'use client'

import React from 'react'
import { HomeIcon, MagnifyingGlassIcon, BellIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeSolidIcon, MagnifyingGlassIcon as MagnifyingGlassSolidIcon, } from '@heroicons/react/24/solid'
import useNavigation from '@/hooks/useNavigation';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/authState';

const BottomNav = () => {

    //const scrollDirection = useScrollingEffect(); // Use the custom hook
    //const navClass = scrollDirection === 'up' ? '' : 'opacity-25 duration-500';
    const router = useRouter();

    const [user] = useAtom(userAtom);

    const {
        isHomeActive,
        isExploreActive,
        isNotificationsActive,
        isProfileActive,
    } = useNavigation();

    return (
        <div className="fixed bottom-0 flex flex-row w-full bg-stone-950/70 text-neutral-content py-3 border-t-[0.3px] border-gray-600">
            <button className='w-1/5 pl-6'>
                {
                    !isHomeActive ?

                    <HomeIcon width={28} onClick={() => router.push('/home')}/>
                     
                    :

                    <HomeSolidIcon width={28} color='#F0B100'/>
                }
            </button>
            
            <button className='w-1/5 pl-6'>
            {
                !isExploreActive ?

                <MagnifyingGlassIcon width={28} onClick={() => router.push('/explore')}/>

                :

                <MagnifyingGlassSolidIcon width={28} color='#F0B100'/>

            }
                
            </button>

            <button className='rounded-full bg-yellow-500 btn btn-warning w-1/5'>
                <PlusIcon width={24} color='black' className='text-black' onClick={() => router.push('/create')}/>
            </button>

            <button className='w-1/5 pl-8'>
            {   
                !isNotificationsActive ?

                <BellIcon width={28} onClick={() => router.push('/notifications')}/>
                :
                <BellIcon width={28} color='#F0B100'/>

            }
            </button>

            <button className='w-1/5 pl-6'>
            {
                !isProfileActive ?

                <UserIcon width={28} onClick={() => router.push(`/${user.username}`)}/>
                :
                <UserIcon width={28} color='#F0B100'/>
            }
            </button>
        </div>
    )
}

export default BottomNav