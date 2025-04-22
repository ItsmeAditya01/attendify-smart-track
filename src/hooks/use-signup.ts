
import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const { signup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signingUp, setSigningUp] = useState(false);

  const handleSignup = async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    enrollmentNumber?: string;
    semester?: string;
    branch?: string;
    class?: string;
  }) => {
    if (!userData.name || !userData.email || !userData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (userData.role === "student" && (!userData.enrollmentNumber || !userData.semester || !userData.branch || !userData.class)) {
      toast({
        title: "Error",
        description: "Please fill in all student details",
        variant: "destructive",
      });
      return;
    }

    try {
      setSigningUp(true);
      
      // Format the metadata correctly for Supabase
      // This is critical for the profiles table constraints
      const metaData: Record<string, any> = {
        name: userData.name,
        role: userData.role,
      };
      
      // Only include student-specific fields if role is student
      if (userData.role === 'student') {
        metaData.enrollment_number = userData.enrollmentNumber;
        metaData.semester = userData.semester;
        metaData.branch = userData.branch;
        metaData.class = userData.class;
      }
      
      await signup({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        ...(userData.role === 'student' ? {
          enrollmentNumber: userData.enrollmentNumber,
          semester: userData.semester,
          branch: userData.branch,
          class: userData.class
        } : {})
      }, userData.password);
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSigningUp(false);
    }
  };

  return {
    handleSignup,
    isAuthenticated,
    isLoading,
    signingUp,
  };
};
