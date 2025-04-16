
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { useUserListings } from '@/hooks/useUserListings';
import { useListingStatistics } from '@/hooks/useListingStatistics';
import StatCards from '@/components/dashboard/StatCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import ListingsTable from '@/components/dashboard/ListingsTable';
import AdBanner from '@/components/AdBanner';

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
        </div>
        
        {/* Ad Banner */}
        <div className="mb-6">
          <AdBanner size="medium" position="top" />
        </div>
        
        {/* Overview Cards */}
        <StatCards 
          listingsCount={listings?.length || 0}
          totalViews={statistics?.totalViews || 0}
          totalInterests={statistics?.totalInterests || 0}
          isLoading={listingsLoading || statsLoading}
        />
        
        {/* Chart */}
        <PerformanceChart 
          listingStats={statistics?.listingStats} 
          isLoading={statsLoading}
        />
        
        {/* Your Listings */}
        <ListingsTable 
          listings={listings} 
          listingStats={statistics?.listingStats}
          isLoading={listingsLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
