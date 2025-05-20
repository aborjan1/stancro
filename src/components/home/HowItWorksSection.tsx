
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

interface Step {
  icon: string;
  title: string;
  description: string;
}

const HowItWorksSection = () => {
  const navigate = useNavigate();
  
  const steps: Step[] = [
    {
      icon: "🔍",
      title: "Search",
      description: "Browse verified student housing options across Croatia's university cities."
    },
    {
      icon: "💬",
      title: "Connect",
      description: "Message landlords directly to ask questions and schedule viewings."
    },
    {
      icon: "✅",
      title: "Apply",
      description: "Submit your application online with just a few clicks."
    },
    {
      icon: "🏠",
      title: "Move In",
      description: "Sign the lease and get ready to enjoy your new student home."
    }
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <ScrollAnimation animation="fade-up">
          <h2 className="text-3xl font-bold text-center mb-4">How StanCro Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Finding your perfect student accommodation in Croatia has never been easier</p>
        </ScrollAnimation>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ScrollAnimation key={index} animation="fade-up" delay={index * 100}>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#F5F7FA] flex items-center justify-center text-4xl mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center absolute right-[-20px] top-1/2 transform -translate-y-1/2">
                    <ChevronRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            </ScrollAnimation>
          ))}
        </div>
        
        <ScrollAnimation animation="fade-up" delay={400}>
          <div className="flex justify-center mt-12">
            <Button 
              onClick={() => navigate("/about")}
              variant="outline"
              className="border-[#E56717] text-[#E56717] hover:bg-[#E56717] hover:text-white"
            >
              Learn more
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default HowItWorksSection;
