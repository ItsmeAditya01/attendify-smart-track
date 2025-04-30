
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/auth";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginError } from "@/components/auth/LoginError";
import { LoginLoadingIndicator } from "@/components/auth/LoginLoadingIndicator";
import { StudentLoginForm } from "@/components/auth/StudentLoginForm";
import { FacultyLoginForm } from "@/components/auth/FacultyLoginForm";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { DemoCredentials } from "@/components/auth/DemoCredentials";

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [role, setRole] = useState<UserRole>("student");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoggingIn(true);
      await login(email, password);
      // Success is handled by the auth state change in AuthContext
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(
        error.message === "Invalid login credentials" 
          ? "Invalid email or password. Please try again." 
          : error.message || "An error occurred during login. Please try again."
      );
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or user not found",
        variant: "destructive",
      });
    } finally {
      setLoggingIn(false);
    }
  };

  // Show loading state either from local or global auth state
  const showLoading = loggingIn || isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginHeader />

        {showLoading && (
          <LoginLoadingIndicator 
            message={isLoading ? "Checking authentication..." : "Logging in..."}
          />
        )}

        <LoginError errorMessage={errorMessage} />

        <Card className={`animate-scale-in ${showLoading ? 'opacity-75' : ''}`}>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" onValueChange={(value) => setRole(value as UserRole)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="faculty">Faculty</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="student">
                <StudentLoginForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  handleLogin={handleLogin}
                  isLoading={showLoading}
                />
              </TabsContent>
              
              <TabsContent value="faculty">
                <FacultyLoginForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  handleLogin={handleLogin}
                  isLoading={showLoading}
                />
              </TabsContent>
              
              <TabsContent value="admin">
                <AdminLoginForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  handleLogin={handleLogin}
                  isLoading={showLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-attendance-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <DemoCredentials />
      </div>
    </div>
  );
};

export default Login;
