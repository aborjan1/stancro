
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Loader2 } from "lucide-react";
import { format, isToday, isYesterday } from 'date-fns';

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    notifications, 
    isLoading, 
    clearAllNotifications, 
    deleteNotification,
    markAsRead,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
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
              <Button onClick={() => navigate('/notifications')} variant="ghost" className="w-full justify-start bg-slate-800">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
                {notifications.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              <Button onClick={() => navigate('/profile')} variant="ghost" className="w-full justify-start">
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
              <h1 className="text-2xl font-bold">My Notifications</h1>
              <p className="text-gray-500">Manage your notifications</p>
            </div>
            
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : notifications.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 rounded-md border ${notification.read ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-200'}`}
                      >
                        <div className="flex justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={notification.sender?.avatar_url || undefined} />
                              <AvatarFallback>{notification.sender?.full_name?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className={`${notification.read ? 'font-normal' : 'font-medium'}`}>
                                {notification.message}
                              </p>
                              {!notification.read && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded mt-1">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleNotificationClick(notification.id)}
                            disabled={markAsRead.isPending}
                          >
                            {notification.read ? "Contacted" : "Mark as Read"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => deleteNotification.mutate(notification.id)}
                            disabled={deleteNotification.isPending}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => clearAllNotifications.mutate()}
                      disabled={clearAllNotifications.isPending}
                    >
                      {clearAllNotifications.isPending ? "Clearing..." : "Clear all notifications"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                  <p className="mt-2 text-gray-500">You have no new notifications at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
