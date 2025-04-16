import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface AdBannerProps {
  // The size of the ad banner
  size?: 'small' | 'medium' | 'large';
  // The position of the ad (used for analytics)
  position?: 'top' | 'sidebar' | 'footer' | 'inline';
  // Optional className for custom styling
  className?: string;
}

// Map sizes to actual AdSense ad formats
const adSizeFormats = {
  small: { width: 300, height: 100 },
  medium: { width: 300, height: 250 },
  large: { width: 728, height: 90 }
};

const AdBanner = ({ size = 'medium', position = 'inline', className = '' }: AdBannerProps) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Map sizes to height classes for fallback/placeholder display
  const sizeClasses = {
    small: 'h-16',
    medium: 'h-24',
    large: 'h-32',
  };
  
  // Flag to determine if we should show real ads or mock ads
  const useRealAds = false; // Set to true when you have your ad network credentials
  
  useEffect(() => {
    if (useRealAds && typeof window !== 'undefined' && window.adsbygoogle && adContainerRef.current) {
      try {
        // Clear any previous ad content
        if (adContainerRef.current.children.length > 0) {
          adContainerRef.current.innerHTML = '';
        }

        // Create the ad slot
        const adElement = document.createElement('ins');
        const adWidth = adSizeFormats[size].width;
        const adHeight = adSizeFormats[size].height;
        
        adElement.className = 'adsbygoogle';
        adElement.style.display = 'inline-block';
        adElement.style.width = `${adWidth}px`;
        adElement.style.height = `${adHeight}px`;
        adElement.setAttribute('data-ad-client', 'YOUR-AD-CLIENT-ID'); // Replace with your ad client ID
        adElement.setAttribute('data-ad-slot', 'YOUR-AD-SLOT-ID');     // Replace with your ad slot ID
        adElement.setAttribute('data-ad-format', 'auto');
        
        // Add the ad to the container
        adContainerRef.current.appendChild(adElement);
        
        // Request an ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // Track ad impression (you can integrate with your analytics here)
        console.log(`Real Ad impression at position: ${position}`);
      } catch (error) {
        console.error('Error displaying ad:', error);
        toast({
          title: "Ad Display Error",
          description: "There was a problem loading the advertisement.",
          variant: "destructive"
        });
      }
    }
  }, [size, position, useRealAds, toast]);
  
  // Mock ads for development or when real ads aren't configured
  const mockAds = [
    {
      title: "Student Housing Fair",
      description: "Find your perfect housing at the annual student fair",
      url: "https://example.com/housing-fair",
      bgColor: "bg-blue-500"
    },
    {
      title: "Furniture Discounts",
      description: "20% off student furniture this month",
      url: "https://example.com/furniture",
      bgColor: "bg-green-500"
    },
    {
      title: "Internet Package",
      description: "Special internet rates for students",
      url: "https://example.com/internet",
      bgColor: "bg-purple-500"
    }
  ];

  // Select a random mock ad
  const randomAd = mockAds[Math.floor(Math.random() * mockAds.length)];

  // Track mock ad impression
  React.useEffect(() => {
    if (!useRealAds) {
      console.log(`Mock Ad impression: ${randomAd.title} at position: ${position}`);
    }
  }, [position, randomAd.title, useRealAds]);

  // Handle mock ad click
  const handleMockAdClick = () => {
    console.log(`Mock Ad clicked: ${randomAd.title} at position: ${position}`);
    window.open(randomAd.url, '_blank');
  };

  return useRealAds ? (
    <div
      ref={adContainerRef}
      className={`ad-container ${sizeClasses[size]} overflow-hidden rounded-md ${className}`}
      data-ad-position={position}
    >
      {/* Real ads will be injected here by AdSense */}
      <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-800">
        <p className="text-gray-400 text-sm">Advertisement</p>
      </div>
    </div>
  ) : (
    // Mock ad display
    <Card 
      onClick={handleMockAdClick}
      className={`relative w-full ${sizeClasses[size]} flex items-center px-4 cursor-pointer overflow-hidden hover:shadow-md transition-shadow ${randomAd.bgColor} ${className}`}
    >
      <div className="absolute top-1 right-2 text-xs text-white opacity-70">Ad</div>
      <div className="text-white">
        <h3 className="font-bold text-lg flex items-center">
          {randomAd.title}
          <ExternalLink className="ml-2 h-4 w-4" />
        </h3>
        <p className="opacity-90">{randomAd.description}</p>
      </div>
    </Card>
  );
};

export default AdBanner;
