
import React from 'react';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PropertyListingSection from "@/components/home/PropertyListingSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CitiesSection from "@/components/home/CitiesSection";
import NewsletterSection from "@/components/home/NewsletterSection";

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

const Index = () => {
  const cityImages = [
    {
      url: "/lovable-uploads/aa8da853-778a-45ed-aeae-1a3e871e76fc.png",
      city: "Split",
      description: "Coastal city with Mediterranean charm"
    },
    {
      url: "/lovable-uploads/f2893f4c-e52e-447f-b087-a5dd148e9217.png",
      city: "Rijeka",
      description: "Port city with affordable student housing"
    },
    {
      url: "/lovable-uploads/aff17a74-257c-4130-873f-8795379dd416.png",
      city: "Osijek",
      description: "University city on the Drava river"
    },
    {
      url: "/lovable-uploads/6be39931-0312-4f94-b26d-6f6744dbf77a.png",
      city: "Dubrovnik",
      description: "Historic coastal gem with vibrant student life"
    },
    {
      url: "/lovable-uploads/ca6bf2f5-56fe-4ee4-a408-699db387dea9.png",
      city: "Zadar",
      description: "Coastal university city with rich history"
    }
  ];

  const handleSearch = (searchParams: SearchParams) => {
    const { searchTerm, filters } = searchParams;
    
    const params = new URLSearchParams();
    params.set('search', searchTerm);
    
    if (filters.propertyTypes.length > 0) {
      params.set('types', filters.propertyTypes.join(','));
    }
    
    params.set('minPrice', filters.priceRange[0].toString());
    params.set('maxPrice', filters.priceRange[1].toString());
    
    if (filters.bedrooms !== null) params.set('beds', filters.bedrooms.toString());
    if (filters.bathrooms !== null) params.set('baths', filters.bathrooms.toString());
    
    window.location.href = `/housing?${params.toString()}`;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onSearch={handleSearch} />
      <HeroSection cityImages={cityImages} />
      <FeaturesSection />
      <PropertyListingSection />
      <HowItWorksSection />
      <CitiesSection />
      <NewsletterSection />
    </div>
  );
};

export default Index;
