import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, UserPlus, UserMinus } from "lucide-react";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { StudentTable } from "@/components/students/StudentTable";

interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  semester: string;
  branch: string;
  class: string;
  attendance: number;
}

const Students = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [newStudent, setNewStudent] = useState<Omit<Student, "id" | "attendance">>({
    name: "",
    email: "",
    enrollmentNumber: "",
    semester: "",
    branch: "",
    class: ""
  });
  const [currentTab, setCurrentTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("students")
          .select("*");
        
        if (error) {
          console.error("Error fetching students:", error);
          toast({
            title: "Error",
            description: "Failed to load students data",
            variant: "destructive",
          });
          return;
        }
        
        setStudents(data || []);
      } catch (err) {
        console.error("Exception while fetching students:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase());

    if (currentTab === "all") return matchesSearch;
    return matchesSearch && student.class === currentTab;
  });

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedStudents.length === 0) return;
    const { error } = await supabase
      .from("students")
      .delete()
      .in("id", selectedStudents);

    if (error) {
      toast({
        title: "Failed to delete students",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setStudents(prev => prev.filter(student => !selectedStudents.includes(student.id)));
    toast({
      title: "Students Deleted",
      description: `${selectedStudents.length} students have been removed`,
    });
    setSelectedStudents([]);
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.enrollmentNumber || !newStudent.semester || !newStudent.branch || !newStudent.class) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setAddLoading(true);
    const { data, error } = await supabase
      .from("students")
      .insert({
        name: newStudent.name,
        email: newStudent.email,
        enrollment_number: newStudent.enrollmentNumber,
        semester: newStudent.semester,
        branch: newStudent.branch,
        class: newStudent.class,
        user_id: user.id,
      })
      .select()
      .single();

    setAddLoading(false);

    if (error) {
      toast({
        title: "Failed to add",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setStudents(prev => [
      ...prev,
      {
        id: data.id,
        name: data.name,
        email: data.email,
        enrollmentNumber: data.enrollment_number,
        semester: data.semester,
        branch: data.branch,
        class: data.class,
        attendance: 100
      }
    ]);

    toast({
      title: "Student Added",
      description: `${newStudent.name} has been added successfully`,
    });

    setNewStudent({
      name: "",
      email: "",
      enrollmentNumber: "",
      semester: "",
      branch: "",
      class: ""
    });
  };

  if (user?.role === "student") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
            <p className="text-gray-600">Students don't have access to manage the student list.</p>
          </div>
        </div>
      </div>
    );
  }

  const classes = [...new Set(students.map(s => s.class))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold">Student Management</h1>
            <p className="text-gray-600">Manage and track students</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            {selectedStudents.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="flex items-center gap-1"
              >
                <UserMinus className="h-4 w-4" />
                Delete ({selectedStudents.length})
              </Button>
            )}
            <AddStudentDialog
              onAddStudent={async (studentData) => {
                setAddLoading(true);
                const { data, error } = await supabase
                  .from("students")
                  .insert({
                    name: studentData.name,
                    email: studentData.email,
                    enrollment_number: studentData.enrollmentNumber,
                    semester: studentData.semester,
                    branch: studentData.branch,
                    class: studentData.class,
                    user_id: user.id,
                  })
                  .select()
                  .single();

                setAddLoading(false);

                if (error) {
                  toast({
                    title: "Failed to add",
                    description: error.message,
                    variant: "destructive",
                  });
                  return;
                }

                setStudents(prev => [
                  ...prev,
                  {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    enrollmentNumber: data.enrollment_number,
                    semester: data.semester,
                    branch: data.branch,
                    class: data.class,
                    attendance: 100
                  }
                ]);

                toast({
                  title: "Student Added",
                  description: `${studentData.name} has been added successfully`,
                });
              }}
              addLoading={addLoading}
            />
          </div>
        </div>
        <div className="mb-6 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Card className="animate-scale-in">
          <CardHeader className="p-4 pb-0">
            <Tabs defaultValue="all" onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-4 sm:w-auto">
                <TabsTrigger value="all">All Classes</TabsTrigger>
                {classes.slice(0, 3).map(cls => (
                  <TabsTrigger key={cls} value={cls}>{cls}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-4">
            <StudentTable
              students={filteredStudents}
              loading={loading}
              selectedStudents={selectedStudents}
              onSelectStudent={handleSelectStudent}
              onSelectAll={handleSelectAll}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Students;
