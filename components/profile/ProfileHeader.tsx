
import { Button } from "@/components/ui/button";
import { MapPinIcon, BriefcaseIcon, UserGroupIcon, StarIcon, ChatBubbleLeftIcon, HeartIcon, EllipsisHorizontalIcon, CurrencyDollarIcon, Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useState } from "react";
import { SocialStatsModal } from "./SocialStatsModal";
import { ChatModal } from "./ChatModal";
import { TipModal } from "./TipModal";
import { ImageViewModal } from "../modals/ImageViewModal";
import coverImage from "@/assets/cover-image.jpg";
import profileAvatar from "@/assets/profile-avatar.jpg";

interface ProfileHeaderProps {
  username: string;
  displayName: string;
  bio: string;
  location: string;
  occupation: string;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isSubscribed?: boolean;
}

export function ProfileHeader({
  username,
  displayName,
  bio,
  location,
  occupation,
  followerCount,
  followingCount,
  isFollowing = false,
  isSubscribed = false
}: ProfileHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"following" | "followers" | "subscribers">("followers");
  const [imageViewOpen, setImageViewOpen] = useState(false);

  const openModal = (tab: "following" | "followers" | "subscribers") => {
    setModalTab(tab);
    setModalOpen(true);
  };

  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <div className="relative h-24 sm:h-32 md:h-40 lg:h-48 rounded-t-lg overflow-hidden">
        <img 
          src="/lovable-uploads/d6e53331-5ff4-4d29-adf5-d4af7eccd7c7.png" 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Profile Picture - Overlapping the cover */}
      <div className="absolute left-1/2 top-24 sm:top-32 md:top-40 lg:top-48 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <button 
            onClick={() => setImageViewOpen(true)}
            className="block hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src='/logo.png'
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-background shadow-glow object-cover"
            />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="relative pr-3 sm:pr-4 md:pr-6 pb-6 sm:pb-8 pt-12 sm:pt-16 md:pt-20">

        {/* Profile Info */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground animate-fade-in">
              {displayName}
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">@{username}</p>
          </div>

          <p className="text-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in text-center text-sm sm:text-base px-2">
            {bio}
          </p>

          <div className="flex justify-center items-center gap-6 text-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-creator-gold">work</span>
              <span className="text-creator-gold font-medium">h3xdev</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-creator-gold">location_on</span>
              <span className="text-creator-gold font-medium">h3xav3rse</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8 text-center animate-fade-in mb-4 sm:mb-6">
            <button onClick={() => openModal("following")} className="hover:bg-muted/50 rounded-lg p-2 transition-colors">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{followingCount.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Following</div>
            </button>
            <button onClick={() => openModal("followers")} className="hover:bg-muted/50 rounded-lg p-2 transition-colors">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{followerCount.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
            </button>
            <button onClick={() => openModal("subscribers")} className="hover:bg-muted/50 rounded-lg p-2 transition-colors">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">420</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Subscribers</div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-2 sm:gap-3 mx-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-24 sm:w-28 py-2 h-10 border border-creator-gold text-creator-gold hover:bg-creator-gold hover:text-background font-medium rounded-full text-xs"
            >
              Follow
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-24 sm:w-28 py-2 h-10 border border-creator-gold text-creator-gold hover:bg-creator-gold hover:text-background font-medium rounded-full text-xs"
            >
              Subscribe
            </Button>
            <ChatModal>
              <Button variant="ghost" size="sm" className="w-10 h-10 sm:w-12 sm:h-12 p-1 rounded-full sm:border sm:border-white/20 hover:border-creator-gold group">
                <ChatBubbleLeftIcon className="w-full h-full text-white group-hover:text-creator-gold transition-colors" />
              </Button>
            </ChatModal>
            <TipModal>
              <Button variant="ghost" size="sm" className="w-10 h-10 sm:w-12 sm:h-12 p-1 rounded-full sm:border sm:border-white/20 hover:border-creator-gold group">
                <CurrencyDollarIcon className="w-full h-full text-white group-hover:text-creator-gold transition-colors" />
              </Button>
            </TipModal>
            <Button variant="ghost" size="sm" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full sm:border sm:border-white/20 hover:border-creator-gold group">
              <EllipsisHorizontalIcon className="w-full h-full text-white group-hover:text-creator-gold transition-colors" />
            </Button>
          </div>
        </div>
      </div>

      <SocialStatsModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={modalTab}
        followingCount={followingCount}
        followerCount={followerCount}
      />

      <ImageViewModal
        isOpen={imageViewOpen}
        onClose={() => setImageViewOpen(false)}
        imageSrc='/logo.png'
        imageAlt="Profile Picture"
      />
    </div>
  );
}
