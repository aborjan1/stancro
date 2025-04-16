
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StatCardsProps {
  listingsCount: number;
  totalViews: number;
  totalInterests: number;
  isLoading: boolean;
}

const StatCards = ({ listingsCount, totalViews, totalInterests, isLoading }: StatCardsProps) => {
  const { user } = useAuth();
  
  // Fetch user's subscription status
  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  
  const isSubscribed = !!subscription && subscription.status === 'active' && new Date(subscription.expires_at) > new Date();
  
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
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Subscription Status</CardTitle>
            {isSubscribed && (
              <Badge className="bg-green-500 text-white">ACTIVE</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isSubscribed ? (
            <div>
              <p className="text-2xl font-bold capitalize">{subscription.tier}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Expires: {new Date(subscription.expires_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-2xl font-bold">Free Plan</p>
              <p className="text-sm text-muted-foreground mt-1">
                <a href="/subscribe" className="text-blue-500 hover:underline">Upgrade now</a> for featured listings
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
