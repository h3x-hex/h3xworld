// components/QuoteModal.tsx
"use client"

import React, { useEffect, useRef, useState } from "react"
import { FaceSmileIcon, GifIcon, PhotoIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Post, postId, uri } from "@lens-protocol/client"
import { Carousel } from "react-responsive-carousel"
import moment from 'moment'
import { lensAccountOnly } from "@lens-chain/storage-client"
import { ethers } from "ethers"
import { chains } from "@lens-chain/sdk/viem"
import { storageClient } from "@/helper/storageClient"
import { image, MediaImageMimeType, textOnly } from "@lens-protocol/metadata"
import { post } from "@lens-protocol/client/actions"
import { useAtom } from "jotai"
import { userAtom } from "@/store/authState"
import { useRouter } from "next/navigation"
import { client } from "@/helper/lensClient"
import { goldColor } from "@/constants/colors"
import GifPicker from "../posts/GifPicker"
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'


interface PostAttachment {
  item: string,
  type: MediaImageMimeType,
}

type MediaFile = {
  file: File|null
  url: string
  type: string
}

export interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  /** The “post” you’re quoting: pass in whatever minimal data you need to render */
  quotedPost: Post
  quotedPostMedia: string[]
}

const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  quotedPost,
  quotedPostMedia,
}) => {
  const [quote, setQuote] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(false); 

  const [showPicker, setShowPicker] = useState(false)

  const [upgradePrompt, setUpgradePrompt] = useState(false)
  const [showGifPicker, setShowGifPicker] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [media, setMedia] = useState<MediaFile[]>([])

  const [user] = useAtom(userAtom)
  const router = useRouter()

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

  const handleInputClick = () => {
    if (!inputRef.current) return;
    inputRef.current?.click();
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

  const timestamp = quotedPost.timestamp
      ? moment(quotedPost.timestamp).fromNow()
      : 'just now'

  const addEmoji = (emoji: any) => {
    setQuote(prev => prev + emoji.native)
  }
  // close on <Esc> or click outside
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    const onClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey)
      document.addEventListener("mousedown", onClick)
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onClick)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async () => {
    try {
      const acl = lensAccountOnly(
        '0x2a88fDB064A1aFE5A0Cabf19E176B24CdA2EE1F7',
        chains.testnet.id
      );

      const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
      const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
      const signer = wallet.connect(provider);

      const resumed = await client.resumeSession();
          
      if (resumed.isErr()) {
        return console.error(resumed.error);
      }
      
      // SessionClient: { ... }
      const sessionClient = resumed.value;

      if(media.length > 1)
      {
        const filesURI: PostAttachment[] = [];

        for (let i = 0; i < media.length; i++) {
          const uploadedFileUri = await storageClient.uploadFile(media[i].file!, { acl });
          if(media[i].type === 'GIF') filesURI.push({ item: uploadedFileUri.gatewayUrl, type: MediaImageMimeType.GIF });
          else {filesURI.push({ item: uploadedFileUri.gatewayUrl, type: MediaImageMimeType.WEBP });}
        }

        const extraAttachments = filesURI.length > 1
          ? filesURI.slice(1)
          : [];

          const metadata = image({
            title: quote,
            image: filesURI[0],
            attachments: extraAttachments,
          });
          const { uri:contentUri } = await storageClient.uploadAsJson(metadata);         
  
          console.log(sessionClient);
  
          const result = await post(sessionClient, {
            contentUri: uri(contentUri),
            quoteOf: {
              post: postId(quotedPost.id), // the post to quote
            },
          });

          console.log(result)
  
      }
      if(media.length == 1)
      {
        const filesURI: PostAttachment[] = [];

        for (let i = 0; i < media.length; i++) {
          const uploadedFileUri = await storageClient.uploadFile(media[i].file!, { acl });
          filesURI.push({ item: uploadedFileUri.gatewayUrl, type: MediaImageMimeType.WEBP });
        }
        
        const metadata = image({
          title: quote,
          image: filesURI[0],
        });
        const { uri:contentUri } = await storageClient.uploadAsJson(metadata);

        const result = await post(sessionClient, {
          contentUri: uri(contentUri),
          quoteOf: {
            post: postId(quotedPost.id), // the post to quote
          },
        });

        console.log(result)
          
      } 
      else
      {
        const metadata = textOnly({
          content: quote,
        });
        const { uri:contentUri } = await storageClient.uploadAsJson(metadata);

        const result = await post(sessionClient, {
          contentUri: uri(contentUri),
          quoteOf: {
            post: postId(quotedPost.id), // the post to quote
          },
        });

        console.log(result)
      }
      router.push(`/${user.username}`)
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
    setQuote("")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        ref={modalRef}
        className="bg-stone-900 text-white rounded-xl w-full max-w-lg mx-4 sm:mx-0 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-700">
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-300 hover:text-white" />
          </button>
          <h2 className="text-lg font-semibold text-center mx-auto">Quote Post</h2>
        </div>

        {/* Quote Input */}
        <div className="p-4">
          <textarea
            rows={4}
            placeholder="Add a comment"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg p-3 resize-none focus:outline-none focus:border-yellow-500"
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
            className="rounded-md overflow-hidden h-64 sm:h-96 w-[80%] border-2 border-gray-600 border-dashed mb-4"
          >
            {media.map(({ file, url }, idx) => (
              <div key={url} className="relative h-64 sm:h-96 w-full">
                {file && file.type.startsWith('video') ? (
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

        {/* Quoted Post Preview */}
        <div className="px-4 pb-4">
          <div className="flex items-start space-x-3 border border-stone-700 rounded-lg p-3">
            {quotedPost.author.metadata?.picture ? (
              <img
                src={quotedPost.author.metadata?.picture}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-stone-700 rounded-full" />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{quotedPost.author.metadata?.name}</span>
                <span className="text-gray-400 text-sm">
                  @{quotedPost.author.username?.localName}
                </span>
                {quotedPost.timestamp && (
                  <span className="text-gray-500 text-xs">
                    · {timestamp}
                  </span>
                )}
              </div>
              {quotedPost.metadata.__typename === 'ImageMetadata' && (
                <h2 className="text-lg mb-2">{quotedPost.metadata?.title}</h2>
              )}
      
              <p className="text-md text-gray-300 py-3">
                {quotedPost.metadata.__typename === "TextOnlyMetadata" ? quotedPost.metadata.content : <></>}
              </p>
      
              {quotedPost.metadata.__typename === "ImageMetadata" && quotedPostMedia.length > 0 && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    useKeyboardArrows
                    showIndicators
                    className="rounded-md overflow-hidden h-64 sm:h-96 mb-4 border border-gray-700 cursor-pointer w-full"
                    onClickItem={(index) => {
                      setCurrentSlide(index)
                    }}
                  >
                    {quotedPostMedia.map((url, idx) => (
                      <div key={idx} className="relative w-full">
                        <img
                          src={url}
                          className="object-cover rounded-lg h-64 sm:h-96 w-full cursor-pointer"
                          alt={`media-${idx}`}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex space-x-4 text-gray-400">
              <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={(e) => handleFileChange(e)} className='hidden'/>
              <PhotoIcon className="h-5 w-5 cursor-pointer hover:text-white" onClick={() => handleInputClick()} color={goldColor}/>
              <GifIcon className="h-5 w-5 cursor-pointer hover:text-white" color={goldColor} onClick={() => setShowGifPicker(true)}/>
              <FaceSmileIcon className="h-5 w-5 cursor-pointer hover:text-white" color={goldColor} onClick={() => setShowPicker(!showPicker)}/>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!quote.trim()}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                quote.trim()
                  ? "bg-yellow-500 text-black hover:bg-yellow-600"
                  : "bg-yellow-500/50 text-black cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
          {showGifPicker && (
            <GifPicker
              apiKey={process.env.NEXT_PUBLIC_GIPHY_API_KEY!}
              onSelect={(url) => setMedia((m) => [...m, {file: null, url:url, type: 'GIF'}])}
             onClose={() => setShowGifPicker(false)}
            />
          )}

          {showPicker && (
            <div className="absolute z-50 mt-2">
              <Picker
                onSelect={addEmoji}
                theme="dark"
                showPreview={false}
                showSkinTones={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuoteModal;
