
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
import { Home, Search, Filter, Info, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Define the filter options interface
interface FilterOptions {
  priceRange: [number, number];
  propertyTypes: string[];
  bedrooms: number | null;
  bathrooms: number | null;
}

// Define the search params interface
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
  
  // Filter states
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
      // Convert filter options to URL parameters
      const params = new URLSearchParams();
      params.set('search', searchTerm);
      
      if (selectedPropertyTypes.length > 0) {
        params.set('types', selectedPropertyTypes.join(','));
      }
      
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
      
      if (bedrooms !== null) params.set('beds', bedrooms.toString());
      if (bathrooms !== null) params.set('baths', bathrooms.toString());
      
      // Navigate to housing page with all parameters
      navigate(`/housing?${params.toString()}`);
    }
  };
  
  const resetFilters = () => {
    setPriceRange([200, 900]);
    setSelectedPropertyTypes([]);
    setBedrooms(null);
    setBathrooms(null);
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
                    
                    {/* Advanced Search Options */}
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
