
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

const NewsletterSection = () => {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Subscribed to newsletter");
  };
  
  return (
    <section className="py-20 bg-[#151C2E] text-white">
      <div className="container mx-auto px-4 text-center">
        <ScrollAnimation animation="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8 max-w-2xl mx-auto">Subscribe to our newsletter to receive updates on new listings and student housing tips.</p>
        </ScrollAnimation>
        
        <ScrollAnimation animation="zoom-in" delay={200}>
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
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default NewsletterSection;
