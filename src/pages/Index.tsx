import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Building, Home, Search, Shield, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import CitiesCarousel from "@/components/CitiesCarousel";
import Navbar from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();
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

  const handleSearch = (searchTerm: string) => {
    navigate(`/housing?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Thanks for subscribing!",
      description: "You'll be the first to know when StanCro launches.",
    });
  };

  const features = [
    {
      icon: <Building className="h-12 w-12 text-primary" />,
      title: "Centralized Listings",
      description: "All housing options in one place, no need to search across multiple platforms."
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: "Verified Landlords",
      description: "Security and trust with our landlord verification system."
    },
    {
      icon: <Search className="h-12 w-12 text-primary" />,
      title: "Smart Filtering",
      description: "Find exactly what you need with our advanced search capabilities."
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "For Croatian & International Students",
      description: "Designed for the needs of all students studying in Croatia."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar onSearch={handleSearch} />

      {/* Hero Section with fading images */}
      <header className="relative h-[90vh] w-full overflow-hidden">
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-center">
            Finding student housing in Croatia made simple
          </h1>
          <p className="text-xl text-white/90 mb-8 text-center max-w-2xl">
            StanCro connects students with verified landlords on a single platform, making housing search easier and safer.
          </p>
          <p className="text-md text-white/70 italic mb-8">
            {cityImages[currentImageIndex].caption}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/housing">
              <Button size="lg" className="bg-white text-[#151C2E] hover:bg-white/90">
                Find Housing
              </Button>
            </Link>
            <Button 
              size="lg" 
              className="bg-[#E56717] text-white hover:bg-[#E56717]/90 transition-colors"
            >
              List Your Property
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Cities Carousel */}
        <CitiesCarousel />
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose StanCro?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our platform solves the problems of disorganized housing listings and provides security for both students and landlords.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How StanCro Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to find your perfect student accommodation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-muted-foreground">Sign up and tell us what you're looking for in your student housing</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Browse Listings</h3>
                <p className="text-muted-foreground">Search through verified accommodation options matching your criteria</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Connect & Move In</h3>
                <p className="text-muted-foreground">Contact landlords directly and secure your new home</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students & Landlords Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join the community of satisfied users across Croatia
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle>Perfect for Exchange Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "As an Erasmus student, finding accommodation was my biggest worry. StanCro made it incredibly easy to find a great apartment near my university."
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm font-medium">- Marko, Student from Zagreb</p>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle>Reliable Tenants</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "I've been renting to students for years, but StanCro has made the process so much easier. I found respectful, reliable tenants quickly."
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm font-medium">- Ana, Landlord in Split</p>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle>Safe and Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "The verification system gave me peace of mind. I knew I wasn't being scammed, which was my biggest fear when apartment hunting."
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm font-medium">- Ivana, Student from Rijeka</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Student Housing?</h2>
              <p className="text-xl mb-8">
                Be the first to know when StanCro launches. Sign up for early access and updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  className="bg-white text-black"
                />
                <Button type="submit" className="bg-white text-primary hover:bg-white/90 px-6">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StanCro</h3>
              <p className="text-gray-400">
                Connecting students and landlords across Croatia.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Students</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">Find Housing</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Housing Guide</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Safety Tips</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Landlords</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">List Property</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Verification Process</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Landlord Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} StanCro. All rights reserved.</p>
            <p className="text-gray-400">Created by Team Stanko: Antonio Borjan, Dora Jurić, Simone Jurcan, Rafael Bistričić</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
