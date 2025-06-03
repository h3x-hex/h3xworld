'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ethers } from 'ethers'
import { chains } from '@lens-chain/sdk/viem'
import { lensAccountOnly } from '@lens-chain/storage-client'
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'
import { storageClient } from '@/helper/storageClient'
import { image, MediaImageMimeType } from '@lens-protocol/metadata'
import { client } from '@/helper/lensClient'
import { post } from '@lens-protocol/client/actions'
import { evmAddress, uri } from '@lens-protocol/client'
import { handleOperationWith } from '@lens-protocol/client/ethers'

const CreatePortfolioCollection = () => {

    const router = useRouter();
    
    const [collectionName, setCollectionName] = useState('');

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement|null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    
    const [user] = useAtom(userAtom);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = URL.createObjectURL((e.target as HTMLInputElement).files?.[0]!)
        setThumbnailFile((e.target as HTMLInputElement).files?.[0]!)
        setPreviewUrl(url)
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const acl = lensAccountOnly(
                user.accountAddress as `0x${string}`,
                chains.testnet.id
            );
        
            const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
            const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
            const signer = wallet.connect(provider);
        
            const uploadedFileUri = await storageClient.uploadFile(thumbnailFile!, { acl });
        
            const metadata = image({
                title: collectionName,
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
                feed: evmAddress("0xf7B7F7Faa314d4496bc7EBF2884A03802cEFF7a1"),
            }).andThen(handleOperationWith(signer));
        
            console.log(result);

        } catch (error) {
            console.error(error);
        }
    };

  return (
    <div className='px-3 h-screen sm:w-[36rem] mx-auto bg-stone-950 pb-64'>
        <ArrowLeftIcon width={24} color='white' onClick={() => router.push('/create')} className='absolute sm:left-8 top-5'/>

        <div className='h-12 border-b-2 border-gray-600 flex flex-row'>
        <h1 className='pt-2 mx-auto text-3xl text-yellow-500'>Create Club</h1>
        </div>

        <div className='px-3 pt-3'>


        {/* Club Name */}
        <fieldset className="mb-4">
            <legend className="text-white mb-2">Club Name</legend>
            <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="Enter Club Name"
            className="input bg-transparent border-2 border-gray-600 text-white w-full rounded-lg"
            />
        </fieldset>
        
        {/* Upload Images */}
        <fieldset className="fieldset w-full">
            <legend className="fieldset-legend text-white">Upload Thumbnail Image</legend>
            <div className="border-2 border-dashed border-gray-500 rounded-lg text-center cursor-pointer hover:border-yellow-500 h-48 w-full relative" onClick={() => fileInputRef.current?.click()}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e)}
                // if needed
            />
            <div className="text-gray-300 h-48 w-full flex flex-col items-center justify-center relative">
                
                {previewUrl ? 
                <img src={previewUrl} alt="Preview" className="rounded-lg border border-yellow-500 object-cover max-h-44" />

                :
                <div>
                    <p>Upload your Thumbnail Image</p>
                    <p className="text-xs text-gray-500 mt-1">Max size 8MB</p>
                </div>

                }
            </div>
            </div>
        </fieldset>

        <div className="pt-6">
            <button className="btn bg-yellow-500 w-full rounded-lg text-black border-none shadow-none" onClick={handleSubmit}>
                {isLoading ? <span className="loading loading-spinner"></span> : <span>Create Club</span>}
            </button>
        </div>

        </div>
    </div>
  )
}

export default CreatePortfolioCollection