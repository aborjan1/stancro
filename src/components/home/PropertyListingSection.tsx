
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, CheckCircle } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

const PropertyListingSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-[#F5F7FA]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 space-y-6">
            <ScrollAnimation animation="slide-left">
              <h2 className="text-3xl font-bold">List Your Property on StanCro</h2>
              <p className="text-lg text-gray-600">
                Are you a property owner with housing suitable for students? Join our platform and connect with thousands of students looking for their next home.
              </p>
            </ScrollAnimation>
            
            <div className="space-y-4">
              <ScrollAnimation animation="fade-up" delay={100}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#E56717] mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Reach More Students</h3>
                    <p className="text-gray-600">Connect with the largest pool of student renters in Croatia.</p>
                  </div>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation animation="fade-up" delay={200}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#E56717] mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Easy Management</h3>
                    <p className="text-gray-600">Manage bookings, communicate with tenants, and track payments all in one place.</p>
                  </div>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation animation="fade-up" delay={300}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[#E56717] mt-1" />
                  <div>
                    <h3 className="font-medium text-lg">Verified Tenants</h3>
                    <p className="text-gray-600">All student profiles are verified, providing peace of mind for landlords.</p>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
            
            <ScrollAnimation animation="fade-up" delay={400}>
              <Button 
                className="bg-[#E56717] hover:bg-[#d05c13] text-white"
                onClick={() => navigate("/list-property")}
              >
                List Your Property
                <Home className="ml-2 h-5 w-5" />
              </Button>
            </ScrollAnimation>
          </div>
          
          <ScrollAnimation className="md:w-1/2" animation="slide-right">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop" 
                alt="List your property" 
                className="w-full h-auto"
              />
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
};

export default PropertyListingSection;
