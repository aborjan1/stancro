
import React from 'react';
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  isScrolled: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled }) => {
  return (
    <Link to="/" className="flex items-center">
      <div className="bg-[#E56717] rounded-lg p-2 mr-2">
        <Home className="h-6 w-6 text-white" />
      </div>
      <span className={cn(
        "font-bold text-xl",
        isScrolled ? "text-gray-900 dark:text-white" : "text-white"
      )}>
        StanCro
      </span>
    </Link>
  );
};

export default Logo;
