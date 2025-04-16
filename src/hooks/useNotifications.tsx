import { useFetchNotifications } from './notifications/useFetchNotifications';
import { useSendNotification } from './notifications/useSendNotification';
import { useManageNotifications } from './notifications/useManageNotifications';
import { useRealtimeNotifications } from './notifications/useRealtimeNotifications';
import { Notification } from '@/types/notification';

export type { Notification };

export const useNotifications = () => {
  // Fetch notifications
  const { 
    data: notifications = [], 
    isLoading, 
    error 
  } = useFetchNotifications();

  // Send notification
  const { mutate: sendNotificationMutate, isPending: isSending } = useSendNotification();
  const sendNotification = {
    mutate: sendNotificationMutate,
    isPending: isSending
  };

  // Manage notifications
  const { 
    markAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useManageNotifications();

  // Set up realtime notifications listener
  useRealtimeNotifications();

  // Return a function that can be used to setup realtime notifications
  // This maintains backward compatibility with the previous API
  const setupRealtimeNotifications = () => {
    // This is now handled by the useRealtimeNotifications hook
    // but we keep the function for compatibility
    return () => {};
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
