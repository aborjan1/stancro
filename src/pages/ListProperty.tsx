
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";

// Form schema validation
const propertyFormSchema = z.object({
  propertyType: z.enum(["private_room", "shared_room", "whole_apartment", "house"], {
    required_error: "Please select a property type.",
  }),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(5, "Valid postal code is required"),
  price: z.string().min(1, "Price is required"),
  bedrooms: z.string().min(1, "Number of bedrooms is required"),
  bathrooms: z.string().min(1, "Number of bathrooms is required"),
  description: z.string().min(10, "Please provide a detailed description"),
  amenities: z.string(),
  rules: z.string(),
  contactName: z.string().min(1, "Your name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().min(9, "Please enter a valid phone number"),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const ListProperty = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      propertyType: undefined,
      address: "",
      city: "",
      postalCode: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      description: "",
      amenities: "",
      rules: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    }
  });

  const onSubmit = (data: PropertyFormValues) => {
    console.log("Form submitted:", data);
    toast.success("Your property listing has been submitted!", {
      description: "We'll review your listing and get back to you soon.",
    });
    navigate("/");
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 py-10 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">List Your Property</h1>
          <p className="text-center text-gray-600 mb-8">Connect with thousands of students looking for accommodation</p>
          
          {/* Progress indicator */}
          <div className="flex justify-between max-w-md mx-auto mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step > index + 1 ? "bg-green-500 text-white" : 
                  step === index + 1 ? "bg-[#E56717] text-white" : 
                  "bg-gray-200 text-gray-600"
                }`}>
                  {step > index + 1 ? "✓" : index + 1}
                </div>
                <span className="text-xs mt-1 text-gray-600">
                  {index === 0 ? "Property Details" : 
                   index === 1 ? "Description" : "Contact Info"}
                </span>
              </div>
            ))}
          </div>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                {step === 1 ? "Property Details" : 
                 step === 2 ? "Description & Amenities" : "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Property Type and Basic Info */}
                  {step === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>What type of property are you renting out?</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="private_room" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Private room (with shared utilities)
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="shared_room" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Shared room (multiple students)
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="whole_apartment" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Whole apartment
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="house" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    House
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Postal code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Price (€)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bedrooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bedrooms</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bathrooms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bathrooms</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  {/* Step 2: Description & Amenities */}
                  {step === 2 && (
                    <>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your property in detail. Include information about the surrounding area, proximity to universities, public transport, etc."
                                className="min-h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="amenities"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Available Amenities</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List amenities (e.g., Wi-Fi, washing machine, dishwasher, heating, air conditioning, etc.)"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rules"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>House Rules</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any specific rules for your property (e.g., no smoking, no pets, quiet hours, etc.)"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Step 3: Contact Information */}
                  {step === 3 && (
                    <>
                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+385..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={prevStep}
                >
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button 
                  type="button"
                  className="bg-[#E56717] hover:bg-[#d05c13] ml-auto"
                  onClick={nextStep}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="bg-[#E56717] hover:bg-[#d05c13] ml-auto"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Submit Listing
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListProperty;
