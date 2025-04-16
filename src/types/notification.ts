
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
