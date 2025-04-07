
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';

// Form schema definition
const propertySchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  propertyType: z.string(),
  price: z.string().refine((val) => !isNaN(Number(val)), { message: "Price must be a number" }),
  beds: z.string().refine((val) => !isNaN(Number(val)), { message: "Bedrooms must be a number" }),
  baths: z.string().refine((val) => !isNaN(Number(val)), { message: "Bathrooms must be a number" }),
  area: z.string().refine((val) => !isNaN(Number(val)), { message: "Area must be a number" }),
  address: z.string().min(5, { message: "Address is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  images: z.array(z.string()),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const ListProperty = () => {
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Initialize form with default values
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "apartment",
      price: "",
      beds: "",
      baths: "",
      area: "",
      address: "",
      location: "",
      images: [],
    },
  });

  // Handle form submission
  const onSubmit = async (data: PropertyFormValues) => {
    try {
      // If user is not logged in, redirect to auth page
      if (!user) {
        // Store form data in session storage before redirecting
        sessionStorage.setItem('pendingPropertyListing', JSON.stringify(data));
        toast.info("Please log in to complete your listing", {
          description: "You'll be redirected back after logging in.",
        });
        navigate("/auth", { state: { returnPath: "/list-property" } });
        return;
      }
      
      setIsSubmitting(true);
      
      // Create the listing in the database
      const { error } = await supabase
        .from('listings')
        .insert({
          title: data.title,
          description: data.description,
          property_type: data.propertyType,
          price: Number(data.price),
          beds: Number(data.beds),
          baths: Number(data.baths),
          area: data.area,
          address: data.address,
          location: data.location,
          images: data.images,
          owner_id: user.id
        });
      
      if (error) throw error;
      
      toast.success("Your property listing has been submitted!", {
        description: "We'll review your listing and get back to you soon.",
      });
      
      // Redirect to homepage after successful submission
      navigate("/");
    } catch (error: any) {
      toast.error("Failed to submit your property listing", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for pending property listing on component mount
  useEffect(() => {
    const pendingListing = sessionStorage.getItem('pendingPropertyListing');
    
    if (pendingListing && user) {
      try {
        const parsedListing = JSON.parse(pendingListing);
        form.reset(parsedListing);
        
        // Move to last tab to complete submission
        setActiveTab("photos");
        
        // Clear the pending listing
        sessionStorage.removeItem('pendingPropertyListing');
        
        toast.info("Continue where you left off", {
          description: "Your property details have been restored.",
        });
      } catch (error) {
        console.error("Error parsing pending listing", error);
      }
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Placeholder for image upload functionality
    // This would typically upload to storage and return URLs
    toast.info("Image upload functionality would go here");
    
    // For now, just add placeholder image URLs
    if (e.target.files?.length) {
      const newImages = [...images];
      for (let i = 0; i < e.target.files.length; i++) {
        newImages.push(`https://source.unsplash.com/random/800x600?apartment&sig=${Math.random()}`);
      }
      setImages(newImages);
      form.setValue("images", newImages);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto py-24 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">List Your Property</h1>
        
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="details">Property Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="photos">Photos & Submit</TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <TabsContent value="details" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Modern 2-Bedroom Apartment with Balcony" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your property in detail" 
                              {...field} 
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="house">House</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="townhouse">Townhouse</SelectItem>
                              <SelectItem value="studio">Studio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Rent ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 1500" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area (sq ft)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 850" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="beds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 2" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="baths"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 1" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab("location")}
                      >
                        Next: Location
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="location" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Address</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 123 Main St, Apt 4B" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City/Neighborhood</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Brooklyn" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("details")}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab("photos")}
                      >
                        Next: Photos
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="photos" className="space-y-4">
                    <div>
                      <Label htmlFor="images">Upload Property Images</Label>
                      <div className="mt-2">
                        <Input 
                          id="images" 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={handleImageUpload}
                          className="mb-4"
                        />
                      </div>
                      
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative aspect-[4/3] bg-slate-100 rounded-md overflow-hidden">
                              <img 
                                src={image} 
                                alt={`Property preview ${index + 1}`} 
                                className="object-cover w-full h-full"
                              />
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm" 
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  const newImages = images.filter((_, i) => i !== index);
                                  setImages(newImages);
                                  form.setValue("images", newImages);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      {!user && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
                          <p className="text-yellow-800 font-medium">You'll need to log in to complete your listing</p>
                          <p className="text-yellow-700 text-sm mt-1">
                            Don't worry, your property details will be saved.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("location")}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : user ? "Submit Listing" : "Login & Submit"}
                      </Button>
                    </div>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListProperty;
