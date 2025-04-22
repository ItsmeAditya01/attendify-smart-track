
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, UserMinus, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Faculty, DepartmentType } from "./types";

interface FacultyAddDialogProps {
  onAdd: (faculty: Omit<Faculty, "id" | "user_id">) => Promise<boolean>;
  isLoading: boolean;
}

export const FacultyAddDialog: React.FC<FacultyAddDialogProps> = ({ onAdd, isLoading }) => {
  const { toast } = useToast();
  const [newFaculty, setNewFaculty] = useState<Omit<Faculty, "id" | "user_id">>({
    name: "",
    email: "",
    phone: "",
    department: "Computer Science",
    subjects: [],
  });
  const [newSubject, setNewSubject] = useState("");

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;
    if (newFaculty.subjects.includes(newSubject)) {
      toast({
        title: "Subject already added",
        description: "This subject is already in the list",
        variant: "destructive",
      });
      return;
    }
    setNewFaculty({
      ...newFaculty,
      subjects: [...newFaculty.subjects, newSubject],
    });
    setNewSubject("");
  };

  const handleRemoveSubject = (subject: string) => {
    setNewFaculty({
      ...newFaculty,
      subjects: newFaculty.subjects.filter(s => s !== subject),
    });
  };

  const handleSubmit = async () => {
    if (!newFaculty.name || !newFaculty.email || !newFaculty.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    const success = await onAdd(newFaculty);
    if (success) {
      setNewFaculty({
        name: "",
        email: "",
        phone: "",
        department: "Computer Science",
        subjects: [],
      });
      setNewSubject("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          Add Faculty
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Faculty</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={newFaculty.name}
              onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
              placeholder="Dr. John Smith"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newFaculty.email}
              onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
              placeholder="john.smith@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={newFaculty.phone || ""}
              onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
              placeholder="555-123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={newFaculty.department}
              onValueChange={(value: DepartmentType) => setNewFaculty({ ...newFaculty, department: value })}
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
          <div className="space-y-2">
            <Label>Subjects</Label>
            <div className="flex gap-2">
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add a subject"
              />
              <Button type="button" onClick={handleAddSubject} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {newFaculty.subjects.length > 0 && (
              <div className="mt-2 space-y-1">
                {newFaculty.subjects.map(subject => (
                  <div key={subject} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{subject}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubject(subject)}
                      className="h-6 w-6 p-0"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button className="w-full mt-4" onClick={handleSubmit} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" /> Add Faculty
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
