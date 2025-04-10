
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import Logo from "./navbar/Logo";
import SearchPopover from "./navbar/SearchPopover";
import UserProfileMenu from "./navbar/UserProfileMenu";
import LoginRegisterButton from "./navbar/LoginRegisterButton";

interface FilterOptions {
  priceRange: [number, number];
  propertyTypes: string[];
  bedrooms: number | null;
  bathrooms: number | null;
}

interface SearchParams {
  searchTerm: string;
  filters: FilterOptions;
}

const Navbar = ({ onSearch }: { onSearch?: (searchParams: SearchParams) => void }) => {
  const scrollPosition = useScrollPosition();
  const location = useLocation();
  const isScrolled = scrollPosition > 10;
  const { user } = useAuth();
  
  // Check if we're on the auth page to apply special styling
  const isAuthPage = location.pathname === '/auth';
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled || isAuthPage
        ? "bg-white/90 dark:bg-[#151C2E]/90 backdrop-blur shadow-md py-3" 
        : "bg-transparent py-4"
    )}>
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <Logo isScrolled={isScrolled || isAuthPage} />
        </div>
        
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <Link to="/">
                <Button 
                  variant={isScrolled || isAuthPage ? "ghost" : "outline"} 
                  className={!(isScrolled || isAuthPage) ? "bg-white/20 text-white hover:bg-white/30" : ""}
                >
                  <Home className="mr-1 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <SearchPopover onSearch={onSearch} isScrolled={isScrolled || isAuthPage} />
            </NavigationMenuItem>
            <NavigationMenuItem>
              {user ? (
                <UserProfileMenu isScrolled={isScrolled || isAuthPage} />
              ) : (
                <LoginRegisterButton isScrolled={isScrolled || isAuthPage} />
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
