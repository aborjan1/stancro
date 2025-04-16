
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTrackListingView = (listingId: string | undefined) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!listingId) return;
    
    // Create a function to track the view
    const trackView = async () => {
      try {
        // Track the view in the database
        await supabase.from('listing_views').insert({
          listing_id: listingId,
          viewer_id: user?.id || null
        });
        console.log('View tracked successfully');
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    // Only track the view once when the component mounts
    trackView();
  }, [listingId, user?.id]);
};
