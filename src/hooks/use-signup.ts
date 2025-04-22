
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
      
      // For student role, ensure all required fields are included
      const signupData: Partial<{
        name: string;
        email: string;
        role: UserRole;
        enrollmentNumber?: string;
        semester?: string;
        branch?: string;
        class?: string;
      }> = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };
      
      // Only add student-specific fields for student role
      if (userData.role === "student") {
        signupData.enrollmentNumber = userData.enrollmentNumber;
        signupData.semester = userData.semester;
        signupData.branch = userData.branch;
        signupData.class = userData.class;
      }
      
      console.log("Sending signup data:", signupData);
      await signup(signupData, userData.password);
      
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
