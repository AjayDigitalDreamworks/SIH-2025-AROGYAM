import React from 'react';

export default function AdminEmergency() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Emergency Management</h2>
        <p className="text-sm text-muted-foreground mb-6">This page will provide tools to monitor and manage emergency cases. (Placeholder)</p>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 border rounded-lg bg-card">No active emergency cases.</div>
          <div className="p-4 border rounded-lg bg-card">Create new emergency response plan (placeholder)</div>
        </div>
      </main>
    </div>
  );
}
