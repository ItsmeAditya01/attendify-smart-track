
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Timetable from "./pages/Timetable";
import Attendance from "./pages/Attendance";
import Faculty from "./pages/Faculty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            
            <Route path="/students" element={
              <AuthGuard allowedRoles={["admin", "faculty"]}>
                <Students />
              </AuthGuard>
            } />
            
            <Route path="/timetable" element={
              <AuthGuard>
                <Timetable />
              </AuthGuard>
            } />
            
            <Route path="/attendance" element={
              <AuthGuard>
                <Attendance />
              </AuthGuard>
            } />
            
            <Route path="/faculty" element={
              <AuthGuard allowedRoles={["admin"]}>
                <Faculty />
              </AuthGuard>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
