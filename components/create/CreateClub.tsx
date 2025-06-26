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
import { feed, group } from '@lens-protocol/metadata'
import { client } from '@/helper/lensClient'
import { createFeed, createGroup } from '@lens-protocol/client/actions'
import { uri } from '@lens-protocol/client'
import { handleOperationWith, signMessageWith } from '@lens-protocol/client/ethers'


const CreateClub = () => {

    const router = useRouter();
    
    const [clubName, setClubName] = useState('');
    const [clubDescription, setClubDescription] = useState('');

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
            if (!clubName || !clubDescription) {
                alert("Please fill all required fields.");
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
            setIsLoading(false);
            router.push(`/club/${clubName}`);

        } catch (error) {
            console.error(error);
        }
    };

  return (
    <div className='max-w-xl mx-auto bg-black text-white p-6 rounded-xl min-h-screen'>
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
            <h1 className='text-3xl text-yellow-500 mx-auto pr-4'>Create Club</h1>
            </div>
        </div>

        <div className='pt-3'>

            {/* Club Name */}
            <fieldset className="mb-4">
                <legend className="text-white mb-2">Club Name</legend>
                <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="Enter Club Name"
                className="input bg-transparent border-2 border-gray-600 text-white w-full rounded-lg"
                />
            </fieldset>

            
            {/* Club Description */}
            <fieldset className="mb-4">
                <legend className="text-white mb-2">Club Description</legend>
                <textarea
                value={clubDescription}
                onChange={(e) => setClubDescription(e.target.value)}
                placeholder="Describe your club..."
                className="textarea bg-transparent border-2 border-gray-600 text-white w-full h-32 rounded-lg"
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

export default CreateClub