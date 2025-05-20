
import React from 'react';
import CitiesCarousel from "@/components/CitiesCarousel";

const CitiesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Popular Student Cities</h2>
        <p className="text-center text-gray-600 mb-12">Explore beautiful Croatian cities with top universities and affordable student housing</p>
        <CitiesCarousel />
      </div>
    </section>
  );
};

export default CitiesSection;
