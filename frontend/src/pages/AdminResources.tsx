import React from 'react';
import CounsellorResources from './CounsellorResources';

export default function AdminResources() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <h2 className="text-2xl font-bold mb-4">Resources</h2>
        <p className="text-sm text-muted-foreground mb-6">Manage and review mental wellness resources.</p>
        <CounsellorResources />
      </main>
    </div>
  );
}
