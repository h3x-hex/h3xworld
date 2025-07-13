'use client'

import { Sidebar } from "../../components/nav/Sidebar";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileTabs } from "../../components/profile/ProfileTabs";
import { RightSidebar } from "../../components/nav/RightSidebar";
import { useLocation } from "react-router-dom";
import { Home, Globe, Bell, MessageCircle, User, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useNavigation from "@/hooks/useNavigation";

const Profile = () => {
  const router = useRouter();

  const {
      isHomeActive,
      isExploreActive,
      isNotificationsActive,
      isProfileActive,
      isCreateActive,
  } = useNavigation();
  
  const profileData = {
    username: "ron12369",
    displayName: "Ronald Prithiv",
    bio: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since",
    location: "San Francisco, CA",
    occupation: "Digital Artist & Content Creator",
    followerCount: 888,
    followingCount: 369,
    isFollowing: false,
    isSubscribed: false
  };

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
            onClick={() => router.push("/chats")}
            className="p-2 hover:bg-creator-gold/10 rounded-lg transition-colors flex-shrink-0"
          >
            <MessageCircle className="w-6 h-6 text-creator-gold" />
          </button>
        </div>
      </div>

      {/* Fixed Left Sidebar - Hidden on mobile */}
      <div className="hidden md:block fixed top-0 left-0 z-30">
        <Sidebar onNavigate={(id) => id === "home" && router.push("/")} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex md:ml-20 lg:ml-72 pt-16 md:pt-0 pb-20 md:pb-4 min-h-screen">
        {/* Main Content */}
        <div className="flex-1 w-full mx-auto sm:px-4 lg:px-8 pt-2 sm:pt-4 pb-4">

          {/* Profile Header */}
          <div className="bg-gradient-card rounded-lg px-3 shadow-card overflow-hidden mb-4 sm:mb-6">
            <ProfileHeader {...profileData} />
          </div>

          {/* Profile Tabs */}
          <div className="bg-gradient-card">
            <ProfileTabs />
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile and tablet, visible on large screens */}
        <div className="hidden xl:block sticky top-4 h-screen overflow-y-auto">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Profile;