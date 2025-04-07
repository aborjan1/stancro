
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CitiesCarousel from "@/components/CitiesCarousel";
import Navbar from "@/components/Navbar";

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

const Index = () => {
  const navigate = useNavigate();
  const cityImages = [
    {
      url: "/lovable-uploads/fc5d8e4b-854f-4734-96e0-59abf743630e.png",
      city: "Zagreb",
      description: "Croatia's capital with vibrant student life"
    },
    {
      url: "/placeholder.svg",
      city: "Split",
      description: "Coastal city with Mediterranean charm"
    },
    {
      url: "/placeholder.svg",
      city: "Rijeka",
      description: "Port city with affordable student housing"
    },
    {
      url: "/placeholder.svg",
      city: "Osijek",
      description: "University city on the Drava river"
    }
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cityImages.length);
        setFadeIn(true);
      }, 500); // Wait for fade out to complete
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [cityImages.length]);

  const handleSearch = (searchParams: SearchParams) => {
    const { searchTerm, filters } = searchParams;
    
    // Build URL parameters
    const params = new URLSearchParams();
    params.set('search', searchTerm);
    
    if (filters.propertyTypes.length > 0) {
      params.set('types', filters.propertyTypes.join(','));
    }
    
    params.set('minPrice', filters.priceRange[0].toString());
    params.set('maxPrice', filters.priceRange[1].toString());
    
    if (filters.bedrooms !== null) params.set('beds', filters.bedrooms.toString());
    if (filters.bathrooms !== null) params.set('baths', filters.bathrooms.toString());
    
    // Navigate to housing page with search parameters
    navigate(`/housing?${params.toString()}`);
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Subscription logic would go here
    console.log("Subscribed to newsletter");
  };
  
  const currentImage = cityImages[currentImageIndex];
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar onSearch={handleSearch} />

      {/* Hero Section with fading images */}
      <header className="relative h-[90vh] w-full overflow-hidden">
        <div 
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
            fadeIn ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${currentImage.url})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#151C2E]"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect Student Home in {currentImage.city}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl">
            {currentImage.description}
          </p>
          <Button size="lg" onClick={() => navigate("/housing")} className="bg-[#E56717] hover:bg-[#d05c13] text-white">
            Browse Available Housing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose StanCro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card>
              <CardHeader>
                <CardTitle>Verified Student Housing</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All listings are verified to ensure they meet student housing standards and requirements.</p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card>
              <CardHeader>
                <CardTitle>Budget-Friendly Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Find accommodations that fit your budget with transparent pricing and no hidden fees.</p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card>
              <CardHeader>
                <CardTitle>Close to Universities</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Discover housing options located near your university for convenient access to campus.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Popular Cities Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Student Cities</h2>
          <p className="text-center text-gray-600 mb-12">Explore housing options in Croatia's top student destinations</p>
          
          <CitiesCarousel />
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-20 bg-[#151C2E] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8 max-w-2xl mx-auto">Subscribe to our newsletter to receive updates on new listings and student housing tips.</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button type="submit" className="bg-[#E56717] hover:bg-[#d05c13]">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
      
      {/* Footer */}
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
