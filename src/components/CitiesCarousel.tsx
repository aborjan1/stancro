
import React from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const cities = [
  {
    name: "Zagreb",
    image: "https://images.unsplash.com/photo-1541232484988-44a4147ad6c0?q=80&w=1000&auto=format&fit=crop",
    description: "Croatia's vibrant capital city with rich history and culture"
  },
  {
    name: "Split",
    image: "https://images.unsplash.com/photo-1555990793-da11153b2473?q=80&w=1000&auto=format&fit=crop",
    description: "Coastal city famous for Diocletian's Palace and beautiful beaches"
  },
  {
    name: "Dubrovnik",
    image: "https://images.unsplash.com/photo-1522175279007-54cd987c196c?q=80&w=1000&auto=format&fit=crop",
    description: "The 'Pearl of the Adriatic' with stunning medieval architecture"
  },
  {
    name: "Rijeka",
    image: "https://images.unsplash.com/photo-1565894098565-a8dd202b0ebe?q=80&w=1000&auto=format&fit=crop",
    description: "Major port city and cultural hub in the northern Adriatic"
  },
  {
    name: "Osijek",
    image: "https://images.unsplash.com/photo-1618911752184-61790da33a39?q=80&w=1000&auto=format&fit=crop",
    description: "Largest city in eastern Croatia on the banks of the Drava River"
  },
  {
    name: "Zadar",
    image: "https://images.unsplash.com/photo-1555990538-2237e72eef2c?q=80&w=1000&auto=format&fit=crop",
    description: "Coastal city known for its Roman ruins and unique Sea Organ"
  }
];

const CitiesCarousel = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
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
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {cities.map((city, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={city.image} 
                        alt={`City of ${city.name}`} 
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                        <h3 className="text-xl font-bold">{city.name}</h3>
                        <p className="text-sm opacity-90">{city.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative static left-0 right-0 translate-y-0 mx-2" />
            <CarouselNext className="relative static left-0 right-0 translate-y-0 mx-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default CitiesCarousel;
