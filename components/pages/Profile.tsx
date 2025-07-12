'use client'

import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { BriefcaseIcon, ChatBubbleOvalLeftEllipsisIcon, CurrencyDollarIcon, EllipsisHorizontalCircleIcon, MapPinIcon } from '@heroicons/react/24/outline'
import PostsFeed from '../Feed/Post'
import PortfolioGrid from '../Feed/Portfolio'
import H3xclusiveTiers from '../Feed/h3xclusive'
import ShopGrid from '../Feed/Shop'
import LinksGrid from '../Feed/Link'
import BookingTab from '../Feed/Booking'
import About from '../Feed/About'
import ClubsTab from '../Feed/Club'
import { evmAddress } from "@lens-protocol/client";
import { fetchAccount, fetchFollowers, fetchFollowing, fetchFollowStatus } from "@lens-protocol/client/actions";
import { client } from "../../helper/lensClient";
import { motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  PresentationChartBarIcon,
  UserIcon,
  BellIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { userAtom } from '@/store/authState'
import { useAtom } from 'jotai'
import TippingModal from '../modals/TippingModal'
import MessageOptionModal from '../modals/MessageOptionModal'
import useNavigation from '@/hooks/useNavigation'
import Navbar from '../nav/Navbar'
import SearchBar from '../nav/SearchBar'

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
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

  const tabs = ['home', 'posts', 'portfolio', 'shop', 'gigs', 'h3xclusive', 'links', 'about']
  const tabRefs = useRef<Record<string, MutableRefObject<HTMLButtonElement | null>>>({})

  const [isTippingModalOpen, setIsTippingModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)

  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'home'
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [following, setFollowing] = useState(false);

  const [, setFollowingCount] = useState(0);
  const [, setFollowersCount] = useState(0);
  const [, setSubscribersCount] = useState(0);

  const [, setSidebarExpanded] = useState(true);

  const [user] = useAtom(userAtom);

  const router = useRouter();

  const {
    isHomeActive,
    isExploreActive,
    isNotificationsActive,
    isProfileActive,
    isChatActive,
    isDashboardActive,
  } = useNavigation();

  const pathname = usePathname();
  const username = pathname.split('/')[1];

  const [words, setWords] = useState([""]);
  const splitIndex = Math.floor(words.length * 0.65); // tweak ratio to balance lines

  const handleTip = (amount: number) => {
    console.log(`Tipped: ${amount}`)
    // You can integrate your tipping logic here
  }

  useEffect(() => {

    if (activeTab && tabRefs.current[activeTab]?.current) {
      tabRefs.current[activeTab]?.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }

    setSubscribersCount(0);
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
      if(account?.metadata && account.metadata.attributes.length === 7)
      {
        const sLinks = Object.entries(JSON.parse(account?.metadata?.attributes[6].value) as Record<string, string>).map(([platform, url]) => ({ platform, url }))
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

        setWords(account?.metadata.bio!.split(""));
        console.log(account?.metadata.bio!.split("").slice(0, splitIndex).join(""))
      }

      if(user && (user.accountAddress !== account?.address as string))
      {
        const result = await fetchFollowStatus(client, {
          pairs: [
            {
              account: evmAddress(account?.address as string),
              follower: evmAddress(user.accountAddress! as string),
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

    const handleResize = () => {
      setSidebarExpanded(window.innerWidth > 1280);
    };

    fetch();

    handleResize(); // initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [activeTab, user, following])

  const navigation1 = [
    { name: 'Home', href: '/home', icon: HomeIcon, current: isHomeActive },
    { name: 'Explore', href: '/explore', icon: MagnifyingGlassIcon, current: isExploreActive },
    { name: 'Notifications', href: '/notifications', icon: BellIcon, current: isNotificationsActive },
    { name: 'Chats', href: '/chats', icon: ChatBubbleOvalLeftEllipsisIcon, current: isChatActive },
    { name: 'Profile', href: `/${user.username}`, icon: UserIcon, current: isProfileActive },
    { name: 'Dashboard', href: '/dashboard', icon: PresentationChartBarIcon, current: isDashboardActive },
  ]

  return (
    <div className="overflow-y-auto flex flex-col sm:flex-row bg-stone-950 mx-auto h-screen w-screen">
      {/*<Navbar/>*/}
      <Navbar/>
      <div className='bg-stone-950 flex flex-row'>
      {/* Left Sidebar */}
      <div className={`hidden sm:flex h-screen fixed inset-y-0 z-0 flex-col max-w-[20vw] ml-[8vw]`}>
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-stone-950 px-6 border-r-[1px] border-gray-600">
          <div className="flex h-16 w-16 shrink-0 items-center">
            <img
              alt="Your Company"
              src="/logo.png"
              width={48}
              className=""
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li className=''>
                <ul role="list" className="space-y-3">
                  {navigation1.map((item) => (
                    <li key={item.name}>
                      <div
                        className={classNames(
                          item.current
                            ? 'bg-stone-900 text-yellow-500'
                            : 'text-gray-300 hover:bg-stone-900 hover:text-yellow-500',
                          'group flex gap-x-3 rounded-full p-2 text-lg font-semibold cursor-pointer',
                        )}
                        onClick={() => router.push(item.href)}
                      >
                        <item.icon aria-hidden="true" className="size-7 shrink-0" />
                        {item.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
              <li className=''>
                <button className='btn btn-outline border-yellow-500 rounded-full text-yellow-500 hover:bg-yellow-500 hover:text-black w-[16vw] h-10 shadow-none' onClick={() => router.push('/create')}>Create</button>
              </li>
              <li className="-mx-6 mt-auto">
                <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-stone-900 border-t-[1px] border-gray-600">
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-800"
                  />
                  <span className="sr-only">Your profile</span>
                  <p className=''>{user.username}</p>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full sm:max-w-[44vw] mx-auto overflow-y-auto overflow-y-scroll sm:ml-[27.3vw]">
        {/* Profile Header + Feed */}
          <div className='flex flex-col mx-auto bg-stone-950'>
            <div className="relative w-full">
              {/* Cover Image */}
              <img
                src={profile.coverImage || '/default-cover.jpg'}
                alt="Cover"
                className="w-full h-72 object-cover mx-auto"
              />

              {/* Profile Image - half overlapping */}
              <div className="absolute inset-x-0 -bottom-16 flex justify-center">
                <div className="w-36 h-36 rounded-full border-4 border-stone-950 overflow-hidden">
                  <img src={profile.profileImage || '/logo.png'} alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="h-20" /> {/* Spacer to compensate for overlap */}
            <div className='pt-3 px-6 flex flex-col'>
              <p className='text-white text-2xl font-bold text-center'>{profile.name}</p>
              <p className='text-gray-300 text-md text-center'>@{profile.username}</p> 
              <p className='text-white pt-2 text-center'>{profile.bio}</p>
            </div>
            <div className='flex flex-row gap-8 py-2 px-6 mx-auto'>
              <div className='flex flex-row text-white gap-1'><BriefcaseIcon color='#F0B100' width={24}/> {profile.occupation}</div>
              <div className='flex flex-row text-white pl-2'><MapPinIcon color='#F0B100' width={24}/> {profile.location}</div>
            </div>
            <div className='flex flex-row py-2 px-6 gap-3'>
              <div className='flex flex-col text-white w-1/3 text-center'><p className='font-bold'>369</p><p>Following</p></div>
              <div className='flex flex-col text-white w-1/3 text-center'><p className='font-bold'>888</p><p>Followers</p></div>
              <div className='flex flex-col text-white w-1/3 text-center'><p className='font-bold'>420</p><p>Subscribers</p></div>
            </div>
            <div className='flex flex-row w-[95%] gap-3 sm:gap-[1vw] pt-3 pl-[2vw] justify-center items-center mx-auto'>
              <button className='btn btn-outline hover:bg-yellow-500 hover:text-black border-yellow-500 shadow-none w-[33%] rounded-full text-white hover:scale-105'>Follow</button>
              <button className='btn btn-outline hover:bg-yellow-500 hover:text-black border-yellow-500 shadow-none w-[33%] rounded-full text-white hover:scale-105'>Subscribe</button>
              <div className='flex flex-row w-[33%] gap-1 sm:gap-3 pr-2'>
                <ChatBubbleOvalLeftEllipsisIcon color='white' width={48} className='size-10 cursor-pointer hover:text-yellow-500 hover:scale-105' onClick={() => setIsMessageModalOpen(true)}/>
                <CurrencyDollarIcon color='white' width={48} className='size-10 cursor-pointer hover:text-yellow-500 hover:scale-105' onClick={() => setIsTippingModalOpen(true)}/>
                <EllipsisHorizontalCircleIcon  color='white' width={48} className='size-10 cursor-pointer hover:text-yellow-500 hover:scale-105' onClick={() => setIsTippingModalOpen(true)}/>
              </div>
            </div>
            <div className="overflow-x-auto border-b border-gray-700 pt-3">
              <div className="flex space-x-4 sm:space-x-6 text-white whitespace-nowrap text-md tracking-wide pl-2">
                {tabs.map((tab) => {
                  
                  if (!tabRefs.current[tab]) {
                    tabRefs.current[tab] = { current: null }
                  }

                  const label = tab === 'h3xclusive' ? tab : tab.charAt(0).toUpperCase() + tab.slice(1)

                  return (
                    <button
                      key={tab}
                      ref={(el) => {
                        tabRefs.current[tab].current = el
                      }}
                      onClick={() => {setActiveTab(tab); router.push(`/${username}?tab=${tab}`)}}
                      className={`pb-2 px-1 transition-colors duration-200 ${activeTab === tab ? 'text-yellow-500' : ''}`}
                    >
                      {label}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="underline"
                          className="h-[2px] bg-yellow-500 rounded-full mt-1"
                          style={{
                            width: '100%',
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

                    activeTab === 'gigs' ?
                    <div className='pt-3'>
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
      </main>

      {/* Right Sidebar */}
      <div className="hidden sm:flex sm:w-[24vw] border-l-1 border-gray-700 bg-stone-950 sm:mr-[1vw]">
        <div className='flex w-[80%] mx-auto mt-3'>
          <SearchBar/>
        </div>
      </div>

      <MessageOptionModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
        />
        <TippingModal
          isOpen={isTippingModalOpen}
          onClose={() => setIsTippingModalOpen(false)}
          onTip={handleTip}
        />
        </div>
    </div>
    
  )
}

export default Profile
