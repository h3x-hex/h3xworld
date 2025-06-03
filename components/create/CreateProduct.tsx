'use client'

import { TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Carousel } from 'react-responsive-carousel'
import { usePreviewUrls } from '../utils/usePreviewUrls'
import { ethers } from 'ethers'
import { chains } from '@lens-chain/sdk/viem'
import { lensAccountOnly } from '@lens-chain/storage-client'
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'
import { storageClient } from '@/helper/storageClient'
import { image, MediaImageMimeType, MetadataAttributeType } from '@lens-protocol/metadata'
import { client } from '@/helper/lensClient'
import { fetchPosts, post } from '@lens-protocol/client/actions'
import { AnyPost, evmAddress, uri } from '@lens-protocol/client'
import { handleOperationWith } from '@lens-protocol/client/ethers'

interface PostAttachment {
  item: string,
  type: MediaImageMimeType,
}

const CreateProduct = () => {
  const router = useRouter();
  const [productType, setProductType] = useState('Affiliate');
  const [productName, setProductName] = useState('');
  const [productLink, setProductLink] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [categories, setCategories] = useState<AnyPost[]>([]);
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useAtom(userAtom);
  const previews = usePreviewUrls(files);

  const isVideo = (file: File) => file.type.startsWith('video/');

  const handleInputClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (currentSlide >= newFiles.length && newFiles.length > 0) {
        setCurrentSlide(newFiles.length - 1);
      }
      return newFiles;
    });
  };

  const fetchCategories = async () => {
    const result = await fetchPosts(client, {
      filter: {
        authors: [evmAddress(user.accountAddress!)],
        feeds: [{ feed: evmAddress("0xf57F719A9d7e456b8106E1d7054E4F56a103E411") }],
      },
    });
    if (result.isErr()) return console.error(result.error);
    setCategories([...result.value.items]);
  };

  useEffect(() => {
    if (user?.accountAddress) fetchCategories();
  }, [user?.accountAddress]);

  const handleSubmit = async () => {
    try {
      if (!productName || !productDescription || !price || !currency) {
        alert("Please fill all required fields.");
        return;
      }

      setIsLoading(true);

      const acl = lensAccountOnly(user.accountAddress as `0x${string}`, chains.testnet.id);
      const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
      const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
      const signer = wallet.connect(provider);

      const filesURI: PostAttachment[] = [];
      for (const file of files) {
        const uploaded = await storageClient.uploadFile(file, { acl });
        filesURI.push({ item: uploaded.gatewayUrl, type: MediaImageMimeType.WEBP });
      }

      if(productType === 'Affiliate')
      {
        if(filesURI.length > 1)
        {
          const metadata = image({
            title: productName,
            image: filesURI[0],
            attachments: filesURI.slice(1),
            attributes: [
              { key: 'Description', value: productDescription, type: MetadataAttributeType.STRING },
              { key: 'ProductType', value: productType, type: MetadataAttributeType.STRING },
              { key: 'Price', value: price, type: MetadataAttributeType.STRING },
              { key: 'Currency', value: currency, type: MetadataAttributeType.STRING },
              { key: 'ExternalURL', value: productLink, type: MetadataAttributeType.STRING },
            ],
            tags: [productCategory]
          });
    
          const { uri: contentUri } = await storageClient.uploadAsJson(metadata);
          const resumed = await client.resumeSession();
          if (resumed.isErr()) return console.error(resumed.error);
    
          const sessionClient = resumed.value;
          const result = await post(sessionClient, {
            contentUri: uri(contentUri),
            feed: evmAddress('0xcf1932d62a06AE38D70879895441FcD0b4339044'),
          }).andThen(handleOperationWith(signer));
    
          console.log('Product posted:', result);
          router.push('/products');
        }
        else 
        {
          const metadata = image({
            title: productName,
            image: filesURI[0],
            attributes: [
              { key: 'Description', value: productDescription, type: MetadataAttributeType.STRING },
              { key: 'ProductType', value: productType, type: MetadataAttributeType.STRING },
              { key: 'Price', value: price, type: MetadataAttributeType.STRING },
              { key: 'Currency', value: currency, type: MetadataAttributeType.STRING },
              { key: 'ExternalURL', value: productLink, type: MetadataAttributeType.STRING },
            ],
          });
    
          const { uri: contentUri } = await storageClient.uploadAsJson(metadata);
          const resumed = await client.resumeSession();
          if (resumed.isErr()) return console.error(resumed.error);
    
          const sessionClient = resumed.value;
          const result = await post(sessionClient, {
            contentUri: uri(contentUri),
            feed: evmAddress('0xcf1932d62a06AE38D70879895441FcD0b4339044'),
          }).andThen(handleOperationWith(signer));
    
          console.log('Product posted:', result);
          router.push('/products');
        }
      }
      else{
        if(filesURI.length > 1)
        {
          const metadata = image({
            title: productName,
            image: filesURI[0],
            attachments: filesURI.slice(1),
            attributes: [
              { key: 'Description', value: productDescription, type: MetadataAttributeType.STRING },
              { key: 'ProductType', value: productType, type: MetadataAttributeType.STRING },
              { key: 'Price', value: price, type: MetadataAttributeType.STRING },
              { key: 'Currency', value: currency, type: MetadataAttributeType.STRING },
            ],
          });
    
          const { uri: contentUri } = await storageClient.uploadAsJson(metadata);
          const resumed = await client.resumeSession();
          if (resumed.isErr()) return console.error(resumed.error);
    
          const sessionClient = resumed.value;
          const result = await post(sessionClient, {
            contentUri: uri(contentUri),
            feed: evmAddress('0xcf1932d62a06AE38D70879895441FcD0b4339044'),
          }).andThen(handleOperationWith(signer));
    
          console.log('Product posted:', result);
          router.push('/products');
        }
        else 
        {
          const metadata = image({
            title: productName,
            image: filesURI[0],
            attributes: [
              { key: 'Description', value: productDescription, type: MetadataAttributeType.STRING },
              { key: 'ProductType', value: productType, type: MetadataAttributeType.STRING },
              { key: 'Price', value: price, type: MetadataAttributeType.STRING },
              { key: 'Currency', value: currency, type: MetadataAttributeType.STRING },
            ],
          });
    
          const { uri: contentUri } = await storageClient.uploadAsJson(metadata);
          const resumed = await client.resumeSession();
          if (resumed.isErr()) return console.error(resumed.error);
    
          const sessionClient = resumed.value;
          const result = await post(sessionClient, {
            contentUri: uri(contentUri),
            feed: evmAddress('0xcf1932d62a06AE38D70879895441FcD0b4339044'),
          }).andThen(handleOperationWith(signer));
    
          console.log('Product posted:', result);
          router.push('/products');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='px-3 h-full sm:w-[36rem] mx-auto bg-stone-950 pb-64'>
      <ArrowLeftIcon width={24} color='white' onClick={() => router.push('/create')} className='absolute sm:left-8 top-5'/>

      <div className='h-12 border-b-2 border-gray-600 flex flex-row'>
        <h1 className='pt-2 mx-auto text-3xl text-yellow-500'>Create Product</h1>
      </div>

      <div className='px-3 pt-3'>
        <fieldset className="mb-4">
          <label className="text-white mb-2 block">Product Type</label>
          <select value={productType} onChange={(e) => setProductType(e.target.value)}
            className="bg-stone-950 border border-gray-600 text-white rounded-lg w-full focus:border-yellow-500 focus:outline-none h-10 pl-3">
            <option value="Affiliate">Affiliate Product</option>
            <option value="Digital">Digital Product</option>
          </select>
        </fieldset>

        <fieldset className="mb-4">
          <label className="text-white mb-2 block">Product Category</label>
          <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}
            className="bg-stone-950 border border-gray-600 text-white rounded-lg w-full focus:border-yellow-500 focus:outline-none h-10 pl-3">
            {categories.filter((cat) => cat.__typename === 'Post').map((cat) => <option key={cat.id} value={cat.id}>{cat.metadata.__typename === 'ImageMetadata' && cat.metadata.title}</option>)}
          </select>
        </fieldset>

        <fieldset className="mb-4">
          <label className="text-white mb-2 block">Product Name</label>
          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
            className="bg-transparent border border-gray-600 text-white rounded-lg w-full focus:border-yellow-500 focus:outline-none h-10 pl-3" />
        </fieldset>

        {productType === 'Affiliate' && (
          <fieldset className="mb-4">
            <label className="text-white mb-2 block">Product Link</label>
            <input type="text" value={productLink} onChange={(e) => setProductLink(e.target.value)}
              className="bg-transparent border border-gray-600 text-white rounded-lg w-full focus:border-yellow-500 focus:outline-none h-10 pl-3" />
          </fieldset>
        )}

        <fieldset className="mb-4">
          <label className="text-white mb-2 block">Description</label>
          <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)}
            className="bg-transparent border border-gray-600 text-white rounded-lg w-full focus:border-yellow-500 focus:outline-none h-32 p-3" />
        </fieldset>

        <fieldset className="mb-4">
          <label className="text-white mb-2 block">Upload Images</label>
          <button type="button" onClick={handleInputClick} className="w-full h-72 border-2 border-dashed border-gray-600 rounded-lg">
            <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className='hidden'/>
            {previews.length > 0 ? (
              <Carousel selectedItem={currentSlide} onChange={setCurrentSlide} showThumbs={false} showStatus={false}>
                {previews.map(({ file, url }, i) => (
                  <div key={url} className="relative h-64">
                    {isVideo(file) ? <video src={url} controls className="w-full h-full object-cover"/> : <img src={url} className="w-full h-full object-cover" alt={`img-${i}`}/>}
                    <button onClick={() => removeFile(i)} className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full">
                      <TrashIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </Carousel>
            ) : <p className="text-gray-400">Click to upload images</p>}
          </button>
        </fieldset>

        <div className="flex gap-4">
          <fieldset className="flex-1 mb-4">
            <label className="text-white mb-2 block">Price</label>
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}
              className="bg-transparent border border-gray-600 text-white rounded-lg w-full focus:border-yellow-500 focus:outline-none h-10 pl-3" />
          </fieldset>
          <fieldset className="flex-1 mb-4">
            <label className="text-white mb-2 block">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="bg-stone-950 border border-gray-600 text-white rounded-lg w-full focus:border-yellow-500 focus:outline-none h-10 pl-3">
              <option>USD</option>
              <option>EUR</option>
              <option>INR</option>
            </select>
          </fieldset>
        </div>

        <button onClick={handleSubmit} disabled={isLoading}
          className="w-full py-3 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400">
          {isLoading ? 'Posting...' : 'Post Product'}
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;