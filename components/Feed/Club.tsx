'use client'

import { client } from '@/helper/lensClient'
import { evmAddress, Group } from '@lens-protocol/client'
import { fetchGroupMembers, fetchGroups } from '@lens-protocol/client/actions'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface PostsFeedProps {
  address: string;
}

const ClubsTab = ({address}: PostsFeedProps) => {

  const [clubList, setClubList] = useState<Group[]>([]);
  const [clubMemberCount, setClubMemberCount] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  
  const fetchClubs = async () => {
    setIsLoading(true);

    const result = await fetchGroups(client, {
      filter: {
        managedBy: {
          address: evmAddress(address),
        },
      },
    });
  
    if (result.isErr()) {
      return console.error(result.error);
    }
  
    const { items, pageInfo } = result.value;
    console.log('Updated clubs:', items, pageInfo);
    for (const group of items) {
      const result = await fetchGroupMembers(client, {
        group: evmAddress(group.address),
      });

      if (result.isErr()) {
        return console.error(result.error);
      }

      // items: Array<GroupMember>: [{account: Account, joinedAt: DateTime, lastActiveAt: DateTime}, …]
      const { items } = result.value;
      const members = clubMemberCount
      members.push(items.length)
      setClubMemberCount(members)
    };
    setClubList([...items]);
    setIsLoading(false);

  };

  useEffect(() => {
        
    fetchClubs();
    
  }, [])


  return (
    <div className="bg-black text-white p-5 h-full pb-32">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Your Clubs</h2>

      {clubList.length === 0 && !isLoading? (
        <p className="text-gray-400">You haven’t created any clubs yet.</p>
      ) 
      : isLoading ? <div className='h-full pb-64 bg-stone-950 mx-auto flex items-center justify-center pt-32'><span className="loading loading-infinity text-warning text-xl"></span></div>
      : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
          {clubList.filter((club) => club.__typename === 'Group').map((club, index) => (
            <div key={club.metadata?.id} className="bg-stone-900 border border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition" onClick={() => router.push(`/club/${club.metadata?.id}`)}>
              <img src={club.metadata?.icon} alt={club.metadata?.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold text-white">{club.metadata?.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{club.metadata?.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-500 text-sm font-semibold">{clubMemberCount[index]} Members</span>
                  <button className="bg-yellow-500 text-black font-bold px-3 py-1 text-sm rounded hover:bg-yellow-400">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClubsTab
