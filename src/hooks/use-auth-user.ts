
import { User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types/auth";

/**
 * Helper function to extract user data from Supabase auth session
 */
export const extractUserDataFromSession = (session: any): User | null => {
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
