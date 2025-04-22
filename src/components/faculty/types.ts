
export type DepartmentType = "Computer Science" | "Information Technology" | "Electronics" | "Mechanical" | "Civil";

export interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: DepartmentType;
  subjects: string[];
  user_id: string;
}
