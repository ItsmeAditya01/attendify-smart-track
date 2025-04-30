
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper function to extract user data from Supabase auth session
  const extractUserDataFromSession = (session: any) => {
    if (!session || !session.user) return null;
    
    // Extract user metadata (which contains our custom fields)
    const metadata = session.user.user_metadata || {};
    
    return {
      id: session.user.id,
      name: metadata.name || session.user.email,
      email: session.user.email,
      role: metadata.role || 'student',
      enrollmentNumber: metadata.enrollment_number,
      semester: metadata.semester,
      branch: metadata.branch,
      class: metadata.class
    };
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (session?.user) {
          // Use setTimeout to prevent Supabase auth deadlocks
          setTimeout(async () => {
            try {
              console.log("Session user data:", session.user);
              const userData = extractUserDataFromSession(session);
              
              if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
              } else {
                console.log("Could not extract user data from session");
                setUser(null);
                setIsAuthenticated(false);
              }
            } catch (error) {
              console.error("Error in auth state change handler:", error);
              setUser(null);
              setIsAuthenticated(false);
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const userData = extractUserDataFromSession(session);
          
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error in session initialization:", error);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log(`Attempting login for ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      // We don't need to set the user here as the onAuthStateChange handler will do it
      console.log("Login successful, session created:", data.session?.user?.id);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      
      // Create clean metadata for signup
      const metaData: Record<string, any> = {
        name: userData.name || '',
        role: userData.role || 'student',
      };
      
      // Only include student-specific fields if role is student
      if (userData.role === 'student') {
        metaData.enrollment_number = userData.enrollmentNumber || '';
        metaData.semester = userData.semester || '';
        metaData.branch = userData.branch || '';
        metaData.class = userData.class || '';
      }

      console.log("Signing up with metadata:", metaData);
      console.log("Full user data:", userData);
      
      const { error, data } = await supabase.auth.signUp({
        email: userData.email || '',
        password,
        options: {
          data: metaData,
        },
      });

      if (error) {
        console.error("Supabase signup error:", error);
        throw error;
      }
      
      console.log("Signup successful:", data);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
