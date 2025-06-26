// components/TweetBox.tsx
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import {
  PhotoIcon,
  CurrencyDollarIcon,
  FaceSmileIcon,
  GifIcon,
} from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/authState';
import GifPicker from './GifPicker';
import EmojiPicker from 'emoji-picker-react'
import { goldColor } from '@/constants/colors';
import { MAX_FILE_SIZE_MB } from '@/constants/constants'
import TippingModal from '../modals/TippingModal';



type MediaFile = {
  file: File|null
  url: string
  type: string
}

type CommentBoxProps = {
  onPost: (content: string, media: MediaFile[]) => void
}

const CommentBox: React.FC<CommentBoxProps> = ({ onPost }) => {

  const [content, setContent] = useState<string>('');

  const [isTippingModalOpen, setIsTippingModalOpen] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [upgradePrompt, setUpgradePrompt] = useState(false)
  
  const [media, setMedia] = useState<MediaFile[]>([])
  
  const inputRef = useRef<HTMLInputElement | null>(null);

  const maxSizeMB = 8;

  const [user] = useAtom(userAtom);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePost = () => {
    console.log('first')
    onPost(content, media);
    setContent('');
    setMedia([]);
  };

  const handleTip = (amount: number) => {
    console.log(`Tipped: ${amount}`)
    // You can integrate your tipping logic here
  }

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

  return (
    <div className="flex border-b border-gray-200 px-1 py-3 dark:border-gray-700">
      <div className="mr-4">
        <Image
          src={user.profileImage!}
          alt="User Avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex-1">
        <textarea
          className="w-full h-20 resize-none bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none dark:text-gray-100"
          placeholder="What's happening?"
          value={content}
          onChange={handleChange}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex space-x-4 text-yellow-500">
            <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={(e) => handleFileChange(e)} className='hidden'/>
            <PhotoIcon className="h-5 w-5 cursor-pointer hover:text-yellow-500" onClick={() => handleInputClick()} color={goldColor}/>
            <CurrencyDollarIcon className="h-5 w-5 cursor-pointer hover:text-yellow-500" onClick={() => setIsTippingModalOpen(true)}/>
            <GifIcon className="h-5 w-5 cursor-pointer hover:text-white" color={goldColor} onClick={() => setShowGifPicker(true)}/>
            <FaceSmileIcon className="h-5 w-5 cursor-pointer hover:text-yellow-500" color={goldColor} onClick={() => setShowPicker(!showPicker)}/>
          </div>
          <button
            onClick={handlePost}
            disabled={!content.trim()}
            className="bg-yellow-500 text-black px-4 py-1 rounded-full disabled:opacity-50"
          >
            Comment
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
            <EmojiPicker onEmojiClick={(emojiObject) => setContent(prev => prev + emojiObject.emoji)} />
          </div>
        )}

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

        <TippingModal
          isOpen={isTippingModalOpen}
          onClose={() => setIsTippingModalOpen(false)}
          onTip={handleTip}
        />
      </div>
    </div>
  );
};

export default CommentBox;
