
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Faculty, DepartmentType } from "@/components/faculty/types";
import { FacultyAddDialog } from "@/components/faculty/FacultyAddDialog";
import { FacultyTable } from "@/components/faculty/FacultyTable";

const FacultyPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  // Fetch faculty from Supabase
  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        toast({
          title: "Error loading faculty",
          description: error.message,
          variant: "destructive",
        });
        setFaculty([]);
      } else {
        // Only map the fields we use; ignore records that lack needed keys.
        setFaculty((data ?? []).map((row: any) => ({
          id: row.id,
          name: row.name || "",
          email: row.email || "",
          phone: row.phone || "",
          department: row.department || "Computer Science",
          subjects: row.subjects || [],
          user_id: row.user_id,
        })));
      }
      setLoading(false);
    };
    fetchFaculty();
  }, [toast]);

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
    const { error } = await supabase
      .from("faculty")
      .delete()
      .in("id", selectedFaculty);

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
      description: `${selectedFaculty.length} faculty member(s) have been removed`,
    });
    setSelectedFaculty([]);
  };

  const handleAddFaculty = async (newFaculty: Omit<Faculty, "id" | "user_id">) => {
    setAddLoading(true);
    if (!user?.id) {
      toast({
        title: "No user detected",
        description: "You must be logged in to add faculty",
        variant: "destructive",
      });
      setAddLoading(false);
      return false;
    }
    const { data, error } = await supabase
      .from("faculty")
      .insert({
        name: newFaculty.name,
        email: newFaculty.email,
        phone: newFaculty.phone || null,
        department: newFaculty.department,
        subjects: newFaculty.subjects.length ? newFaculty.subjects : null,
        user_id: user.id,
      })
      .select()
      .single();

    setAddLoading(false);

    if (error) {
      toast({
        title: "Failed to add",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    setFaculty(prev => [
      ...prev,
      {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        subjects: data.subjects || [],
        user_id: data.user_id,
      } as Faculty,
    ]);
    toast({
      title: "Faculty Added",
      description: `${newFaculty.name} has been added successfully`,
    });
    return true;
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
            <FacultyAddDialog onAdd={handleAddFaculty} isLoading={addLoading} />
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
            <FacultyTable
              facultyList={filteredFaculty}
              loading={loading}
              selectedFaculty={selectedFaculty}
              onSelectFaculty={handleSelectFaculty}
              onSelectAll={handleSelectAll}
              onDeleteSelected={handleDeleteSelected}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FacultyPage;
