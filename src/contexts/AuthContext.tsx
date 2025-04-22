
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
  isLoading: boolean; // Added loading state for auth operations
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
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track initial loading

  // Helper function to convert Supabase profile to our User type
  const mapProfileToUser = (profile: any): User => {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role as UserRole,
      enrollmentNumber: profile.enrollment_number || undefined,
      semester: profile.semester || undefined,
      branch: profile.branch || undefined,
      class: profile.class || undefined,
    };
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Use setTimeout to prevent Supabase auth deadlocks
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(mapProfileToUser(profile));
              setIsAuthenticated(true);
            }
            setIsLoading(false);
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser(mapProfileToUser(profile));
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } finally {
      // Don't set isLoading to false here - the onAuthStateChange will handle that
    }
  };

  const signup = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      // Convert any undefined values to null for Supabase metadata
      const metaData: Record<string, any> = {
        name: userData.name,
        role: userData.role,
      };
      
      // Only include student-specific fields if role is student
      if (userData.role === 'student') {
        metaData.enrollment_number = userData.enrollmentNumber || '';
        metaData.semester = userData.semester || '';
        metaData.branch = userData.branch || '';
        metaData.class = userData.class || '';
      }

      const { error } = await supabase.auth.signUp({
        email: userData.email || '',
        password,
        options: {
          data: metaData,
        },
      });

      if (error) throw error;
    } finally {
      // Don't set isLoading to false here - the onAuthStateChange will handle that
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
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
