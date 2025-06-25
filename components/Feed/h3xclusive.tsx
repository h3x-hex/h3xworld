'use client'

import { client } from '@/helper/lensClient'
import { AnyPost, evmAddress } from '@lens-protocol/client'
import { fetchPosts } from '@lens-protocol/client/actions'
import React, { useEffect, useState } from 'react'

interface PostsFeedProps {
  address: string;
}

//If not subscribed show tiers and Unlock h3xclusive access. If subscribed show 2 tabs posts and tiers.

const H3xclusiveTiers = ({address}: PostsFeedProps) => {

  const [tierList, setTierList] = useState<AnyPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchTiers = async () => {
    setIsLoading(true);

    const result = await fetchPosts(client, {
      filter: {
        authors: [evmAddress(address)],
        feeds: [
          {
            feed: evmAddress("0x74F9f2Fa4fe6c15284a911245957d06AC33EaB2F"),
          }
        ],
      },
    });
  
    if (result.isErr()) {
      return console.error(result.error);
    }
  
    const { items } = result.value;
    console.log(items)
    setTierList([...items]);
    setIsLoading(false);

  };

  useEffect(() => {
      
      fetchTiers();
    
  }, [])
  
  
  return (
    <>
    <div className="bg-black min-h-screen text-white p-5">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">h3xclusive</h2>
      <div className='flex flex-row mx-auto justify-center pb-3'>  
        <button className="btn btn-warning btn-outline w-24">Posts</button>
        <button className="btn btn-warning btn-outline w-24">Tiers</button>
      </div>
      {
        isLoading ?

          <div className='h-full pb-64 bg-stone-950 mx-auto flex items-center justify-center pt-32'><span className="loading loading-spinner text-warning text-lg"></span></div>

        :

          <div className="grid gap-6 sm:grid-cols-2 w-[90%] mx-auto">
            {tierList.filter((tier) => tier.__typename === 'Post').map((tier) => (
              tier.metadata.__typename === 'ImageMetadata' &&
              <div key={tier.id} className="bg-stone-900 border border-yellow-500 rounded-lg p-5 shadow-md text-center">
                <img
                  src={tier.metadata.image.item ? tier.metadata.image.item : '/defaultCover.png'}
                  alt={`${tier.metadata.title} thumbnail`}
                  className="w-full h-40 object-cover rounded-md mb-4 border border-yellow-400"
                />
                <h3 className="text-xl font-semibold text-white mb-1">{tier.metadata.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{tier.metadata.attributes[0].value}</p>
                <p className="text-yellow-500 font-bold mb-3">${tier.metadata.attributes[1].value}/month</p>
                <ul className="text-sm text-white list-disc pl-5 mb-4 space-y-1">
                  
                </ul>
                <button
                  className="w-full py-2 rounded-lg bg-yellow-500 text-black font-semibold hover:bg-yellow-400"
                >
                  {'Unlock Tier'}
                </button>
              </div>
            ))}
          </div>
      }
    </div>

  </>
  )
}

export default H3xclusiveTiers
