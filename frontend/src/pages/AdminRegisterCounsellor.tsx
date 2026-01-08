import React from 'react';
import CounsellorSignup from './CounsellorSignup';

export default function AdminRegisterCounsellor() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Register Counsellor</h2>
        <p className="text-sm text-muted-foreground mb-6">Use this form to create a counsellor account on behalf of someone.</p>
        <CounsellorSignup />
      </main>
    </div>
  );
}
