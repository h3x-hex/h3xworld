'use client'

import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import BottomNav from '@/components/nav/BottomNav'
import Navbar from '@/components/nav/Navbar'
import MediaQuery from 'react-responsive'
import Sidebar from '../nav/Sidebar'
import { BriefcaseIcon, ChatBubbleOvalLeftEllipsisIcon, CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import RightSidebar from '../nav/RightSidebar'
import { evmAddress } from "@lens-protocol/client";
import { currentSession, fetchAccount, fetchFollowers, fetchFollowing, fetchFollowStatus, follow, unfollow } from "@lens-protocol/client/actions";

import { client } from "../../helper/lensClient";
import { motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import PostsFeed from '../Feed/Post'
import PortfolioGrid from '../Feed/Portfolio'
import H3xclusiveTiers from '../Feed/h3xclusive'
import ShopGrid from '../Feed/Shop'
import LinksGrid from '../Feed/Link'
import BookingTab from '../Feed/Booking'
import About from '../Feed/About'
import ClubsTab from '../Feed/Club'
import ConnectionsModal from '../profile/ConnectionsModal'
import { userAtom } from '@/store/authState'
import { useAtom } from 'jotai'
import EditProfileModal from '../profile/EditProfileModal'

interface SocialLink {
  platform: string;
  url: string;
}

interface Profile {
  name: string | null,
  username: string | undefined;
  profileImage: string | null;
  coverImage: string | null;
  bio: string | null;
  socialLinks: SocialLink[];
  plan: string | null;
  location: string | null;
  occupation: string | null;
  address: string | null;
}

const Profile = () => {
  
  const [profile, setProfile] = useState<Profile>({
    name: '',
    username: '',
    profileImage: null,
    coverImage: null,
    bio: ' ',
    socialLinks: [],
    plan: 'free',
    location: ' ',
    occupation: ' ',
    address: '',
  });

  const tabs = ['Posts', 'Portfolio', 'h3xclusive', 'Shop', 'Links', 'Bookings', 'Clubs', 'About']
  const tabRefs = useRef<Record<string, MutableRefObject<HTMLButtonElement | null>>>({})

  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'posts'
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [following, setFollowing] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);

  const [user] = useAtom(userAtom);

  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [initialConnectionTab, setInitialConnectionTab] = useState<'Followers' | 'Following' | 'Subscriptions' | 'Subscribers'>('Followers');

  const pathname = usePathname();
  const username = pathname.split('/')[1];

  useEffect(() => {

    if (activeTab && tabRefs.current[activeTab]?.current) {
      tabRefs.current[activeTab]?.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
    const fetch = async () => {

      const result = await fetchAccount(client, {
        username: {
          localName: username,
          namespace: evmAddress("0x0c978F29b462762A1b64e10E0c7052353E743a2e"), // the Username namespace address
        },
      });
      
      if (result.isErr()) {
        return console.error(result.error);
      }
      
      const account = result.value;
      console.log(account)
      if(account?.metadata && account.metadata.attributes.length === 8)
      {
        const sLinks = Object.entries(JSON.parse(account?.metadata?.attributes[7].value) as Record<string, string>).map(([platform, url]) => ({ platform, url }))
        setProfile({
          name: account?.metadata?.name,
          username: account?.username?.localName,
          bio: account?.metadata.bio,
          profileImage: account?.metadata?.picture,
          coverImage: account?.metadata?.coverPicture,
          socialLinks: sLinks,
          plan: account?.metadata?.attributes[4].value,
          location: account?.metadata?.attributes[2].value,
          occupation: account?.metadata?.attributes[3].value,
          address: account?.address as string,
        })
      }

      if(user && (user.accountAddress !== account?.address as string))
      {
        const result = await fetchFollowStatus(client, {
          pairs: [
            {
              account: evmAddress(account?.address as string),
              follower: evmAddress(user.accountAddress!),
            },
          ],
        });
        
        if (result.isErr()) {
          return console.error(result.error);
        }
        
        // status: Array<FollowStatus>: [{graph: "0x1234", follower: "0x1234", account: "0x1234", isFollowing: {...}}, …]
        const status = result.value;
        console.log(status, account?.address, user.accountAddress, account?.operations?.isFollowedByMe);
        setFollowing(status[0].isFollowing.onChain)
      }

      const resumed = await client.resumeSession();
              
      if (resumed.isErr()) {
        return console.error(resumed.error);
      }
      
      // SessionClient: { ... }
      const sessionClient = resumed.value;
      console.log(sessionClient.getAuthenticatedUser())
      
      const result2 = await fetchFollowers(client, {
        account: evmAddress(account?.address),
      });

      if (result2.isErr()) {
        return console.error(result2.error);
      }

      // items: Array<Follower>: [{follower: Account, followedOn: DateTime}, …]
      setFollowersCount(result2.value.items.filter((item) => item.follower.metadata !== null).length);

      const result3 = await fetchFollowing(client, {
        account: evmAddress(account?.address),
      });
      
      if (result3.isErr()) {
        return console.error(result3.error);
      }
      
      // items: Array<Following>: [{following: Account, followedOn: DateTime}, …]
      setFollowingCount(result3.value.items.filter((item) => item.following.metadata !== null).length);
    }

    

    fetch();

  }, [activeTab, user, following])

  const followUser = async () => {

    if(!profile) return;

    if(!following)
    {
      const resumed = await client.resumeSession();
      if (resumed.isErr()) return console.error(resumed.error);

      const sessionClient = resumed.value;

      

      const result = await follow(sessionClient, { account: evmAddress(profile.address!) });
      console.log(result)
      setFollowing(true);
    }
    else
    {
      const resumed = await client.resumeSession();
      if (resumed.isErr()) return console.error(resumed.error);

      const sessionClient = resumed.value;

      const result = await unfollow(sessionClient, { account: evmAddress(profile.address!) });
      console.log(result)
      setFollowing(false);
    }

  }

  const subscribeToUser = async () => {

    setActiveTab('h3xclusive')
    setSubscribe(false);

  }

  return (
    <div className='bg-stone-950 h-full sm:h-screen'>
        <MediaQuery maxWidth={500}>
            <Navbar/>
            <div className='flex flex-col h-full'>
              <div className="relative w-full">
                {/* Cover Image */}
                <img
                  src={profile.coverImage || '/default-cover.jpg'}
                  alt="Cover"
                  className="w-full h-36 object-cover"
                />

                {/* Profile Image - half overlapping */}
                <div className="absolute left-6 -bottom-12">
                  <div className="w-24 h-24 rounded-full border-4 border-stone-950 overflow-hidden">
                    <img src={profile.profileImage || '/logo.png'} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div className="h-12" /> {/* Spacer to compensate for overlap */}
              <div className='pt-3 px-6 flex flex-col'>
                <p className='text-white text-2xl font-bold'>{profile.name}</p>
                <p className='text-gray-300 text-md'>@{profile.username}</p> 
                <p className='text-white pt-2'>{profile.bio}</p>
              </div>
              <div className='flex flex-row gap-8 py-2 px-6'>
                <div className='flex flex-row text-white gap-1'><BriefcaseIcon color='#F0B100' width={24}/> {profile.occupation}</div>
                <div className='flex flex-row text-white pl-2'><MapPinIcon color='#F0B100' width={24}/> {profile.location}</div>
              </div>
              <div className='flex flex-row w-full py-2 px-6'>
                <div className='flex flex-col text-white w-1/3' onClick={() => {setInitialConnectionTab('Following'); setModalOpen(true)}}><p className='font-bold'>{followingCount}</p><p>Following</p></div>
                <div className='flex flex-col text-white w-1/3' onClick={() => {setInitialConnectionTab('Followers'); setModalOpen(true)}}><p className='font-bold'>{followersCount}</p><p>Followers</p></div>
                <div className='flex flex-col text-white w-1/3' onClick={() => {setInitialConnectionTab('Subscribers'); setModalOpen(true)}}><p className='font-bold'>{subscribersCount}</p><p>Subscribers</p></div>
              </div>
              {
                user.username === profile.username ?

                <div className='w-full flex'>
                  <button className='btn bg-yellow-500 text-black w-[96%] rounded-lg border-yellow-500 shadow-none font-semibold mx-auto' onClick={() => setIsModalOpen(true)}>Edit Profile</button>
                </div>
                :
                <div className='flex flex-row w-full gap-3 pt-3 px-5'>
                  <button className={`btn ${following ? 'btn-outline bg-transparent border-yellow-500 shadow-none w-[33%] rounded-full text-white' : 'bg-yellow-500 text-black w-[33%] rounded-full border-yellow-500 shadow-none font-semibold'}`} onClick={() => followUser()}>{following? <span>Unfollow</span> : <span>Follow</span>}</button>
                  <button className={`btn ${subscribe ? 'btn-outline bg-transparent border-yellow-500 shadow-none w-[33%] rounded-full text-white' : 'bg-yellow-500 text-black w-[33%] rounded-full border-yellow-500 shadow-none font-semibold'}`} onClick={() => subscribeToUser()}>{subscribe ? <span>Unsubscribe</span> : <span>Subscribe</span>}</button>
                  <div className='flex flex-row w-[33%] gap-5 pl-2'>
                    <ChatBubbleOvalLeftEllipsisIcon color='white' width={48} className='size-10 cursor-pointer'/>
                    <CurrencyDollarIcon color='white' width={48} className='size-10 cursor-pointer'/>
                  </div>
                </div>
              }
              
              <div className=" w-full px-2 mt-3 pt-3 pb-1 border-t-[1px] border-gray-600 h-full">
                <div className="relative flex space-x-6 text-white text-sm font-medium whitespace-nowrap overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => {
                  if (!tabRefs.current[tab.toLowerCase()]) {
                    tabRefs.current[tab.toLowerCase()] = { current: null }
                  }

                  return (
                    <button
                      key={tab.toLowerCase()}
                      ref={(el) => {
                        tabRefs.current[tab.toLowerCase()].current = el
                      }}
                      onClick={() => {setActiveTab(tab.toLowerCase()); router.push(`/${username}?tab=${tab.toLowerCase()}`)}}
                      className={`pb-2 px-1 transition-colors duration-200 cursor-pointer ${activeTab === tab.toLowerCase() ? 'text-yellow-500' : ''}`}
                    >
                      {tab}
                      {activeTab === tab.toLowerCase() && (
                        <motion.div
                          layoutId="underline"
                          className="h-[2px] bg-yellow-500 rounded-full mt-1"
                          style={{
                            width: tabRefs.current[tab.toLowerCase()].current?.offsetWidth || '100%',
                          }}
                        />
                      )}
                    </button>
                  )
                })}
                </div>
              </div>
              {
                profile.address ?
                (
                  <div className='pb-32'>
                  {
                    activeTab === 'posts' ?

                    <PostsFeed address={profile.address}/>
                    :

                    activeTab === 'portfolio' ?

                    <PortfolioGrid address={profile.address}/>
                    :

                    activeTab === 'h3xclusive' ?

                    <H3xclusiveTiers address={profile.address}/>
                    :

                    activeTab === 'shop' ?

                    <ShopGrid address={profile.address}/>
                    :

                    activeTab === 'links' ?

                    <LinksGrid address={profile.address}/>
                    
                    :

                    activeTab === 'bookings' ?

                    <div className='pt-8'>
                      <BookingTab address={profile.address}/>
                    </div>
                    
                    :

                    activeTab === 'about' ?

                    <About address={profile.address}/>
                    :

                    activeTab === 'clubs' ?

                    <ClubsTab address={profile.address}/>
                    :

                    <></>
                  }
                  </div>
                )
                :
                <div className='h-screen bg-stone-950'>

                </div>
              }
            </div>
            <ConnectionsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialTab={initialConnectionTab}/>
            <BottomNav/>
        </MediaQuery>
        <MediaQuery minWidth={551} maxWidth={99999}>
            <Sidebar/>
            <div className="pl-72 pr-96">
              <div className='flex flex-col mx-auto border-r-[1px] border-gray-600 bg-stone-950 '>
                <div className="relative w-full">
                  {/* Cover Image */}
                  <img
                    src={profile.coverImage || '/default-cover.jpg'}
                    alt="Cover"
                    className="w-full h-96 object-cover mx-auto"
                  />

                  {/* Profile Image - half overlapping */}
                  <div className="absolute left-6 -bottom-16">
                    <div className="w-36 h-36 rounded-full border-4 border-stone-950 overflow-hidden">
                      <img src={profile.profileImage || '/logo.png'} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <div className="h-20" /> {/* Spacer to compensate for overlap */}
                <div className='pt-3 px-6 flex flex-col'>
                  <p className='text-white text-2xl font-bold'>{profile.name}</p>
                  <p className='text-gray-300 text-md'>@{profile.username}</p> 
                  <p className='text-white pt-2'>{profile.bio}</p>
                </div>
                <div className='flex flex-row gap-8 py-2 px-6'>
                  <div className='flex flex-row text-white gap-1'><BriefcaseIcon color='#F0B100' width={24}/> {profile.occupation}</div>
                  <div className='flex flex-row text-white pl-2'><MapPinIcon color='#F0B100' width={24}/> {profile.location}</div>
                </div>
                <div className='flex flex-row w-full py-2 px-6'>
                  <div className='flex flex-col text-white w-1/3'><p className='font-bold'>369</p><p>Following</p></div>
                  <div className='flex flex-col text-white w-1/3'><p className='font-bold'>888</p><p>Followers</p></div>
                  <div className='flex flex-col text-white w-1/3'><p className='font-bold'>420</p><p>Subscribers</p></div>
                </div>
                <div className='flex flex-row w-full gap-3 pt-3 px-5'>
                  <button className='btn btn-outline hover:bg-yellow-500 hover:text-black border-yellow-500 shadow-none w-[33%] rounded-full text-white'>Follow</button>
                  <button className='btn btn-outline hover:bg-yellow-500 hover:text-black border-yellow-500 shadow-none w-[33%] rounded-full text-white'>Subscribe</button>
                  <div className='flex flex-row w-[33%] gap-5 pl-2'>
                    <ChatBubbleOvalLeftEllipsisIcon color='white' width={48} className='size-10 cursor-pointer hover:text-yellow-500'/>
                    <CurrencyDollarIcon color='white' width={48} className='size-10 cursor-pointer hover:text-yellow-500'/>
                  </div>
                </div>
                <div className="overflow-x-auto w-full px-2 mt-3 pt-3 pb-1 border-t-[1px] border-gray-600">
                  <div className="relative flex space-x-6 text-white sm:space-x-12 sm:text-lg text-sm font-medium whitespace-nowrap">
                    {tabs.map((tab) => {
                      if (!tabRefs.current[tab]) {
                        tabRefs.current[tab] = { current: null }
                      }

                      return (
                        <button
                          key={tab}
                          ref={(el) => {
                            tabRefs.current[tab].current = el
                          }}
                          onClick={() => {setActiveTab(tab); router.push(`/${username}?tab=${tab}`)}}
                          className={`pb-2 px-1 transition-colors duration-200 ${activeTab === tab ? 'text-yellow-500' : ''}`}
                        >
                          {tab}
                          {activeTab === tab && (
                            <motion.div
                              layoutId="underline"
                              className="h-[2px] bg-yellow-500 rounded-full mt-1"
                              style={{
                                width: tabRefs.current[tab].current?.offsetWidth || '100%',
                              }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            <RightSidebar/>
        </MediaQuery>

        {isModalOpen && (
          <EditProfileModal
            onClose={() => setIsModalOpen(false)}
            onSave={(data) => {
              console.log('Saved:', data)
            }}
          />
        )}
    </div>
  )
}

export default Profile