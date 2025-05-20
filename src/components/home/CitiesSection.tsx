
import React from 'react';
import CitiesCarousel from "@/components/CitiesCarousel";

const CitiesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-600 mb-12"></p>
        <CitiesCarousel />
      </div>
    </section>
  );
};

export default CitiesSection;
