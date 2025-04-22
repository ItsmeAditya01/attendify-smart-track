
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRole } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StudentForm } from "@/components/signup/StudentForm";
import { StaffForm } from "@/components/signup/StaffForm";
import { useSignup } from "@/hooks/use-signup";

const Signup = () => {
  const { handleSignup, isAuthenticated, isLoading, signingUp } = useSignup();
  const navigate = useNavigate();
  const [role, setRole] = React.useState<UserRole>("student");
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const showLoading = signingUp || isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold">
            <span className="text-attendance-primary">Attend</span>
            <span className="text-attendance-accent">ify</span>
          </h1>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        {showLoading && (
          <div className="w-full">
            <Progress value={75} className="h-1 mb-2" />
            <p className="text-center text-sm text-muted-foreground">
              {isLoading ? "Checking authentication..." : "Creating your account..."}
            </p>
          </div>
        )}

        <Card className={`animate-scale-in ${showLoading ? 'opacity-75' : ''}`}>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create a new account
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
                <StudentForm onSubmit={handleSignup} isLoading={showLoading} />
              </TabsContent>
              
              <TabsContent value="faculty">
                <StaffForm role="faculty" onSubmit={handleSignup} isLoading={showLoading} />
              </TabsContent>
              
              <TabsContent value="admin">
                <StaffForm role="admin" onSubmit={handleSignup} isLoading={showLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-attendance-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
