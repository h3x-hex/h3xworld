'use client'

import { PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { lensAccountOnly } from '@lens-chain/storage-client'
import { userAtom } from '@/store/authState'
import { useAtom } from 'jotai'
import { chains } from '@lens-chain/sdk/viem'
import { ethers } from 'ethers'
import { storageClient } from '@/helper/storageClient'
import { image, MediaImageMimeType } from '@lens-protocol/metadata'
import { convertToWebP } from '../utils/convertToWebP'
import { client } from '@/helper/lensClient'
import { post } from '@lens-protocol/client/actions'
import { evmAddress, uri } from '@lens-protocol/client'
import { handleOperationWith } from '@lens-protocol/client/ethers'

const CreateCategory = () => {
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [user] = useAtom(userAtom);

  const router = useRouter();

  const handleImageClick = () => {
    if (!inputRef.current) return;
    inputRef.current.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      const objectURL = URL.createObjectURL(event.target.files[0]);
      setFileURL(objectURL);
      console.log("Thumbnail URL:", objectURL);
    }
  };

  const handleSubmit = async () => {
    if (!categoryTitle || !file) {
      alert('Please enter category name and upload an image.');
      return;
    }
    setIsLoading(true);
    const acl = lensAccountOnly(
      user.accountAddress as `0x${string}`,
      chains.testnet.id
    );

    const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
    const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
    const signer = wallet.connect(provider);

    const thumbnailFile = await convertToWebP(file)

    const uploadedFileUri = await storageClient.uploadFile(thumbnailFile, { acl });

    const metadata = image({
      title: categoryTitle,
      image: {
        type: MediaImageMimeType.WEBP,
        item: uploadedFileUri.gatewayUrl
      },
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
      feed: evmAddress("0xf57F719A9d7e456b8106E1d7054E4F56a103E411"),
    }).andThen(handleOperationWith(signer));
    setIsLoading(false);
    console.log(result);
  };

  return (
    <div className='px-3 h-full bg-stone-950 pb-64 sm:w-[36rem] mx-auto'>
      <ArrowLeftIcon width={24} color='white' onClick={() => router.push('/create')} className='absolute top-4 sm:left-8 sm:top-6'/>

      <div className='h-12 border-b-2 border-gray-600 flex flex-row'>
        <h1 className='pt-2 text-3xl text-yellow-500 mx-auto'>Create Category</h1>
      </div>

      <div className='px-3 pt-8 h-screen'>

        {/* Category Title */}
        <fieldset className="fieldset mb-8">
          <legend className="fieldset-legend text-white">Category Title</legend>
          <input
            type="text"
            value={categoryTitle}
            onChange={(e) => setCategoryTitle(e.target.value)}
            placeholder="Enter category name"
            className="input input-bordered w-full bg-transparent border-2 border-gray-600 rounded-lg text-white focus:border-yellow-500"
          />
        </fieldset>

        {/* Thumbnail Upload */}
        <fieldset className="fieldset mb-8">
          <legend className="fieldset-legend text-white">Category Thumbnail Image</legend>
          <button
            type="button"
            className="relative block w-full h-64 rounded-lg border-2 border-dashed border-gray-300 text-center cursor-pointer overflow-hidden"
            onClick={handleImageClick}
          >
            <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
            {!fileURL ? (
              <>
                <PhotoIcon width={48} className="mx-auto text-gray-300" />
                <span className="mt-2 block text-sm font-semibold text-gray-300">Upload your Thumbnail Image</span>
              </>
            ) : (
              <Image src={fileURL} alt="Category Thumbnail" layout="fill" objectFit="cover" />
            )}
          </button>
          <label className="fieldset-label text-gray-300 mt-2 block text-center">Max size 8MB</label>
        </fieldset>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            className="btn bg-yellow-500 border-2 border-yellow-500 w-full rounded-lg text-black shadow-none"
            onClick={handleSubmit}
          >
            {isLoading ? <span className="loading loading-spinner"></span> : <span>Create Category</span>}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CreateCategory;
