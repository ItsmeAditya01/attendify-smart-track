
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, UserPlus, X, Check, UserMinus, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock student data
const initialStudents = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    enrollmentNumber: "EN12001",
    semester: "3rd",
    branch: "Computer Science",
    class: "CS-301",
    attendance: 92
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    enrollmentNumber: "EN12002",
    semester: "3rd",
    branch: "Computer Science",
    class: "CS-301",
    attendance: 88
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    enrollmentNumber: "EN12003",
    semester: "3rd",
    branch: "Computer Science",
    class: "CS-301",
    attendance: 76
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    enrollmentNumber: "EN12004",
    semester: "3rd",
    branch: "Computer Science",
    class: "CS-301",
    attendance: 94
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert.w@example.com",
    enrollmentNumber: "EN12005",
    semester: "5th",
    branch: "Information Technology",
    class: "IT-501",
    attendance: 82
  },
  {
    id: "6",
    name: "Sarah Brown",
    email: "sarah.b@example.com",
    enrollmentNumber: "EN12006",
    semester: "5th",
    branch: "Information Technology",
    class: "IT-501",
    attendance: 90
  },
  {
    id: "7",
    name: "David Lee",
    email: "david.l@example.com",
    enrollmentNumber: "EN12007",
    semester: "5th",
    branch: "Information Technology",
    class: "IT-501",
    attendance: 85
  },
  {
    id: "8",
    name: "Lisa Taylor",
    email: "lisa.t@example.com",
    enrollmentNumber: "EN12008",
    semester: "1st",
    branch: "Electronics",
    class: "EC-101",
    attendance: 79
  }
];

// Types
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
  const [students, setStudents] = useState<Student[]>(initialStudents);
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

  // Filter students based on search and current tab
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

  const handleDeleteSelected = () => {
    if (selectedStudents.length === 0) return;
    
    setStudents(prev => prev.filter(student => !selectedStudents.includes(student.id)));
    toast({
      title: "Students Deleted",
      description: `${selectedStudents.length} students have been removed`,
    });
    setSelectedStudents([]);
  };

  const handleAddStudent = () => {
    // Simple validation
    if (!newStudent.name || !newStudent.email || !newStudent.enrollmentNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newStudentWithId: Student = {
      ...newStudent,
      id: `${students.length + 1}`,
      attendance: 100 // New student starts with perfect attendance
    };

    setStudents(prev => [...prev, newStudentWithId]);
    toast({
      title: "Student Added",
      description: `${newStudent.name} has been added successfully`,
    });

    // Reset form
    setNewStudent({
      name: "",
      email: "",
      enrollmentNumber: "",
      semester: "",
      branch: "",
      class: ""
    });
  };

  // Only admin and faculty can access this page
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

  // Group students by class for the tabs
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
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Add Student
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
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                    <Input 
                      id="enrollmentNumber"
                      value={newStudent.enrollmentNumber}
                      onChange={(e) => setNewStudent({...newStudent, enrollmentNumber: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select 
                        value={newStudent.semester}
                        onValueChange={(value) => setNewStudent({...newStudent, semester: value})}
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
                        value={newStudent.branch}
                        onValueChange={(value) => setNewStudent({...newStudent, branch: value})}
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
                      value={newStudent.class}
                      onValueChange={(value) => setNewStudent({...newStudent, class: value})}
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
                  
                  <Button className="w-full mt-4" onClick={handleAddStudent}>
                    <Plus className="mr-2 h-4 w-4" /> Add Student
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Enrollment</TableHead>
                    <TableHead className="hidden lg:table-cell">Semester</TableHead>
                    <TableHead className="hidden md:table-cell">Branch</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => handleSelectStudent(student.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                        <TableCell className="hidden lg:table-cell">{student.enrollmentNumber}</TableCell>
                        <TableCell className="hidden lg:table-cell">{student.semester}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.branch}</TableCell>
                        <TableCell>
                          <span className="bg-attendance-light text-attendance-primary px-2 py-1 rounded text-xs">
                            {student.class}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            student.attendance >= 90 
                              ? "bg-green-100 text-green-700" 
                              : student.attendance >= 75 
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {student.attendance}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Students;
