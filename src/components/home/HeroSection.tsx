
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityImage {
  url: string;
  city: string;
  description: string;
}

interface HeroSectionProps {
  cityImages: CityImage[];
}

const HeroSection = ({ cityImages }: HeroSectionProps) => {
  const navigate = useNavigate();
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
  
  const currentImage = cityImages[currentImageIndex];

  return (
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
  );
};

export default HeroSection;
