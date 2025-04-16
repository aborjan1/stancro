
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface ListingStat {
  id: string;
  title: string;
  views: number;
  interests: number;
}

interface ListingStatistics {
  totalViews: number;
  totalInterests: number;
  listingStats: ListingStat[];
}

export const useListingStatistics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up real-time subscription for listing views
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('real-time-views')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'listing_views',
          filter: `viewer_id=eq.${user.id}`
        }, 
        () => {
          // Invalidate the query when new views are added
          queryClient.invalidateQueries({ queryKey: ['listingStatistics', user.id] });
        }
      )
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          // Invalidate the query when new interests are added
          queryClient.invalidateQueries({ queryKey: ['listingStatistics', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ['listingStatistics', user?.id],
    queryFn: async (): Promise<ListingStatistics> => {
      if (!user) throw new Error("User not authenticated");

      // Fetch user's listings
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('id, title')
        .eq('owner_id', user.id);

      if (listingsError) {
        console.error("Error fetching listings for statistics:", listingsError);
        throw listingsError;
      }

      // Create an array to collect statistics for each listing
      const listingStatsPromises = listings.map(async (listing) => {
        // Get real view count from listing_views table
        const { count: viewsCount, error: viewsError } = await supabase
          .from('listing_views')
          .select('*', { count: 'exact', head: true })
          .eq('listing_id', listing.id);

        if (viewsError) {
          console.error("Error counting views:", viewsError);
          throw viewsError;
        }

        // Get interest count from notifications table
        const { count: interestsCount, error: interestsError } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('listing_id', listing.id)
          .eq('type', 'interest');

        if (interestsError) {
          console.error("Error counting interests:", interestsError);
          throw interestsError;
        }

        return {
          id: listing.id,
          title: listing.title,
          views: viewsCount || 0,
          interests: interestsCount || 0
        };
      });

      // Resolve all promises
      const listingStats = await Promise.all(listingStatsPromises);

      // Calculate totals
      const totalViews = listingStats.reduce((sum, stat) => sum + stat.views, 0);
      const totalInterests = listingStats.reduce((sum, stat) => sum + stat.interests, 0);

      return {
        totalViews,
        totalInterests,
        listingStats
      };
    },
    enabled: !!user
  });
};
