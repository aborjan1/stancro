import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  recipient_id: string;
  sender_id: string;
  message: string;
  listing_id: string | null;
  read: boolean;
  created_at: string;
  type: string;
  sender?: {
    avatar_url: string | null;
    full_name: string | null;
    username: string | null;
  } | null;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: fetchNotifications,
    enabled: !!user,
  });

  const sendNotification = useMutation({
    mutationFn: async ({ 
      recipientId, 
      message, 
      listingId 
    }: { 
      recipientId: string; 
      message: string; 
      listingId: string 
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      console.log("Sending notification with data:", {
        recipient_id: recipientId,
        sender_id: user.id,
        message,
        listing_id: listingId,
      });

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          sender_id: user.id,
          message: message,
          listing_id: listingId,
          type: 'interest'
        })
        .select();

      if (error) {
        console.error("Error sending notification:", error);
        throw error;
      }

      console.log("Notification sent successfully:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Interest Sent",
        description: "The property owner has been notified of your interest.",
      });
    },
    onError: (error) => {
      console.error("Failed to send notification:", error);
      toast({
        title: "Failed to Send",
        description: "Could not notify the property owner. Please try again.",
        variant: "destructive"
      });
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });

  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      toast({
        title: "Notification Deleted",
        description: "The notification has been removed.",
      });
    }
  });

  const clearAllNotifications = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('recipient_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      toast({
        title: "All Notifications Cleared",
        description: "All notifications have been removed.",
      });
    }
  });

  const setupRealtimeNotifications = () => {
    if (!user) return () => {};

    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `recipient_id=eq.${user.id}`
      }, payload => {
        const currentNotifications = queryClient.getQueryData<Notification[]>(['notifications', user.id]) || [];
        
        queryClient.setQueryData(['notifications', user.id], [
          payload.new as Notification,
          ...currentNotifications
        ]);

        toast({
          title: "New Notification",
          description: (payload.new as Notification).message,
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    notifications,
    isLoading,
    error,
    sendNotification,
    markAsRead,
    deleteNotification,
    clearAllNotifications,
    setupRealtimeNotifications
  };
};
