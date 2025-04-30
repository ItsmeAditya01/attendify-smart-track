
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Faculty } from "./types";

interface FacultyAddDialogProps {
  onAdd: (faculty: Omit<Faculty, "id" | "created_at">) => Promise<boolean>;
  isLoading: boolean;
}

export const FacultyAddDialog: React.FC<FacultyAddDialogProps> = ({ onAdd, isLoading }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newFaculty, setNewFaculty] = useState<Omit<Faculty, "id" | "created_at">>({
    full_name: "",
    email: "",
    faculty_number: "",
    department: "Computer Science",
    position: "",
    subjects: []
  });

  const handleSubmit = async () => {
    if (!newFaculty.full_name || !newFaculty.email || !newFaculty.faculty_number) {
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
        full_name: "",
        email: "",
        faculty_number: "",
        department: "Computer Science",
        position: "",
        subjects: []
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              value={newFaculty.full_name}
              onChange={(e) => setNewFaculty({ ...newFaculty, full_name: e.target.value })}
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
            <Label htmlFor="faculty_number">Faculty ID</Label>
            <Input
              id="faculty_number"
              value={newFaculty.faculty_number}
              onChange={(e) => setNewFaculty({ ...newFaculty, faculty_number: e.target.value })}
              placeholder="FAC-12345"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={newFaculty.department || "Computer Science"}
              onValueChange={(value) => setNewFaculty({ ...newFaculty, department: value })}
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
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={newFaculty.position || ""}
              onChange={(e) => setNewFaculty({ ...newFaculty, position: e.target.value })}
              placeholder="Professor"
            />
          </div>
          
          <Button className="w-full mt-4" onClick={handleSubmit} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" /> Add Faculty
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
