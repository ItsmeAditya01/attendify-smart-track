import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface Class {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  class: string;
}
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface AddLectureDialogProps {
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  currentClass: string;
  canEdit: boolean;
}

const AddLectureDialog: React.FC<AddLectureDialogProps> = ({
  classes,
  setClasses,
  currentClass,
  canEdit,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newClass, setNewClass] = useState<Omit<Class, "id">>({
    day: "Monday",
    startTime: "",
    endTime: "",
    subject: "",
    room: "",
    class: currentClass || "CS-301"
  });

  // Keep class select in sync with selected tab
  React.useEffect(() => {
    setNewClass((c) => ({ ...c, class: currentClass }));
  }, [currentClass]);

  function formatTimeToString(time24: string): string {
    if (!time24) return "";
    const [h, m] = time24.split(':');
    let hh = Number(h), ampm = "AM";
    if (hh === 0) hh = 12;
    else if (hh === 12) ampm = "PM";
    else if (hh > 12) { hh -= 12; ampm = "PM"; }
    return `${String(hh).padStart(2, "0")}:${m} ${ampm}`;
  }

  function isTimeOverlap(start1: string, end1: string, start2: string, end2: string) {
    return start1 < end2 && start2 < end1;
  }

  const handleAddClass = () => {
    if (!newClass.subject || !newClass.room || !newClass.startTime || !newClass.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    if (newClass.endTime <= newClass.startTime) {
      toast({
        title: "Invalid Time Slot",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }
    const conflict = classes.find(cls =>
      cls.day === newClass.day &&
      cls.class === newClass.class &&
      isTimeOverlap(
        newClass.startTime, newClass.endTime,
        cls.startTime.length === 5 ? cls.startTime : "",
        cls.endTime.length === 5 ? cls.endTime : ""
      )
    );
    if (conflict) {
      toast({
        title: "Time Slot Conflict",
        description: `There is already a class scheduled for ${newClass.day} at this time slot.`,
        variant: "destructive",
      });
      return;
    }

    const newClassWithId: Class = {
      ...newClass,
      id: `${classes.length + 1}`,
      startTime: formatTimeToString(newClass.startTime),
      endTime: formatTimeToString(newClass.endTime),
    };

    setClasses(prev => [...prev, newClassWithId]);
    toast({
      title: "Class Added",
      description: `${newClass.subject} has been added to the timetable`,
    });

    setNewClass({
      ...newClass,
      subject: "",
      room: "",
      startTime: "",
      endTime: ""
    });
    setOpen(false);
  };

  if (!canEdit) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1" data-dialog-trigger="true">
          <Plus className="h-4 w-4" />
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select
                value={newClass.day}
                onValueChange={(value) => setNewClass({ ...newClass, day: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select
                value={newClass.class}
                onValueChange={(value) => setNewClass({ ...newClass, class: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CS-301">CS-301</SelectItem>
                  <SelectItem value="IT-501">IT-501</SelectItem>
                  <SelectItem value="EC-101">EC-101</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={newClass.startTime}
                onChange={e => setNewClass({ ...newClass, startTime: e.target.value })}
                step="300"
                placeholder="Start Time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={newClass.endTime}
                onChange={e => setNewClass({ ...newClass, endTime: e.target.value })}
                step="300"
                placeholder="End Time"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Name</Label>
            <Input
              id="subject"
              value={newClass.subject}
              onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
              placeholder="e.g., Data Structures"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room">Room/Lab</Label>
            <Input
              id="room"
              value={newClass.room}
              onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
              placeholder="e.g., Room 204"
            />
          </div>
          <Button className="w-full mt-4" onClick={handleAddClass}>
            <Plus className="mr-2 h-4 w-4" /> Add to Timetable
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLectureDialog;
