import React, { useEffect, useState } from 'react';
import { UpcomingAppointments } from '@/components/UpcomingAppointments';
import CounsellorRequests from '@/components/CounsellorRequests';
import api from '@/config/api';
import { Card } from '@/components/ui/card';

export default function CounsellorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/appointments');
        setAppointments(res.data || []);
      } catch (err) {
        console.error('Failed to fetch counsellor appointments', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const upcoming = appointments.filter(a => a.status === 'accepted' || a.status === 'modified');
  const requests = appointments.filter(a => a.status === 'pending' || a.status === 'modified');

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Upcoming appointments and pending requests for your review.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <UpcomingAppointments appointments={upcoming} />
          </div>

          <div>
            <CounsellorRequests initialRequests={requests} />
          </div>
        </div>

        <div className="mt-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Note: This view shows appointments for the logged-in counsellor (requires counsellor login).</p>
          </Card>
        </div>
      </main>
    </div>
  );
}