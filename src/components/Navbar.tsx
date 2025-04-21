
import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case "admin":
        return "bg-attendance-primary text-white";
      case "faculty":
        return "bg-attendance-secondary text-white";
      case "student":
        return "bg-attendance-accent text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <nav className="w-full border-b border-border py-3 px-4 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Attendify</SheetTitle>
              </SheetHeader>
              <div className="py-4 flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                {(user?.role === "admin" || user?.role === "faculty") && (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => navigate("/students")}
                    >
                      Students
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => navigate("/timetable")}
                    >
                      Timetable
                    </Button>
                  </>
                )}
                {user?.role === "admin" && (
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => navigate("/faculty")}
                  >
                    Faculty
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/attendance")}
                >
                  Attendance
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <h1 
            className="text-xl font-bold cursor-pointer" 
            onClick={() => navigate("/dashboard")}
          >
            <span className="text-attendance-primary">Attend</span>
            <span className="text-attendance-accent">ify</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
          
          {(user?.role === "admin" || user?.role === "faculty") && (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/students")}
              >
                Students
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/timetable")}
              >
                Timetable
              </Button>
            </>
          )}
          
          {user?.role === "admin" && (
            <Button
              variant="ghost"
              onClick={() => navigate("/faculty")}
            >
              Faculty
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={() => navigate("/attendance")}
          >
            Attendance
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <>
              <div className="hidden md:flex items-center mr-2">
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor()}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
