
import React from "react";

export const LoginHeader: React.FC = () => {
  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-3xl font-bold">
        <span className="text-attendance-primary">Attend</span>
        <span className="text-attendance-accent">ify</span>
      </h1>
      <p className="mt-2 text-gray-600">Modern Attendance Tracking</p>
    </div>
  );
};
