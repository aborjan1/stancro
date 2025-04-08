import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters."),
  newPassword: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || "",
      lastName: user?.user_metadata?.last_name || "",
      email: user?.email || "",
      phone: user?.user_metadata?.phone || "",
      mobile: user?.user_metadata?.mobile || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onProfileSubmit(data: ProfileFormValues) {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          mobile: data.mobile,
        }
      });

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    }
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;
      
      passwordForm.reset();
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your password.",
        variant: "destructive",
      });
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto mt-24 px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 bg-slate-900 text-white rounded-lg p-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-2xl">{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</h2>
              <p className="text-sm text-gray-300">Free</p>
            </div>
            
            <div className="bg-emerald-500 rounded-md p-4 mb-6">
              <h3 className="font-medium mb-1">My product</h3>
              <p className="text-sm mb-2">Upgrade to Premium to contact landlords and homeseekers directly.</p>
              <Button className="w-full bg-slate-900 hover:bg-slate-800">Upgrade now</Button>
            </div>
            
            <nav className="space-y-2">
              <Button onClick={() => navigate('/dashboard')} variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
              <Button onClick={() => navigate('/notifications')} variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button onClick={() => navigate('/profile')} variant="ghost" className="w-full justify-start">
                My account
              </Button>
              <Button onClick={() => navigate('/settings')} variant="ghost" className="w-full justify-start bg-slate-800">
                Settings
              </Button>
            </nav>
          </div>
          
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <div className="border-b pb-4 mb-6">
              <h1 className="text-2xl font-bold">My Account</h1>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" onClick={() => setActiveTab("profile")}>
                  Password
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("subscription")}>
                  Subscription
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("delete")}>
                  Delete profile
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="profile">
                <div className="space-y-6">
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Save changes</Button>
                    </form>
                  </Form>

                  <div className="pt-6 border-t">
                    <h2 className="text-lg font-medium mb-4">Password</h2>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm new password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Update password</Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="subscription">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Subscription Management</h2>
                  <div className="p-4 border rounded-md">
                    <p className="font-medium">Current Plan: Free</p>
                    <p className="text-sm text-gray-500 mt-1">Upgrade to Premium for more features</p>
                    <Button className="mt-4">Upgrade now</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="delete">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Delete Profile</h2>
                  <div className="p-4 border rounded-md bg-red-50">
                    <p className="font-medium text-red-600">Warning: This action cannot be undone</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Deleting your profile will permanently remove all your data from our systems.
                    </p>
                    <Button variant="destructive" className="mt-4">Delete my account</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
