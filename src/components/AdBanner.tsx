
import React from 'react';
import { Card } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';

interface AdBannerProps {
  // The size of the ad banner
  size?: 'small' | 'medium' | 'large';
  // The position of the ad (used for analytics)
  position?: 'top' | 'sidebar' | 'footer' | 'inline';
  // Optional className for custom styling
  className?: string;
}

const AdBanner = ({ size = 'medium', position = 'inline', className = '' }: AdBannerProps) => {
  // Map sizes to height classes
  const sizeClasses = {
    small: 'h-16',
    medium: 'h-24',
    large: 'h-32',
  };

  // For a real implementation, you would fetch actual ad content from an ad network
  // or your own ad management system
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

  // Select a random ad from our mock ads
  const randomAd = mockAds[Math.floor(Math.random() * mockAds.length)];

  // Track ad impression (in a real implementation, this would call your analytics service)
  React.useEffect(() => {
    console.log(`Ad impression: ${randomAd.title} at position: ${position}`);
    // In a real implementation:
    // trackAdImpression({ adId: randomAd.id, position });
  }, [position]);

  // Handle ad click
  const handleAdClick = () => {
    console.log(`Ad clicked: ${randomAd.title} at position: ${position}`);
    // In a real implementation:
    // trackAdClick({ adId: randomAd.id, position });
    window.open(randomAd.url, '_blank');
  };

  return (
    <Card 
      onClick={handleAdClick}
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
