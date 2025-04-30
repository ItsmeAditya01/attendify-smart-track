
import React, { createContext, useReducer, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { authReducer, initialAuthState, AuthState, AuthAction } from "./authReducer";
import { extractUserDataFromSession } from "@/hooks/use-auth-user";
import { User, UserRole } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Set up auth state listener
  useEffect(() => {
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
                dispatch({ type: 'SET_USER', payload: userData });
                dispatch({ type: 'SET_AUTHENTICATED', payload: true });
              } else {
                console.log("Could not extract user data from session");
                dispatch({ type: 'SET_USER', payload: null });
                dispatch({ type: 'SET_AUTHENTICATED', payload: false });
              }
            } catch (error) {
              console.error("Error in auth state change handler:", error);
              dispatch({ type: 'SET_USER', payload: null });
              dispatch({ type: 'SET_AUTHENTICATED', payload: false });
            } finally {
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          }, 0);
        } else {
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const userData = extractUserDataFromSession(session);
          
          if (userData) {
            dispatch({ type: 'SET_USER', payload: userData });
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
          }
        } catch (error) {
          console.error("Error in session initialization:", error);
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log(`Attempting login for ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      console.log("Login successful, session created:", data.session?.user?.id);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signup = async (userData: Partial<User>, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
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
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        ...state, 
        login, 
        signup, 
        logout,
        dispatch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
