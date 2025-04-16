
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Eye, MessageSquare, ArrowRight } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: number;
  property_type: string;
  images: string[];
}

interface ListingStat {
  id: string;
  views: number;
  interests: number;
}

interface ListingsTableProps {
  listings: Listing[] | undefined;
  listingStats: ListingStat[] | undefined;
  isLoading: boolean;
}

const ListingsTable = ({ listings, listingStats, isLoading }: ListingsTableProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
          <CardDescription>Manage your property listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">Loading your listings...</div>
        </CardContent>
      </Card>
    );
  }
  
  if (!listings || listings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
          <CardDescription>Manage your property listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">You haven't listed any properties yet</p>
            <Button onClick={() => navigate('/list-property')}>
              List a Property
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Listings</CardTitle>
        <CardDescription>Manage your property listings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Interests</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => {
              const stats = listingStats?.find(stat => stat.id === listing.id) || { views: 0, interests: 0 };
              
              return (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {listing.images && listing.images[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mr-3">
                          <Building className="h-5 w-5" />
                        </div>
                      )}
                      <span className="truncate max-w-[150px]">{listing.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{listing.property_type}</TableCell>
                  <TableCell>€{listing.price}/month</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {stats.views}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {stats.interests}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/housing/listing/${listing.id}`)}
                    >
                      <span className="sr-only">View details</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="ml-auto" onClick={() => navigate('/list-property')}>
          Add New Listing
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingsTable;
