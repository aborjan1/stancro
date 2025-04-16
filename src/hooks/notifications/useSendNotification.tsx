
import { useMutation } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SendNotificationParams {
  recipientId: string;
  message: string;
  listingId: string;
}

export const useSendNotification = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ recipientId, message, listingId }: SendNotificationParams) => {
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
};
