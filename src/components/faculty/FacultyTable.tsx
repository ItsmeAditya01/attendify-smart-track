
import React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Mail, Phone, UserMinus } from "lucide-react";
import { Faculty } from "./types";

interface FacultyTableProps {
  facultyList: Faculty[];
  loading: boolean;
  selectedFaculty: string[];
  onSelectFaculty: (id: string) => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
}

export const FacultyTable: React.FC<FacultyTableProps> = ({
  facultyList,
  loading,
  selectedFaculty,
  onSelectFaculty,
  onSelectAll,
  onDeleteSelected,
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedFaculty.length === facultyList.length && facultyList.length > 0}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="hidden lg:table-cell">Subjects</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Loading faculty...
              </TableCell>
            </TableRow>
          ) : facultyList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No faculty members found
              </TableCell>
            </TableRow>
          ) : (
            facultyList.map((fac) => (
              <TableRow key={fac.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedFaculty.includes(fac.id)}
                    onCheckedChange={() => onSelectFaculty(fac.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{fac.name}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-attendance-primary" />
                    {fac.email}
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-attendance-secondary" />
                    {fac.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="bg-attendance-light text-attendance-primary px-2 py-1 rounded text-xs">
                    {fac.department}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {fac.subjects.map(subject => (
                      <span
                        key={subject}
                        className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {selectedFaculty.length > 0 && (
        <div className="flex items-center gap-2 mt-3 p-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            className="flex items-center gap-1"
          >
            <UserMinus className="h-4 w-4" />
            Delete ({selectedFaculty.length})
          </Button>
        </div>
      )}
    </div>
  );
};
