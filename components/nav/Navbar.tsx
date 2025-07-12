'use client'

import React, { useState } from 'react';
import {
  ChatBubbleOvalLeftEllipsisIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import {
  ChatBubbleOvalLeftEllipsisIcon as ChatSolidIcon,
} from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import useNavigation from '@/hooks/useNavigation';
import SearchBar from './SearchBar';
import SideMenu from './SideMenu'; // <- import your Sidebar component

const Navbar = () => {
  const router = useRouter();
  const { isChatActive } = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='sm:hidden bg-stone-950 relative w-full'>
      <div className="navbar bg-stone-950 border-b-2 border-gray-600 shadow-sm w-full">
        <div className='navbar-start flex items-center gap-3 pl-3'>
          <Image src={'/logo.png'} width={36} height={24} alt='h3x Logo'/>
        </div>

        <div className='navbar-center w-64'>
          <SearchBar />
        </div>

        <div className="navbar-end px-2 flex items-center gap-2">
          <div role="button" className="w-8">
            {!isChatActive ? (
              <ChatBubbleOvalLeftEllipsisIcon
                color='white'
                onClick={() => router.push('/chats')}
              />
            ) : (
              <ChatSolidIcon color='#F0B100' />
            )}
          </div>

          <Bars3Icon
            className="w-8 h-8 text-white cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        </div>
      </div>

      {/* Sidebar Overlay */}
      <SideMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};

export default Navbar;
