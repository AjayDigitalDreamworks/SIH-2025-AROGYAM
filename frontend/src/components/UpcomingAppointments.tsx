import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Video, MapPin, Calendar, Clock, Plus } from "lucide-react";

export function UpcomingAppointments({ appointments = [] }:{ appointments?: any[] }) {
  return (
    <Card className="wellness-card p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
          <Button variant="default" size="sm" className="bg-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Book New
          </Button>
        </div>
        
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-sm text-muted-foreground">No upcoming appointments</div>
          ) : (
            appointments.map((appointment:any) => (
              <div
                key={String(appointment._id || appointment.id)}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={appointment.avatar} alt={appointment.fullName || appointment.doctor || ''} />
                  <AvatarFallback>{(appointment.fullName || appointment.doctor || '').split(' ').map((n:any) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium text-foreground">{appointment.fullName || appointment.doctor}</h4>
                  <p className="text-sm text-muted-foreground">{appointment.specialty || appointment.type}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {appointment.type && appointment.type.toLowerCase().includes('video') ? (
                        <>
                          <Video className="w-3 h-3 text-green-500" />
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            {appointment.type}
                          </Badge>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 text-blue-500" />
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                            {appointment.type || 'In-Person'}
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    {appointment.location && (
                      <span className="text-xs">{appointment.location}</span>
                    )}
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Calendar className="w-4 h-4" />
                    {appointment.date || appointment.time || 'TBD'}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {appointment.duration || ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}