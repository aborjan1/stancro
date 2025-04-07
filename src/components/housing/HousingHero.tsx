
import React from 'react';

interface FilterOptions {
  priceRange: [number, number];
  propertyTypes: string[];
  bedrooms: number | null;
  bathrooms: number | null;
}

interface HousingHeroProps {
  searchTerm: string;
  filters: FilterOptions;
}

const HousingHero = ({ searchTerm, filters }: HousingHeroProps) => {
  return (
    <section className="pt-28 pb-10 bg-gradient-to-b from-[#151C2E] to-[#1E293B]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Find Your Perfect Student Housing
        </h1>
        <p className="text-xl text-white/90 mb-4">
          Browse our latest listings specifically tailored for students in Croatia
        </p>
        {searchTerm && (
          <p className="text-white/80 italic">
            Showing results for: "{searchTerm}"
          </p>
        )}
        {/* Show active filters */}
        {(filters.propertyTypes.length > 0 || filters.bedrooms !== null || filters.bathrooms !== null) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.propertyTypes.map(type => (
              <span key={type} className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                {type}
              </span>
            ))}
            {filters.bedrooms !== null && (
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                {filters.bedrooms}+ beds
              </span>
            )}
            {filters.bathrooms !== null && (
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                {filters.bathrooms}+ baths
              </span>
            )}
            <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
              €{filters.priceRange[0]} - €{filters.priceRange[1]}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default HousingHero;
