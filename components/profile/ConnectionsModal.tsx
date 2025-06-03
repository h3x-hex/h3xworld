// components/Modal.tsx
'use client'

import { client } from '@/helper/lensClient'
import { userAtom } from '@/store/authState'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { evmAddress, Follower, Following } from '@lens-protocol/client'
import { fetchFollowers, fetchFollowing } from '@lens-protocol/client/actions'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab: string
}

const ConnectionsModal: React.FC<ModalProps> = ({ isOpen, onClose, initialTab }) => {

    const [user] = useAtom(userAtom);
    
    const [activeTab, setActiveTab] = useState(initialTab)
    const tabs = ['Followers', 'Following', 'Subscribers', 'Subscriptions']
    
    const [following, setFollowing] = useState<Following[]>([]);
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [subcription, setSubscription] = useState<Following[]>([]);
    const [subscribers, setSubscribers] = useState<Follower[]>([]);

    useEffect(() => {

      if(!user) return;

      const getFollowing = async () => {

        const result = await fetchFollowing(client, {
          account: evmAddress(user.accountAddress!),
        });
        
        if (result.isErr()) {
          return console.error(result.error);
        }
        
        // items: Array<Following>: [{following: Account, followedOn: DateTime}, …]
        const { items } = result.value;
        setFollowing([...items])
        console.log(following)
      }

      const getFollowers = async () => {

        const result = await fetchFollowers(client, {
          account: evmAddress(user.accountAddress!),
        });
        
        if (result.isErr()) {
          return console.error(result.error);
        }
        
        // items: Array<Following>: [{following: Account, followedOn: DateTime}, …]
        const { items } = result.value;
        setFollowers([...items])
        console.log(followers)
      }

      const getSubscribers = async () => {

        
        setSubscribers([])

      }

      const getSubscriptions = async () => {

        
        setSubscription([])
        
      }

      if(activeTab === 'Followers') getFollowers();
      if(activeTab === 'Following') getFollowing();
      if(activeTab === 'Subscribers') getSubscribers();
      if(activeTab === 'Subscriptions') getSubscriptions();

    }, [activeTab])
    

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="bg-stone-900 rounded-xl w-full max-w-md h-[90vh] overflow-y-auto p-4"
                onClick={(e) => e.stopPropagation()} // prevent modal from closing when clicking inside
            >

                <div className="flex items-center px-4 py-3 border-b border-stone-700">
                    <ArrowLeftIcon className="h-5 w-5 text-white mr-4" onClick={onClose}/>
                    <div>
                    <p className="text-lg text-gray-100">{user.username}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-between border-b border-stone-700 text-center text-sm pt-3">
                    {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 ${
                        activeTab === tab
                            ? 'border-b-2 border-yellow-500 text-yellow-500 font-semibold'
                            : 'text-gray-400'
                        }`}
                    >
                        {tab}
                    </button>
                    ))}
                </div>

                {/* Search */}
                <div className="px-4 py-2">
                    <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-stone-900 text-white border border-stone-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
                    />
                </div>

                {/* List */}
                <div className="px-4 space-y-4 pb-16">
                    <h3 className="text-sm text-gray-300 font-semibold mb-2">All {activeTab}</h3>
                    {
                      activeTab === 'Followers' ?

                      followers.map((_, i) => (
                        <UserRow key={i} name={`User ${i + 1}`} username={`username${i}`} tab={activeTab} />
                      ))

                      :

                      activeTab === 'Following' ?

                      following.map((_, i) => (
                        <UserRow key={i} name={`User ${i + 1}`} username={`username${i}`} tab={activeTab} />
                      ))

                      :

                      activeTab === 'Subscribers' ?

                      subscribers.map((_, i) => (
                        <UserRow key={i} name={`User ${i + 1}`} username={`username${i}`} tab={activeTab} />
                      ))

                      :

                      activeTab === 'Subscriptions' ?

                      subcription.map((_, i) => (
                        <UserRow key={i} name={`User ${i + 1}`} username={`username${i}`} tab={activeTab} />
                      ))

                      :

                      <></>
                    }
                </div>
                
            </div>
        </div>
    )
}

const UserRow = ({
    name,
    username,
    tab,
  }: {
    name: string
    username: string
    tab: string
  }) => (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 bg-stone-800 rounded-full" />
        <div className=''>
          <p className="text-md text-gray-100">{username}</p>
          <p className="text-sm text-gray-400">{name}</p>
        </div>
      </div>
      {tab === 'Followers' ? (
        <button className="text-blue-500 text-sm bg-blue-500/10 px-3 py-1 rounded-md">Follow back</button>
      ) : (
        <button className="text-sm border border-stone-600 px-3 py-1 rounded-md text-white">Message</button>
      )}
    </div>
  )

export default ConnectionsModal
