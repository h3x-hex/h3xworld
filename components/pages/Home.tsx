import { Sidebar } from "../../components/nav/Sidebar";
import { RightSidebar } from "../../components/nav/RightSidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Home as HomeIcon, Globe, Bell, MessageCircle, User, Search, Plus, Heart, Share, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock feed data
  const posts = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        username: "@sarahc",
        avatar: "/lovable-uploads/050f992c-47c0-42c7-a1d3-99e7f71f6340.png"
      },
      content: "Just finished working on an amazing digital art piece! The creative process never gets old ✨",
      image: "/lovable-uploads/d6e53331-5ff4-4d29-adf5-d4af7eccd7c7.png",
      likes: 142,
      shares: 23,
      timestamp: "2h"
    },
    {
      id: 2,
      user: {
        name: "Alex Rodriguez",
        username: "@alexr",
        avatar: "/lovable-uploads/050f992c-47c0-42c7-a1d3-99e7f71f6340.png"
      },
      content: "Beautiful sunset from my studio window today. Sometimes the best inspiration comes from just looking outside 🌅",
      likes: 89,
      shares: 12,
      timestamp: "4h"
    },
    {
      id: 3,
      user: {
        name: "Maya Patel",
        username: "@mayap",
        avatar: "/lovable-uploads/050f992c-47c0-42c7-a1d3-99e7f71f6340.png"
      },
      content: "Excited to announce my new collection will be dropping next week! Stay tuned for more details 🎨",
      likes: 234,
      shares: 45,
      timestamp: "6h"
    }
  ];

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
        <Sidebar onNavigate={(id) => id === "home" && navigate("/home")} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex md:ml-20 lg:ml-72 pt-16 md:pt-0 pb-20 md:pb-4">
        {/* Main Content */}
        <div className="flex-1 max-w-2xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4 pb-4">
          
          {/* Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-gradient-card rounded-lg shadow-card border border-border p-4 sm:p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.user.avatar} alt={post.user.name} />
                      <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{post.user.name}</h3>
                      <p className="text-sm text-muted-foreground">{post.user.username} • {post.timestamp}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

                {/* Post Image */}
                {post.image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post content" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-creator-gold transition-colors">
                      <Share className="w-5 h-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <HomeIcon className="w-5 h-5" />
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

export default Home;