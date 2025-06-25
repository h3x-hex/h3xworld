import React from 'react'
import { ChatBubbleOvalLeftEllipsisIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { ChatBubbleOvalLeftEllipsisIcon as ChatSolidIcon, Cog6ToothIcon as CogSolidIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useNavigation from '@/hooks/useNavigation'

const Navbar = () => {

  const router = useRouter();
  
  const {
      isChatActive,
      isSettingsActive,
      isProfileActive
  } = useNavigation();

  return (
    <div className='bg-stone-950'>
      <div className="navbar bg-stone-950 border-b-2 border-gray-600 shadow-sm">
        <div className='navbar-start'>
          <div className="flex flex-row pl-3">
            <Image src={'/logo.png'} width={36} height={24} alt='h3x Logo'/>
          </div>
        </div>
        <div className='navbar-center'>
          <label className="input rounded-full bg-transparent border-gray-300 focus:border-yellow-500 border-[1px]">
            <svg className="h-[1em] opacity-50 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
            <input type="search" required placeholder="Search" className='text-gray-300'/>
          </label>
        </div>
        <div className="navbar-end">
          <div role="button" className="bg-transparent border-none shadow-none pr-3">
            <div className="w-8 rounded-full font-semibold">
              {
                !isChatActive ?

                <ChatBubbleOvalLeftEllipsisIcon color='white' onClick={() => router.push('/chats')}/>

                :

                <ChatSolidIcon color='#F0B100'/>

              }
              
            </div>
          </div>
          {
            isProfileActive ?

            <div role="button" className="bg-transparent border-none shadow-none pr-3">
              <div className="w-8 rounded-full font-semibold">
                {
                  !isSettingsActive ?

                  <Cog6ToothIcon color='white' onClick={() => router.push('/settings')}/>

                  :

                  <CogSolidIcon color='#F0B100'/>

                }
                
              </div>
            </div>
            :
            <></>
          }
        </div>
      </div>

    </div>
  )
}

export default Navbar