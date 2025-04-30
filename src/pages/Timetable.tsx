
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Clock, Calendar, BookOpen, MapPin } from "lucide-react";
import AddLectureDialog, { Class } from "@/components/AddLectureDialog";
import { supabase } from "@/integrations/supabase/client";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Define types to match our database schema
interface ClassRecord {
  id: string;
  class: string;
  created_at: string;
}

interface TimetableRecord {
  id: string;
  class: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  created_at: string;
}

const Timetable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [timetable, setTimetable] = useState<TimetableRecord[]>([]);
  const [currentClass, setCurrentClass] = useState("CS-301");

  useEffect(() => {
    async function fetchClasses() {
      // Use type casting to fix TypeScript error
      const { data, error } = await supabase
        .from('classes')
        .select('*') as { data: ClassRecord[] | null; error: any };
      
      if (!error && data) setClasses(data);
    }
    fetchClasses();
  }, []);

  useEffect(() => {
    async function fetchTimetable() {
      // Use type casting to fix TypeScript error
      const { data, error } = await supabase
        .from('timetable')
        .select('*') as { data: TimetableRecord[] | null; error: any };
      
      if (!error && data) setTimetable(data);
    }
    fetchTimetable();
  }, []);

  const filteredClasses = timetable.filter(cls => cls.class === currentClass);

  const canEdit = user?.role === "admin" || user?.role === "faculty";

  /**
   * Converts "hh:mm" (24hr) to "hh:mm AM/PM"
   */
  function formatTimeToString(time24: string): string {
    if (!time24) return "";
    const [h, m] = time24.split(':');
    let hh = Number(h), ampm = "AM";
    if (hh === 0) hh = 12;
    else if (hh === 12) ampm = "PM";
    else if (hh > 12) { hh -= 12; ampm = "PM"; }
    return `${String(hh).padStart(2, "0")}:${m} ${ampm}`;
  }

  // Utility: Time overlap checking, for conflict detection
  function isTimeOverlap(start1: string, end1: string, start2: string, end2: string) {
    return start1 < end2 && start2 < end1;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold">Class Timetable</h1>
            <p className="text-gray-600">View and manage class schedules</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <AddLectureDialog
              classes={classes}
              setClasses={setClasses}
              currentClass={currentClass}
              canEdit={canEdit}
            />
          </div>
        </div>
        <Card className="animate-scale-in">
          <CardHeader>
            <Tabs defaultValue="CS-301" onValueChange={setCurrentClass}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="CS-301">CS-301</TabsTrigger>
                <TabsTrigger value="IT-501">IT-501</TabsTrigger>
                <TabsTrigger value="EC-101">EC-101</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              {daysOfWeek.map(day => {
                const dayClasses = filteredClasses.filter(cls => cls.day === day);
                if (dayClasses.length === 0) return null;
                return (
                  <div key={day} className="space-y-4">
                    <h3 className="font-semibold text-lg">{day}</h3>
                    <div className="space-y-3">
                      {dayClasses.map(cls => (
                        <div key={cls.id} className="p-4 rounded-lg border border-border bg-white hover:shadow-md transition-shadow flex flex-col md:flex-row">
                          <div className="md:w-1/4 flex items-center gap-2 mb-2 md:mb-0">
                            <Clock className="h-4 w-4 text-attendance-primary" />
                            <span>
                              {cls.startTime.length === 5 ? formatTimeToString(cls.startTime) : cls.startTime} -
                              {cls.endTime.length === 5 ? formatTimeToString(cls.endTime) : cls.endTime}
                            </span>
                          </div>
                          <div className="md:w-1/4 flex items-center gap-2 mb-2 md:mb-0">
                            <BookOpen className="h-4 w-4 text-attendance-secondary" />
                            <span className="font-medium">{cls.subject}</span>
                          </div>
                          <div className="md:w-1/4 flex items-center gap-2 mb-2 md:mb-0">
                            <MapPin className="h-4 w-4 text-attendance-accent" />
                            <span>{cls.room}</span>
                          </div>
                          <div className="md:w-1/4 flex items-center gap-2">
                            <span className="bg-attendance-light text-attendance-primary px-2 py-1 rounded-md text-sm">
                              {cls.class}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filteredClasses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted" />
                  <h3 className="text-lg font-medium mb-1">No Classes Scheduled</h3>
                  <p>There are no classes scheduled for this class yet.</p>
                  {canEdit && (
                    <AddLectureDialog
                      classes={classes}
                      setClasses={setClasses}
                      currentClass={currentClass}
                      canEdit={canEdit}
                    />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Timetable;
