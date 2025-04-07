
import React from 'react';
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Settings, User, 
  HelpCircle, ShieldCheck, Lightbulb, FileText, 
  Info, Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfileMenuProps {
  isScrolled: boolean;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ isScrolled }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={isScrolled ? "ghost" : "outline"} className={!isScrolled ? "bg-white/20 text-white hover:bg-white/30" : ""}>
          <User className="mr-1 h-4 w-4" />
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate("/subscribe")}>
          <Newspaper className="mr-2 h-4 w-4 text-muted-foreground" />
          Subscribe now
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/profile")}>
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          My profile
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
          Settings
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => navigate("/how-it-works")}>
          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
          How does it work?
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/about")}>
          <Info className="mr-2 h-4 w-4 text-muted-foreground" />
          About StanCro
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/safety")}>
          <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
          Safety
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/tips")}>
          <Lightbulb className="mr-2 h-4 w-4 text-muted-foreground" />
          Useful tips
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => navigate("/support")}>
          <HelpCircle className="mr-2 h-4 w-4 text-muted-foreground" />
          Support
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
