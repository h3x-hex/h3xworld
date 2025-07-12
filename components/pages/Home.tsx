"use client"

import React, { useEffect, useState } from 'react';
import { evmAddress, Post } from '@lens-protocol/client';
import { client } from '@/helper/lensClient';
import { usePostsForYou } from '@lens-protocol/react'
import MediaQuery from 'react-responsive';
import Navbar from '../nav/Navbar';
import BottomNav from '../nav/BottomNav';
import Sidebar from '../nav/Sidebar';
import PostCard from '../posts/PostCard';

interface SocialLink {
  platform: string
  url: string
}

type HomeFeedProps = {
  user: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    coverImage?: string;
    bio?: string;
    dob?: string;
    location?: string;
    occupation?: string;
    socialLinks?: SocialLink[];
    emailVerified: string | null;
    username?: string | null;
    createdAt: Date | null;
    wallet: string | null;
    pin: string | null;
    address: string | null;
    accountAddress: string | null;
  };
};

const HomeFeed: React.FC<HomeFeedProps> = ({ user }) => {
  const [posts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, loading, error } = usePostsForYou({
      account: evmAddress(user.accountAddress!),
      shuffle: true, // optional, shuffle the results
  });

  if (loading) {
    return <p>Loading…</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  console.log(data.items)

  useEffect(() => {
    const loadPosts = async () => {
      if (!user.accountAddress) return;

      const resumed = await client.resumeSession();
      if (resumed.isErr()) return console.error(resumed.error);

      const sessionClient = resumed.value;
      console.log(sessionClient)
      setIsLoading(true);

    };

    loadPosts();
  }, [user.accountAddress]);

  return (
    <>
        <MediaQuery maxWidth={500}>
            <Navbar/>
            <div className="pt-4 px-4 h-full pb-64">
                {isLoading && (
                    <p className="text-white text-center h-screen items-center">
                        <span className="loading loading-infinity text-warning loading-xl"></span>
                    </p>
                )}

                {posts.length === 0 && !isLoading && (
                    <p className="text-gray-400 text-center h-screen">No posts available yet.</p>
                )}

                <div className="flex flex-col gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} postItem={post} />
                    ))}
                </div>
            </div>
            <BottomNav/>            
        </MediaQuery>
        <MediaQuery minWidth={551} maxWidth={9999}>
            <Sidebar/>
        </MediaQuery>
    </>
  );
};

export default HomeFeed;
