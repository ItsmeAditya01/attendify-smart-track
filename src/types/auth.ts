
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

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
