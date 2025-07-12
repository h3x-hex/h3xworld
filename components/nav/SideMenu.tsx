'use client'

import React from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  UserCircleIcon,
  NewspaperIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  EnvelopeIcon,
  UsersIcon,
  SparklesIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ArrowRightStartOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type SideMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-3/4 bg-stone-950 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } shadow-lg`}
      onClick={handleOverlayClick}
    >
      <div className="p-4 flex justify-between items-center border-b border-stone-800 text-white">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={onClose}>
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex flex-col gap-4 p-4 text-gray-300 text-sm">
        <a href="#" className="flex items-center gap-3"><HomeIcon className="w-6 h-6" />Home</a>
        <a href="#" className="flex items-center gap-3"><UserCircleIcon className="w-6 h-6" />My Profile</a>
        <a href="#" className="flex items-center gap-3"><NewspaperIcon className="w-6 h-6" />Explore</a>
        <a href="#" className="flex items-center gap-3"><EnvelopeIcon className="w-6 h-6" />Messages</a>
        <a href="#" className="flex items-center gap-3"><CreditCardIcon className="w-6 h-6" />Payments & Orders</a>
        <a href="#" className="flex items-center gap-3"><UsersIcon className="w-6 h-6" />My Supporters</a>
        <a href="#" className="flex items-center gap-3"><Cog6ToothIcon className="w-6 h-6" />Settings</a>

        <hr className="border-stone-700" />
        <span className="text-gray-400 text-xs">Monetization Streams</span>

        <a href="#" className="flex items-center gap-3"><SparklesIcon className="w-6 h-6" />Memberships</a>
        <a href="#" className="flex items-center gap-3"><ShoppingBagIcon className="w-6 h-6" />Shop</a>
        <a href="#" className="flex items-center gap-3"><BanknotesIcon className="w-6 h-6" />Commissions</a>
        <a href="#" className="flex items-center gap-3"><ChatBubbleLeftRightIcon className="w-6 h-6" />DMs</a>

        <Link href="/help" className="flex items-center gap-3 text-gray-400">
          <QuestionMarkCircleIcon className="w-6 h-6" />
          Help
        </Link>

        <Link href="/logout" className="flex items-center gap-3 text-red-400">
          <ArrowRightStartOnRectangleIcon className="w-6 h-6" />
          Logout
        </Link>

        <button className="mt-6 bg-yellow-500 text-black rounded px-4 py-2 text-sm font-semibold hover:bg-yellow-400 transition">
          Upgrade
        </button>
      </nav>
    </div>
  );
};

export default SideMenu;
