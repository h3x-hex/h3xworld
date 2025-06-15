'use client'

import { client } from '@/helper/lensClient'
import { evmAddress, Post } from '@lens-protocol/client'
import { fetchPosts } from '@lens-protocol/client/actions'
import React, { useEffect, useState } from 'react'

interface PostsFeedProps {
  address: string;
}

const LinksGrid = ({address}: PostsFeedProps) => {

  const [linkList, setLinkList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {

    const fetchLinks = async () => {
      setIsLoading(true);
      console.log(isLoading)
      const result = await fetchPosts(client, {
        filter: {
          authors: [evmAddress(address)],
          feeds: [
            {
              feed: evmAddress("0xd87f4E0337eDBBa6c3AfB6955a9e46Ce9Dcc9450"),
            }
          ],
        },
      });
    
      if (result.isErr()) {
        return console.error(result.error);
      }
    
      const { items } = result.value;
      console.log(items)
      setLinkList([...items] as Post[]);
      setIsLoading(false);
  
    };
        
    fetchLinks();
    
  }, [address])

  return (
    <div className="bg-black min-h-screen text-white p-5">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Links</h2>

      <div className="flex flex-col gap-4">
        {linkList.map((link) => (
          link.metadata.__typename === 'LinkMetadata' &&

          <>
          
          </>
          
        ))}
      </div>
    </div>
  )
}

export default LinksGrid
