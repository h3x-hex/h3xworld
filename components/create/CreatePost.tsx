'use client'

import { InformationCircleIcon, PhotoIcon, GifIcon } from '@heroicons/react/24/outline'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { fetchGroups, fetchPosts } from '@lens-protocol/client/actions'
import { AnyPost, evmAddress, Group } from '@lens-protocol/client'
import { client } from '@/helper/lensClient'
import { lensAccountOnly } from '@lens-chain/storage-client'
import { storageClient } from '@/helper/storageClient'
import { chains } from '@lens-chain/sdk/viem'
import { MediaImageMimeType } from '@lens-protocol/metadata'
import { ethers } from 'ethers'
import { Carousel } from 'react-responsive-carousel'
import { TrashIcon } from '@heroicons/react/24/solid'
import { AnimatePresence } from 'framer-motion'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'
import GifPicker from "../posts/GifPicker"
import { MAX_FILE_SIZE_MB, MAX_FILE_SIZE_BYTES } from '@/constants/constants'
import { goldColor } from "@/constants/colors"
import Modal from '@/components/Modal'
import { uploadPostToLens } from '@/utils/uploadPostLens'
import { uploadMediaToLens } from '@/utils/uploadMediaLens'

interface PostAttachment {
  item: string
  type: MediaImageMimeType
}

interface MediaFile {
  file: File | null
  url: string
  type: string
}

interface DestinationState {
  portfolio: string
  club: Group | null
  h3xclusive: string[]
}

const FEED_ADDRESSES = {
  portfolio: "0x48d5E01d21Ad51993c297935b3d618b99f7e2868",
  portfolioCollection: "0xf7B7F7Faa314d4496bc7EBF2884A03802cEFF7a1",
  h3xclusive: "0x74F9f2Fa4fe6c15284a911245957d06AC33EaB2F",
  post: "0x63c3579756B353D26876A9A5A6f563165C320b7f",
} as const

