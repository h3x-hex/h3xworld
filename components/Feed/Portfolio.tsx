'use client'

import { client } from '@/helper/lensClient'
import { evmAddress, Post } from '@lens-protocol/client'
import { fetchPosts } from '@lens-protocol/client/actions'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface PostsFeedProps {
  address: string;
}

const PortfolioGrid = ({address}: PostsFeedProps) => {

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()
  
  const [portfolioCollectionList, setPortfolioCollectionList] = useState<Post[]>([]);

  const fetchPortfolioCollections = async () => {
    setIsLoading(true);
    const result = await fetchPosts(client, {
      filter: {
        authors: [evmAddress(address)],
        feeds: [
          {
            feed: evmAddress("0xf7B7F7Faa314d4496bc7EBF2884A03802cEFF7a1"),
          }
        ],
      },
    });
  
    if (result.isErr()) {
      return console.error(result.error);
    }
  
    const { items } = result.value;
    const postArr = items.filter((item) => item.__typename === 'Post') as Post[];
    setPortfolioCollectionList(postArr);
    console.log(postArr)
    setIsLoading(false);
  };

  useEffect(() => {
    
    fetchPortfolioCollections();
  
    }, [])

  return (
    <>
    <div className="bg-stone-950 min-h-screen text-white p-4">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">Portfolio</h2>
      {
        isLoading ?

        <div className='h-full pb-64 bg-stone-950 mx-auto flex items-center justify-center pt-32'><span className="loading loading-infinity text-warning text-lg"></span></div>

        :

        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {portfolioCollectionList.filter((item) => item.__typename === 'Post').map((item) => (
            (
              item.metadata.__typename === 'ImageMetadata' ? (
                <div key={item.id} className="bg-stone-900 rounded-lg overflow-hidden shadow-md" onClick={() => router.push(`/portfolio/${item.id}?fromTab=Portfolio`)}>
                  <img
                    src={item.metadata.image.item}
                    alt={item.metadata.title!}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-white">{item.metadata.title}</h3>
                  </div>
                </div>
              )
              :
              <></>
            )
          ))}
        </div>

      }
    </div>

    </>
  )
}

export default PortfolioGrid
