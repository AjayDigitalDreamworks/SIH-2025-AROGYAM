import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import api from "@/config/api";

interface Counselor {
  _id: string;
  name?: string;
  email?: string;
  specialty?: string;
  rating?: number;
  experience?: string;
  image?: string;
}

interface AppointmentItem {
  _id: string;
  date?: string;
  time?: string;
  type?: string;
  discussion?: string;
  status?: string;
  responseNote?: string;
  requestedAt?: string;
  counselorId?: Counselor;
}

interface CurrentUser {
  _id?: string;
  userId?: string;
  fullName?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  university?: string;
}

const formatDateLabel = (value?: string) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeTime = (value?: string) => (value || "").replace(/\s+/g, "").toLowerCase();

const formatHourSlot = (hour24: number) =>
  new Date(1970, 0, 1, hour24, 0).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const getDefaultSlots = () => Array.from({ length: 9 }, (_, idx) => formatHourSlot(idx + 9));

const getStatusClassName = (status?: string) => {
  const normalized = (status || "").toLowerCase();
  if (normalized === "accepted") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (normalized === "rejected" || normalized === "cancelled") return "text-red-700 bg-red-50 border-red-200";
  if (normalized === "modified") return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-blue-700 bg-blue-50 border-blue-200";
};

export default function Appointments() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [myAppointments, setMyAppointments] = useState<AppointmentItem[]>([]);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [loadingCounselors, setLoadingCounselors] = useState(true);
  const [booking, setBooking] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    concerns: "",
  });

  const { toast } = useToast();

  const selectedCounselorData = useMemo(
    () => counselors.find((item) => item._id === selectedCounselor) || null,
    [counselors, selectedCounselor]
  );

  const suggestedTypes = useMemo(() => {
    const specialty = selectedCounselorData?.specialty;
    if (!specialty) return [];
    return [`${specialty} Consultation`, `${specialty} Follow-up`, `${specialty} Assessment`];
  }, [selectedCounselorData]);

  const availableTimeSlots = useMemo(() => {
    const blocked = new Set(takenSlots.map((slot) => normalizeTime(slot)));
    return getDefaultSlots().filter((slot) => !blocked.has(normalizeTime(slot)));
  }, [takenSlots]);

  const progressChecklist = useMemo(() => {
    const checks = [
      { label: "Counselor selected", done: Boolean(selectedCounselor) },
      { label: "Date and time selected", done: Boolean(selectedDate && selectedTime) },
      { label: "Session type provided", done: Boolean(appointmentType.trim()) },
      { label: "Contact details complete", done: Boolean(formData.name && formData.email && formData.phone) },
    ];
    const doneCount = checks.filter((item) => item.done).length;
    return { checks, doneCount, total: checks.length };
  }, [selectedCounselor, selectedDate, selectedTime, appointmentType, formData]);

  const upcomingCount = myAppointments.filter((item) =>
    ["pending", "accepted", "modified"].includes((item.status || "").toLowerCase())
  ).length;

  const fetchMyAppointments = async () => {
    try {
      const response = await api.get("/appointments/mine");
      setMyAppointments(Array.isArray(response.data) ? response.data : []);
    } catch {
      setMyAppointments([]);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [userRes, counselorRes] = await Promise.all([
          api.get("/current_user"),
          api.get("/counselors"),
        ]);

        const user = userRes.data?.user || null;
        setCurrentUser(user);
        setFormData((prev) => ({
          ...prev,
          name: user?.fullName || user?.fullname || prev.name,
          email: user?.email || prev.email,
          phone: user?.phone || prev.phone,
        }));

        setCounselors(Array.isArray(counselorRes.data) ? counselorRes.data : []);
      } catch (error) {
        console.error("Failed to load appointment bootstrap data:", error);
        toast({
          title: "Unable to load appointment data",
          description: "Please refresh and try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingCounselors(false);
      }
    };

    bootstrap();
    fetchMyAppointments();
  }, [toast]);

  useEffect(() => {
    const fetchTakenSlots = async () => {
      if (!selectedCounselor || !selectedDate) {
        setTakenSlots([]);
        return;
      }

      try {
        const response = await api.get("/appointments", { params: { counselorId: selectedCounselor } });
        const appointments = Array.isArray(response.data) ? response.data : [];
        const blocked = appointments
          .filter((item: AppointmentItem) => item.date === selectedDate)
          .filter((item: AppointmentItem) =>
            !["rejected", "cancelled"].includes((item.status || "").toLowerCase())
          )
          .map((item: AppointmentItem) => item.time || "")
          .filter(Boolean);
        setTakenSlots(blocked);
      } catch (error) {
        console.error("Error fetching occupied slots:", error);
        setTakenSlots([]);
      }
    };

    fetchTakenSlots();
  }, [selectedCounselor, selectedDate]);

  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime("");
    }
  }, [availableTimeSlots, selectedTime]);

  const handleBooking = async () => {
    if (
      !selectedCounselor ||
      !selectedDate ||
      !selectedTime ||
      !appointmentType.trim() ||
      !formData.name ||
      !formData.email ||
      !formData.phone
    ) {
      toast({
        title: "Missing information",
        description: "Please fill all required details.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser?._id && !currentUser?.userId) {
      toast({
        title: "Session issue",
        description: "Please log in again before booking.",
        variant: "destructive",
      });
      return;
    }

    const appointmentPayload = {
      counselorId: selectedCounselor,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType.trim(),
      fullName: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      discussion: formData.concerns.trim(),
      userId: currentUser._id || currentUser.userId,
    };

    try {
      setBooking(true);
      await api.post("/appointments", appointmentPayload);
      toast({ title: "Appointment booked", description: "Your request has been submitted." });

      setSelectedCounselor("");
      setSelectedDate("");
      setSelectedTime("");
      setAppointmentType("");
      setTakenSlots([]);
      setFormData((prev) => ({ ...prev, concerns: "" }));
      fetchMyAppointments();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast({
          title: "Time slot not available",
          description: error.response.data?.message || "Please choose another time.",
          variant: "destructive",
        });
      } else {
        console.error("Error booking appointment:", error);
        toast({
          title: "Booking failed",
          description: "There was an error booking your appointment.",
          variant: "destructive",
        });
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-teal-200/70 bg-gradient-to-br from-teal-700 via-cyan-700 to-sky-700 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_45%)]" />
        <div className="relative">
          <Badge className="mb-3 border-white/25 bg-white/10 text-white hover:bg-white/20">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Professional support booking
          </Badge>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Book Counseling Appointment</h1>
              <p className="mt-1 text-sm text-cyan-100 sm:text-base">
                Schedule a confidential session with a counselor based on your needs.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs sm:text-sm">
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2">
                <div className="text-lg font-bold">{counselors.length}</div>
                <div className="text-cyan-100">Counselors</div>
              </div>
              <div className="rounded-xl border border-white/25 bg-white/10 px-3 py-2">
                <div className="text-lg font-bold">{upcomingCount}</div>
                <div className="text-cyan-100">Active Requests</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl border-slate-200 p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Choose Your Counselor</h3>
            {loadingCounselors ? (
              <div className="text-sm text-slate-500">Loading counselors...</div>
            ) : counselors.length === 0 ? (
              <div className="text-sm text-slate-500">No counselors available right now.</div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {counselors.map((counselor) => (
                  <button
                    type="button"
                    key={counselor._id}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedCounselor === counselor._id
                        ? "border-teal-300 bg-teal-50"
                        : "border-slate-200 hover:border-teal-200 hover:bg-slate-50"
                    }`}
                    onClick={() => setSelectedCounselor(counselor._id)}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 border border-slate-200">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-medium text-slate-900">{counselor.name || "Counselor"}</h4>
                        <p className="truncate text-sm text-slate-600">
                          {counselor.specialty || "General support"}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <span>
                            {typeof counselor.rating === "number"
                              ? `Rating ${counselor.rating.toFixed(1)}`
                              : "Rating unavailable"}
                          </span>
                          <span>{counselor.experience || "Experience unavailable"}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card className="rounded-2xl border-slate-200 p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Select Date and Time</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Select
                  value={selectedTime}
                  onValueChange={setSelectedTime}
                  disabled={!selectedCounselor || !selectedDate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                    {availableTimeSlots.length === 0 ? (
                      <SelectItem value="no-slots" disabled>
                        No slots available
                      </SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedCounselor && selectedDate ? (
              <p className="mt-3 text-xs text-slate-500">
                {takenSlots.length
                  ? `${takenSlots.length} slot(s) already booked for ${formatDateLabel(selectedDate)}.`
                  : "All standard slots are currently available for this day."}
              </p>
            ) : null}
          </Card>

          <Card className="rounded-2xl border-slate-200 p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Appointment Focus</h3>
            <div className="space-y-3">
              <Label htmlFor="appointmentType">Session Type</Label>
              <Input
                id="appointmentType"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                placeholder="e.g. Anxiety support session"
              />
              {suggestedTypes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {suggestedTypes.map((suggestion) => (
                    <Button
                      type="button"
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setAppointmentType(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Your Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@college.edu"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="concerns">What would you like to discuss?</Label>
                <Textarea
                  id="concerns"
                  value={formData.concerns}
                  onChange={(e) => setFormData((prev) => ({ ...prev, concerns: e.target.value }))}
                  placeholder="Briefly describe what you'd like to talk about"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          <Button onClick={handleBooking} className="w-full bg-teal-700 hover:bg-teal-800" size="lg" disabled={booking}>
            <Calendar className="mr-2 h-4 w-4" />
            {booking ? "Booking..." : "Book Appointment"}
          </Button>

          <Card className="rounded-2xl border-slate-200 p-5 sm:p-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">Your Appointments</h3>
            {myAppointments.length === 0 ? (
              <div className="text-sm text-slate-500">You have no appointment requests yet.</div>
            ) : (
              <div className="space-y-3">
                {myAppointments.map((appointment) => (
                  <div key={appointment._id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="font-medium text-slate-900">{appointment.type || "Counselling session"}</div>
                      <span className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusClassName(appointment.status)}`}>
                        {(appointment.status || "pending").toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {formatDateLabel(appointment.date)} - {appointment.time || "Time pending"}
                    </div>
                    {appointment.counselorId?.name ? (
                      <div className="mt-1 text-sm text-slate-600">Counselor: {appointment.counselorId.name}</div>
                    ) : null}
                    {appointment.discussion ? (
                      <div className="mt-2 text-sm text-slate-600">{appointment.discussion}</div>
                    ) : null}
                    {appointment.responseNote ? (
                      <div className="mt-2 text-xs text-slate-500">Note: {appointment.responseNote}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 p-5 sm:p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Booking Readiness</h3>
            <div className="mb-3 text-sm text-slate-600">
              {progressChecklist.doneCount}/{progressChecklist.total} steps complete
            </div>
            <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-teal-600 transition-all"
                style={{ width: `${(progressChecklist.doneCount / progressChecklist.total) * 100}%` }}
              />
            </div>
            <div className="space-y-2">
              {progressChecklist.checks.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className={item.done ? "font-medium text-emerald-600" : "font-medium text-amber-600"}>
                    {item.done ? "Done" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <CalendarClock className="h-5 w-5 text-teal-700" />
              Support Contact
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-teal-700" />
                <span className="break-all">{selectedCounselorData?.email || formData.email || "support@arogyam.app"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-teal-700" />
                <span>{formData.phone || "Update your phone in profile"}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-teal-700" />
                <span>{currentUser?.university ? `${currentUser.university} Counselling Center` : "Campus counselling center"}</span>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-red-200 bg-red-50/70 p-5 sm:p-6">
            <h3 className="mb-2 text-lg font-semibold text-red-700">Crisis Support</h3>
            <p className="mb-3 text-sm text-red-600">
              If you are facing immediate risk, contact emergency support now.
            </p>
            <Button
              variant="destructive"
              className="w-full"
              size="sm"
              onClick={() => (window.location.href = "tel:988")}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Crisis Line: 988
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
