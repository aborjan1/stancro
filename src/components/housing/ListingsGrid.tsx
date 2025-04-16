
import React from 'react';
import ListingCard from './ListingCard';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AdBanner from '@/components/AdBanner';

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

  // Create a copy of listings to insert ads
  const listingsWithAds = [...listings];
  
  // Insert inline ads after every 4th listing (if there are enough listings)
  if (listingsWithAds.length >= 4) {
    // Insert ad after 4th item 
    listingsWithAds.splice(4, 0, { id: 'ad-1', isAd: true } as unknown as Listing);
    
    // If we have more than 9 listings, add another ad
    if (listingsWithAds.length >= 10) {
      listingsWithAds.splice(10, 0, { id: 'ad-2', isAd: true } as unknown as Listing);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listingsWithAds.map((listing) => (
          // @ts-ignore - We're adding a custom isAd property
          listing.isAd ? (
            <div key={listing.id} className="w-full flex items-center justify-center">
              <AdBanner size="medium" position="inline" className="h-auto min-h-[220px]" />
            </div>
          ) : (
            <ListingCard key={listing.id} listing={listing} />
          )
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Button variant="outline">Load More</Button>
      </div>
    </>
  );
};

export default ListingsGrid;
