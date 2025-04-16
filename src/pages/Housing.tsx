
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HousingHero from '@/components/housing/HousingHero';
import ListingsSection from '@/components/housing/ListingsSection';
import AdBanner from '@/components/AdBanner';
import { useListings } from '@/hooks/useListings';

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
      Number(searchParams.get('minPrice')) || 0,
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
        Number(searchParams.get('minPrice')) || 0,
        Number(searchParams.get('maxPrice')) || filters.priceRange[1]
      ],
      propertyTypes: searchParams.get('types')?.split(',') || filters.propertyTypes,
      bedrooms: searchParams.get('beds') ? 
        (searchParams.get('beds') === 'any' ? null : Number(searchParams.get('beds'))) : filters.bedrooms,
      bathrooms: searchParams.get('baths') ? 
        (searchParams.get('baths') === 'any' ? null : Number(searchParams.get('baths'))) : filters.bathrooms
    });
  }, [searchParams]);
  
  // Use the custom hook to fetch listings
  const { data: listings, isLoading, error } = useListings(searchTerm, filters);

  const handleSearch = (searchParams: SearchParams) => {
    setSearchTerm(searchParams.searchTerm);
    setFilters(searchParams.filters);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar with search capability */}
      <Navbar onSearch={handleSearch} />

      {/* Hero section */}
      <HousingHero searchTerm={searchTerm} filters={filters} />
      
      {/* Top Ad Banner */}
      <div className="container mx-auto px-4 mt-4">
        <AdBanner size="medium" position="top" />
      </div>

      {/* Housing listing section */}
      <ListingsSection 
        listings={listings} 
        isLoading={isLoading} 
        error={error} 
        searchTerm={searchTerm}
      />
      
      {/* Bottom Ad Banner */}
      <div className="container mx-auto px-4 mb-10 mt-2">
        <AdBanner size="large" position="footer" />
      </div>
    </div>
  );
};

export default Housing;
