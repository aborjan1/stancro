
import React from 'react';
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginRegisterButtonProps {
  isScrolled: boolean;
}

const LoginRegisterButton: React.FC<LoginRegisterButtonProps> = ({ isScrolled }) => {
  return (
    <Link to="/auth">
      <Button variant={isScrolled ? "ghost" : "outline"} className={!isScrolled ? "bg-white/20 text-white hover:bg-white/30" : ""}>
        <LogIn className="mr-1 h-4 w-4" />
        Login / Register
      </Button>
    </Link>
  );
};

export default LoginRegisterButton;
