
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Bath, BedDouble, Ruler } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/housing/listing/${listing.id}`);
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-video w-full overflow-hidden">
        <img 
          src={listing.images && listing.images.length > 0 ? listing.images[0] : "/placeholder.svg"} 
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-[#E56717] text-white px-2 py-1 rounded text-sm font-medium">
          €{listing.price}/month
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription className="text-muted-foreground">{listing.location}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-3">
          {listing.description && listing.description.length > 100 
            ? `${listing.description.substring(0, 100)}...` 
            : listing.description}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <BedDouble className="h-4 w-4 mr-1" />
            <span>{listing.beds} {listing.beds === 1 ? 'bed' : 'beds'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{listing.baths} {listing.baths === 1 ? 'bath' : 'baths'}</span>
          </div>
          <div className="flex items-center">
            <Ruler className="h-4 w-4 mr-1" />
            <span>{listing.area || 'N/A'}</span>
          </div>
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1" />
            <span>{listing.property_type}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleViewDetails}>View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