export default function CreatePost() {
  // State management
  const [media, setMedia] = useState<MediaFile[]>([])
  const [content, setContent] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedDest, setSelectedDest] = useState<string[]>([])
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [destinationData, setDestinationData] = useState<DestinationState>({
    portfolio: '',
    club: null,
    h3xclusive: []
  })
  
  // Modal states
  const [modals, setModals] = useState({
    portfolio: false,
    club: false,
    tier: false
  })
  
  // Data states
  const [tierList, setTierList] = useState<AnyPost[]>([])
  const [portfolioCollectionList, setPortfolioCollectionList] = useState<string[]>([])
  const [clubList, setClubList] = useState<Group[]>([])
  
  // Loading states
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [upgradePrompt, setUpgradePrompt] = useState(false)
  
  // Refs and atoms
  const inputRef = useRef<HTMLInputElement>(null)
  const [user] = useAtom(userAtom)
  const router = useRouter()

  // Memoized values
  const isSubmitDisabled = useMemo(() => {
    return !content.trim() || isLoading || 
           (selectedDest.includes('portfolio') && !destinationData.portfolio) ||
           (selectedDest.includes('club') && !destinationData.club) ||
           (selectedDest.includes('h3xclusive') && destinationData.h3xclusive.length === 0)
  }, [content, isLoading, selectedDest, destinationData])

  // Optimized file handling
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const selectedFiles = Array.from(files)
    const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE_BYTES)
    
    if (oversizedFiles.length > 0) {
      setUpgradePrompt(true)
      return
    }

    const newMedia = selectedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image'
    }))
    
    setMedia(prev => {
      const updated = [...prev, ...newMedia];
      setCurrentSlide(updated.length - 1); // Move to new last slide
      return updated;
    });    
    setUpgradePrompt(false)
  }, [])

  // Optimized destination handling
  const handleDestinationChange = useCallback((dest: string) => {
    setSelectedDest(prev => {
      if (dest === 'h3xclusive') {
        return prev.includes('h3xclusive') ? [] : ['h3xclusive']
      }
      
      if (prev.includes(dest)) {
        return prev.filter(d => d !== dest)
      }
      
      if (prev.includes('h3xclusive')) {
        return [dest]
      }
      
      return [...prev, dest]
    })
  }, [])

  // File removal with proper cleanup
  const removeFile = useCallback((index: number) => {
    setMedia(prev => {
      const fileToRemove = prev[index]
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      if (fileToRemove?.file) {
        URL.revokeObjectURL(fileToRemove.url)
      }

      const newFiles = prev.filter((_, i) => i !== index)
      
      setCurrentSlide((prevSlide) => {
        if (newFiles.length === 0) return 0;
        return Math.min(prevSlide, newFiles.length - 1);
      });
      
      return newFiles
    })
  }, [currentSlide])

  // Modal handlers
  const toggleModal = useCallback((modalType: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalType]: !prev[modalType] }))
  }, [])

  // Optimized data fetching
  const fetchPortfolioCollections = useCallback(async () => {
    if (!user?.accountAddress) return
    
    try {
      const result = await fetchPosts(client, {
        filter: {
          authors: [evmAddress(user.accountAddress)],
          feeds: [{ feed: evmAddress(FEED_ADDRESSES.portfolioCollection) }]
        }
      })

      if (result.isErr()) {
        console.error('Failed to fetch portfolio collections:', result.error)
        return
      }

      const titles = result.value.items
        .filter(item => item.__typename === 'Post' && item.metadata.__typename === 'ImageMetadata')
        .map(item => (item as any).metadata.title)
        .filter(Boolean)

      setPortfolioCollectionList(titles)
    } catch (error) {
      console.error('Error fetching portfolio collections:', error)
    }
  }, [user?.accountAddress])

  const fetchClubs = useCallback(async () => {
    if (!user?.accountAddress) return
    
    try {
      const result = await fetchGroups(client, {
        filter: {
          managedBy: { address: evmAddress(user.accountAddress) }
        }
      })

      if (result.isErr()) {
        console.error('Failed to fetch clubs:', result.error)
        return
      }

      setClubList([...result.value.items]);
    } catch (error) {
      console.error('Error fetching clubs:', error)
    }
  }, [user?.accountAddress])

  const fetchTiers = useCallback(async () => {
    if (!user?.accountAddress) return
    
    try {
      const result = await fetchPosts(client, {
        filter: {
          authors: [evmAddress(user.accountAddress)],
          feeds: [{ feed: evmAddress(FEED_ADDRESSES.h3xclusive) }]
        }
      })

      if (result.isErr()) {
        console.error('Failed to fetch tiers:', result.error)
        return
      }

      setTierList([...result.value.items])
    } catch (error) {
      console.error('Error fetching tiers:', error)
    }
  }, [user?.accountAddress])

  // Main submit handler
  const handleSubmit = useCallback(async () => {
    if (!user?.wallet || !user?.pin || !user?.accountAddress) {
      console.error('User authentication data missing')
      return
    }

    try {
      setIsLoading(true)

      const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet, user.pin)
      const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx')
      const signer = wallet.connect(provider)

      const filesURI: PostAttachment[] = await uploadMediaToLens(media)

      // Handle different destination types
      if (selectedDest.includes('h3xclusive')) {
        // Handle h3xclusive post
        await uploadPostToLens(
          media.length, 
          content, 
          filesURI, 
          'h3xclusive', 
          undefined, 
          FEED_ADDRESSES.h3xclusive, 
          undefined, 
          signer
        )
      } else if (selectedDest.includes('portfolio')) {
        await uploadPostToLens(
          media.length, 
          content, 
          filesURI, 
          'portfolio', 
          undefined, 
          FEED_ADDRESSES.portfolio, 
          destinationData.portfolio, 
          signer
        )
      } else if (selectedDest.includes('club')) {
        await uploadPostToLens(
          media.length, 
          content, 
          filesURI, 
          'club', 
          undefined, 
          destinationData.club?.feed?.address, 
          undefined, 
          signer
        )
      } else {
        await uploadPostToLens(
          media.length, 
          content, 
          filesURI, 
          'post', 
          undefined, 
          FEED_ADDRESSES.post, 
          undefined, 
          signer
        )
      }

      router.push(`/${user.username}`)
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user, media, content, selectedDest, destinationData, router])

  // Create handlers for modals
  const createPortfolioCollection = useCallback(async (collectionName: string, thumbnailFile: File) => {
    if (!user?.wallet || !user?.pin || !user?.accountAddress) return

    const acl = lensAccountOnly(user.accountAddress as `0x${string}`, chains.testnet.id)
    const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet, user.pin)
    const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx')
    const signer = wallet.connect(provider)

    const uploadedFileUri = await storageClient.uploadFile(thumbnailFile, { acl })

    await uploadPostToLens(
      1, 
      collectionName, 
      [{ type: MediaImageMimeType.WEBP, item: uploadedFileUri.gatewayUrl }], 
      'portfolioCollection', 
      undefined, 
      FEED_ADDRESSES.portfolioCollection, 
      undefined, 
      signer
    )
  }, [user])

  // Effects
  useEffect(() => {
    if (!user) return

    if (selectedDest.includes('portfolio')) {
      fetchPortfolioCollections()
    }
    if (selectedDest.includes('club')) {
      fetchClubs()
    }
    if (selectedDest.includes('h3xclusive')) {
      fetchTiers()
    }
  }, [selectedDest, user, fetchPortfolioCollections, fetchClubs, fetchTiers])

  // Cleanup effect for media URLs
  useEffect(() => {
    return () => {
      media.forEach(({ url }) => URL.revokeObjectURL(url))
    }
  }, [])

  if (!user) {
    return (
      <div className="max-w-xl mx-auto bg-black text-white p-6 rounded-xl h-full flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto bg-black text-white p-6 rounded-xl min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6 w-full border-b-2 border-gray-600">
          <button
            onClick={() => router.push('/create')}
            className="btn-ghost bg-transparent border-none transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-6 h-6 text-white" />
          </button>
          <div className='h-12 flex flex-row mx-auto w-full'>
            <h1 className='text-3xl text-yellow-500 mx-auto pr-4'>Create Post</h1>
          </div>
        </div>

        {/* Content Input */}
        <div className="mb-6">
          <textarea
            placeholder="Write something..."
            className="w-full bg-stone-900 border border-gray-600 rounded-lg p-4 text-white h-64 resize-none focus:border-yellow-500 focus:outline-none transition-colors"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={5000}
          />
          <div className="text-right text-sm text-gray-400 mt-1">
            {content.length}/5000
          </div>
        </div>

        {/* Media Preview */}
        {media.length > 0 && (
          <div className="mb-6">
            <Carousel
              key={media.length} // <--- add this
              selectedItem={currentSlide}
              onChange={setCurrentSlide}
              showThumbs={false}
              showStatus={false}
              infiniteLoop={media.length > 1}
              useKeyboardArrows
              dynamicHeight={false}
              className="rounded-lg overflow-hidden border-2 border-gray-600"
            >
              {media.map(({ file, url, type }, idx) => (
                <div key={url} className="relative h-64 sm:h-96">
                  {file && file.type.startsWith('video') ? (
                    <video 
                      src={url} 
                      controls 
                      className="w-full h-full object-cover" 
                      preload="metadata"
                    />
                  ) : 
                  file === null && type === 'GIF' ? (
                    <img
                      src={url}
                      className="w-full h-full object-contain bg-black"
                      alt={`GIF Preview ${idx + 1}`}
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt={`Preview ${idx + 1}`}
                      loading="lazy"
                    />
                  )
                  }
                  <button
                    onClick={() => removeFile(idx)}
                    className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-2 text-white hover:bg-opacity-90 transition-opacity"
                    aria-label="Remove media"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </Carousel>
            <div className="text-center text-sm text-gray-400 mt-2">
              {media.length > 1 && `${currentSlide + 1} of ${media.length}`}
            </div>
          </div>
        )}

        {/* Media Upload */}
        <div className='flex flex-row gap-4 pb-3'>
          <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={(e) => handleFileChange(e)} className='hidden'/>
          <PhotoIcon className='cursor-pointer' width={36} color={goldColor} onClick={() => inputRef.current?.click()}/>
          <GifIcon className="cursor-pointer" width={36} color={goldColor} onClick={() => setShowGifPicker(true)}/>
        </div>

        {/* Upgrade Prompt */}
        {upgradePrompt && (
          <div className="bg-yellow-900 text-yellow-100 p-4 rounded-lg mb-6">
            <p className="font-semibold">File size limit exceeded</p>
            <p className="text-sm">
              One or more files exceed the {MAX_FILE_SIZE_MB}MB limit. 
              <br />
              <strong>Upgrade to h3xPro</strong> for larger file support.
            </p>
          </div>
        )}

        {/* Destination Selection */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Where should this post appear?</label>
            <div className="tooltip" data-tip="All posts show on your profile posts section in addition to your selection— except h3xclusive, which is only visible to members.">
              <InformationCircleIcon className="w-6 h-6 text-gray-400 cursor-help" />
            </div>
          </div>

          <div className="space-y-3">
            {/* Portfolio Option */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-warning" 
                  checked={selectedDest.includes('portfolio')} 
                  onChange={() => handleDestinationChange('portfolio')} 
                />
                <span>Portfolio</span>
              </label>
              
              <AnimatePresence>
                {selectedDest.includes('portfolio') && (
                  <div className="ml-6 space-y-2">
                    <select
                      className="select select-bordered w-full bg-stone-900 rounded-full h-12"
                      value={destinationData.portfolio}
                      onChange={(e) => setDestinationData(prev => ({ ...prev, portfolio: e.target.value }))}
                    >
                      <option value="">Select Collection</option>
                      {portfolioCollectionList.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => toggleModal('portfolio')}
                      className="text-yellow-500 underline text-sm hover:text-yellow-400"
                    >
                      Create Collection
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Club Option */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer rounded-full">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-warning" 
                  checked={selectedDest.includes('club')} 
                  onChange={() => handleDestinationChange('club')} 
                />
                <span>Club</span>
              </label>
              
              <AnimatePresence>
                {selectedDest.includes('club') && (
                  <div className="ml-6 space-y-2">
                    <select
                      className="select select-bordered w-full bg-stone-900 rounded-full h-12"
                      value={destinationData.club?.metadata?.id || ''}
                      onChange={(e) => {
                        const selectedClub = clubList.find(club => club.metadata?.id === e.target.value)
                        setDestinationData(prev => ({ ...prev, club: selectedClub || null }))
                      }}
                    >
                      <option value="">Select Club</option>
                      {clubList.map(club => (
                        <option key={club.metadata?.id} value={club.metadata?.id}>
                          {club.metadata?.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => toggleModal('club')}
                      className="text-yellow-500 underline text-sm hover:text-yellow-400"
                    >
                      Create Club
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* H3xclusive Option */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-warning" 
                  checked={selectedDest.includes('h3xclusive')} 
                  onChange={() => handleDestinationChange('h3xclusive')} 
                />
                <span>h3xclusive</span>
              </label>
              
              <AnimatePresence>
                {selectedDest.includes('h3xclusive') && (
                  <div className="ml-6 space-y-2">
                    <div className="border border-gray-600 p-3 max-h-40 overflow-y-auto rounded-xl">
                      {tierList.length > 0 ? (
                        tierList
                          .filter(tier => tier.__typename === 'Post')
                          .map(tier => (
                            <label key={tier.id} className="flex items-center gap-2 cursor-pointer py-1">
                              <input
                                type="checkbox"
                                className="checkbox checkbox-warning checkbox-sm"
                                checked={destinationData.h3xclusive.includes(tier.id)}
                                onChange={(e) => {
                                  const newSelection = e.target.checked
                                    ? [...destinationData.h3xclusive, tier.id]
                                    : destinationData.h3xclusive.filter(id => id !== tier.id)
                                  setDestinationData(prev => ({ ...prev, h3xclusive: newSelection }))
                                }}
                              />
                              <span className="text-sm">
                                {tier.metadata.__typename === 'ImageMetadata' ? tier.metadata.title : 'Unnamed Tier'}
                              </span>
                            </label>
                          ))
                      ) : (
                        <p className="text-sm text-gray-400">No tiers available</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleModal('tier')}
                      className="text-yellow-500 underline text-sm hover:text-yellow-400"
                    >
                      Create Tier
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
            isSubmitDisabled 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-yellow-500 text-black hover:bg-yellow-400'
          }`}
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              Publishing...
            </span>
          ) : (
            'Publish Post'
          )}
        </button>

        {showGifPicker && (
          <GifPicker
            apiKey={process.env.NEXT_PUBLIC_GIPHY_API_KEY!}
            onSelect={(url) => {
              setMedia(prev => {
                const updated = [...prev, { file: null, url, type: 'GIF' }];
                setCurrentSlide(updated.length - 1); // Move to the new GIF
                return updated;
              });
              setShowGifPicker(false);
            }}
            onClose={() => setShowGifPicker(false)}
          />
        )}

        {/* Modals */}
        <Modal
          isOpen={modals.portfolio}
          onClose={() => toggleModal('portfolio')}
          title="Create Portfolio Collection"
          fields={[
            { name: 'collectionName', type: 'text', placeholder: 'Collection Name' },
            { name: 'thumbnailFile', type: 'file', placeholder: 'Upload Thumbnail Image' },
          ]}
          isLoading={isCreating}
          onSubmitWithData={async (data) => {
            if (!data.thumbnailFile) {
              alert('Please select a thumbnail image')
              return
            }
            try {
              setIsCreating(true)
              await createPortfolioCollection(data.collectionName, data.thumbnailFile)
              await fetchPortfolioCollections()
              toggleModal('portfolio')
            } catch (error) {
              console.error('Error creating portfolio collection:', error)
            } finally {
              setIsCreating(false)
            }
          }}
        />
      </div>
  )
}