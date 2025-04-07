
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Building, BedDouble, Bath, Ruler } from 'lucide-react';
import { useListing } from '@/hooks/useListing';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: listing, isLoading, error } = useListing(id);

  // Function to handle contact owner button click
  const handleContactOwner = () => {
    toast({
      title: "Contact Request Sent",
      description: "The property owner has been notified of your interest.",
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col gap-6">
            <div className="w-full h-[400px]">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-6 w-1/3 mb-6" />
                <Skeleton className="h-24 w-full mb-6" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="md:w-80">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-2xl font-bold text-red-500">Error Loading Listing</h1>
            <p className="mb-6 text-muted-foreground">
              {error?.message || "This listing could not be found or may have been removed."}
            </p>
            <Button asChild>
              <Link to="/housing">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Listings
              </Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/housing">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Link>
          </Button>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col gap-8">
          {/* Primary image */}
          <div className="w-full h-[400px] overflow-hidden rounded-lg relative">
            <img 
              src={listing.images && listing.images.length > 0 ? listing.images[0] : "/placeholder.svg"} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[#E56717] text-white px-3 py-2 rounded-md text-lg font-semibold">
              €{listing.price}/month
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Listing details */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{listing.location}</span>
                <span className="mx-2">•</span>
                <span>{listing.address}</span>
              </div>
              
              {/* Property characteristics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center text-center">
                  <Building className="h-6 w-6 mb-2 text-[#E56717]" />
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium">{listing.property_type}</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <BedDouble className="h-6 w-6 mb-2 text-[#E56717]" />
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                  <div className="font-medium">{listing.beds}</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Bath className="h-6 w-6 mb-2 text-[#E56717]" />
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                  <div className="font-medium">{listing.baths}</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Ruler className="h-6 w-6 mb-2 text-[#E56717]" />
                  <div className="text-sm text-muted-foreground">Area</div>
                  <div className="font-medium">{listing.area}</div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {listing.description || "No description provided for this property."}
                </p>
              </div>
              
              {/* Additional images if available */}
              {listing.images && listing.images.length > 1 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.images.slice(1).map((image, index) => (
                      <div key={index} className="aspect-video overflow-hidden rounded-md">
                        <img 
                          src={image} 
                          alt={`${listing.title} - Image ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Video if available */}
              {listing.video_url && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Video Tour</h2>
                  <div className="aspect-video w-full">
                    <iframe
                      src={listing.video_url}
                      title="Property video tour"
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column - Contact box */}
            <div className="md:w-80">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Interested in this property?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Contact the property owner directly to arrange a viewing.
                </p>
                <Button className="w-full mb-4" onClick={handleContactOwner}>
                  Contact Owner
                </Button>
                <Button variant="outline" className="w-full">
                  Save to Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingDetail;
