'use client'

import { PhotoIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { post } from '@lens-protocol/client/actions'
import { evmAddress, uri } from '@lens-protocol/client'
import { client } from '@/helper/lensClient'
import { lensAccountOnly } from '@lens-chain/storage-client'
import { storageClient } from '@/helper/storageClient'
import { chains } from '@lens-chain/sdk/viem'
import { image, MediaImageMimeType } from '@lens-protocol/metadata'
import { handleOperationWith } from '@lens-protocol/client/ethers'
import { ethers } from 'ethers'
import { Carousel } from 'react-responsive-carousel';
import { TrashIcon } from '@heroicons/react/24/solid'
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'

interface PostAttachment {
  item: string,
  type: MediaImageMimeType,
}

export default function CreateH3xclusivePost() {

  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [content, setContent] = useState('');

  const [user] = useAtom(userAtom);

  const router = useRouter();

  const previews = usePreviewUrls(files);

  const isVideo = (file: File) => file.type.startsWith('video/');

  const handleInputClick = () => {
    if (!inputRef.current) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).slice(0, 10);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async () => {
    try {
      const acl = lensAccountOnly(
        '0x2a88fDB064A1aFE5A0Cabf19E176B24CdA2EE1F7',
        chains.testnet.id
      );

      if(previews.length > 0)
      {
        const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
        const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
        const signer = wallet.connect(provider);

        console.log(wallet);
        
        const filesURI: PostAttachment[] = [];

        for (let i = 0; i < files.length; i++) {
          const uri = await storageClient.uploadFile(files[i]!, { acl });
          filesURI.push({ item: uri.gatewayUrl, type: MediaImageMimeType.WEBP });
        }

        const extraAttachments = filesURI.length > 1
          ? filesURI.slice(1)
          : [];

        const metadata = image({
          title: content,
          image: filesURI[0],
          attachments: extraAttachments
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
          feed: evmAddress("0x63c3579756B353D26876A9A5A6f563165C320b7f"),
        }).andThen(handleOperationWith(signer));

        console.log(result);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      
      // Adjust currentSlide if needed
      if (currentSlide >= newFiles.length && newFiles.length > 0) {
        setCurrentSlide(newFiles.length - 1);
      }
      
      return newFiles;
    });
  };

  useEffect(() => {

  }, [])
  

  
  return (
    <div className='px-3 h-full sm:w-[36rem] bg-stone-950 pb-64 mx-auto'>
      <ArrowLeftIcon width={24} color='white' onClick={() => router.push('/create')} className='absolute sm:left-8 top-5'/>
      <div className='h-12 border-b-2 border-gray-600 flex flex-row'>
        <h1 className='pt-2 text-3xl text-yellow-500 text-center mx-auto'>Create Post</h1>
      </div>
      <div className='flex flex-col h-screen px-3'>
        <div className='px-3 pt-8'>
          <div className='flex flex-col '>
            <textarea placeholder="Whats on your mind?" className="textarea border-2 border-gray-600 focus:border-yellow-500 bg-transparent text-white h-64 sm:h-96 rounded-lg w-full pb-3" value={content} onChange={(e) => setContent(e.target.value)}/>   

            {previews.length > 0 && (
              <Carousel
                selectedItem={currentSlide}
                onChange={(index) => setCurrentSlide(index)}
                showThumbs={false}
                showStatus={false}
                infiniteLoop
                useKeyboardArrows
                dynamicHeight={false}
                className="rounded-md overflow-hidden h-64 sm:h-96 w-full border-2 border-gray-600 border-dashed"
              >
                {previews.map(({ file, url }, idx) => (
                  <div key={url} className="relative h-64 sm:h-96 w-full">
                    {isVideo(file) ? (
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
            <div className='pt-6'>
              <button className='btn bg-yellow-500 border-2 border-yellow-500 w-full rounded-lg text-black shadow-none' onClick={() => handleSubmit()} disabled={content == ''}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function usePreviewUrls(files: File[]) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  useEffect(() => {
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [files]);

  return previews;
}
