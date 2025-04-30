
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to create demo accounts in Supabase.
 * This is for testing and development purposes only.
 */
export const setupDemoAccounts = async () => {
  try {
    console.log("Setting up demo accounts...");
    
    // Admin account
    const { error: adminError } = await supabase.auth.signUp({
      email: "admin@example.com",
      password: "password123",
      options: {
        data: {
          name: "Admin User",
          role: "admin",
        },
      },
    });
    
    if (adminError) {
      console.error("Error creating admin account:", adminError);
    } else {
      console.log("Admin account created or already exists");
    }
    
    // Faculty account
    const { error: facultyError } = await supabase.auth.signUp({
      email: "faculty@example.com",
      password: "password123",
      options: {
        data: {
          name: "Faculty User",
          role: "faculty",
        },
      },
    });
    
    if (facultyError) {
      console.error("Error creating faculty account:", facultyError);
    } else {
      console.log("Faculty account created or already exists");
    }
    
    // Student account
    const { error: studentError } = await supabase.auth.signUp({
      email: "student@example.com",
      password: "password123",
      options: {
        data: {
          name: "Student User",
          role: "student",
          enrollment_number: "EN12345",
          semester: "4th",
          branch: "Computer Science",
          class: "CS-301",
        },
      },
    });
    
    if (studentError) {
      console.error("Error creating student account:", studentError);
    } else {
      console.log("Student account created or already exists");
    }
    
    return { success: true, message: "Demo accounts setup completed" };
  } catch (error) {
    console.error("Error setting up demo accounts:", error);
    return { 
      success: false, 
      message: "Failed to set up demo accounts",
      error
    };
  }
};
