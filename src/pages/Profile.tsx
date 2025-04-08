
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Ana is interested in your apartment in Zagreb", date: "Today" },
    { id: 2, message: "Marko is interested in your house in Split", date: "Yesterday" },
  ]);
  
  // Redirect to auth page if user is not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const clearNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been removed",
    });
  };

  const handleNotificationClick = (id: number) => {
    // Here you would handle the notification, e.g. mark as read, navigate to listing, etc.
    toast({
      title: "Notification handled",
      description: "You've responded to the notification",
    });
    
    // Remove the notification from the list
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  if (!user) return null;

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
              <Button onClick={() => navigate('/notifications')} variant="ghost" className="w-full justify-start">
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
                {notifications.length > 0 ? (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="bg-slate-50 p-4 rounded-md border border-slate-100">
                        <div className="flex justify-between">
                          <p>{notification.message}</p>
                          <span className="text-sm text-gray-500">{notification.date}</span>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleNotificationClick(notification.id)}
                          >
                            Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearNotifications}
                      className="mt-2"
                    >
                      Clear all
                    </Button>
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
