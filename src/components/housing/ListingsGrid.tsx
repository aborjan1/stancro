
import React from 'react';
import ListingCard from './ListingCard';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

interface ListingsGridProps {
  listings: Listing[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const ListingsGrid = ({ listings, isLoading, error }: ListingsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[220px] w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 py-8 text-center">
        <p className="text-lg text-red-500">Error loading listings: {error.message}</p>
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 py-8 text-center">
        <p className="text-lg text-gray-500">No housing found matching your criteria.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.href = "/housing"}
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Button variant="outline">Load More</Button>
      </div>
    </>
  );
};

export default ListingsGrid;
