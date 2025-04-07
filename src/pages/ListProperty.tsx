
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Toggle, toggleVariants } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import { User, Home, Users, HelpCircle, Calendar, Image, Video, Map, FileText } from "lucide-react";

// Form schema validation
const propertyFormSchema = z.object({
  landlordType: z.enum(["private_owner", "roommate", "agent", "other"], {
    required_error: "Please select your landlord type.",
  }),
  isStudentHouse: z.enum(["yes", "no"], {
    required_error: "Please specify if it's a student house.",
  }),
  studentHouseName: z.string().optional(),
  roomName: z.string().optional(),
  rentalPeriod: z.enum(["indefinite", "temporary"], {
    required_error: "Please select a rental period."
  }),
  availableFrom: z.string().min(1, "Available date is required"),
  viewingDate: z.string().optional(),
  surfaceArea: z.string().min(1, "Surface area is required"),
  furnishing: z.enum(["unfurnished", "furnished", "uncarpeted"], {
    required_error: "Please select furnishing type."
  }),
  rentalPrice: z.string().min(1, "Rental price is required"),
  utilitiesIncluded: z.enum(["included", "excluded"], {
    required_error: "Please specify if utilities are included."
  }),
  deposit: z.string().optional(),
  photos: z.array(z.string()).optional(),
  video: z.string().optional(),
  livingRoom: z.enum(["shared", "private", "none"]).default("none"),
  kitchen: z.enum(["shared", "private", "none"]).default("none"),
  toilet: z.enum(["shared", "private", "none"]).default("none"),
  bathroom: z.enum(["shared", "private", "none"]).default("none"),
  petsAllowed: z.enum(["yes", "no", "mutual"]).default("no"),
  internet: z.enum(["yes", "no", "charge"]).default("no"),
  energyLabel: z.string().optional(),
  tenantCount: z.string().optional(),
  desiredGender: z.enum(["male", "female", "not_important"]).default("not_important"),
  ageMin: z.string().default("18"),
  ageMax: z.string().default("99"),
  tenantStatus: z.array(z.string()).optional(),
  languages: z.string().optional(),
  roommateCount: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Please provide a detailed description"),
  addDutchVersion: z.boolean().default(false),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const ListProperty = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<string | null>(null);
  
  // Define all steps for the form
  const steps = [
    "landlord-type",
    "student-house",
    "rental-period",
    "surface-area",
    "rental-price",
    "photos",
    "property-details",
    "desired-tenant",
    "current-residents",
    "title-description"
  ];

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      landlordType: undefined,
      isStudentHouse: undefined,
      studentHouseName: "",
      roomName: "",
      rentalPeriod: undefined,
      availableFrom: "",
      viewingDate: "",
      surfaceArea: "",
      furnishing: undefined,
      rentalPrice: "",
      utilitiesIncluded: undefined,
      deposit: "",
      photos: [],
      video: "",
      livingRoom: "none",
      kitchen: "none",
      toilet: "none",
      bathroom: "none",
      petsAllowed: "no",
      internet: "no",
      energyLabel: "",
      tenantCount: "",
      desiredGender: "not_important",
      ageMin: "18",
      ageMax: "99",
      tenantStatus: [],
      languages: "",
      roommateCount: "",
      title: "",
      description: "",
      addDutchVersion: false,
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
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const newPhotos = fileArray.map((file) => URL.createObjectURL(file));
      setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
      form.setValue("photos", [...uploadedPhotos, ...newPhotos]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      setVideoFile(videoUrl);
      form.setValue("video", videoUrl);
    }
  };

  const progressPercentage = ((step + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 py-10 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">List Your Property</h1>
          <p className="text-center text-gray-600 mb-8">Connect with thousands of students looking for accommodation</p>
          
          {/* Progress bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <Card className="max-w-2xl mx-auto shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Landlord Type */}
                {step === 0 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">What kind of landlord are you?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="landlordType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div
                                className={`flex flex-col items-center justify-center p-6 border rounded-md cursor-pointer transition-all ${
                                  field.value === "private_owner" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => field.onChange("private_owner")}
                              >
                                <User className="h-8 w-8 mb-2 text-primary" />
                                <span className="font-medium text-center">Private owner</span>
                              </div>
                              
                              <div
                                className={`flex flex-col items-center justify-center p-6 border rounded-md cursor-pointer transition-all ${
                                  field.value === "roommate" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => field.onChange("roommate")}
                              >
                                <Users className="h-8 w-8 mb-2 text-primary" />
                                <span className="font-medium text-center">Roommate</span>
                              </div>
                              
                              <div
                                className={`flex flex-col items-center justify-center p-6 border rounded-md cursor-pointer transition-all ${
                                  field.value === "agent" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => field.onChange("agent")}
                              >
                                <Home className="h-8 w-8 mb-2 text-primary" />
                                <span className="font-medium text-center">Real estate agent</span>
                              </div>
                              
                              <div
                                className={`flex flex-col items-center justify-center p-6 border rounded-md cursor-pointer transition-all ${
                                  field.value === "other" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => field.onChange("other")}
                              >
                                <HelpCircle className="h-8 w-8 mb-2 text-primary" />
                                <span className="font-medium text-center">Other</span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </>
                )}

                {/* Step 2: Student House */}
                {step === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">Is it a room in a student house?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="isStudentHouse"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="yes" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Yes
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    No
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("isStudentHouse") === "yes" && (
                        <>
                          <div className="mt-6 mb-4">
                            <Button variant="outline" className="w-full justify-start">
                              + Create a new student house
                            </Button>
                          </div>

                          <FormField
                            control={form.control}
                            name="studentHouseName"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel>Name of the student house <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="roomName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name of the room <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter room name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </CardContent>
                  </>
                )}

                {/* Step 3: Rental Period */}
                {step === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">What is the rental period?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="rentalPeriod"
                        render={({ field }) => (
                          <FormItem className="space-y-3 mb-6">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="indefinite" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Indefinite period
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="temporary" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Temporary
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
                        name="availableFrom"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Available from <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="viewingDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Viewing date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </>
                )}

                {/* Step 4: Surface Area */}
                {step === 3 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">Surface in m² of the entire home</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="surfaceArea"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Surface in m² <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter surface area" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="furnishing"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Furnishing <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="uncarpeted" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Uncarpeted
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="unfurnished" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Unfurnished
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="furnished" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Furnished
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </>
                )}

                {/* Step 5: Rental Price */}
                {step === 4 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">Rental price and costs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="rentalPrice"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Rental price per month <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="€" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="utilitiesIncluded"
                        render={({ field }) => (
                          <FormItem className="space-y-3 mb-4">
                            <FormLabel>Including or excluding utilities such as electricity? <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="excluded" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Utilities excl.
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="included" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Utilities incl.
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
                        name="deposit"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Deposit</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="€" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </>
                )}

                {/* Step 6: Photos and Video */}
                {step === 5 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">Add photos and video</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Add photos (max 4 MB per photo)</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Add at least 3 photos to give home seekers a good idea of the home. You can add up to 10 photos to your ad.
                        </p>
                        
                        <div className="space-y-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            className="w-full h-12"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                          >
                            <Image className="mr-2 h-5 w-5" /> Please select
                          </Button>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                          
                          {uploadedPhotos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                              {uploadedPhotos.map((photo, index) => (
                                <div key={index} className="relative aspect-square border rounded-md overflow-hidden">
                                  <img 
                                    src={photo} 
                                    alt={`Uploaded photo ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2">Add a video</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload a video of maximum 120 seconds. The video file can be no larger than 1 GB.
                        </p>
                        
                        <Button
                          type="button"
                          variant="secondary"
                          className="w-full h-12"
                          onClick={() => document.getElementById('video-upload')?.click()}
                        >
                          <Video className="mr-2 h-5 w-5" /> Select a video file
                        </Button>
                        <input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                        
                        {videoFile && (
                          <div className="mt-4 border rounded-md overflow-hidden">
                            <video 
                              src={videoFile} 
                              controls 
                              className="w-full h-auto"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </>
                )}

                {/* Step 7: Property Details */}
                {step === 6 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="livingRoom"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Living room</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="shared" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Shared</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="private" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Private</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="none" />
                                    </FormControl>
                                    <FormLabel className="font-normal">None</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="kitchen"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Kitchen</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="shared" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Shared</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="private" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Private</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="none" />
                                    </FormControl>
                                    <FormLabel className="font-normal">None</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="toilet"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Toilet</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="shared" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Shared</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="private" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Private</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="none" />
                                    </FormControl>
                                    <FormLabel className="font-normal">None</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bathroom"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Bathroom</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="shared" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Shared</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="private" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Private</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="none" />
                                    </FormControl>
                                    <FormLabel className="font-normal">None</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="petsAllowed"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Pets allowed?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="mutual" />
                                    </FormControl>
                                    <FormLabel className="font-normal">By mutual agreement</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="internet"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Internet available</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-4"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="yes" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Yes</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal">No</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="charge" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Additional charge</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="energyLabel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Energy label</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select energy label" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="A+++">A+++</SelectItem>
                                  <SelectItem value="A++">A++</SelectItem>
                                  <SelectItem value="A+">A+</SelectItem>
                                  <SelectItem value="A">A</SelectItem>
                                  <SelectItem value="B">B</SelectItem>
                                  <SelectItem value="C">C</SelectItem>
                                  <SelectItem value="D">D</SelectItem>
                                  <SelectItem value="E">E</SelectItem>
                                  <SelectItem value="F">F</SelectItem>
                                  <SelectItem value="G">G</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </>
                )}

                {/* Step 8: Desired Tenant */}
                {step === 7 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">Desired tenant</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="tenantCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Suitable for how many tenants?</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select number of tenants" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5+">5+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="desiredGender"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Desired gender</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="male" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Male</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="female" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Female</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="not_important" />
                                    </FormControl>
                                    <FormLabel className="font-normal">Not important</FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <FormLabel>Age</FormLabel>
                          <div className="pt-6 pb-2">
                            <div className="relative">
                              <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full">
                                <div className="absolute left-0 right-0 h-1 bg-primary rounded-full" style={{left: "10%", right: "10%"}}></div>
                              </div>
                              <div className="absolute left-0 top-0 -mt-2 -ml-1 h-4 w-4 rounded-full bg-primary"></div>
                              <div className="absolute right-0 top-0 -mt-2 -mr-1 h-4 w-4 rounded-full bg-primary"></div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-8">
                            <FormField
                              control={form.control}
                              name="ageMin"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input type="number" placeholder="Min" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <span className="self-center">To</span>
                            <FormField
                              control={form.control}
                              name="ageMax"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input type="number" placeholder="Max" {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <FormLabel>Status of the new tenant(s)</FormLabel>
                          <div className="flex flex-col space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="student" value="student" />
                              <label htmlFor="student" className="text-sm">Student</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="working-student" value="working-student" />
                              <label htmlFor="working-student" className="text-sm">Working student</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="working" value="working" />
                              <label htmlFor="working" className="text-sm">Working</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="looking-for-job" value="looking-for-job" />
                              <label htmlFor="looking-for-job" className="text-sm">Looking for a job</label>
                            </div>
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="languages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Which languages should your tenant speak?</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., English, Croatian, Italian" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </>
                )}

                {/* Step 9: Current Residents */}
                {step === 8 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">Current residents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="roommateCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of roommates</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select number of roommates" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0">0</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5+">5+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </>
                )}

                {/* Step 10: Title and Description */}
                {step === 9 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-2xl">Title and description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>English title <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter title for your listing" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>English description <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your property in detail"
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center space-x-2 pt-4 border-t">
                        <Checkbox id="add-dutch" checked={form.watch("addDutchVersion")} onCheckedChange={(checked) => form.setValue("addDutchVersion", !!checked)} />
                        <label htmlFor="add-dutch" className="text-sm">Add Dutch version</label>
                      </div>
                    </CardContent>
                  </>
                )}
              </form>
            </Form>
            <CardFooter className="flex justify-between">
              {step > 0 && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={prevStep}
                >
                  Back
                </Button>
              )}
              {step < steps.length - 1 ? (
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
