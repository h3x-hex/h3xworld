'use client'

import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { Post, postId, PostReactionType } from '@lens-protocol/client'
import {
  ArrowPathRoundedSquareIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartSolid,
  BookmarkIcon as BookmarkSolid,
} from '@heroicons/react/24/solid'
import { addReaction, bookmarkPost, repost, undoReaction } from "@lens-protocol/client/actions";
import { Carousel } from 'react-responsive-carousel'
import { useRouter } from 'next/navigation'
import { client } from '@/helper/lensClient'
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'
import { handleOperationWith } from '@lens-protocol/client/ethers'
import { ethers } from 'ethers'
import ImageModal from './ImageModal'
import QuoteModal from '../modals/QuoteModal'
import { goldColor, greyColor, whiteColor } from '@/constants/colors'

interface PostCardProps {
  postItem: Post
}

const PostCard: React.FC<PostCardProps> = ({ postItem }) => {
  const timestamp = postItem.timestamp
    ? moment(postItem.timestamp).fromNow()
    : 'just now'

  const [media, setMedia] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [liked, setLiked] = useState(postItem.operations?.hasUpvoted || false)
  const [bookmarked, setBookmarked] = useState(postItem.operations?.hasBookmarked || false)
  const [reposted, setReposted] = useState(postItem.operations?.hasReposted.optimistic || false)
  const [likes, setLikes] = useState(postItem.stats.upvotes || 0)
  const [comments, setComments] = useState(postItem.stats.comments || 0)
  const [reposts, setReposts] = useState(postItem.stats.reposts || 0)
  const [quotes, setQuotes] = useState(postItem.stats.quotes || 0)
  const [bookmarks, setBookmarks] = useState(postItem.stats.bookmarks || 0)

  const [modalOpen, setModalOpen] = useState(false)
  const [dropdownOpen, setDropDownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  const [isQuoteOpen, setIsQuoteOpen] = useState(false)

  const justClosedModalRef = useRef(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const startY = useRef<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const [translateY, setTranslateY] = useState(100)

  const [user] = useAtom(userAtom)
  const router = useRouter()

  useEffect(() => {
    if (!user) return

    if (postItem.metadata.__typename === "ImageMetadata") {
      const images = [postItem.metadata.image.item]
      const attachments = postItem.metadata.attachments.map((a) => a.item)
      setMedia([...images, ...attachments])
    }

    setLiked(postItem?.operations?.hasUpvoted!)
    setReposted(postItem?.operations?.hasReposted!.optimistic!)
    setBookmarked(postItem?.operations?.hasBookmarked!)
    setComments(postItem.stats.comments)
    setReposts(postItem.stats.reposts)
    setQuotes(postItem.stats.quotes)
    setBookmarks(postItem.stats.bookmarks)

    if (menuOpen) {
      document.body.classList.add("overflow-hidden")
      setTimeout(() => setTranslateY(0), 10)
    } else {
      document.body.classList.remove("overflow-hidden")
      setTranslateY(100)
    }

    return () => document.body.classList.remove("overflow-hidden")
    
  }, [postItem, user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu()
      }
    }

    if (menuOpen) {
      document.body.classList.add('overflow-hidden')
      document.addEventListener('mousedown', handleClickOutside)
      setTimeout(() => setAnimateIn(true), 10)
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const handleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(true)
  }

  const handleCloseMenu = () => {
    setAnimateIn(false)
    setTimeout(() => setMenuOpen(false), 300)
  }

  /*const handleQuote = (quoteText: string) => {
    console.log("Submitting quote:", quoteText)
    // send to backend...
    
  }*/

  const postInteraction = async (interaction: string) => {
    const resumed = await client.resumeSession()
    if (resumed.isErr()) return console.error(resumed.error)
    const sessionClient = resumed.value

    if (interaction === 'like') {
      setLiked(!liked)
      if (!liked) {
        setLikes(likes + 1)
        const result = await addReaction(sessionClient, {
          post: postId(postItem.id),
          reaction: PostReactionType.Upvote,
        })
        if (result.isErr()) {
          setLikes(likes - 1)
          return console.error(result.error)
        }
      } else {
        setLikes(likes - 1)
        const result = await undoReaction(sessionClient, {
          post: postId(postItem.id),
          reaction: PostReactionType.Upvote,
        })
        if (result.isErr()) {
          setLikes(likes + 1)
          return console.error(result.error)
        }
      }
    }

    if (interaction === 'repost') {
      const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!)
      const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx')
      const signer = wallet.connect(provider)

      await repost(sessionClient, {
        post: postId(postItem.id),
      }).andThen(handleOperationWith(signer))
      setReposted(true)
    }

    if (interaction === 'quote') {

      
    }

    if (interaction === 'bookmark') {
      const result = await bookmarkPost(sessionClient, {
        post: postId(postItem.id),
      })
      if (result.isErr()) return console.error(result.error)
      setBookmarked(true)
    }

    if (interaction === 'comment') {
      router.push(`/post/${postItem.id}`)
    }
  }

  const handleCardClick = () => {
    if (justClosedModalRef.current) {
      justClosedModalRef.current = false
      return
    }
    router.push(`/post/${postItem.id}`)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    setDragging(true)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || startY.current === null) return
    const deltaY = e.touches[0].clientY - startY.current
    if (deltaY > 0) {
      const percentage = Math.min((deltaY / window.innerHeight) * 100, 100)
      setTranslateY(percentage)
    }
  }

  const handleTouchEnd = () => {
    if (translateY > 25) {
      handleCloseMenu()
    } else {
      setTranslateY(0) // snap back
    }
    setDragging(false)
    startY.current = null
  }
  
  return (
    <div className="bg-black py-4 text-white border-b border-yellow-500 relative">
      <div onClick={handleCardClick} className='z-0'>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img
              src={postItem.author.metadata?.picture}
              alt="avatar"
              className="w-12 h-12 rounded-full border border-yellow-400"
            />
            <div>
              <div className="flex flex-row gap-2">
                <p className="font-semibold">{postItem.author.metadata?.name}</p>
                <p className="text-gray-400">{timestamp}</p>
                <button
                  onClick={handleOpenMenu}
                  className="hover:bg-stone-700 rounded-full right-4 absolute"
                >
                  <EllipsisHorizontalIcon className="w-6 text-white" />
                </button>
              </div>
              <p className="text-gray-400">@{postItem.author.username?.localName || postItem.author.metadata?.name}</p>
            </div>
          </div>

          
        </div>

        <div className='pl-[3.75rem]'>
          {postItem.metadata.__typename === 'ImageMetadata' && (
            <h2 className="text-md mb-2">{postItem.metadata?.title}</h2>
          )}

          <p className="text-md text-gray-300 py-3">
            {postItem.metadata.__typename === "TextOnlyMetadata" ? postItem.metadata.content : <></>}
          </p>

          {postItem.metadata.__typename === "ImageMetadata" && media.length > 0 && (
            <div onClick={(e) => e.stopPropagation()}>
              <Carousel
                showThumbs={false}
                showStatus={false}
                infiniteLoop
                useKeyboardArrows
                showIndicators
                className="rounded-md overflow-hidden h-64 sm:h-96 mb-4 border border-gray-700 cursor-pointer"
                onClickItem={(index) => {
                  setCurrentSlide(index)
                  setModalOpen(true)
                }}
              >
                {media.map((url, idx) => (
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

      {modalOpen && (
        <ImageModal
          media={media}
          startIndex={currentSlide}
          onClose={() => {
            justClosedModalRef.current = true
            setModalOpen(false)
          }}
        />
      )}

      <div className="flex justify-between text-gray-400 text-sm border-t border-stone-700 pt-3 pl-[3.75rem] pr-4">
        <button
          onClick={() => postInteraction('like')}
          className="flex items-center gap-2 hover:text-yellow-500 transition"
        >
          {liked ? <HeartSolid color="#eab308" width={20} /> : <HeartIcon color="#D2D2D2" width={20} />}
          {likes}
        </button>

        <button
            onClick={() => postInteraction('comment')}
            className="flex items-center gap-2 hover:text-yellow-500 transition"
          >
          <ChatBubbleLeftEllipsisIcon color="#D2D2D2" width={20} />
          {comments}
        </button>

        <div className="dropdown">
          <button
            className={`flex items-center gap-2 transition ${
              reposted ? 'font-bold text-yellow-500' : 'hover:text-yellow-500'
            }`}
            onClick={() => setDropDownOpen(true)}
          >
            { reposted ? <ArrowPathRoundedSquareIcon width={20} color={goldColor} strokeWidth={2.5} /> : <ArrowPathRoundedSquareIcon width={20} color={greyColor} strokeWidth={1} />}
            {reposts + quotes}
          </button>
          {
            dropdownOpen &&
            <ul className="menu dropdown-content bg-stone-800 rounded-box z-1 w-36 p-2 shadow-sm text-white text-lg">
              <li className='flex flex-row z-10'><button onClick={() => {setDropDownOpen(false);postInteraction('repost')}}><ArrowPathRoundedSquareIcon width={20} color={whiteColor} strokeWidth={2} className='z-10'/>Repost</button></li>
              <li className='flex flex-row z-10'><button onClick={() => {setDropDownOpen(false);setIsQuoteOpen(true)}}><PencilIcon width={20} color={whiteColor} strokeWidth={2}/>Quote</button></li>
            </ul>
          }
        </div>

        <button
          onClick={() => postInteraction('bookmark')}
          className="flex items-center gap-2 hover:text-yellow-500 transition"
        >
          {bookmarked ? <BookmarkSolid color={goldColor} width={20} /> : <BookmarkIcon color={greyColor} width={20} />}
          {bookmarks}
        </button>
      </div>

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        quotedPost={postItem}
        quotedPostMedia={media}
      />

      {/* Bottom Sheet Modal with Locked Background Scroll */}
      {menuOpen && (
        <div className="fixed inset-0 z-100 pointer-events-none h-screen">
          {/* Top 25% overlay (dimmed, clickable to close) */}
          <div
            className="absolute top-0 left-0 w-full pointer-events-auto"
            style={{ height: '25vh' }}
            onClick={handleCloseMenu}
          >
            <div className="w-full h-full bg-transparent backdrop-blur-xs" />
          </div>

          {/* Bottom modal */}
          <div
            ref={menuRef}
            className={`
              fixed bottom-0 left-1/2 transform -translate-x-1/2
              w-full sm:w-96 bg-stone-800 rounded-t-2xl
              transition-transform duration-300
              ${animateIn ? 'translate-y-0' : 'translate-y-full'}
              pointer-events-auto flex flex-col
            `}
            style={{ height: '75vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex justify-center py-3 border-b border-stone-700"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-12 h-1.5 bg-gray-500 rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
              <button className="w-full text-left">Report postItem</button>
              <button className="w-full text-left">Mute User</button>
              <button className="w-full text-left">Block User</button>
              {/* Simulated scroll content */}
              <div className="h-96"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard;