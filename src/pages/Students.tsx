
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserMinus } from "lucide-react";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { StudentTable } from "@/components/students/StudentTable";

interface Student {
  id: string;
  full_name: string;
  email: string;
  registration_number: string;
  semester: number;
  program: string;
  section: string;
  profile_url?: string | null;
  attendance?: number; // This is mock data we'll add client-side
}

const Students = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("student")
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
        
        // Transform database data to match our Student interface
        const transformedData: Student[] = (data || []).map(student => ({
          id: student.student_id,
          full_name: student.full_name,
          email: student.email,
          registration_number: student.registration_number,
          semester: student.semester,
          program: student.program,
          section: student.section,
          profile_url: student.profile_url,
          // Add mock attendance data (in a real app, this would come from the database)
          attendance: Math.floor(Math.random() * 30) + 70 // Random attendance between 70-100%
        }));
        
        setStudents(transformedData);
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
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registration_number.toLowerCase().includes(searchTerm.toLowerCase());

    if (currentTab === "all") return matchesSearch;
    return matchesSearch && student.section === currentTab;
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
    
    try {
      const { error } = await supabase
        .from("student")
        .delete()
        .in("student_id", selectedStudents);

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
    } catch (err) {
      console.error("Error deleting students:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting students",
        variant: "destructive",
      });
    }
  };

  const handleAddStudent = async (studentData: {
    full_name: string;
    email: string;
    registration_number: string;
    semester: number;
    program: string;
    section: string;
  }) => {
    setAddLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("student")
        .insert({
          full_name: studentData.full_name,
          email: studentData.email,
          registration_number: studentData.registration_number,
          semester: studentData.semester,
          program: studentData.program,
          section: studentData.section,
          student_id: `STU-${Math.floor(Math.random() * 100000)}` // Generate a random student ID
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
        return false;
      }

      const newStudent: Student = {
        id: data.student_id,
        full_name: data.full_name,
        email: data.email,
        registration_number: data.registration_number,
        semester: data.semester,
        program: data.program,
        section: data.section,
        profile_url: data.profile_url,
        attendance: 100 // New students start with 100% attendance
      };

      setStudents(prev => [...prev, newStudent]);

      toast({
        title: "Student Added",
        description: `${studentData.full_name} has been added successfully`,
      });
      return true;
    } catch (err) {
      console.error("Error adding student:", err);
      setAddLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the student",
        variant: "destructive",
      });
      return false;
    }
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

  const sections = [...new Set(students.map(s => s.section))];

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
              onAddStudent={handleAddStudent}
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
                <TabsTrigger value="all">All Sections</TabsTrigger>
                {sections.slice(0, 3).map(section => (
                  <TabsTrigger key={section} value={section}>{section}</TabsTrigger>
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
