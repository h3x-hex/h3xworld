'use client'

import React, { useRef, useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { storageClient } from '@/helper/storageClient'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { lensAccountOnly } from '@lens-chain/storage-client'
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'
import { chains } from '@lens-chain/sdk/viem'
import { ethers } from 'ethers'
import { image, MediaImageMimeType, MetadataAttributeType } from '@lens-protocol/metadata'
import { post } from '@lens-protocol/client/actions'
import { evmAddress, uri } from '@lens-protocol/client'
import { handleOperationWith } from '@lens-protocol/client/ethers'
import { client } from '@/helper/lensClient'


export default function CreateH3xclusiveTier() {
  
  const [tierName, setTierName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [tierFeatures, setTierFeatures] = useState<string[]>(['']);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement|null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [user] = useAtom(userAtom);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailFile(e.target.files![0]);
    const objectURL = URL.createObjectURL(e.target.files![0]);
    setPreviewUrl(objectURL);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...tierFeatures];
    newFeatures[index] = value;
    setTierFeatures(newFeatures);
  };

  const addFeature = () => {
    setTierFeatures([...tierFeatures, '']);
  };

  const removeFeature = (index: number) => {
    const newFeatures = tierFeatures.filter((_, i) => i !== index);
    setTierFeatures(newFeatures);
  };

  const handleSubmit = async () => {
    try {
      if (!tierName || !description || price <= 0) {
        alert("Please fill in all fields properly.");
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
  
      const uploadedFileUri = await storageClient.uploadFile(thumbnailFile!, { acl });

      const features = JSON.stringify(tierFeatures)
  
      const metadata = image({
        title: tierName,
        image: {
          type: MediaImageMimeType.WEBP,
          item: uploadedFileUri.gatewayUrl
        },
        attributes:[
          {
            key: 'tierDescription',
            type: MetadataAttributeType.STRING, 
            value: description,
          },
          {
            key: 'tierPrice',
            type: MetadataAttributeType.NUMBER, 
            value: price.toString(),
          },
          {
            key: 'tierFeatures',
            type: MetadataAttributeType.STRING, 
            value: features,
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

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className='flex flex-col px-3 h-full sm:w-[36rem] bg-stone-950 pb-64 mx-auto'>
      <ArrowLeftIcon width={24} color='white' onClick={() => router.push('/create')} className='absolute sm:left-8 top-5'/>
      <div className='h-12 border-b-2 border-gray-600 flex flex-row'>
        <h1 className='pt-2 text-3xl text-yellow-500 text-center mx-auto'>Create H3xclusive Tier</h1>
      </div>
      <div className='flex flex-col h-screen px-3 pt-8'>

        {/* Fieldset for Tier Name */}
        <fieldset className="flex flex-col mb-4">
          <label htmlFor="tierName" className="text-white mb-2">Tier Name</label>
          <input
            id="tierName"
            type="text"
            placeholder="Enter tier name"
            className="input bg-transparent border-2 border-gray-600 text-white rounded-lg w-full"
            value={tierName}
            onChange={(e) => setTierName(e.target.value)}
          />
        </fieldset>

        {/* Fieldset for Tier Description */}
        <fieldset className="flex flex-col mb-4">
          <label htmlFor="description" className="text-white mb-2">Tier Description</label>
          <textarea
            id="description"
            placeholder="Describe the benefits of this tier..."
            className="textarea bg-transparent border-2 border-gray-600 text-white h-48 rounded-lg w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </fieldset>

        {/* Fieldset for Tier Features */}
        <fieldset className="flex flex-col mb-4">
          <label htmlFor="description" className="text-white mb-2">Tier Features</label>
            {tierFeatures.map((feature, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="flex-1 bg-stone-950 p-2 rounded text-white border-2 border-gray-600"
                placeholder={`Feature ${index + 1}`}
              />
              {tierFeatures.length > 1 && (
                <button type="button" onClick={() => removeFeature(index)} className="text-red-500">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addFeature} className="text-yellow-500 underline text-sm mt-2">
            + Add another feature
          </button>
        </fieldset>

        {/* Fieldset for Tier Price */}
        <fieldset className="flex flex-col mb-4">
          <label htmlFor="price" className="text-white mb-2">Tier Price (USD)</label>
          <input
            id="price"
            type="number"
            placeholder="Enter price"
            className="input bg-transparent border-2 border-gray-600 text-white rounded-lg w-full"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </fieldset>

        {/* Fieldset for Tier Image */}
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

        {/* Submit Button */}
        <button
          className="btn bg-yellow-500 border-2 border-yellow-500 w-full rounded-lg text-black shadow-none mt-8"
          onClick={handleSubmit}
          disabled={!tierName || !description || price < 0}
        >
          {isLoading ? <span className="loading loading-spinner"></span> : <span>Create Tier</span>}
        </button>

      </div>
    </div>
  )
}