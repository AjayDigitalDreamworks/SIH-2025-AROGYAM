import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

const emergencyContacts = [
  {
    title: "National Crisis Hotline",
    number: "988",
    description: "24/7 free and confidential support",
  },
  {
    title: "Campus Emergency",
    number: "(555) 123-4567",
    description: "Campus security & counseling",
  },
  {
    title: "Text Support",
    number: "Text HOME to 741741",
    description: "Crisis Text Line support",
  },
];

export function EmergencySupport() {
  return (
    <Card className="bg-red-50 border border-red-200 rounded-xl px-8 py-6 shadow">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center shadow-lg">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-red-800">Emergency Support</h3>
        </div>
        <p className="text-sm text-red-700 mb-5">
          If you're experiencing a mental health crisis or having thoughts of self-harm, please reach out immediately:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {emergencyContacts.map((contact, idx) => (
            <div key={contact.title}
                 className="border border-red-100 bg-white rounded-lg p-4 text-left">
              <h4 className="font-semibold text-red-700 mb-1">{contact.title}</h4>
              <p className="text-lg font-bold text-red-600 mb-1">{contact.number}</p>
              <p className="text-xs text-red-700">{contact.description}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 flex items-center gap-2 rounded-lg shadow" >
            <Phone className="w-4 h-4" />
            Call Now
          </Button>
          <Button variant="outline" className="border-red-400 text-red-700 font-semibold px-6 py-2 flex items-center gap-2 rounded-lg shadow" >
            <MessageCircle className="w-4 h-4" />
            Chat Support
          </Button>
        </div>
      </div>
    </Card>
  );
}
