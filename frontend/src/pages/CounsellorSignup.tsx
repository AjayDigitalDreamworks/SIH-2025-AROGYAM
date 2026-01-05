import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import api from '@/config/api';
import { useNavigate } from 'react-router-dom';

export default function CounsellorSignup() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    specialty: '',
    rating: 0,
    experience: '',
    image: ''
  });

  const [loading, setLoading] = useState(false);

  const onChange = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/counsellor/signup', form);
      toast({ title: 'Signup successful', description: res?.data?.message || 'Account created' });
      navigate('/counsellor/login');
    } catch (err: any) {
      console.error('Signup error', err?.response || err);
      const msg = err?.response?.data?.message || err?.message || 'Signup failed';
      toast({ title: 'Signup failed', description: msg });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-xl p-6">
        <h2 className="text-xl font-bold mb-4">Counsellor Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Username" value={form.username} onChange={(e) => onChange('username', e.target.value)} />
          <Input placeholder="Email" value={form.email} onChange={(e) => onChange('email', e.target.value)} />
          <Input type="password" placeholder="Password" value={form.password} onChange={(e) => onChange('password', e.target.value)} />
          <Input placeholder="Full Name" value={form.name} onChange={(e) => onChange('name', e.target.value)} />
          <Input placeholder="Specialty (e.g., Anxiety, Depression)" value={form.specialty} onChange={(e) => onChange('specialty', e.target.value)} />
          <Input placeholder="Years of experience (e.g., '5 years')" value={form.experience} onChange={(e) => onChange('experience', e.target.value)} />
          <Input placeholder="Profile image (emoji or URL)" value={form.image} onChange={(e) => onChange('image', e.target.value)} />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign up'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
