import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Star } from "lucide-react";
import { Star as StarSolid } from "lucide-react";
import { motion } from "framer-motion";

interface SocialStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "following" | "followers" | "subscribers";
  followingCount: number;
  followerCount: number;
  subscriberCount?: number;
}

interface UserItemProps {
  name: string;
  username: string;
  isFollowing?: boolean;
  isSubscribed?: boolean;
  showSubscribeBadge?: boolean;
}

const UserItem = ({ name, username, isFollowing, isSubscribed, showSubscribeBadge }: UserItemProps) => (
  <div className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-creator-blue to-creator-pink rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-semibold text-sm sm:text-base">{name.charAt(0)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground text-sm sm:text-base truncate">{name}</p>
        <p className="text-xs sm:text-sm text-muted-foreground truncate">@{username}</p>
      </div>
      {showSubscribeBadge && (
        <StarSolid className="w-3 h-3 sm:w-4 sm:h-4 text-creator-gold flex-shrink-0" />
      )}
    </div>
    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
      {showSubscribeBadge ? (
        <Button variant={isSubscribed ? "outline" : "subscribe"} size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
          <span className="hidden sm:inline">{isSubscribed ? "Subscribed" : "Subscribe"}</span>
          <span className="sm:hidden">{isSubscribed ? "Sub'd" : "Sub"}</span>
        </Button>
      ) : (
        <Button variant={isFollowing ? "outline" : "follow"} size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
          <span className="hidden sm:inline">{isFollowing ? "Following" : "Follow"}</span>
          <span className="sm:hidden">{isFollowing ? "Follow" : "Follow"}</span>
        </Button>
      )}
    </div>
  </div>
);

export function SocialStatsModal({ 
  isOpen, 
  onClose, 
  initialTab = "followers",
  followingCount,
  followerCount,
  subscriberCount = 420
}: SocialStatsModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: "following", label: "Following", count: followingCount, icon: UserPlus },
    { id: "followers", label: "Followers", count: followerCount, icon: Users },
    { id: "subscribers", label: "Subscribers", count: subscriberCount, icon: Star },
  ];

  // Mock data for demonstration
  const mockUsers = {
    following: Array.from({ length: followingCount }, (_, i) => ({
      name: `User ${i + 1}`,
      username: `user${i + 1}`,
      isFollowing: true,
    })),
    followers: Array.from({ length: Math.min(followerCount, 20) }, (_, i) => ({
      name: `Follower ${i + 1}`,
      username: `follower${i + 1}`,
      isFollowing: Math.random() > 0.5,
    })),
    subscribers: Array.from({ length: Math.min(subscriberCount, 20) }, (_, i) => ({
      name: `Subscriber ${i + 1}`,
      username: `subscriber${i + 1}`,
      isSubscribed: true,
      showSubscribeBadge: true,
    })),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 w-full sm:max-w-lg md:max-w-2xl">
        <DialogHeader className="p-3 sm:p-6 pb-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold">Social Stats</DialogTitle>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors relative ${
                  isActive
                    ? "text-creator-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="text-xs">{tab.count.toLocaleString()}</span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-creator-gold"
                    layoutId="activeModalTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {mockUsers[activeTab].length > 0 ? (
              <div className="divide-y divide-border">
                {mockUsers[activeTab].map((user, index) => (
                  <UserItem
                    key={index}
                    name={user.name}
                    username={user.username}
                    isFollowing={user.isFollowing}
                    isSubscribed={user.isSubscribed}
                    showSubscribeBadge={user.showSubscribeBadge}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No {activeTab} yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}