
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification";

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!user) return;

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
  }, [user, queryClient, toast]);
};
