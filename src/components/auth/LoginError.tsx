
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginErrorProps {
  errorMessage: string | null;
}

export const LoginError: React.FC<LoginErrorProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;
  
  return (
    <Alert variant="destructive" className="animate-shake">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
};
