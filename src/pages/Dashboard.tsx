
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserListings } from '@/hooks/useUserListings';
import { useListingStatistics } from '@/hooks/useListingStatistics';
import { Building, Eye, MessageSquare, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: listings, isLoading: listingsLoading } = useUserListings();
  const { data: statistics, isLoading: statsLoading } = useListingStatistics();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{listingsLoading ? '...' : listings?.length || 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{statsLoading ? '...' : statistics?.totalViews || 0}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Interested Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{statsLoading ? '...' : statistics?.totalInterests || 0}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Listing Performance</CardTitle>
            <CardDescription>Views and interests for your listings</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {!statsLoading && statistics?.listingStats && (
              <ChartContainer
                config={{
                  views: { theme: { light: "#4F46E5", dark: "#818CF8" } },
                  interests: { theme: { light: "#E56717", dark: "#FB923C" } },
                }}
                className="aspect-[4/3] sm:aspect-[2/1] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={statistics.listingStats}
                    margin={{
                      top: 5,
                      right: 5,
                      left: 5,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" fontSize={12} tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value} />
                    <YAxis />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent labelKey="title" />
                      }
                    />
                    <Bar dataKey="views" fill="var(--color-views)" name="Views" />
                    <Bar dataKey="interests" fill="var(--color-interests)" name="Interests" />
                  </BarChart>
                </ResponsiveContainer>
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </ChartContainer>
            )}
            {statsLoading && (
              <div className="flex justify-center items-center h-64">
                <p>Loading statistics...</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Your Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Your Listings</CardTitle>
            <CardDescription>Manage your property listings</CardDescription>
          </CardHeader>
          <CardContent>
            {listingsLoading && (
              <div className="text-center py-6">Loading your listings...</div>
            )}
            
            {!listingsLoading && listings && listings.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">You haven't listed any properties yet</p>
                <Button onClick={() => navigate('/list-property')}>
                  List a Property
                </Button>
              </div>
            )}
            
            {!listingsLoading && listings && listings.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Interests</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => {
                    const stats = statistics?.listingStats?.find(stat => stat.id === listing.id) || { views: 0, interests: 0 };
                    
                    return (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {listing.images && listing.images[0] ? (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="w-10 h-10 rounded object-cover mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center mr-3">
                                <Building className="h-5 w-5" />
                              </div>
                            )}
                            <span className="truncate max-w-[150px]">{listing.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{listing.property_type}</TableCell>
                        <TableCell>€{listing.price}/month</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {stats.views}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {stats.interests}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/housing/listing/${listing.id}`)}
                          >
                            <span className="sr-only">View details</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="ml-auto" onClick={() => navigate('/list-property')}>
              Add New Listing
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
