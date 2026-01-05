import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sampleVolunteers = [
  { name: "Ravi Kumar", role: "Peer Mentor" },
  { name: "Sana Patel", role: "Community Helper" },
  { name: "Devi Rao", role: "Volunteer" },
];

export default function Volunteer() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Volunteers</h1>
            <p className="text-muted-foreground">Manage volunteer profiles and assignments.</p>
          </div>
          <Button asChild>
            <a href="#">Add Volunteer</a>
          </Button>
        </div>

        <div className="space-y-4">
          {sampleVolunteers.map((v) => (
            <Card key={v.name} className="p-4">
              <CardContent className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{v.name}</div>
                  <div className="text-sm text-muted-foreground">{v.role}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="outline" size="sm">Assign</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
