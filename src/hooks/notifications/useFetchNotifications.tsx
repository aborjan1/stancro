
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Notification } from "@/types/notification";

export const useFetchNotifications = () => {
  const { user } = useAuth();

  const fetchNotifications = async (): Promise<Notification[]> => {
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }

    return data as Notification[];
  };

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: fetchNotifications,
    enabled: !!user,
  });
};
