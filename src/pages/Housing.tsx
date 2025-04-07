
import React, { useState, useEffect } from 'react';
import { Building, Bath, BedDouble, Ruler, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';

const Housing = () => {
  // City images for the slideshow
  const cityImages = [
    {
      url: "/lovable-uploads/fc5d8e4b-854f-4734-96e0-59abf743630e.png",
      caption: "Zagreb"
    },
    {
      url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
      caption: "Split"
    },
    {
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      caption: "Rijeka"
    },
    {
      url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
      caption: "Dubrovnik"
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === cityImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [cityImages.length]);

  // Mock data for recently listed housing
  const recentHousing = [
    {
      id: 1,
      title: "Modern Studio in Zagreb Center",
      description: "Bright and modern studio apartment located in the heart of Zagreb. Perfect for students.",
      price: "€400/month",
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
      location: "Osijek, University Campus",
      beds: 1,
      baths: "Shared",
      area: "12m²",
      type: "Dorm",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: "Luxury 3-bedroom with Balcony",
      description: "Spacious apartment with a large balcony, perfect for sharing with roommates.",
      price: "€900/month",
      location: "Dubrovnik, Lapad",
      beds: 3,
      baths: 2,
      area: "85m²",
      type: "Apartment",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero section with fading images */}
      <section className="relative h-[60vh] overflow-hidden">
        {/* Background images with fade transition */}
        {cityImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out bg-cover bg-center bg-no-repeat`}
            style={{
              backgroundImage: `url(${image.url})`,
              opacity: index === currentImageIndex ? 1 : 0,
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#151C2E]/80 to-[#1E293B]/80"></div>
          </div>
        ))}

        {/* Centered content */}
        <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">
            Find Your Perfect Student Housing
          </h1>
          <p className="text-xl text-white/90 mb-4 text-center max-w-2xl">
            Browse our latest listings specifically tailored for students in Croatia
          </p>
          <p className="text-md text-white/70 italic">
            {cityImages[currentImageIndex].caption}
          </p>
        </div>
      </section>

      {/* Housing listing section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Listings</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort by: Newest
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentHousing.map((housing) => (
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
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Button variant="outline">Load More</Button>
          </div>
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
