
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Home, Search, Filter, Info, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const Navbar = () => {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 10;
  
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
              <Link to="/housing">
                <Button variant={isScrolled ? "ghost" : "outline"} className={!isScrolled ? "bg-white/20 text-white hover:bg-white/30" : ""}>
                  <Building className="mr-1 h-4 w-4" />
                  Housing
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={!isScrolled ? "bg-white/20 text-white hover:bg-white/30" : ""}>
                <Search className="mr-1 h-4 w-4" />
                Search
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[320px] p-4">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    <span className="font-medium">Filters</span>
                  </div>
                  <div className="grid gap-3 mt-3">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md"
                          to="/housing"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Find Housing
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Search through verified housing options in Croatia.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
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
