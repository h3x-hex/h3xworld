/*'use client'

import { InformationCircleIcon, PhotoIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { createFeed, createGroup, fetchGroups, fetchPosts, post } from '@lens-protocol/client/actions'
import { AnyPost, evmAddress, Group, uri } from '@lens-protocol/client'
import { client } from '@/helper/lensClient'
import { lensAccountOnly } from '@lens-chain/storage-client'
import { storageClient } from '@/helper/storageClient'
import { chains } from '@lens-chain/sdk/viem'
import { feed, group, image, MediaImageMimeType, MetadataAttributeType, textOnly } from '@lens-protocol/metadata'
import { handleOperationWith, signMessageWith } from '@lens-protocol/client/ethers'
import { ethers} from 'ethers'
import { Carousel } from 'react-responsive-carousel';
import { TrashIcon } from '@heroicons/react/24/solid';
import { AnimatePresence } from 'framer-motion';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'
import Modal from '@/components/Modal'
import { uploadPostToLens } from '@/utils/uploadPostLens'
import { uploadMediaToLens } from '@/utils/uploadMediaLens'

interface PostAttachment {
  item: string,
  type: MediaImageMimeType,
}

type MediaFile = {
  file: File
  url: string
  type: string
}

export default function CreatePost() {
  
  const [media, setMedia] = useState<MediaFile[]>([])
  const [content, setContent] = useState('');
  const [upgradePrompt, setUpgradePrompt] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedDest, setSelectedDest] = useState<string[]>([])
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)
  const [showClubModal, setShowClubModal] = useState(false)
  const [showTierModal, setShowTierModal] = useState(false)
  const [portfolioCollection, setPortfolioCollection] = useState('')
  const [clubSelection, setClubSelection] = useState<Group | null>(null)
  const [tierSelection, setTierSelection] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const [tierList, setTierList] = useState<AnyPost[]>([]);
  const [portfolioCollectionList, setPortfolioCollectionList] = useState<string[]>([]);
  const [clubList, setClubList] = useState<Group[]>([]);

  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false);  

  const [user] = useAtom(userAtom);

  const router = useRouter();

  const maxSizeMB = 8;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const selectedFiles = Array.from(files)
    const oversized = selectedFiles.find((file) => file.size > maxSizeMB * 1024 * 1024)
    
    if (oversized) {
      setUpgradePrompt(true)
      return
    }

    const newMedia = selectedFiles.map((file) => {
      const type = file.type.startsWith('video') ? 'video' : 'image'
      return {
        file,
        url: URL.createObjectURL(file),
        type
      }
    })

    setMedia([...media, ...newMedia])
  }


  const handleDestinationChange = (dest: string) => {
    if (dest === 'h3xclusive') {
      // Selecting h3xclusive clears all and selects only it
      if (selectedDest.includes('h3xclusive')) {
        setSelectedDest([]) // deselect it
      } else {
        setSelectedDest(['h3xclusive']) // select only h3xclusive
      }
    } else {
      if (selectedDest.includes(dest)) {
        // deselect clicked non-h3xclusive
        setSelectedDest(selectedDest.filter(d => d !== dest))
      } else {
        // If h3xclusive is currently selected, deselect it and select the new one
        if (selectedDest.includes('h3xclusive')) {
          setSelectedDest([dest])
        } else {
          setSelectedDest([...selectedDest, dest])
        }
      }
    }
  }

  const handleInputClick = () => {
    if (!inputRef.current) return;
    inputRef.current?.click();
  };

  const closePortfolioModal = () => {
    setShowPortfolioModal(false)
  }
  
  const closeClubModal = () => {
    setShowClubModal(false)
  }
  
  const closeTierModal = () => {
    setShowTierModal(false)
  }
  

  const handleSubmit = async () => {
    try {
      const acl = lensAccountOnly(
        '0x2a88fDB064A1aFE5A0Cabf19E176B24CdA2EE1F7',
        chains.testnet.id
      );

      setIsLoading(true);

      const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
      const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
      const signer = wallet.connect(provider);

      const filesURI: PostAttachment[] = await uploadMediaToLens(media);

      if(selectedDest.includes('h3xclusive'))
      {

      }
      if(selectedDest.includes('portfolio'))
      {
        uploadPostToLens(media.length, content, filesURI, 'portfolio', undefined, "0x48d5E01d21Ad51993c297935b3d618b99f7e2868", portfolioCollection, signer)
      }
      if(selectedDest.includes('club'))
      {
        uploadPostToLens(media.length, content, filesURI, 'club', undefined, clubSelection?.feed?.address, undefined, signer)
      }
      else 
      {
        uploadPostToLens(media.length, content, filesURI, 'post', undefined, "0x63c3579756B353D26876A9A5A6f563165C320b7f", undefined, signer)        
      }
      
      router.push(`/${user.username}`)
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFile = (index: number) => {
    setMedia((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      
      // Adjust currentSlide if needed
      if (currentSlide >= newFiles.length && newFiles.length > 0) {
        setCurrentSlide(newFiles.length - 1);
      }
      
      return newFiles;
    });
  };

  const createPortfolioCollection = async (collectionName: string, thumbnailFile: File): Promise<void> => {

    const acl = lensAccountOnly(
      user.accountAddress as `0x${string}`,
      chains.testnet.id
    );

    const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
    const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
    const signer = wallet.connect(provider);

    const uploadedFileUri = await storageClient.uploadFile(thumbnailFile, { acl });

    uploadPostToLens(1, collectionName, [{type: MediaImageMimeType.WEBP, item: uploadedFileUri.gatewayUrl}], 'portfolioCollection', undefined, "0xf7B7F7Faa314d4496bc7EBF2884A03802cEFF7a1", undefined, signer)

  }

  const createClub = async (clubName: string, clubDescription: string, thumbnailFile: File): Promise<void> => {

    const acl = lensAccountOnly(
      user.accountAddress as `0x${string}`,
      chains.testnet.id
    );

    const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
    const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
    const signer = wallet.connect(provider);

    const uploadedFileUri = await storageClient.uploadFile(thumbnailFile, { acl });

    const metadata = group({
      name: clubName,
      description: clubDescription,
      icon: uploadedFileUri.gatewayUrl,
    });

    const { uri:contentUri } = await storageClient.uploadAsJson(metadata);

    const feedMetadata = feed({
      name: clubName,
      description: clubDescription,
    });

    const { uri:feedUri } = await storageClient.uploadAsJson(feedMetadata);

    console.log(feedUri);
    
    const authenticated = await client.login({
      builder: {
        address: signer.address,
      },
      signMessage: signMessageWith(signer),
    });
    
    if (authenticated.isErr()) {
      return console.error(authenticated.error);
    }
    
    // SessionClient: { ... }
    let sessionClient = authenticated.value;

    await createFeed(sessionClient, {
      metadataUri: uri(feedUri),
    });
    
    const authenticated1 = await client.login({
      accountOwner: {
        account: user.accountAddress,
        app: "0xa4de8E77b3F92005C84ff4dDd184b1F097aF11a2",
        owner: wallet.address,
      },
      signMessage: signMessageWith(signer),
    });
    
    if (authenticated1.isErr()) {
      return console.error(authenticated1.error);
    }
    
    // SessionClient: { ... }
    sessionClient = authenticated1.value;

    console.log(sessionClient);

    const result1 = await createGroup(sessionClient, { 
      metadataUri: uri(contentUri),
      feed: {
        metadataUri: uri(feedUri),
      },
    }).andThen(handleOperationWith(signer));

    console.log(result1);
    
  }

  const createH3xclusiveTier = async (tierName: string, tierDescription: string, tierPrice: number, thumbnailFile: File): Promise<void> => {

    const acl = lensAccountOnly(
      user.accountAddress as `0x${string}`,
      chains.testnet.id
    );

    const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
    const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
    const signer = wallet.connect(provider);

    const uploadedFileUri = await storageClient.uploadFile(thumbnailFile, { acl });

    const metadata = image({
      title: tierName,
      image: {
        type: MediaImageMimeType.WEBP,
        item: uploadedFileUri.gatewayUrl
      },
      attributes:[
        {
          key: 'tierDescription',
          type: MetadataAttributeType.STRING, //0
          value: tierDescription,
        },
        {
          key: 'tierPrice',
          type: MetadataAttributeType.NUMBER, //0
          value: tierPrice.toString(),
        },
      ]
    });
    const { uri:contentUri } = await storageClient.uploadAsJson(metadata);
    
    const resumed = await client.resumeSession();
      
    if (resumed.isErr()) {
      return console.error(resumed.error);
    }
    
    // SessionClient: { ... }
    const sessionClient = resumed.value;

    console.log(sessionClient);

    const result = await post(sessionClient, { 
      contentUri: uri(contentUri),
      feed: evmAddress("0x74F9f2Fa4fe6c15284a911245957d06AC33EaB2F"),
    }).andThen(handleOperationWith(signer));

    console.log(result);
    
  }

  const fetchClubs = async () => {
    const result = await fetchGroups(client, {
      filter: {
        managedBy: {
          address: evmAddress(user.accountAddress!),
        },
      },
    });
  
    if (result.isErr()) {
      return console.error(result.error);
    }
  
    const { items, pageInfo } = result.value;
    console.log('Updated clubs:', items, pageInfo);
    setClubList([...items]);
  };

  const fetchPortfolioCollections = async () => {
    const result = await fetchPosts(client, {
      filter: {
        authors: [evmAddress(user.accountAddress!)],
        feeds: [
          {
            feed: evmAddress("0xf7B7F7Faa314d4496bc7EBF2884A03802cEFF7a1"),
          }
        ],
      },
    });
  
    if (result.isErr()) {
      return console.error(result.error);
    }
  
    const { items } = result.value;
    const titles: string[] = [];

    for (const item of items) {
      if (item.__typename === 'Post' && item.metadata.__typename === 'ImageMetadata') {
        titles.push(item.metadata.title!);
      }
    }
    setPortfolioCollectionList(titles)
    console.log(portfolioCollectionList)

  };

  const fetchTiers = async () => {
    const result = await fetchPosts(client, {
      filter: {
        authors: [evmAddress(user.accountAddress!)],
        feeds: [
          {
            feed: evmAddress("0x74F9f2Fa4fe6c15284a911245957d06AC33EaB2F"),
          }
        ],
      },
    });
  
    if (result.isErr()) {
      return console.error(result.error);
    }
  
    const { items } = result.value;
    setTierList([...items]);
  };

  useEffect(() => {
    setShowPortfolioModal(false)
    setShowClubModal(false)
    setShowTierModal(false)

    if (!user) return;

    if (selectedDest.includes('portfolio')) {
      fetchPortfolioCollections();
    }

    if (selectedDest.includes('club')) {
      fetchClubs();
    }

    if (selectedDest.includes('h3xclusive')) {
      fetchTiers();
    }

  }, [selectedDest])
  

  
  return (
    <div className="max-w-xl mx-auto bg-black text-white p-6 rounded-xl h-full">
      <ArrowLeftIcon width={24} color='white' onClick={() => router.push('/create')} className='absolute top-10 sm:left-8 sm:top-6'/>
      <div className='h-12 border-b-2 border-gray-600 flex flex-row'>
        <h1 className='pt-2 text-3xl text-yellow-500 mx-auto'>Create Post</h1>
      </div>

      <div className='pt-4'>
        <textarea
          placeholder="Write something..."
          className="w-full bg-stone-900 border border-gray-600 rounded-lg p-2 text-white mb-4 h-64"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {media.length > 0 && (
        <Carousel
          selectedItem={currentSlide}
          onChange={(index) => setCurrentSlide(index)}
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          useKeyboardArrows
          dynamicHeight={false}
          className="rounded-md overflow-hidden h-64 sm:h-96 w-full border-2 border-gray-600 border-dashed mb-4"
        >
          {media.map(({ file, url }, idx) => (
            <div key={url} className="relative h-64 sm:h-96 w-full">
              {file.type.startsWith('video') ? (
                <video src={url} controls className="w-full h-64 sm:h-96 object-cover rounded-box" />
              ) : (
                <img src={url} className="w-full h-64 sm:h-96 object-cover rounded-box" alt={`preview-${idx}`} />
              )}
              <button
                onClick={() => removeFile(currentSlide)}
                className="absolute top-2 right-6 bg-black bg-opacity-70 rounded-full p-1 text-white"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </Carousel>
      )}
      <div className='flex flex-row gap-40 sm:gap-76 pb-3'>
        <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={(e) => handleFileChange(e)} className='hidden'/>
        <PhotoIcon className='cursor-pointer' width={36} color='#F0B100' onClick={() => handleInputClick()}/>
      </div>
      {upgradePrompt && (
        <div className="bg-yellow-900 text-yellow-400 p-3 rounded text-sm mb-4">
          One or more files exceed the 8MB limit. <br />
          <strong>Upgrade to h3xPro</strong> for larger post support.
        </div>
      )}

      

      <div className="mb-4 space-y-2">
        <div className='flex flex-row gap-1'>
          <label className="block font-semibold">Where should this post appear?</label>
          <div className="tooltip" data-tip="All posts show on your profile posts section in addition to your selection— except h3xclusive, which is only visible to members.">
            <button className="btn btn-circle w-6 h-6"><InformationCircleIcon/></button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label><input type="checkbox" className='checkbox checkbox-warning' checked={selectedDest.includes('portfolio')} onChange={() => handleDestinationChange('portfolio')} /> Portfolio</label>
          <AnimatePresence mode="wait">
          {selectedDest.includes('portfolio') && (
            <>
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn w-full justify-between bg-neutral text-white">
                  {portfolioCollection
                    ? portfolioCollection
                    : 'Select Collection'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <ul tabIndex={0} className="dropdown-content z-[1] menu pb-6 shadow bg-stone-950 rounded-lg w-64 max-h-60 overflow-y-auto">
                  {portfolioCollectionList.length > 0 ? (
                    portfolioCollectionList.map((name) => (
                      <li key={name}>
                        <label className="label cursor-pointer justify-start gap-2">
                          <input
                            type="radio"
                            name="portfolio"
                            className="radio radio-warning radio-sm"
                            checked={portfolioCollection === name}
                            onChange={() => setPortfolioCollection(name)}
                          />
                          <span className="label-text">{name}</span>
                        </label>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400 px-2 py-1">No collections available</li>
                  )}
                </ul>
              </div>

              <button
                onClick={() => setShowPortfolioModal(true)}
                className="text-yellow-500 underline text-sm mt-2"
              >
                Create Collection
              </button>
            </>
          )}

          </AnimatePresence>


          <label><input type="checkbox" className='checkbox checkbox-warning' checked={selectedDest.includes('club')} onChange={() => handleDestinationChange('club')} /> Club</label>
          <AnimatePresence mode="wait">
          {selectedDest.includes('club') && (
            <>
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn w-full justify-between bg-neutral text-white">
                  {clubSelection
                    ? clubList.find((club) => club.metadata?.name === clubSelection.metadata?.name)?.metadata?.name ?? 'Select Club'
                    : 'Select Club'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <ul tabIndex={0} className="dropdown-content z-[1] menu pb-6 shadow bg-stone-950 rounded-lg w-64 max-h-60 overflow-y-auto">
                  {clubList.length > 0 ? (
                    clubList.map((club) => (
                      <li key={club.metadata?.id}>
                        <label className="label cursor-pointer justify-start gap-2">
                          <input
                            type="radio"
                            name="club"
                            className="radio radio-warning radio-sm"
                            checked={clubSelection?.metadata?.name === club.metadata?.name}
                            onChange={() => setClubSelection(club)}
                          />
                          <span className="label-text">{club.metadata?.name}</span>
                        </label>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400 px-2 py-1">No clubs available</li>
                  )}
                </ul>
              </div>

              <button onClick={() => setShowClubModal(true)} className="text-yellow-500 underline text-sm mt-2">
                Create Club
              </button>
            </>
          )}

          </AnimatePresence>


          <label><input type="checkbox" className='checkbox checkbox-warning' checked={selectedDest.includes('h3xclusive')} onChange={() => handleDestinationChange('h3xclusive')} /> h3xclusive</label>
          <AnimatePresence mode="wait">
            {selectedDest.includes('h3xclusive') && (
              <>
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn w-full justify-between bg-neutral text-white">
                  {tierSelection.length > 0 ? `${tierSelection.length} Tier${tierSelection.length > 1 ? 's' : ''} Selected` : 'Select Tier(s)'}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu pb-6 shadow bg-stone-950 rounded-lg w-64 max-h-60 overflow-y-auto">
                  {tierList.length > 0 ? (
                    tierList.filter((tier) => tier.__typename === 'Post').map((tier) => (
                      <li key={tier.id}>
                        <label className="label cursor-pointer justify-start gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-warning checkbox-sm"
                            checked={tierSelection.includes(tier.id)}
                            onChange={() => {
                              if (tierSelection.includes(tier.id)) {
                                setTierSelection(tierSelection.filter((id) => id !== tier.id))
                              } else {
                                setTierSelection([...tierSelection, tier.id])
                              }
                            }}
                          />
                          {tier.metadata.__typename === 'ImageMetadata' && <span className="label-text">{tier.metadata.title}</span>}
                        </label>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-400 px-2 py-1">No tiers available</li>
                  )}
                </ul>
                
              </div>
              <button onClick={() => setShowTierModal(true)} className="text-yellow-500 underline text-sm">Create Tier</button>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button className="bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-400" onClick={() => handleSubmit()}>
        {isLoading ? <span className="loading loading-spinner"></span> : <span>Publish Post</span>}
      </button>

      <Modal
        isOpen={showPortfolioModal}
        onClose={closePortfolioModal}
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
            await createPortfolioCollection(data.collectionName, data.thumbnailFile);
            await fetchPortfolioCollections();
            setIsCreating(false)
            setShowPortfolioModal(false)
          } finally {
            
          }
        }}
      >
      </Modal>
      
      <Modal
        isOpen={showClubModal}
        onClose={closeClubModal}
        title="Create Club"
        fields={[
          { name: 'clubName', type: 'text', placeholder: 'Club Name' },
          { name: 'clubDescription', type: 'textarea', placeholder: 'Club Description' },
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
            await createClub(data.clubName, data.clubDescription, data.thumbnailFile);
            await fetchClubs();
            setIsCreating(false)
            setShowClubModal(false)
          } finally {
            
          }
        }}
      >
      </Modal>

      <Modal
        isOpen={showTierModal}
        onClose={closeTierModal}
        title="Create h3xclusive Tier"
        fields={[
          { name: 'tierName', type: 'text', placeholder: 'Tier Name' },
          { name: 'tierDescription', type: 'textarea', placeholder: 'Tier Description (Markdown supported)' },
          { name: 'tierPrice', type: 'number', placeholder: 'Price (USD)' },
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
            await createH3xclusiveTier(data.tierName, data.tierDescription, data.tierPrice, data.thumbnailFile);
            await fetchTiers();
            setIsCreating(false)
            setShowTierModal(false)
          } finally {
            
          }
        }}
      >
      </Modal>

    </div>
  )
}*/

