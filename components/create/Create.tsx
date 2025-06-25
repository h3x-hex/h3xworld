'use client'

import React from 'react'
import { ArrowLeftIcon} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';


const Create = () => {

  const router = useRouter();

  const items = [

    {
      title: 'Create a Post',
      description: 'Share thoughts, ideas, or content with your audience.',
      icon: <span className="material-symbols-outlined text-gray-300">post_add</span>,
      link: 'post',
    },
    {
      title: 'Create a Club',
      description: 'Create a club and build your community.',
      icon: <span className="material-symbols-outlined text-gray-300">groups</span>,
      link: 'club',
    },
    {
      title: 'Create a Link',
      description: 'Share an external resource with your followers.',
      icon: <span className="material-symbols-outlined text-gray-300">link</span>,
      link: 'link',
    },
    {
      title: 'Create a Booking',
      description: 'Offer time slots to connect and collaborate.',
      icon: <span className="material-symbols-outlined text-gray-300">calendar_month</span>,
      link: 'booking',
    },
    {
      title: 'Create a Shop Product',
      description: 'Sell Digitals products or add products to your shop.',
      icon: <span className="material-symbols-outlined text-gray-300">shopping_bag</span>,
      link: 'product',
    },
    {
      title: 'Create a Shop Category',
      description: 'Organize your shop products by category.',
      icon: <span className="material-symbols-outlined text-gray-300">sell</span>,
      link: 'category',
    },
    {
      title: 'Create a Portfolio Collection',
      description: 'Highlight your best content in collections',
      icon: <span className="material-symbols-outlined text-gray-300">dataset</span>,
      link: 'portfolio',
    },
    {
      title: 'Create a h3xclusive Tier',
      description: 'h3xclusive tiers for your subscribers.',
      icon: <span className="material-symbols-outlined text-gray-300">box_add</span>,
      link: 'h3xclusive/tier',
    },
    {
      title: 'Create a Portfolio Collection',
      description: 'Highlight your best content in collections',
      icon: <span className="material-symbols-outlined text-gray-300">dataset</span>,
      link: 'portfolio',
    },
    {
      title: 'Create a h3xclusive Tier',
      description: 'h3xclusive tiers for your subscribers.',
      icon: <span className="material-symbols-outlined text-gray-300">box_add</span>,
      link: 'h3xclusive/tier',
    }

  ]

  return (
    <div className='h-screen bg-stone-950 text-center flex flex-col'>
      <div className='flex flex-row gap-8 text-center pt-3 mx-auto'>
        <div className='pl-3 pt-2 absolute left-0'>
          <ArrowLeftIcon width={24} color='white' onClick={() => history.back()} className='cursor-pointer'/>
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold text-yellow-500 text-center">Create</h2>
      </div>
      <div className="mt-3 px-6 grid grid-cols-2 gap-6 border-t border-gray-600 py-6 sm:h-[48rem] sm:w-[36rem] mx-auto">
        {items.map((item, itemNo) => (
          <div key={itemNo} className="border-[1px] border-gray-600 py-3 rounded-lg cursor-pointer hover:border-yellow-500" onClick={() => router.push(`/create/${item.link}`)}>
            <div className='flex flex-col px-3'>
              <div className='flex my-auto w-1/5 items-center justify-center mx-auto'>
                {item.icon}
              </div>
              <div>
                <h3 className="text-md font-medium text-yellow-500">
                  {item.title} &rarr;
                </h3>
                <p className="mt-1 text-sm text-gray-300">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default Create;