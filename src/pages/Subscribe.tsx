
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';

const Subscribe = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  // Fetch user's current subscription status
  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  
  const isSubscribed = !!subscription && subscription.status === 'active' && new Date(subscription.expires_at) > new Date();
  
  // Handle subscription checkout
  const handleSubscribe = async (plan: string) => {
    try {
      setLoading(true);
      
      // This would typically call a Supabase Edge Function to create a Stripe checkout session
      // For now, we'll simulate this with a direct database entry
      
      // Calculate expiration date (1 month from now)
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      
      if (isSubscribed) {
        toast({
          title: "Already Subscribed",
          description: "You already have an active subscription.",
          variant: "default",
        });
      } else {
        // Create mock subscription for demonstration
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user?.id,
            tier: plan,
            expires_at: expirationDate.toISOString(),
          });
          
        if (error) throw error;
        
        toast({
          title: "Subscription Active",
          description: `Your ${plan} subscription is now active. Your listings will be featured!`,
          variant: "default",
        });
        
        // In a real implementation, you would redirect to Stripe checkout
        // window.location.href = checkoutUrl;
        
        // For demo purposes, redirect to dashboard after "successful payment"
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error: any) {
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to process subscription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Premium Subscription</h1>
        <p className="text-gray-500 mb-8">Feature your listings at the top of search results</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <Card className={isSubscribed && subscription?.tier === 'standard' ? 'border-2 border-primary' : ''}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Standard</CardTitle>
                {isSubscribed && subscription?.tier === 'standard' && (
                  <Badge variant="outline" className="bg-primary text-primary-foreground">Current Plan</Badge>
                )}
              </div>
              <CardDescription>Basic listing functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-6">Free</p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Standard listing position</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Up to 3 listings</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/dashboard')}
              >
                Free Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className={`${isSubscribed && subscription?.tier === 'premium' ? 'border-2 border-primary' : ''} bg-muted/50`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Premium</CardTitle>
                {isSubscribed && subscription?.tier === 'premium' && (
                  <Badge variant="outline" className="bg-primary text-primary-foreground">Current Plan</Badge>
                )}
              </div>
              <CardDescription>Featured listings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-6">€19.99<span className="text-base font-normal">/month</span></p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span><strong>Featured position</strong> in search results</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Detailed visitor analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Up to 10 listings</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={isSubscribed && subscription?.tier === 'premium' ? "outline" : "default"}
                className="w-full" 
                onClick={() => handleSubscribe('premium')}
                disabled={loading || (isSubscribed && subscription?.tier === 'premium')}
              >
                {isSubscribed && subscription?.tier === 'premium' ? 'Current Plan' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Enterprise Plan */}
          <Card className={isSubscribed && subscription?.tier === 'enterprise' ? 'border-2 border-primary' : ''}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Enterprise</CardTitle>
                {isSubscribed && subscription?.tier === 'enterprise' && (
                  <Badge variant="outline" className="bg-primary text-primary-foreground">Current Plan</Badge>
                )}
              </div>
              <CardDescription>For property management companies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-6">€49.99<span className="text-base font-normal">/month</span></p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span><strong>Top position</strong> in search results</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Advanced analytics dashboard</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span>Unlimited listings</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={isSubscribed && subscription?.tier === 'enterprise' ? "outline" : "default"}
                className="w-full" 
                onClick={() => handleSubscribe('enterprise')}
                disabled={loading || (isSubscribed && subscription?.tier === 'enterprise')}
              >
                {isSubscribed && subscription?.tier === 'enterprise' ? 'Current Plan' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {isSubscribed && (
          <div className="mt-10 p-6 bg-muted rounded-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 mt-1" />
              <div>
                <h3 className="font-medium mb-2">Active Subscription</h3>
                <p className="text-muted-foreground mb-1">
                  Your {subscription.tier} subscription is active until {new Date(subscription.expires_at).toLocaleDateString()}.
                </p>
                <p className="text-muted-foreground text-sm">
                  Note: This is a demonstration. In a production environment, this would be linked to Stripe for actual billing.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribe;
