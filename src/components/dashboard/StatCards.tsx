
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardsProps {
  listingsCount: number;
  totalViews: number;
  totalInterests: number;
  isLoading: boolean;
}

const StatCards = ({ listingsCount, totalViews, totalInterests, isLoading }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Active Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{isLoading ? '...' : listingsCount}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Views</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{isLoading ? '...' : totalViews}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Interested Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{isLoading ? '...' : totalInterests}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
