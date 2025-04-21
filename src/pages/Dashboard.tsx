
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, BookOpen, UserCheck } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data
  const stats = {
    totalClasses: 42,
    attendanceRate: 89,
    upcomingClasses: 3,
    totalStudents: 120,
  };

  const welcomeMessage = () => {
    const time = new Date().getHours();
    if (time < 12) return "Good Morning";
    if (time < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getCardsByRole = () => {
    switch (user?.role) {
      case "admin":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total Students"
              value={stats.totalStudents}
              description="Enrolled students"
              icon={<Users className="h-6 w-6 text-attendance-primary" />}
            />
            <StatCard
              title="Faculty Members"
              value={15}
              description="Active faculty"
              icon={<UserCheck className="h-6 w-6 text-attendance-secondary" />}
            />
            <StatCard
              title="Departments"
              value={6}
              description="Active departments"
              icon={<BookOpen className="h-6 w-6 text-attendance-accent" />}
            />
            <StatCard
              title="Total Classes"
              value={stats.totalClasses}
              description="Across all courses"
              icon={<Calendar className="h-6 w-6 text-attendance-primary" />}
            />
            <StatCard
              title="Average Attendance"
              value={`${stats.attendanceRate}%`}
              description="Overall attendance rate"
              icon={<Clock className="h-6 w-6 text-attendance-secondary" />}
            />
            <Card className="attendance-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Admin tools</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="p-2 hover:bg-gray-50 rounded-md transition-colors">
                    → Manage faculty accounts
                  </li>
                  <li className="p-2 hover:bg-gray-50 rounded-md transition-colors">
                    → Review attendance reports
                  </li>
                  <li className="p-2 hover:bg-gray-50 rounded-md transition-colors">
                    → Configure system settings
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      case "faculty":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="My Classes"
              value={18}
              description="Classes assigned"
              icon={<Calendar className="h-6 w-6 text-attendance-primary" />}
            />
            <StatCard
              title="Students"
              value={94}
              description="Across all classes"
              icon={<Users className="h-6 w-6 text-attendance-secondary" />}
            />
            <StatCard
              title="Today's Classes"
              value={3}
              description="Scheduled today"
              icon={<Clock className="h-6 w-6 text-attendance-accent" />}
            />
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 attendance-card">
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Classes scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ScheduleItem
                    time="09:00 AM - 10:30 AM"
                    class="CS-101"
                    subject="Data Structures"
                    room="Room 204"
                  />
                  <ScheduleItem
                    time="11:00 AM - 12:30 PM"
                    class="CS-102"
                    subject="Database Management"
                    room="Lab 3"
                  />
                  <ScheduleItem
                    time="02:00 PM - 03:30 PM"
                    class="IT-101"
                    subject="Web Development"
                    room="Room 107"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  View full schedule in the Timetable section
                </p>
              </CardFooter>
            </Card>
          </div>
        );
      case "student":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Attendance Rate"
              value={`${stats.attendanceRate}%`}
              description="Your overall attendance"
              icon={<UserCheck className="h-6 w-6 text-attendance-primary" />}
            />
            <StatCard
              title="Classes Attended"
              value={37}
              description="Out of 42 total classes"
              icon={<Calendar className="h-6 w-6 text-attendance-secondary" />}
            />
            <StatCard
              title="Today's Classes"
              value={3}
              description="Scheduled today"
              icon={<Clock className="h-6 w-6 text-attendance-accent" />}
            />
            <Card className="col-span-1 md:col-span-2 lg:col-span-3 attendance-card">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Classes scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ScheduleItem
                    time="09:00 AM - 10:30 AM"
                    class={user?.class || "CS-101"}
                    subject="Data Structures"
                    room="Room 204"
                  />
                  <ScheduleItem
                    time="11:00 AM - 12:30 PM"
                    class={user?.class || "CS-101"}
                    subject="Database Management"
                    room="Lab 3"
                  />
                  <ScheduleItem
                    time="02:00 PM - 03:30 PM"
                    class={user?.class || "CS-101"}
                    subject="Web Development"
                    room="Room 107"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  View your full attendance report in the Attendance section
                </p>
              </CardFooter>
            </Card>
          </div>
        );
      default:
        return <div>Loading...</div>;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold mb-1">{welcomeMessage()}, {user.name}</h1>
          <p className="text-gray-600">Here's your attendance summary</p>
        </div>

        <div className="animate-scale-in">
          {getCardsByRole()}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, description, icon }: { title: string; value: string | number; description: string; icon: React.ReactNode }) => {
  return (
    <Card className="attendance-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

const ScheduleItem = ({ time, class: classRoom, subject, room }: { time: string; class: string; subject: string; room: string }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center p-4 rounded-lg border border-border bg-white">
      <div className="md:w-1/4 font-semibold">{time}</div>
      <div className="md:w-1/4 mt-2 md:mt-0">
        <span className="bg-attendance-light text-attendance-primary px-2 py-1 rounded-md text-sm">
          {classRoom}
        </span>
      </div>
      <div className="md:w-1/4 mt-2 md:mt-0 font-medium">{subject}</div>
      <div className="md:w-1/4 mt-2 md:mt-0 text-muted-foreground">{room}</div>
    </div>
  );
};

export default Dashboard;
