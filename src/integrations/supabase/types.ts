export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string
          date: string
          id: string
          marked_by: string
          status: boolean
          student_id: string
          timetable_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          marked_by: string
          status?: boolean
          student_id: string
          timetable_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          marked_by?: string
          status?: boolean
          student_id?: string
          timetable_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_timetable_id_fkey"
            columns: ["timetable_id"]
            isOneToOne: false
            referencedRelation: "timetable"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          branch: string
          course_code: string
          created_at: string
          id: string
          name: string
          semester: string
        }
        Insert: {
          branch: string
          course_code: string
          created_at?: string
          id?: string
          name: string
          semester: string
        }
        Update: {
          branch?: string
          course_code?: string
          created_at?: string
          id?: string
          name?: string
          semester?: string
        }
        Relationships: []
      }
      faculty: {
        Row: {
          created_at: string
          department: Database["public"]["Enums"]["department_enum"]
          email: string
          id: string
          name: string
          phone: string | null
          subjects: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          department: Database["public"]["Enums"]["department_enum"]
          email: string
          id?: string
          name: string
          phone?: string | null
          subjects?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          department?: Database["public"]["Enums"]["department_enum"]
          email?: string
          id?: string
          name?: string
          phone?: string | null
          subjects?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      Faculty: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      faculty_subjects: {
        Row: {
          created_at: string
          faculty_id: string
          id: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          faculty_id: string
          id?: string
          subject_id: string
        }
        Update: {
          created_at?: string
          faculty_id?: string
          id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculty_subjects_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faculty_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          branch: string | null
          class: string | null
          created_at: string
          email: string
          enrollment_number: string | null
          id: string
          last_sign_in: string | null
          name: string
          role: string
          semester: string | null
          updated_at: string
        }
        Insert: {
          branch?: string | null
          class?: string | null
          created_at?: string
          email: string
          enrollment_number?: string | null
          id: string
          last_sign_in?: string | null
          name: string
          role: string
          semester?: string | null
          updated_at?: string
        }
        Update: {
          branch?: string | null
          class?: string | null
          created_at?: string
          email?: string
          enrollment_number?: string | null
          id?: string
          last_sign_in?: string | null
          name?: string
          role?: string
          semester?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          branch: string
          class: string
          created_at: string
          email: string
          enrollment_number: string
          id: string
          name: string
          semester: string
          user_id: string
        }
        Insert: {
          branch: string
          class: string
          created_at?: string
          email: string
          enrollment_number: string
          id?: string
          name: string
          semester: string
          user_id: string
        }
        Update: {
          branch?: string
          class?: string
          created_at?: string
          email?: string
          enrollment_number?: string
          id?: string
          name?: string
          semester?: string
          user_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          branch: string
          code: string
          created_at: string
          credits: number
          id: string
          name: string
          semester: string
        }
        Insert: {
          branch: string
          code: string
          created_at?: string
          credits: number
          id?: string
          name: string
          semester: string
        }
        Update: {
          branch?: string
          code?: string
          created_at?: string
          credits?: number
          id?: string
          name?: string
          semester?: string
        }
        Relationships: []
      }
      timetable: {
        Row: {
          class_id: string
          created_at: string
          day: string
          end_time: string
          faculty_id: string
          id: string
          room: string
          start_time: string
          subject_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          day: string
          end_time: string
          faculty_id: string
          id?: string
          room: string
          start_time: string
          subject_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          day?: string
          end_time?: string
          faculty_id?: string
          id?: string
          room?: string
          start_time?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      department_enum:
        | "Computer Science"
        | "Information Technology"
        | "Electronics"
        | "Mechanical"
        | "Civil"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      department_enum: [
        "Computer Science",
        "Information Technology",
        "Electronics",
        "Mechanical",
        "Civil",
      ],
    },
  },
} as const
