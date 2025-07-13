import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Heart, MessageCircle, UserPlus, Star, DollarSign, Calendar, Search, Home, Globe, User, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const notifications = [
    {
      id: 1,
      type: "like",
      icon: Heart,
      user: "Sarah Chen",
      username: "@sarahdesigns",
      action: "liked your post",
      content: "New UI Design Concept",
      time: "2 minutes ago",
      unread: true
    },
    {
      id: 2,
      type: "comment",
      icon: MessageCircle,
      user: "Alex Rivera",
      username: "@alexcodes",
      action: "commented on your post",
      content: "Great work on the authentication flow!",
      time: "1 hour ago",
      unread: true
    },
    {
      id: 3,
      type: "follow",
      icon: UserPlus,
      user: "Maya Thompson",
      username: "@mayacreates",
      action: "started following you",
      content: "",
      time: "3 hours ago",
      unread: true
    },
    {
      id: 4,
      type: "subscription",
      icon: Star,
      user: "David Kim",
      username: "@davidcodes",
      action: "subscribed to your H3Xclusive tier",
      content: "Premium Content Access",
      time: "5 hours ago",
      unread: false
    },
    {
      id: 5,
      type: "purchase",
      icon: DollarSign,
      user: "Emma Wilson",
      username: "@emmacreates",
      action: "purchased your digital asset",
      content: "Modern Logo Pack",
      time: "1 day ago",
      unread: false
    },
    {
      id: 6,
      type: "meeting",
      icon: Calendar,
      user: "Luna Rodriguez",
      username: "@lunashots",
      action: "booked a consultation with you",
      content: "Photography Session Planning",
      time: "2 days ago",
      unread: false
    },
    {
      id: 7,
      type: "like",
      icon: Heart,
      user: "Tech Community",
      username: "@techcommunity",
      action: "liked your blog post",
      content: "The Future of AI in Design",
      time: "3 days ago",
      unread: false
    }
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "like": return "text-red-500";
      case "comment": return "text-blue-500";
      case "follow": return "text-green-500";
      case "subscription": return "text-creator-gold";
      case "purchase": return "text-emerald-500";
      case "meeting": return "text-purple-500";
      default: return "text-muted-foreground";
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Top Navigation - Only visible on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/lovable-uploads/48586265-3684-407a-8713-158398a6bee7.png" 
              alt="H3X World Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 pl-9 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-creator-gold/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Chat Button */}
          <button 
            onClick={() => navigate("/chats")}
            className="p-2 hover:bg-creator-gold/10 rounded-lg transition-colors flex-shrink-0"
          >
            <MessageCircle className="w-6 h-6 text-creator-gold" />
          </button>
        </div>
      </div>

      {/* Fixed Left Sidebar - Hidden on mobile */}
      <div className="hidden md:block fixed top-0 left-0 z-30">
        <Sidebar onNavigate={(id) => {
          if (id === "home") navigate("/");
          if (id === "profile") navigate("/profile");
          if (id === "explore") navigate("/explore");
          if (id === "chats") navigate("/chats");
          if (id === "dashboard") navigate("/dashboard");
        }} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex md:ml-20 lg:ml-72 pt-16 md:pt-0 pb-20 md:pb-4 min-h-screen">
        {/* Main Content */}
        <div className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 pt-2 sm:pt-4 pb-4">
          
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                  <Bell className="w-6 sm:w-8 h-6 sm:h-8 text-creator-gold" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="bg-red-500">
                      {unreadCount}
                    </Badge>
                  )}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">Stay updated with your latest activity</p>
              </div>
              <Button variant="outline" size="sm">
                Mark all as read
              </Button>
            </div>
          </div>

          {/* Notification Filters */}
          <Card className="bg-gradient-card border-border mb-4 sm:mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm" className="bg-creator-gold text-background">
                  All
                </Button>
                <Button variant="outline" size="sm">
                  Likes
                </Button>
                <Button variant="outline" size="sm">
                  Comments
                </Button>
                <Button variant="outline" size="sm">
                  Followers
                </Button>
                <Button variant="outline" size="sm">
                  Purchases
                </Button>
                <Button variant="outline" size="sm">
                  Meetings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className={`bg-gradient-card border-border cursor-pointer hover:border-creator-gold/50 transition-colors ${
                    notification.unread ? 'border-creator-gold/30 bg-creator-gold/5' : ''
                  }`}
                >
            <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-4">
                      {/* Notification Icon */}
                      <div className={`p-2 rounded-full bg-muted/20 ${getNotificationColor(notification.type)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* User Avatar */}
                      <div className="w-10 h-10 bg-creator-gold/20 rounded-full flex items-center justify-center">
                        <span className="text-creator-gold font-semibold text-sm">
                          {notification.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-foreground">
                              <span className="font-medium">{notification.user}</span>
                              <span className="text-muted-foreground text-sm ml-1">
                                {notification.username}
                              </span>
                              <span className="ml-2">{notification.action}</span>
                            </p>
                            {notification.content && (
                              <p className="text-sm text-creator-gold mt-1">"{notification.content}"</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                            {notification.unread && (
                              <div className="w-2 h-2 bg-creator-gold rounded-full mt-1 ml-auto"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <Button variant="outline" className="border-creator-gold/30 hover:bg-creator-gold/10">
              Load More Notifications
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile and tablet, visible on large screens */}
        <div className="hidden xl:block sticky top-4 h-screen overflow-y-auto">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="grid grid-cols-5 gap-1 p-2 items-center">
          {/* Home */}
          <button
            onClick={() => navigate("/home")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === "/home"
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <Home className="w-5 h-5" />
          </button>
          
          {/* Explore */}
          <button
            onClick={() => navigate("/explore")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === "/explore"
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <Globe className="w-5 h-5" />
          </button>
          
          {/* Create - Center button with special styling */}
          <button
            onClick={() => navigate("/create")}
            className="flex items-center justify-center w-20 h-12 bg-creator-gold text-black rounded-full hover:bg-creator-gold/90 transition-colors shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
          
          {/* Notifications */}
          <button
            onClick={() => navigate("/notifications")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === "/notifications"
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === "/profile"
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;