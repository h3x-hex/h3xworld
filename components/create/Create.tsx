'use client'

import React, { useCallback, useMemo } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface CreateItem {
  title: string
  description: string
  icon: string
  link: string
}

const Create: React.FC = () => {
  const router = useRouter()

  // Memoize items array to prevent unnecessary re-renders
  const items: CreateItem[] = useMemo(() => [
    {
      title: 'Create a Post',
      description: 'Share thoughts, ideas, or content with your audience.',
      icon: 'post_add',
      link: 'post',
    },
    {
      title: 'Create a Club',
      description: 'Create a club and build your community.',
      icon: 'groups',
      link: 'club',
    },
    {
      title: 'Create a Link',
      description: 'Share an external resource with your followers.',
      icon: 'link',
      link: 'link',
    },
    {
      title: 'Create a Gig',
      description: 'Offer your services and skills to connect with clients.',
      icon: 'business_center',
      link: 'gig',
    },
    {
      title: 'Create a Shop Product',
      description: 'Sell digital products or add products to your shop.',
      icon: 'shopping_bag',
      link: 'product',
    },
    {
      title: 'Create a Shop Category',
      description: 'Organize your shop products by category.',
      icon: 'sell',
      link: 'category',
    },
    {
      title: 'Create a Portfolio Collection',
      description: 'Highlight your best content in collections.',
      icon: 'dataset',
      link: 'portfolio',
    },
    {
      title: 'Create a h3xclusive Tier',
      description: 'h3xclusive tiers for your subscribers.',
      icon: 'box_add',
      link: 'h3xclusive/tier',
    },
  ], [])

  const handleItemClick = useCallback((link: string) => {
    router.push(`/create/${link}`)
  }, [router])

  // Memoize individual item component
  const CreateItemCard = React.memo<{ item: CreateItem; index: number }>(({ item, index }) => (
    <div
      className="group border border-gray-600 py-3 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:border-yellow-500"
      onClick={() => handleItemClick(item.link)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleItemClick(item.link)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${item.title}: ${item.description}`}
      key={index}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-1/5 mx-auto my-auto mb-2">
          <span className="material-symbols-outlined text-gray-300">
            {item.icon}
          </span>
        </div>
        <div>
          <h3 className="text-md font-medium text-yellow-500">
            {item.title} &rarr;
          </h3>
          <p className="mt-1 text-sm text-gray-300">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  ))

  CreateItemCard.displayName = 'CreateItemCard'

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Header */}
      <header className="relative flex items-center justify-center pt-6 pb-4">
        <button
          onClick={() => router.push('/home')}
          className="absolute left-4 p-2 rounded-full btn-ghost bg-transparent border-none transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-3xl sm:text-5xl font-semibold text-yellow-500">
          Create
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 px-6">
        <div className="mx-auto sm:h-[48rem] sm:w-[36rem]">
          <div className="border-t border-gray-600 pt-6">
            <div className="grid grid-cols-2 gap-6">
              {items.map((item, index) => (
                <CreateItemCard key={item.link} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Create