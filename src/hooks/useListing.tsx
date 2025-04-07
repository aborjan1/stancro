
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  property_type: string;
  beds: number;
  baths: number;
  area: string;
  images: string[];
  video_url: string | null;
  address: string;
}

export const useListing = (id: string | undefined) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!id) throw new Error("No listing ID provided");
      
      try {
        console.log("Fetching listing with ID:", id);
        
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message);
        }
        
        if (!data) {
          throw new Error("Listing not found");
        }
        
        console.log("Listing fetched:", data);
        
        return data as Listing;
      } catch (error: any) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Failed to fetch listing details. Please try again.",
          variant: "destructive"
        });
        throw error;
      }
    },
    enabled: !!id
  });
};
