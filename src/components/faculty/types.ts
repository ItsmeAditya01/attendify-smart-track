
export type DepartmentType = "Computer Science" | "Information Technology" | "Electronics" | "Mechanical" | "Civil";

export interface Faculty {
  id: string;
  full_name: string;
  email: string;
  faculty_number: string;
  department: string | null;
  position: string | null;
  created_at: string;
  subjects?: string[];
}
