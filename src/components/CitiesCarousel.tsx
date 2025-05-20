import React, { useState } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Home, MapPin, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { cn } from "@/lib/utils";

const cities = [
  {
    name: "Split",
    image: "/lovable-uploads/aa8da853-778a-45ed-aeae-1a3e871e76fc.png",
    housingCount: 156,
    tag: "Coastal"
  },
  {
    name: "Rijeka",
    image: "/lovable-uploads/f2893f4c-e52e-447f-b087-a5dd148e9217.png",
    housingCount: 89,
    tag: "Port"
  },
  {
    name: "Osijek",
    image: "/lovable-uploads/aff17a74-257c-4130-873f-8795379dd416.png",
    housingCount: 64,
    tag: "River"
  },
  {
    name: "Dubrovnik",
    image: "/lovable-uploads/6be39931-0312-4f94-b26d-6f6744dbf77a.png",
    housingCount: 42,
    tag: "Historic"
  },
  {
    name: "Zadar",
    image: "/lovable-uploads/ca6bf2f5-56fe-4ee4-a408-699db387dea9.png",
    housingCount: 51,
    tag: "Coastal"
  },
  {
    name: "Zagreb",
    image: "/lovable-uploads/fc5d8e4b-854f-4734-96e0-59abf743630e.png",
    housingCount: 178,
    tag: "Capital"
  }
];

const CitiesCarousel = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [favoriteIndices, setFavoriteIndices] = useState<number[]>([]);
  const scrollPosition = useScrollPosition();
  const [isVisible, setIsVisible] = useState(false);

  const toggleFavorite = (index: number) => {
    if (favoriteIndices.includes(index)) {
      setFavoriteIndices(favoriteIndices.filter((i) => i !== index));
    } else {
      setFavoriteIndices([...favoriteIndices, index]);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('cities-carousel');
      if (element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight - 100) {
          setIsVisible(true);
        }
      }
    };
    
    handleScroll(); // Check on initial render
    
    return () => {};
  }, [scrollPosition]);

  return (
    <section id="cities-carousel" className="py-16 md:py-24 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className={cn(
          "text-center mb-12 transition-all duration-700",
          isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
        )}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Croatian Cities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find student housing in these beautiful locations across Croatia
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className={cn(
            "w-full transition-all duration-700",
            isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
          )}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {cities.map((city, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Card className={`overflow-hidden border-none shadow-lg transition-all duration-300 ${hoveredIndex === index ? 'transform scale-105' : ''}`}>
                  <CardContent className="p-0 relative">
                    <div className="relative overflow-hidden group">
                      <img 
                        src={city.image} 
                        alt={`City of ${city.name}`} 
                        className={`w-full h-64 object-cover transition-transform duration-700 ${hoveredIndex === index ? 'scale-110' : ''}`}
                      />
                      {/* Tag */}
                      <Badge className="absolute top-3 left-3 bg-primary/80 hover:bg-primary text-white">
                        {city.tag}
                      </Badge>
                      
                      {/* Heart/Favorite Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(index);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                      >
                        <Heart 
                          className={`h-5 w-5 transition-colors ${favoriteIndices.includes(index) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                        />
                      </button>
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 text-white">
                        <div className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-1 text-primary-foreground" />
                          <h3 className="text-xl font-bold">{city.name}</h3>
                        </div>
                        <div className="flex items-center">
                          <Home className="h-4 w-4 mr-1" />
                          <p className="text-sm font-medium">
                            <span className="text-white/90">{city.housingCount}</span>
                            <span className="text-white/70"> available accommodations</span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className={`absolute bottom-0 left-0 right-0 bg-primary/90 py-3 px-4 text-center transform transition-transform duration-300 ${hoveredIndex === index ? 'translate-y-0' : 'translate-y-full'}`}>
                        <button className="text-white font-medium">View Properties</button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="relative static left-0 right-0 translate-y-0 mx-2 bg-white hover:bg-primary hover:text-white transition-colors" />
            <CarouselNext className="relative static left-0 right-0 translate-y-0 mx-2 bg-white hover:bg-primary hover:text-white transition-colors" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default CitiesCarousel;
