
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Home, Search, Filter, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const Navbar = ({ onSearch }: { onSearch?: (searchTerm: string) => void }) => {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 10;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else {
      // If no onSearch prop is provided, navigate to housing page with search term
      navigate(`/housing?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/90 dark:bg-[#151C2E]/90 backdrop-blur shadow-md py-3" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
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
        </div>
        
        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <Link to="/">
                <Button variant={isScrolled ? "ghost" : "outline"} className={!isScrolled ? "bg-white/20 text-white hover:bg-white/30" : ""}>
                  <Home className="mr-1 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={isScrolled ? "ghost" : "outline"} className={!isScrolled ? "bg-white/20 text-white hover:bg-white/30" : ""}>
                    <Search className="mr-1 h-4 w-4" />
                    Search
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <form onSubmit={handleSearch} className="flex items-center p-4">
                    <Input
                      type="text"
                      placeholder="Search by city..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="sm" className="ml-2">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </PopoverContent>
              </Popover>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about">
                <Button variant={isScrolled ? "ghost" : "outline"} className={!isScrolled ? "bg-white/20 text-white hover:bg-white/30" : ""}>
                  <Info className="mr-1 h-4 w-4" />
                  About Us
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
