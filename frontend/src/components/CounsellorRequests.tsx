import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import api from '@/config/api';
import { Calendar, Clock } from 'lucide-react';

export default function CounsellorRequests({ initialRequests }: { initialRequests?: any[] }) {
  const [requests, setRequests] = useState<any[]>(initialRequests || []);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      // show recent pending/modified/relevant requests
      setRequests(res.data.filter((a:any) => a.status === 'pending' || a.status === 'modified'));
    } catch (err) {
      console.error('Failed to fetch requests', err);
      toast({ title: 'Error', description: 'Failed to load appointment requests', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialRequests) fetchRequests();
  }, [initialRequests]);

  const respond = async (id:string, action:string, payload:any = {}) => {
    try {
      const res = await api.patch(`/appointments/${id}/respond`, { action, ...payload });
      toast({ title: 'Updated', description: res.data.message });
      fetchRequests();
    } catch (err:any) {
      console.error('Respond error', err);
      if (err?.response?.status === 409) {
        toast({ title: 'Conflict', description: err.response.data?.message || 'Time conflict', variant: 'destructive' });
      } else {
        toast({ title: 'Failed', description: 'Could not update appointment', variant: 'destructive' });
      }
    }
  };

  if (loading) return <Card className="p-4">Loading requests...</Card>;

  return (
    <Card className="wellness-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Appointment Requests</h3>
        <Button size="sm" variant="ghost" onClick={fetchRequests}>Refresh</Button>
      </div>

      {requests.length === 0 ? (
        <div className="text-sm text-muted-foreground">No pending requests</div>
      ) : (
        <div className="space-y-3">
          {requests.map((r:any) => (
            <div key={r._id} className="p-3 rounded-lg border border-border flex items-center justify-between">
              <div>
                <div className="font-medium">{r.fullName} <span className="text-xs text-muted-foreground">({r.email})</span></div>
                <div className="text-sm text-muted-foreground">{r.discussion || r.type}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4"/>{r.date}</div>
                  <div className="flex items-center gap-1"><Clock className="w-4 h-4"/>{r.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => respond(r._id, 'accept')}>Accept</Button>
                <Button size="sm" variant="destructive" onClick={() => {
                  const note = window.prompt('Optional rejection note');
                  respond(r._id, 'reject', { note });
                }}>Reject</Button>
                <Button size="sm" variant="outline" onClick={() => {
                  const newDate = window.prompt('New date (YYYY-MM-DD)', r.date);
                  if (!newDate) return;
                  const newTime = window.prompt('New time (e.g., 10:00 AM)', r.time);
                  if (!newTime) return;
                  respond(r._id, 'modify', { newDate, newTime, note: 'Counsellor rescheduled' });
                }}>Modify</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}