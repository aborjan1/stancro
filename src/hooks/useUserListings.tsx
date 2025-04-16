
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Listing } from '@/hooks/useListing';

export const useUserListings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userListings', user?.id],
    queryFn: async (): Promise<Listing[]> => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching user listings:", error);
        throw error;
      }

      return data as Listing[];
    },
    enabled: !!user
  });
};
