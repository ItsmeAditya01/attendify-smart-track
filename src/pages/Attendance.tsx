
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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

// Mock data since we don't have the actual tables yet
const classOptions = [
  { value: "CS-301", label: "CS-301" },
  { value: "IT-501", label: "IT-501" },
  { value: "EC-101", label: "EC-101" },
];

const subjectOptions = [
  "Data Structures",
  "Database Systems",
  "Computer Networks",
  "Operating Systems"
];

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentClass, setCurrentClass] = useState(
    user?.role === "student" ? (user.class || "CS-301") : "CS-301"
  );
  const [currentSubject, setCurrentSubject] = useState(subjectOptions[0]);
  const [activeTab, setActiveTab] = useState<"view" | "mark">(
    user?.role === "student" ? "view" : "mark"
  );
  const [dateToday] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  });

  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      setFetching(true);

      if (!user) return;
      let studentProfiles: StudentAttendance[] = [];
      let attendance: AttendanceRecord[] = [];

      // Mock students and attendance data based on user role
      // In a real implementation, this would fetch from your database
      if (user.role === "student") {
        // For student role, we only show their own data
        studentProfiles = [
          {
            id: user.id,
            name: user.name,
            enrollmentNumber: user.enrollmentNumber || "N/A",
            status: "pending",
            class: user.class || "CS-301"
          }
        ];

        // Mock attendance data - in a real app, this would come from Supabase
        attendance = [
          {
            id: "att1",
            date: new Date().toISOString().split('T')[0],
            subject: "Data Structures",
            status: "present",
            class: user.class || "CS-301"
          },
          {
            id: "att2",
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            subject: "Database Systems",
            status: "absent",
            class: user.class || "CS-301"
          },
          {
            id: "att3",
            date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
            subject: "Computer Networks",
            status: "present",
            class: user.class || "CS-301"
          }
        ];
      } else {
        // For faculty/admin roles, we show all students in the selected class
        // This is mock data - in a real app, fetch from Supabase
        studentProfiles = [
          {
            id: "s1",
            name: "John Doe",
            enrollmentNumber: "EN001",
            status: "pending",
            class: currentClass
          },
          {
            id: "s2",
            name: "Jane Smith",
            enrollmentNumber: "EN002",
            status: "pending",
            class: currentClass
          },
          {
            id: "s3",
            name: "Alex Johnson",
            enrollmentNumber: "EN003",
            status: "pending",
            class: currentClass
          }
        ];

        // Mock attendance data for all students
        attendance = [
          {
            id: "att1",
            date: new Date().toISOString().split('T')[0],
            subject: "Data Structures",
            status: "present",
            class: currentClass
          },
          {
            id: "att2",
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
            subject: "Database Systems",
            status: "absent",
            class: currentClass
          }
        ];
      }

      setStudents(studentProfiles);
      setAttendanceRecords(attendance);
      setFetching(false);
    };

    fetchStudentsAndAttendance();
  }, [user, currentClass]);

  const [statusMap, setStatusMap] = useState<{ [id: string]: "present" | "absent" | "pending" }>({});

  useEffect(() => {
    if (user?.role === "faculty" || user?.role === "admin") {
      // Initialize status map for all students
      const initialMap: { [k: string]: "present" | "absent" | "pending" } = {};
      students.forEach(s => {
        initialMap[s.id] = "pending";
      });
      setStatusMap(initialMap);
    }
  }, [students, user]);

  let attendanceStats = {
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0
  };

  if (user?.role === "student" && attendanceRecords.length > 0) {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((r) => r.status === "present").length;
    const absent = attendanceRecords.filter((r) => r.status === "absent").length;
    attendanceStats = {
      total,
      present,
      absent,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  } else if (attendanceRecords.length > 0) {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((r) => r.status === "present").length;
    const absent = attendanceRecords.filter((r) => r.status === "absent").length;
    attendanceStats = {
      total,
      present,
      absent,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }

  const handleMarkAllPresent = () => {
    if (students.length === 0) return;
    const updated: typeof statusMap = {};
    students.forEach((s) => {
      updated[s.id] = "present";
    });
    setStatusMap(updated);
  };

  const handleToggleAttendance = (studentId: string) => {
    setStatusMap((prev) => {
      const prevStatus = prev[studentId] || "pending";
      let nextStatus: "present" | "absent" | "pending";
      if (prevStatus === "pending") nextStatus = "present";
      else if (prevStatus === "present") nextStatus = "absent";
      else nextStatus = "present";
      return { ...prev, [studentId]: nextStatus };
    });
  };

  const handleSubmitAttendance = async () => {
    if (submitLoading) return;
    if (!user) return;
    if (!students.length) {
      toast({
        title: "No students",
        description: "There are no students to mark attendance for.",
        variant: "destructive",
      });
      return;
    }
    const unmarked = Object.values(statusMap).filter((val) => val === "pending").length;
    if (unmarked > 0) {
      toast({
        title: "Incomplete Attendance",
        description: "Please mark attendance for all students before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitLoading(true);
    
    // In a real implementation, this would save to Supabase
    // For now, we'll just simulate success
    setTimeout(() => {
      toast({
        title: "Attendance Submitted",
        description: "Attendance has been recorded for this class today.",
      });
      setSubmitLoading(false);
      
      // Refresh the UI to show the new attendance
      const newAttendance = students.map(student => ({
        id: `att-${student.id}-${Date.now()}`,
        date: dateToday,
        subject: currentSubject,
        status: statusMap[student.id],
        class: currentClass
      }));
      
      setAttendanceRecords(prev => [...newAttendance, ...prev]);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (user?.role === "student") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold mb-1">My Attendance</h1>
            <p className="text-gray-600">Your attendance history</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{attendanceStats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Present Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{attendanceStats.present}</div>
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
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Recent entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fetching ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : attendanceRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell>
                            {record.status === "present" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                                <span className="i-lucide-check" />
                                Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs">
                                <span className="i-lucide-x" />
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
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
              <div className="text-3xl font-bold">{attendanceStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Present Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{attendanceStats.present}</div>
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
                <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {activeTab === "view" ? (
              <>
                <div className="mb-4">
                  <Label>Select Class</Label>
                  <Select value={currentClass} onValueChange={setCurrentClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map(cls => (
                        <SelectItem key={cls.value} value={cls.value}>{cls.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Enrollment</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead>Absent</TableHead>
                        <TableHead>Attendance (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fetching ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No students found in this class
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((student) => {
                          const studentAtt = attendanceRecords.filter(r => r.class === currentClass);
                          const total = 10; // Mock total classes
                          const present = 8; // Mock present count
                          const absent = 2; // Mock absent count
                          const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
                          return (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.enrollmentNumber}</TableCell>
                              <TableCell>{present}</TableCell>
                              <TableCell>{absent}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  percentage >= 90
                                    ? "bg-green-100 text-green-700"
                                    : percentage >= 75
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {percentage}%
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })
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
                        {classOptions.map(cls => (
                          <SelectItem key={cls.value} value={cls.value}>{cls.label}</SelectItem>
                        ))}
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
                        {subjectOptions.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
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
                      {fetching ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            Loading students...
                          </TableCell>
                        </TableRow>
                      ) : students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No students found in this class
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.enrollmentNumber}</TableCell>
                            <TableCell>
                              {statusMap[student.id] === "present"
                                ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs"><span className="i-lucide-check" /> Present</span>
                                : statusMap[student.id] === "absent"
                                ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs"><span className="i-lucide-x" /> Absent</span>
                                : <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">Pending</span>
                              }
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant={
                                  statusMap[student.id] === "present"
                                    ? "outline"
                                    : statusMap[student.id] === "absent"
                                    ? "destructive"
                                    : "secondary"
                                }
                                size="sm"
                                onClick={() => handleToggleAttendance(student.id)}
                              >
                                {statusMap[student.id] === "present"
                                  ? "Mark Absent"
                                  : statusMap[student.id] === "absent"
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
                  <Button onClick={handleSubmitAttendance} disabled={submitLoading}>
                    {submitLoading ? "Submitting..." : "Submit Attendance"}
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

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-medium mb-1.5">{children}</div>
);

export default Attendance;
