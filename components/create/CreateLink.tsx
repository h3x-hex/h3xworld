'use client'

import { client } from '@/helper/lensClient';
import { storageClient } from '@/helper/storageClient';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { chains } from '@lens-chain/sdk/viem';
import { lensAccountOnly } from '@lens-chain/storage-client';
import { evmAddress, uri } from '@lens-protocol/client';
import { post } from '@lens-protocol/client/actions';
import { handleOperationWith } from '@lens-protocol/client/ethers';
import { link, MediaImageMimeType, MetadataAttributeType } from '@lens-protocol/metadata';
import { ethers } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { useAtom } from 'jotai';
import { userAtom } from '@/store/authState';



const CreateLink = () => {

  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement|null>(null);
  const [layoutType, setLayoutType] = useState('Bar');
  const [linkURL, setLinkURL] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [color, setColor] = useState('#ffffff');

  const [isLoading, setIsLoading] = useState(false);

  const [user] = useAtom(userAtom);

  const router = useRouter();

  const handleImage = () => {

    if(!inputFileRef.current) return;
    
    inputFileRef.current?.click()

  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      const objectURL = URL.createObjectURL(event.target.files[0]);
      setFileURL(objectURL);
      console.log(objectURL)
    }
  };

  const handleSubmit = async () => {
    try {
      const acl = lensAccountOnly(
        user.accountAddress as `0x${string}`,
        chains.testnet.id
      );

      setIsLoading(true);
      const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
      const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
      const signer = wallet.connect(provider);

      const resumed = await client.resumeSession();
        
      if (resumed.isErr()) {
        return console.error(resumed.error);
      }
      
      // SessionClient: { ... }
      const sessionClient = resumed.value;

      console.log(sessionClient);

      const thumbnailUrl = await storageClient.uploadFile(file!, { acl });

      const metadata = link({
        content: linkTitle,
        sharingLink: linkURL,
        attachments: [
          {
            item: thumbnailUrl.gatewayUrl,
            type: MediaImageMimeType.WEBP,
          }
        ],
        attributes: [
          {
            key: 'textColor',
            type: MetadataAttributeType.STRING,
            value: color,
          },
          {
            key: 'layout',
            type: MetadataAttributeType.STRING,
            value: layoutType,
          }
        ]
      });
      
      const { uri:contentUri } = await storageClient.uploadAsJson(metadata);
      console.log(contentUri)
      
      const result = await post(sessionClient, { 
        contentUri: uri(contentUri),
        feed: evmAddress("0xd87f4E0337eDBBa6c3AfB6955a9e46Ce9Dcc9450"),
      }).andThen(handleOperationWith(signer));

      console.log(result);
      setIsLoading(false);
      router.push(`/${user.username}`);
      
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='max-w-xl mx-auto bg-black text-white p-6 rounded-xl min-h-screen'>
      {/* Header */}
      <div className="flex items-center mb-3 w-full border-b-2 border-gray-600">
          <button
          onClick={() => router.push('/create')}
          className="btn-ghost bg-transparent border-none transition-colors"
          aria-label="Go back"
          >
          <ArrowLeftIcon className="w-6 h-6 text-white" />
          </button>
          <div className='h-12 flex flex-row mx-auto w-full'>
          <h1 className='text-3xl text-yellow-500 mx-auto pr-4'>Create Link</h1>
          </div>
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-white">Enter URL</legend>
        <input type="text" className="input input-bordered w-full bg-transparent border-2 border-gray-600 rounded-lg text-white focus:border-yellow-500" placeholder="https://" onChange={(e) => setLinkURL(e.target.value)}/>
      </fieldset>
      
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-white">Layout</legend>
        <div className='flex flex-row gap-3'>
          {
            layoutType == 'Bar' ?

            <div className='flex flex-col h-48 w-48 border-2 border-yellow-500 rounded-lg gap-3'>
              <div className='pt-1'></div>
              <div className='h-8 w-42 border-2 border-yellow-500 mx-auto rounded-full'></div>
              <div className='h-8 w-42 border-2 border-yellow-500 mx-auto rounded-full'></div>
              <div className='h-8 w-42 border-2 border-yellow-500 mx-auto rounded-full'></div>
            </div>

            :

            <div className='flex flex-col h-48 w-48 border-[1px] border-gray-600 rounded-lg gap-3' onClick={() => setLayoutType('Bar')}>
              <div className='pt-1'></div>
              <div className='h-8 w-42 border-2 border-yellow-500 mx-auto rounded-full'></div>
              <div className='h-8 w-42 border-2 border-yellow-500 mx-auto rounded-full'></div>
              <div className='h-8 w-42 border-2 border-yellow-500 mx-auto rounded-full'></div>
            </div>

          }
          
          {
            layoutType == 'Card' ?

            <div className='h-48 w-48 border-2 border-yellow-500 rounded-lg pt-3 pl-3'>
              <div className='h-28 w-40 border-2 border-yellow-500 rounded-lg pt-1 pl-1'>

              </div>
            </div>

            :

            <div className='h-48 w-48 border-2 border-gray-600 rounded-lg pt-3 pl-3' onClick={() => setLayoutType('Card')}>
              <div className='h-28 w-40 border-2 border-yellow-500 rounded-lg pt-1 pl-1'>

              </div>
            </div>
          }
        </div>
      </fieldset>
      
      <fieldset className="fieldset">
        <legend className="fieldset-legend text-white">Title</legend>
        <input type="text" className="input input-bordered w-full bg-transparent border-2 border-gray-600 rounded-lg text-white focus:border-yellow-500" placeholder=""  onChange={(e) => setLinkTitle(e.target.value)}/>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-white">Text Color</legend>
        <input type="color"value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-10 p-0 border rounded"/>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend text-white">Link Thumbnail Image</legend>
          
            {
              !fileURL ?

              <button
                type="button"
                className="relative block w-full h-48 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer"
                onClick={() => handleImage()}
              >
                <input ref={inputFileRef} type="file" onChange={(e) => handleChange(e)} className='hidden'/>
                <span className="material-symbols-outlined text-gray-300">add_photo_alternate</span>
                <span className="mt-2 block text-sm font-semibold text-gray-300">Upload your Thumbnail Image</span>
              </button>


              :

              <button
                type="button"
                className="relative block w-full h-48 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer"
              >
                <Image src={fileURL!} alt={''} layout='fill' objectFit='cover'/>
              </button>
            }
        <label className="fieldset-label text-gray-400">Max size 8MB</label>
      </fieldset>

      
        <fieldset className='fieldset mx-auto'>
          <legend className="fieldset-legend text-white">Preview</legend>
          {
            layoutType == 'Bar' ?

            <div className='relative h-16 w-full border-2 border-yellow-500 rounded-full flex flex-row text-center mx-auto'>
              <div className='flex flex-row text-center relative w-full'>
              {
                fileURL ?

                <div className='h-24 w-24 absolute left-3 rounded-full pt-[2px] '>
                  <Image src={fileURL!} alt={''} width={56} height={56} objectFit='cover' className='object-cover rounded-full aspect-square'/>
                </div>

                :

                <></>

              }
                <div className='flex w-full text-center'>
                  <p className='text-center text-lg font-semibold mx-auto pt-4 w-full' style={{ color }}>{linkTitle}</p>
                </div>
              </div>
            </div>

            :

            layoutType == 'Card' ?

              <>
              {
                fileURL ?
                <div className='h-48 w-full border-2 border-yellow-500 rounded-lg bg-cover bg-center bg-no-repeat' style={{ backgroundImage: "url(" + fileURL + ")" }} >
                  <div className=''>
                    <p className='text-lg font-semibold pl-1 pt-56' style={{ color }}>{linkTitle}</p>
                  </div>
                </div>

                :

                <div className={`h-48 w-full border-2 border-yellow-500 rounded-lg`}>
                  <div className=''>
                    <p className='text-lg font-semibold pl-3 pt-55' style={{ color }}>{linkTitle}</p>
                  </div>
                </div>

              }
              </>

            :
            <></>
          }
        </fieldset>

      <div className='pt-6'>
        <button className='btn bg-yellow-500 border-2 border-yellow-500 w-full rounded-lg text-black shadow-none' onClick={() => handleSubmit()}>{isLoading ? <span className="loading loading-spinner"></span> : <span>Add Link</span>}</button>
      </div>

    </div>
  )
}

export default CreateLink;