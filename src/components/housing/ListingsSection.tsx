
import React from 'react';
import ListingsGrid from './ListingsGrid';

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  property_type: string;
  beds: number;
  baths: number;
  area: string;
  images: string[];
  video_url: string | null;
}

interface ListingsSectionProps {
  listings: Listing[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const ListingsSection = ({ listings, isLoading, error }: ListingsSectionProps) => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">
            {isLoading ? "Loading listings..." : 
              listings && listings.length > 0 ? `${listings.length} Results Found` : "No Listings Found"}
          </h2>
          
          {/* Debug information for development */}
          {error && (
            <div className="text-red-500 text-sm">Error: {String(error)}</div>
          )}
        </div>
        
        <ListingsGrid 
          listings={listings} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>
    </section>
  );
};

export default ListingsSection;
