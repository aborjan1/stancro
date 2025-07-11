
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    clearAllNotifications,
    setupRealtimeNotifications
  } = useNotifications();
  
  // Redirect to auth page if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Set up realtime notifications
  useEffect(() => {
    const cleanup = setupRealtimeNotifications();
    return cleanup;
  }, []);

  const handleNotificationClick = (notificationId: string) => {
    markAsRead.mutate(notificationId);
  };

  const goToNotifications = () => {
    navigate('/notifications');
  };

  if (!user) return null;

  // Get only a few recent notifications for display
  const recentNotifications = notifications.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto mt-24 px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left sidebar */}
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
              <Button onClick={goToNotifications} variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
                {notifications.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              <Button onClick={() => navigate('/profile')} variant="ghost" className="w-full justify-start bg-slate-800">
                My account
              </Button>
              <Button onClick={() => navigate('/settings')} variant="ghost" className="w-full justify-start">
                Settings
              </Button>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <div className="border-b pb-4 mb-6">
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-gray-500">Manage your personal information</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-2">Personal Information</h2>
                <p>Email: {user.email}</p>
                <p>Name: {user?.user_metadata?.full_name || 'Not set'}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Notifications</h2>
                {recentNotifications.length > 0 ? (
                  <div className="space-y-2">
                    {recentNotifications.map((notification) => (
                      <div key={notification.id} className="bg-slate-50 p-4 rounded-md border border-slate-100">
                        <div className="flex justify-between">
                          <p>{notification.message}</p>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleNotificationClick(notification.id)}
                          >
                            {notification.read ? 'Contacted' : 'Contact'}
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => clearAllNotifications.mutate()}
                        disabled={clearAllNotifications.isPending}
                      >
                        Clear all
                      </Button>
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={goToNotifications}
                      >
                        View all notifications ({notifications.length})
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">You have no new notifications.</p>
                )}
              </div>
              
              <Button onClick={() => navigate('/settings')} variant="outline">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
