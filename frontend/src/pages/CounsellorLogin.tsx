import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import api from '@/config/api';
import { useNavigate } from 'react-router-dom';

export default function CounsellorLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/counsellor/login', { username, password });
      const token = res?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        toast({ title: 'Login successful', description: 'Redirecting to counsellor dashboard' });
        navigate('/counsellor');
      } else {
        toast({ title: 'Login failed', description: res?.data?.message || 'Missing token' });
      }
    } catch (err: any) {
      console.error('Login failed', err?.response || err);
      const msg = err?.response?.data?.message || err?.message || 'Login failed';
      toast({ title: 'Login failed', description: msg });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Counsellor Login</h2>
        <form onSubmit={handleLogin} className="space-y-3">
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
