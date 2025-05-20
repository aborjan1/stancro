
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
      url: "/lovable-uploads/fc5d8e4b-854f-4734-96e0-59abf743630e.png",
      city: "Zagreb",
      description: "Croatia's capital with vibrant student life"
    },
    {
      url: "https://images.unsplash.com/photo-1555990538-2237e72eef2c?q=80&w=1000&auto=format&fit=crop",
      city: "Split",
      description: "Coastal city with Mediterranean charm"
    },
    {
      url: "https://images.unsplash.com/photo-1565894098565-a8dd202b0ebe?q=80&w=1000&auto=format&fit=crop",
      city: "Rijeka",
      description: "Port city with affordable student housing"
    },
    {
      url: "https://images.unsplash.com/photo-1618911752184-61790da33a39?q=80&w=1000&auto=format&fit=crop",
      city: "Osijek",
      description: "University city on the Drava river"
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
      
      <footer className="bg-gray-900 text-white py-6">
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

export default Index;
