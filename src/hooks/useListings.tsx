
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
  featured: boolean;
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
          .select('*')
          .order('featured', { ascending: false }) // Featured listings first
          .order('created_at', { ascending: false }); // Then by date (newest first)
        
        // Apply location filter (prioritize this filter)
        if (searchTerm) {
          console.log("Applying search term filter for location:", searchTerm);
          query = query.ilike('location', `%${searchTerm}%`);
        }
        
        // Apply property type filter
        if (filters.propertyTypes.length > 0) {
          console.log("Applying property types filter:", filters.propertyTypes);
          query = query.in('property_type', filters.propertyTypes);
        }
        
        // Apply bedrooms filter
        if (filters.bedrooms !== null) {
          console.log("Applying bedrooms filter:", filters.bedrooms);
          query = query.gte('beds', filters.bedrooms);
        }
        
        // Apply bathrooms filter
        if (filters.bathrooms !== null) {
          console.log("Applying bathrooms filter:", filters.bathrooms);
          query = query.gte('baths', filters.bathrooms);
        }
        
        // Only apply price range filter if minimum is greater than 0 or maximum is less than a high value
        if (filters.priceRange[0] > 0) {
          console.log("Applying minimum price filter:", filters.priceRange[0]);
          query = query.gte('price', filters.priceRange[0]);
        }
        
        if (filters.priceRange[1] < 1000) {
          console.log("Applying maximum price filter:", filters.priceRange[1]);
          query = query.lte('price', filters.priceRange[1]);
        }
        
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
            
            // If there are listings but not matching our filters, show a helpful toast
            if (allData && allData.length > 0) {
              toast({
                title: "No matches found",
                description: "We have listings, but none match your current filters. Try adjusting your search criteria.",
                variant: "default"
              });
            }
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
