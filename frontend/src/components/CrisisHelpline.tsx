import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/config/api";

export default function CrisisHelpline() {
  const [helpline, setHelpline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/helpline").then(res => {
      setHelpline(res.data.helpline);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Card className="wellness-card p-6">Loading...</Card>;

  return (
    <Card className="wellness-card p-6">
      <h3 className="text-lg font-semibold mb-4">Crisis Helpline</h3>
      {helpline ? (
        <div>
          <div className="mb-2">{helpline.name}</div>
          <div className="mb-2">{helpline.phone}</div>
          <Button as="a" href={`tel:${helpline.phone}`} className="mb-2">Call Now</Button>
          <div className="text-xs text-muted-foreground">{helpline.description}</div>
        </div>
      ) : (
        <p className="text-muted-foreground">No helpline info available.</p>
      )}
    </Card>
  );
}
