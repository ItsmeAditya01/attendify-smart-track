
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "faculty" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrollmentNumber?: string;
  semester?: string;
  branch?: string;
  class?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("attendifyUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("attendifyUser");
      }
    }
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string, role: UserRole) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - In a real app, this would be handled by a backend
      const mockUsers: Record<string, User> = {
        "admin@example.com": {
          id: "admin-1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin"
        },
        "faculty@example.com": {
          id: "faculty-1",
          name: "Faculty User",
          email: "faculty@example.com",
          role: "faculty"
        },
        "student@example.com": {
          id: "student-1",
          name: "Student User",
          email: "student@example.com",
          role: "student",
          enrollmentNumber: "EN12345",
          semester: "3rd",
          branch: "Computer Science",
          class: "CS-301"
        }
      };

      const foundUser = mockUsers[email];
      
      // Check if user exists and role matches
      if (foundUser && foundUser.role === role && password === "password") {
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("attendifyUser", JSON.stringify(foundUser));
      } else {
        throw new Error("Invalid credentials or role");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Mock signup function
  const signup = async (userData: Partial<User>, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user with mock ID
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || "New User",
        email: userData.email || "",
        role: userData.role || "student",
        ...(userData.role === "student" && {
          enrollmentNumber: userData.enrollmentNumber,
          semester: userData.semester,
          branch: userData.branch,
          class: userData.class
        })
      };
      
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("attendifyUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("attendifyUser");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
