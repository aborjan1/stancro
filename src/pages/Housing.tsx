
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building, Bath, BedDouble, Ruler } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navbar from '@/components/Navbar';
import { supabase } from "@/integrations/supabase/client";

// Interface for search filters
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

// Interface for listings from database
interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  property_type: string;
  beds: number;
  baths: number;
  area: string;
  images: string[];
  video_url: string | null;
}

const Housing = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  
  // Initialize filter states from URL parameters
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [
      Number(searchParams.get('minPrice')) || 200,
      Number(searchParams.get('maxPrice')) || 900
    ],
    propertyTypes: searchParams.get('types')?.split(',') || [],
    bedrooms: searchParams.get('beds') ? 
      (searchParams.get('beds') === 'any' ? null : Number(searchParams.get('beds'))) : null,
    bathrooms: searchParams.get('baths') ? 
      (searchParams.get('baths') === 'any' ? null : Number(searchParams.get('baths'))) : null
  });
  
  // Update search term and filters if URL parameters change
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setFilters({
      priceRange: [
        Number(searchParams.get('minPrice')) || filters.priceRange[0],
        Number(searchParams.get('maxPrice')) || filters.priceRange[1]
      ],
      propertyTypes: searchParams.get('types')?.split(',') || filters.propertyTypes,
      bedrooms: searchParams.get('beds') ? 
        (searchParams.get('beds') === 'any' ? null : Number(searchParams.get('beds'))) : filters.bedrooms,
      bathrooms: searchParams.get('baths') ? 
        (searchParams.get('baths') === 'any' ? null : Number(searchParams.get('baths'))) : filters.bathrooms
    });
  }, [searchParams]);
  
  // Fetch listings from Supabase
  const { data: listings, isLoading, error } = useQuery({
    queryKey: ['listings', searchTerm, filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from('listings')
          .select('*');
        
        // Apply filters
        if (searchTerm) {
          query = query.ilike('location', `%${searchTerm}%`);
        }
        
        if (filters.propertyTypes.length > 0) {
          query = query.in('property_type', filters.propertyTypes);
        }
        
        if (filters.bedrooms !== null) {
          query = query.gte('beds', filters.bedrooms);
        }
        
        if (filters.bathrooms !== null) {
          query = query.gte('baths', filters.bathrooms);
        }
        
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
        
        const { data, error } = await query;
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data as Listing[];
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast({
          title: "Error",
          description: "Failed to fetch listings. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  const handleSearch = (searchParams: SearchParams) => {
    setSearchTerm(searchParams.searchTerm);
    setFilters(searchParams.filters);
  };

  // Use real data if available, otherwise show placeholder message
  const filteredListings = listings || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar with search capability */}
      <Navbar onSearch={handleSearch} />

      {/* Hero section */}
      <section className="pt-28 pb-10 bg-gradient-to-b from-[#151C2E] to-[#1E293B]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Your Perfect Student Housing
          </h1>
          <p className="text-xl text-white/90 mb-4">
            Browse our latest listings specifically tailored for students in Croatia
          </p>
          {searchTerm && (
            <p className="text-white/80 italic">
              Showing results for: "{searchTerm}"
            </p>
          )}
          {/* Show active filters */}
          {(filters.propertyTypes.length > 0 || filters.bedrooms !== null || filters.bathrooms !== null) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.propertyTypes.map(type => (
                <span key={type} className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                  {type}
                </span>
              ))}
              {filters.bedrooms !== null && (
                <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                  {filters.bedrooms}+ beds
                </span>
              )}
              {filters.bathrooms !== null && (
                <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                  {filters.bathrooms}+ baths
                </span>
              )}
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                €{filters.priceRange[0]} - €{filters.priceRange[1]}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Housing listing section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {isLoading ? "Loading listings..." : 
                filteredListings.length > 0 ? `${filteredListings.length} Results Found` : "No Listings Found"}
            </h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img 
                        src={listing.images[0] || "/placeholder.svg"} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-[#E56717] text-white px-2 py-1 rounded text-sm font-medium">
                        €{listing.price}/month
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{listing.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">{listing.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground mb-3">{listing.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <BedDouble className="h-4 w-4 mr-1" />
                          <span>{listing.beds} {listing.beds === 1 ? 'bed' : 'beds'}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          <span>{listing.baths} {listing.baths === 1 ? 'bath' : 'baths'}</span>
                        </div>
                        <div className="flex items-center">
                          <Ruler className="h-4 w-4 mr-1" />
                          <span>{listing.area}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{listing.property_type}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-8 text-center">
                  <p className="text-lg text-gray-500">No housing found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.href = "/housing"}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {filteredListings.length > 0 && (
            <div className="flex justify-center mt-10">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer section removed as it's included in App.tsx */}
    </div>
  );
};

export default Housing;
