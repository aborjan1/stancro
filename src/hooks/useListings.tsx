
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FilterOptions {
  priceRange: [number, number];
  propertyTypes: string[];
  bedrooms: number | null;
  bathrooms: number | null;
}

interface Listing {
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
}

export const useListings = (searchTerm: string, filters: FilterOptions) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['listings', searchTerm, filters],
    queryFn: async () => {
      try {
        console.log("Fetching listings with filters:", { searchTerm, filters });
        
        let query = supabase
          .from('listings')
          .select('*');
        
        // Apply filters
        if (searchTerm) {
          console.log("Applying search term filter:", searchTerm);
          query = query.ilike('location', `%${searchTerm}%`);
        }
        
        if (filters.propertyTypes.length > 0) {
          console.log("Applying property types filter:", filters.propertyTypes);
          query = query.in('property_type', filters.propertyTypes);
        }
        
        if (filters.bedrooms !== null) {
          console.log("Applying bedrooms filter:", filters.bedrooms);
          query = query.gte('beds', filters.bedrooms);
        }
        
        if (filters.bathrooms !== null) {
          console.log("Applying bathrooms filter:", filters.bathrooms);
          query = query.gte('baths', filters.bathrooms);
        }
        
        console.log("Applying price range filter:", filters.priceRange);
        query = query
          .gte('price', filters.priceRange[0])
          .lte('price', filters.priceRange[1]);
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message);
        }
        
        console.log("Listings fetched:", data);
        
        // If we have no listings, let's try a simple query to see if there's any data at all
        if (!data || data.length === 0) {
          console.log("No listings found with filters, trying a simple query");
          const { data: allData, error: allError } = await supabase.from('listings').select('*').limit(10);
          
          if (allError) {
            console.error("Supabase error on simple query:", allError);
          } else {
            console.log("All listings (up to 10):", allData);
          }
        }
        
        return data as Listing[];
      } catch (error: any) {
        console.error("Error fetching listings:", error);
        toast({
          title: "Error",
          description: "Failed to fetch listings. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    }
  });
};
