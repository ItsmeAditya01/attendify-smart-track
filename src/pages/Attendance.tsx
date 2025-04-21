
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, CheckCircle, XCircle, Clock, Calendar as CalendarIcon } from "lucide-react";

// Types
interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  status: "present" | "absent" | "pending";
  class: string;
}

interface StudentAttendance {
  id: string;
  name: string;
  enrollmentNumber: string;
  status: "present" | "absent" | "pending";
  class: string;
}

// Mock data
const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    date: "2025-04-21",
    subject: "Data Structures",
    status: "present",
    class: "CS-301"
  },
  {
    id: "2",
    date: "2025-04-20",
    subject: "Database Systems",
    status: "present",
    class: "CS-301"
  },
  {
    id: "3",
    date: "2025-04-19",
    subject: "Computer Networks",
    status: "absent",
    class: "CS-301"
  },
  {
    id: "4",
    date: "2025-04-18",
    subject: "Operating Systems",
    status: "present",
    class: "CS-301"
  },
  {
    id: "5",
    date: "2025-04-17",
    subject: "Software Engineering",
    status: "present",
    class: "CS-301"
  },
  {
    id: "6",
    date: "2025-04-16",
    subject: "Data Structures",
    status: "present",
    class: "CS-301"
  },
  {
    id: "7",
    date: "2025-04-15",
    subject: "Database Systems",
    status: "absent",
    class: "CS-301"
  },
  {
    id: "8",
    date: "2025-04-14",
    subject: "Computer Networks",
    status: "present",
    class: "CS-301"
  }
];

const initialStudentAttendance: StudentAttendance[] = [
  {
    id: "1",
    name: "John Doe",
    enrollmentNumber: "EN12001",
    status: "pending",
    class: "CS-301"
  },
  {
    id: "2",
    name: "Jane Smith",
    enrollmentNumber: "EN12002",
    status: "pending",
    class: "CS-301"
  },
  {
    id: "3",
    name: "Michael Johnson",
    enrollmentNumber: "EN12003",
    status: "pending",
    class: "CS-301"
  },
  {
    id: "4",
    name: "Emily Davis",
    enrollmentNumber: "EN12004",
    status: "pending",
    class: "CS-301"
  },
  {
    id: "5",
    name: "Robert Wilson",
    enrollmentNumber: "EN12005",
    status: "pending",
    class: "IT-501"
  },
  {
    id: "6",
    name: "Sarah Brown",
    enrollmentNumber: "EN12006",
    status: "pending",
    class: "IT-501"
  },
  {
    id: "7",
    name: "David Lee",
    enrollmentNumber: "EN12007",
    status: "pending",
    class: "IT-501"
  },
  {
    id: "8",
    name: "Lisa Taylor",
    enrollmentNumber: "EN12008",
    status: "pending",
    class: "EC-101"
  }
];

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>(initialStudentAttendance);
  const [currentClass, setCurrentClass] = useState(user?.role === "student" ? (user.class || "CS-301") : "CS-301");
  const [currentSubject, setCurrentSubject] = useState("Data Structures");
  const [activeTab, setActiveTab] = useState<"view" | "mark">(user?.role === "student" ? "view" : "mark");

  const filteredAttendanceRecords = attendanceRecords.filter(record => {
    if (user?.role === "student") {
      return record.class === user.class;
    }
    return record.class === currentClass;
  });

  const filteredStudentAttendance = studentAttendance.filter(record => record.class === currentClass);

  const attendanceStats = {
    total: filteredAttendanceRecords.length,
    present: filteredAttendanceRecords.filter(record => record.status === "present").length,
    absent: filteredAttendanceRecords.filter(record => record.status === "absent").length,
    percentage: filteredAttendanceRecords.length > 0
      ? Math.round((filteredAttendanceRecords.filter(record => record.status === "present").length / filteredAttendanceRecords.length) * 100)
      : 0
  };

  const handleMarkAllPresent = () => {
    setStudentAttendance(prev => 
      prev.map(student => 
        student.class === currentClass 
          ? { ...student, status: "present" } 
          : student
      )
    );
  };

  const handleToggleAttendance = (studentId: string) => {
    setStudentAttendance(prev => 
      prev.map(student => 
        student.id === studentId
          ? { 
              ...student, 
              status: student.status === "pending" 
                ? "present" 
                : student.status === "present" 
                ? "absent" 
                : "present"
            }
          : student
      )
    );
  };

  const handleSubmitAttendance = () => {
    // Check if any students are still pending
    const pendingStudents = studentAttendance.filter(
      student => student.class === currentClass && student.status === "pending"
    );

    if (pendingStudents.length > 0) {
      toast({
        title: "Incomplete Attendance",
        description: "Please mark attendance for all students",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would submit to a backend
    toast({
      title: "Attendance Submitted",
      description: `Attendance for ${currentClass} - ${currentSubject} has been recorded`,
    });

    // Reset attendance status back to pending
    setStudentAttendance(prev => 
      prev.map(student => 
        student.class === currentClass 
          ? { ...student, status: "pending" } 
          : student
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold mb-1">Attendance Management</h1>
          <p className="text-gray-600">Track and manage attendance records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-attendance-primary" />
                {attendanceStats.total}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Present Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                {attendanceStats.present}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{attendanceStats.percentage}%</div>
                <Progress value={attendanceStats.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="animate-scale-in">
          <CardHeader>
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "view" | "mark")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="view">View Attendance</TabsTrigger>
                {(user?.role === "admin" || user?.role === "faculty") && (
                  <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
                )}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {activeTab === "view" ? (
              <>
                {user?.role !== "student" && (
                  <div className="mb-4">
                    <Label>Select Class</Label>
                    <Select value={currentClass} onValueChange={setCurrentClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS-301">CS-301</SelectItem>
                        <SelectItem value="IT-501">IT-501</SelectItem>
                        <SelectItem value="EC-101">EC-101</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttendanceRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAttendanceRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell>{record.subject}</TableCell>
                            <TableCell>
                              {record.status === "present" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                                  <CheckCircle className="h-3 w-3" />
                                  Present
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs">
                                  <XCircle className="h-3 w-3" />
                                  Absent
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Class</Label>
                    <Select value={currentClass} onValueChange={setCurrentClass}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS-301">CS-301</SelectItem>
                        <SelectItem value="IT-501">IT-501</SelectItem>
                        <SelectItem value="EC-101">EC-101</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Subject</Label>
                    <Select value={currentSubject} onValueChange={setCurrentSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Data Structures">Data Structures</SelectItem>
                        <SelectItem value="Database Systems">Database Systems</SelectItem>
                        <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                        <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleMarkAllPresent}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Mark All Present
                  </Button>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Enrollment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudentAttendance.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No students found in this class
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudentAttendance.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.enrollmentNumber}</TableCell>
                            <TableCell>
                              {student.status === "present" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                                  <CheckCircle className="h-3 w-3" />
                                  Present
                                </span>
                              ) : student.status === "absent" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs">
                                  <XCircle className="h-3 w-3" />
                                  Absent
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant={
                                  student.status === "present" 
                                    ? "outline" 
                                    : student.status === "absent" 
                                    ? "destructive" 
                                    : "secondary"
                                }
                                size="sm" 
                                onClick={() => handleToggleAttendance(student.id)}
                              >
                                {student.status === "present" 
                                  ? "Mark Absent" 
                                  : student.status === "absent" 
                                  ? "Mark Present" 
                                  : "Mark"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleSubmitAttendance}>
                    Submit Attendance
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Label component
const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium mb-1.5">{children}</div>
);

export default Attendance;
