
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

// This hook fetches simulated statistics since we don't have real view/interest tracking yet
export const useListingStatistics = () => {
  const { user } = useAuth();

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

      // Fetch notifications (interests) for the user's listings
      const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('listing_id, type')
        .in('listing_id', listings.map(listing => listing.id))
        .eq('type', 'interest');

      if (notificationsError) {
        console.error("Error fetching notifications:", notificationsError);
        throw notificationsError;
      }

      // Create statistics for each listing
      const listingStats: ListingStat[] = listings.map(listing => {
        const interestsCount = notifications.filter(n => n.listing_id === listing.id).length;
        
        // Generate a random view count (between interests count and 20+interests)
        // In a real app, you would track actual views
        const viewsCount = interestsCount + Math.floor(Math.random() * 20) + 5;
        
        return {
          id: listing.id,
          title: listing.title,
          views: viewsCount,
          interests: interestsCount
        };
      });

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
