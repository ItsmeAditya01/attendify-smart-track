
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/contexts/AuthContext";

interface StudentFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    enrollmentNumber: string;
    semester: string;
    branch: string;
    class: string;
  }) => void;
  isLoading: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [classRoom, setClassRoom] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    onSubmit({
      name,
      email,
      password,
      role: "student",
      enrollmentNumber,
      semester,
      branch,
      class: classRoom,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
        <Input
          id="enrollmentNumber"
          placeholder="e.g., EN12345"
          value={enrollmentNumber}
          onChange={(e) => setEnrollmentNumber(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select value={semester} onValueChange={setSemester} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st">1st</SelectItem>
              <SelectItem value="2nd">2nd</SelectItem>
              <SelectItem value="3rd">3rd</SelectItem>
              <SelectItem value="4th">4th</SelectItem>
              <SelectItem value="5th">5th</SelectItem>
              <SelectItem value="6th">6th</SelectItem>
              <SelectItem value="7th">7th</SelectItem>
              <SelectItem value="8th">8th</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Select value={branch} onValueChange={setBranch} disabled={isLoading}>
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
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="class">Class</Label>
        <Select value={classRoom} onValueChange={setClassRoom} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CS-101">CS-101</SelectItem>
            <SelectItem value="CS-102">CS-102</SelectItem>
            <SelectItem value="IT-101">IT-101</SelectItem>
            <SelectItem value="IT-102">IT-102</SelectItem>
            <SelectItem value="EC-101">EC-101</SelectItem>
            <SelectItem value="ME-101">ME-101</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Student Account"}
      </Button>
    </form>
  );
};
