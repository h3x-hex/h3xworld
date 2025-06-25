'use client'

import { client } from '@/helper/lensClient'
import { evmAddress, Post } from '@lens-protocol/client'
import { fetchPosts } from '@lens-protocol/client/actions'
import React, { useEffect, useState } from 'react'
import PostCard from '../posts/PostCard'

interface PostsFeedProps {
  address: string;
}

const PostsFeed = ({address}: PostsFeedProps) => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {

      const resumed = await client.resumeSession();
      if (resumed.isErr()) return console.error(resumed.error);

      const sessionClient = resumed.value;
      console.log(sessionClient, isLoading, error)
      setIsLoading(true);
      setError(null);

      const result = await fetchPosts(sessionClient, {
        filter: {
          authors: [evmAddress(address)],
          feeds: [
            {
              feed: evmAddress("0x63c3579756B353D26876A9A5A6f563165C320b7f"),
            }
          ],
        },
      });

      if (result.isErr()) {
        setError('Failed to load posts.');
        setIsLoading(false);
        return;
      }

      const { items } = result.value;
      console.log('Returned items:', items.map(i => i.__typename));
      const postArr = items.filter((item) => item.__typename === 'Post' && item.commentOn == null) as Post[];
      console.log(postArr)
      setPosts(postArr)
      setIsLoading(false);
    };

    loadPosts();
    
  }, []);

  return (
    <div className="bg-black min-h-screen text-white px-3">
      {posts && posts.map((post) => (
        <PostCard key={post.id} postItem={post}/>
      ))}
    </div>
  )
}

export default PostsFeed
