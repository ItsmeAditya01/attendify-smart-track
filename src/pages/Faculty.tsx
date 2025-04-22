
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, UserPlus, UserMinus, Mail, Phone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Types
interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
}

const Faculty = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [newFaculty, setNewFaculty] = useState<Omit<Faculty, "id">>({
    name: "",
    email: "",
    phone: "",
    department: "",
    subjects: []
  });
  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch faculty from Supabase
  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      // Fetch all rows from Faculty table
      const { data, error } = await supabase
        .from("Faculty")
        .select("*")
        .order("id", { ascending: true });
      if (error) {
        toast({
          title: "Error loading faculty",
          description: error.message,
          variant: "destructive",
        });
        setFaculty([]);
      } else {
        // Map Supabase rows to Faculty interface, fill in empty fields for old records
        setFaculty(
          (data ?? []).map((row: any) => ({
            id: String(row.id),
            name: row.name,
            email: "",
            phone: "",
            department: "",
            subjects: [],
          }))
        );
      }
      setLoading(false);
    };
    fetchFaculty();
  }, [toast]);

  // Filter faculty based on search
  const filteredFaculty = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFaculty = (facultyId: string) => {
    setSelectedFaculty(prev =>
      prev.includes(facultyId)
        ? prev.filter(id => id !== facultyId)
        : [...prev, facultyId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFaculty.length === filteredFaculty.length) {
      setSelectedFaculty([]);
    } else {
      setSelectedFaculty(filteredFaculty.map(f => f.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFaculty.length === 0) return;
    // Remove from Supabase
    const { error } = await supabase
      .from("Faculty")
      .delete()
      .in("id", selectedFaculty.map(Number));
    if (error) {
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setFaculty(prev => prev.filter(f => !selectedFaculty.includes(f.id)));
    toast({
      title: "Faculty Deleted",
      description: `${selectedFaculty.length} faculty members have been removed`,
    });
    setSelectedFaculty([]);
  };

  const handleAddSubject = () => {
    if (!newSubject.trim()) return;
    if (newFaculty.subjects.includes(newSubject)) {
      toast({
        title: "Subject already added",
        description: "This subject is already in the list",
        variant: "destructive",
      });
      return;
    }
    setNewFaculty({
      ...newFaculty,
      subjects: [...newFaculty.subjects, newSubject]
    });
    setNewSubject("");
  };

  const handleRemoveSubject = (subject: string) => {
    setNewFaculty({
      ...newFaculty,
      subjects: newFaculty.subjects.filter(s => s !== subject)
    });
  };

  const handleAddFaculty = async () => {
    if (!newFaculty.name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    // Insert only name to Faculty table (table schema only allows 'name')
    const { data, error } = await supabase
      .from("Faculty")
      .insert({ name: newFaculty.name })
      .select()
      .single();
    if (error) {
      toast({
        title: "Failed to add",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setFaculty(prev => [
      ...prev,
      {
        id: String(data.id),
        name: data.name,
        email: newFaculty.email,
        phone: newFaculty.phone,
        department: newFaculty.department,
        subjects: newFaculty.subjects,
      }
    ]);
    toast({
      title: "Faculty Added",
      description: `${newFaculty.name} has been added successfully`,
    });
    setNewFaculty({
      name: "",
      email: "",
      phone: "",
      department: "",
      subjects: []
    });
    setNewSubject("");
  };

  // Only admin can access this page
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
            <p className="text-gray-600">Only administrators can access the faculty management page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold">Faculty Management</h1>
            <p className="text-gray-600">Manage faculty members</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            {selectedFaculty.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="flex items-center gap-1"
              >
                <UserMinus className="h-4 w-4" />
                Delete ({selectedFaculty.length})
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <UserPlus className="h-4 w-4" />
                  Add Faculty
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Faculty</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newFaculty.name}
                      onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newFaculty.email}
                      onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                      placeholder="john.smith@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newFaculty.phone}
                      onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                      placeholder="555-123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newFaculty.department}
                      onValueChange={(value) => setNewFaculty({ ...newFaculty, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                        <SelectItem value="Civil">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subjects</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Add a subject"
                      />
                      <Button type="button" onClick={handleAddSubject} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {newFaculty.subjects.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {newFaculty.subjects.map(subject => (
                          <div key={subject} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span>{subject}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSubject(subject)}
                              className="h-6 w-6 p-0"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button className="w-full mt-4" onClick={handleAddFaculty}>
                    <Plus className="mr-2 h-4 w-4" /> Add Faculty
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="mb-6 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search faculty..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle>
              Faculty Members {loading ? "(Loading...)" : `(${filteredFaculty.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedFaculty.length === filteredFaculty.length && filteredFaculty.length > 0}
                        onCheckedChange={handleSelectAll}
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
                  ) : filteredFaculty.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No faculty members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFaculty.map((fac) => (
                      <TableRow key={fac.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedFaculty.includes(fac.id)}
                            onCheckedChange={() => handleSelectFaculty(fac.id)}
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
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Faculty;
