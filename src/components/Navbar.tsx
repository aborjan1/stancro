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
import { Home, Search, Filter, Info, SlidersHorizontal, LogIn, UserCircle, LogOut, Settings, Building, User, Users, Coins, HelpCircle, ShieldCheck, Lightbulb, MessageCircle, FileText, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
  const isScrolled = scrollPosition > 10;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const { user, signOut } = useAuth();
  
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 900]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  
  const propertyTypes = [
    { id: "apartment", label: "Apartment" },
    { id: "studio", label: "Studio" },
    { id: "room", label: "Room" },
    { id: "dorm", label: "Dorm" }
  ];

  const handlePropertyTypeChange = (type: string, isChecked: boolean) => {
    setSelectedPropertyTypes(prevTypes => 
      isChecked 
        ? [...prevTypes, type] 
        : prevTypes.filter(t => t !== type)
    );
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const searchParams: SearchParams = {
      searchTerm,
      filters: {
        priceRange,
        propertyTypes: selectedPropertyTypes,
        bedrooms,
        bathrooms
      }
    };
    
    if (onSearch) {
      onSearch(searchParams);
    } else {
      const params = new URLSearchParams();
      params.set('search', searchTerm);
      
      if (selectedPropertyTypes.length > 0) {
        params.set('types', selectedPropertyTypes.join(','));
      }
      
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
      
      if (bedrooms !== null) params.set('beds', bedrooms.toString());
      if (bathrooms !== null) params.set('baths', bathrooms.toString());
      
      navigate(`/housing?${params.toString()}`);
    }
  };
  
  const resetFilters = () => {
    setPriceRange([200, 900]);
    setSelectedPropertyTypes([]);
    setBedrooms(null);
    setBathrooms(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/90 dark:bg-[#151C2E]/90 backdrop-blur shadow-md py-3" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto flex items-center justify-between px-4">
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
                  <form onSubmit={handleSearch} className="flex flex-col">
                    <div className="flex items-center p-4 border-b">
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
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="ghost" 
                        className="ml-1"
                        onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Collapsible open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
                      <CollapsibleContent className="p-4 space-y-4 border-b">
                        <div>
                          <h4 className="mb-2 text-sm font-medium">Price Range: €{priceRange[0]} - €{priceRange[1]}</h4>
                          <Slider 
                            defaultValue={[priceRange[0], priceRange[1]]} 
                            min={100} 
                            max={1500} 
                            step={50}
                            onValueChange={(value) => setPriceRange([value[0], value[1]])}
                            className="my-4" 
                          />
                        </div>
                        
                        <div>
                          <h4 className="mb-2 text-sm font-medium">Property Type</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {propertyTypes.map((type) => (
                              <div key={type.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={type.id}
                                  checked={selectedPropertyTypes.includes(type.id)}
                                  onCheckedChange={(checked) => 
                                    handlePropertyTypeChange(type.id, checked === true)
                                  }
                                />
                                <label 
                                  htmlFor={type.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {type.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Bedrooms</label>
                            <Select onValueChange={(value) => setBedrooms(Number(value))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Bathrooms</label>
                            <Select onValueChange={(value) => setBathrooms(Number(value))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex justify-between pt-2">
                          <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
                            Reset
                          </Button>
                          <Button type="submit" size="sm">
                            Apply Filters
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </form>
                </PopoverContent>
              </Popover>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={isScrolled ? "ghost" : "outline"} className={!isScrolled ? "bg-white/20 text-white hover:bg-white/30" : ""}>
                      <UserCircle className="mr-1 h-4 w-4" />
                      Profile
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem>
                      <Newspaper className="mr-2 h-4 w-4 text-muted-foreground" />
                      Subscribe now
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      My profile
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      My adverts
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                      Searching for a room
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      Searching for a tenant
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <Coins className="mr-2 h-4 w-4 text-muted-foreground" />
                      Cashback & discounts
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                      My account
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                      Settings
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      How does it work?
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                      About StanCro
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                      Safety
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <Lightbulb className="mr-2 h-4 w-4 text-muted-foreground" />
                      Useful tips
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
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
              ) : (
                <Link to="/auth">
                  <Button variant={isScrolled ? "ghost" : "outline"} className={!isScrolled ? "bg-white/20 text-white hover:bg-white/30" : ""}>
                    <LogIn className="mr-1 h-4 w-4" />
                    Login / Register
                  </Button>
                </Link>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Navbar;
