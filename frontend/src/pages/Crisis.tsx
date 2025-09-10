import React from "react";
import { Phone, MessageCircle, Clock, Shield, Heart, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function Crisis() {
  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 confidential support for people in suicidal crisis",
      type: "emergency"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 text-based crisis support",
      type: "text"
    },
    {
      name: "Campus Counseling Center",
      number: "(555) 123-4567",
      description: "Campus mental health emergency line",
      type: "campus"
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Mental health and substance abuse treatment referrals",
      type: "support"
    }
  ];

  const warningSignsData = [
    "Thoughts of self-harm or suicide",
    "Feeling hopeless or trapped",
    "Severe anxiety or panic attacks",
    "Substance abuse",
    "Extreme mood changes",
    "Withdrawal from friends and activities",
    "Inability to perform daily tasks",
    "Hearing voices or seeing things"
  ];

  const immediateSteps = [
    {
      step: "1",
      title: "Ensure Safety",
      description: "If you or someone is in immediate danger, call 911 or campus security",
      icon: Shield
    },
    {
      step: "2", 
      title: "Reach Out",
      description: "Contact a crisis helpline or trusted person immediately",
      icon: Phone
    },
    {
      step: "3",
      title: "Stay Connected",
      description: "Don't isolate yourself - stay with someone or in a safe place",
      icon: Heart
    },
    {
      step: "4",
      title: "Seek Professional Help",
      description: "Contact your counseling center or healthcare provider",
      icon: MessageCircle
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Crisis Helpline</h1>
          </div>
          <p className="text-muted-foreground">Immediate support and resources for mental health emergencies</p>
        </div>

        {/* Emergency Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>If you are in immediate danger or having thoughts of self-harm, please call 911 or go to your nearest emergency room immediately.</strong>
          </AlertDescription>
        </Alert>

        {/* Crisis Contacts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Phone className="w-5 h-5" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{contact.name}</h3>
                      <Badge 
                        variant={contact.type === 'emergency' ? 'destructive' : 'secondary'}
                        className="mt-1"
                      >
                        {contact.type === 'emergency' ? '24/7 Emergency' : 
                         contact.type === 'text' ? 'Text Support' :
                         contact.type === 'campus' ? 'Campus' : 'Support'}
                      </Badge>
                    </div>
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{contact.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-lg font-bold text-primary">{contact.number}</div>
                    <Button size="sm" className="ml-auto">
                      {contact.type === 'text' ? 'Send Text' : 'Call Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Immediate Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                If You're in Crisis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {immediateSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <step.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warning Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Warning Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Seek immediate help if you or someone you know experiences:
              </p>
              <div className="space-y-2">
                {warningSignsData.map((sign, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded">
                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></div>
                    <span className="text-sm">{sign}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Additional Support Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <MessageCircle className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-medium text-blue-900 mb-2">Campus Resources</h4>
                <p className="text-sm text-blue-700 mb-3">Counseling center, health services, and peer support programs</p>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                  Find Campus Help
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <Heart className="w-8 h-8 text-green-600 mb-3" />
                <h4 className="font-medium text-green-900 mb-2">Self-Care Tools</h4>
                <p className="text-sm text-green-700 mb-3">Breathing exercises, meditation, and grounding techniques</p>
                <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                  Access Tools
                </Button>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <Shield className="w-8 h-8 text-purple-600 mb-3" />
                <h4 className="font-medium text-purple-900 mb-2">Safety Planning</h4>
                <p className="text-sm text-purple-700 mb-3">Create a personalized safety plan for crisis situations</p>
                <Button variant="outline" size="sm" className="text-purple-600 border-purple-600">
                  Create Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Remember Section */}
        <Card className="gradient-subtle border-0">
          <CardContent className="text-center py-8">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">You Are Not Alone</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Crisis situations are temporary, and help is available. Reaching out for support is a sign of strength, 
              not weakness. Your life has value, and there are people who want to help you through this difficult time.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}