
import React from "react";
import { Progress } from "@/components/ui/progress";

interface LoginLoadingIndicatorProps {
  message: string;
}

export const LoginLoadingIndicator: React.FC<LoginLoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="w-full">
      <Progress value={75} className="h-1 mb-2" />
      <p className="text-center text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
