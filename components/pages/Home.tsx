"use client"

import React, { useEffect, useState } from 'react';
import { fetchTimeline } from '@lens-protocol/client/actions';
import { evmAddress, Post, TimelineItem } from '@lens-protocol/client';
import { client } from '@/helper/lensClient';
import { userAtom } from '@/store/authState';
import { useAtom } from 'jotai';
import MediaQuery from 'react-responsive';
import Navbar from '../nav/Navbar';
import BottomNav from '../nav/BottomNav';
import OnboardingWrapper from '../onboarding/OnboardingWrapper';
import Sidebar from '../nav/Sidebar';
import PostCard from '../posts/PostCard';

const HomeFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user] = useAtom(userAtom);

  useEffect(() => {
    const loadPosts = async () => {
      if (!user.accountAddress) return;

      const resumed = await client.resumeSession();
      if (resumed.isErr()) return console.error(resumed.error);

      const sessionClient = resumed.value;
      console.log(sessionClient)
      setIsLoading(true);
      setError(null);

      /*const result = await fetchTimelineHighlights(sessionClient, {
        account: evmAddress(user.accountAddress!),
        filter: {
            feeds: [
              {
                feed: evmAddress("0x63c3579756B353D26876A9A5A6f563165C320b7f"),
              },
            ],
        },
      });*/

      const result = await fetchTimeline(client, {
        account: evmAddress(user.accountAddress!)
      });

      if (result.isErr()) {
        setError('Failed to load posts.');
        setIsLoading(false);
        return;
      }

      const { items } = result.value;
      const posts = items.filter((item: TimelineItem) => item.__typename === 'TimelineItem' && item.primary?.__typename === 'Post').map((item: TimelineItem) => item.primary);
      console.log(posts)
      setPosts(posts);
      setIsLoading(false);
    };

    if (user.accountAddress) {
      loadPosts();
    }
  }, [user.accountAddress]);

  return (
    <>
        <MediaQuery maxWidth={500}>
            {
                user.username == null ?

                <OnboardingWrapper/>

                :
            <>
            <Navbar/>
            <div className="pt-4 px-4 h-full pb-64">
                {isLoading && (
                    <p className="text-white text-center h-screen items-center">
                        <span className="loading loading-infinity text-warning loading-xl"></span>
                    </p>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}

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
            </>
            }
        </MediaQuery>
        <MediaQuery minWidth={551} maxWidth={9999}>
            <Sidebar/>
        </MediaQuery>
    </>
  );
};

export default HomeFeed;
