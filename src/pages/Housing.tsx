
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building, Bath, BedDouble, Ruler } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';

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

const Housing = () => {
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
  
  // Mock data for recently listed housing
  const recentHousing = [
    {
      id: 1,
      title: "Modern Studio in Zagreb Center",
      description: "Bright and modern studio apartment located in the heart of Zagreb. Perfect for students.",
      price: "€400/month",
      priceValue: 400,
      location: "Zagreb, City Center",
      beds: 1,
      baths: 1,
      area: "35m²",
      type: "Studio",
      image: "/lovable-uploads/fc5d8e4b-854f-4734-96e0-59abf743630e.png"
    },
    {
      id: 2,
      title: "Spacious 2-bedroom in Split",
      description: "Beautiful apartment with a sea view, fully furnished and close to the university.",
      price: "€650/month",
      priceValue: 650,
      location: "Split, Riva",
      beds: 2,
      baths: 1,
      area: "65m²",
      type: "Apartment",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Cozy Room in Student House",
      description: "Private room in a shared student house with common areas and all utilities included.",
      price: "€300/month",
      priceValue: 300,
      location: "Zagreb, Jarun",
      beds: 1,
      baths: 1,
      area: "18m²",
      type: "Room",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Newly Renovated Apartment",
      description: "Fully renovated 1-bedroom apartment close to public transport and amenities.",
      price: "€500/month",
      priceValue: 500,
      location: "Rijeka, Center",
      beds: 1,
      baths: 1,
      area: "45m²",
      type: "Apartment",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Student Dorm Single Room",
      description: "Single room in student dormitory with included utilities and access to cafeteria.",
      price: "€200/month",
      priceValue: 200,
      location: "Osijek, University Campus",
      beds: 1,
      baths: 0,
      area: "12m²",
      type: "Dorm",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: "Luxury 3-bedroom with Balcony",
      description: "Spacious apartment with a large balcony, perfect for sharing with roommates.",
      price: "€900/month",
      priceValue: 900,
      location: "Dubrovnik, Lapad",
      beds: 3,
      baths: 2,
      area: "85m²",
      type: "Apartment",
      image: "/placeholder.svg"
    }
  ];

  // Filter housing listings based on all filters
  const filteredHousing = recentHousing.filter(housing => {
    // Filter by search term (city)
    const matchesSearchTerm = searchTerm 
      ? housing.location.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    // Filter by price range
    const priceInRange = housing.priceValue >= filters.priceRange[0] && 
                          housing.priceValue <= filters.priceRange[1];
    
    // Filter by property type
    const matchesType = filters.propertyTypes.length === 0 || 
                        filters.propertyTypes.some(type => 
                          housing.type.toLowerCase() === type.toLowerCase());
    
    // Filter by number of bedrooms
    const matchesBeds = filters.bedrooms === null || 
                        housing.beds >= filters.bedrooms;
    
    // Filter by number of bathrooms
    const matchesBaths = filters.bathrooms === null || 
                         housing.baths >= filters.bathrooms;
    
    // Return true only if all filters match
    return matchesSearchTerm && priceInRange && matchesType && matchesBeds && matchesBaths;
  });

  const handleSearch = (searchParams: SearchParams) => {
    setSearchTerm(searchParams.searchTerm);
    setFilters(searchParams.filters);
  };

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
              {searchTerm || filters.propertyTypes.length > 0 || filters.bedrooms !== null || filters.bathrooms !== null
                ? `${filteredHousing.length} Results Found`
                : `Recent Listings`}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHousing.length > 0 ? (
              filteredHousing.map((housing) => (
                <Card key={housing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img 
                      src={housing.image} 
                      alt={housing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-[#E56717] text-white px-2 py-1 rounded text-sm font-medium">
                      {housing.price}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{housing.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{housing.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-3">{housing.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <BedDouble className="h-4 w-4 mr-1" />
                        <span>{housing.beds} {housing.beds === 1 ? 'bed' : 'beds'}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{typeof housing.baths === 'number' 
                          ? `${housing.baths} ${housing.baths === 1 ? 'bath' : 'baths'}`
                          : housing.baths}</span>
                      </div>
                      <div className="flex items-center">
                        <Ruler className="h-4 w-4 mr-1" />
                        <span>{housing.area}</span>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        <span>{housing.type}</span>
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
          
          {filteredHousing.length > 0 && (
            <div className="flex justify-center mt-10">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} StanCro. All rights reserved.</p>
            <p className="text-gray-400">Created by Team Stanko</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Housing;
