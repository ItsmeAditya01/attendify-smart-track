
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface StudentTableProps {
  students: any[];
  loading: boolean;
  selectedStudents: string[];
  onSelectStudent: (studentId: string) => void;
  onSelectAll: () => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  loading,
  selectedStudents,
  onSelectStudent,
  onSelectAll
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedStudents.length === students.length && students.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Enrollment</TableHead>
            <TableHead className="hidden lg:table-cell">Semester</TableHead>
            <TableHead className="hidden md:table-cell">Branch</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Attendance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                Loading students...
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No students found
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => onSelectStudent(student.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                <TableCell className="hidden lg:table-cell">{student.enrollmentNumber}</TableCell>
                <TableCell className="hidden lg:table-cell">{student.semester}</TableCell>
                <TableCell className="hidden md:table-cell">{student.branch}</TableCell>
                <TableCell>
                  <span className="bg-attendance-light text-attendance-primary px-2 py-1 rounded text-xs">
                    {student.class}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    student.attendance >= 90
                      ? "bg-green-100 text-green-700"
                      : student.attendance >= 75
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}>
                    {student.attendance}%
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
