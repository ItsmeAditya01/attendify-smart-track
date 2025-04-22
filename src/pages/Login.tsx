
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [role, setRole] = useState<UserRole>("student");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await login(email, password, role);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or user not found",
        variant: "destructive",
      });
      setLoggingIn(false);
    }
  };

  // Show loading state either from local or global auth state
  const showLoading = loggingIn || isLoading;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-3xl font-bold">
            <span className="text-attendance-primary">Attend</span>
            <span className="text-attendance-accent">ify</span>
          </h1>
          <p className="mt-2 text-gray-600">Modern Attendance Tracking</p>
        </div>

        {showLoading && (
          <div className="w-full">
            <Progress value={75} className="h-1 mb-2" />
            <p className="text-center text-sm text-muted-foreground">
              {isLoading ? "Checking authentication..." : "Logging in..."}
            </p>
          </div>
        )}

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
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={showLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={showLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={showLoading}>
                    {showLoading ? "Logging in..." : "Sign in as Student"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="faculty">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="faculty@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={showLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={showLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={showLoading}>
                    {showLoading ? "Logging in..." : "Sign in as Faculty"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="admin">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={showLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={showLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={showLoading}>
                    {showLoading ? "Logging in..." : "Sign in as Admin"}
                  </Button>
                </form>
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

        <div className="text-center text-sm text-gray-500 animate-fade-in">
          <p>Demo credentials (use "password" for all):</p>
          <p>admin@example.com (Admin)</p>
          <p>faculty@example.com (Faculty)</p>
          <p>student@example.com (Student)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
