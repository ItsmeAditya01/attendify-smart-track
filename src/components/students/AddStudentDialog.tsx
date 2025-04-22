
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddStudentDialogProps {
  onAddStudent: (student: Omit<any, "id" | "attendance">) => void;
  addLoading: boolean;
  classes?: string[];
}

export const AddStudentDialog: React.FC<AddStudentDialogProps> = ({
  onAddStudent,
  addLoading,
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    enrollmentNumber: "",
    semester: "",
    branch: "",
    class: ""
  });

  const reset = () => setForm({ name: "", email: "", enrollmentNumber: "", semester: "", branch: "", class: "" });

  const handleAdd = () => {
    onAddStudent(form);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
            <Input
              id="enrollmentNumber"
              value={form.enrollmentNumber}
              onChange={e => setForm({ ...form, enrollmentNumber: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={form.semester}
                onValueChange={value => setForm({ ...form, semester: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1st</SelectItem>
                  <SelectItem value="2nd">2nd</SelectItem>
                  <SelectItem value="3rd">3rd</SelectItem>
                  <SelectItem value="4th">4th</SelectItem>
                  <SelectItem value="5th">5th</SelectItem>
                  <SelectItem value="6th">6th</SelectItem>
                  <SelectItem value="7th">7th</SelectItem>
                  <SelectItem value="8th">8th</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select
                value={form.branch}
                onValueChange={value => setForm({ ...form, branch: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select
              value={form.class}
              onValueChange={value => setForm({ ...form, class: value })}
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
          <Button className="w-full mt-4" onClick={handleAdd} disabled={addLoading}>
            <Plus className="mr-2 h-4 w-4" /> {addLoading ? "Adding..." : "Add Student"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

