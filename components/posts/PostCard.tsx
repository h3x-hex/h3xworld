'use client'

import React, { useEffect, useState, useRef } from 'react'
import moment from 'moment'
import { Post, postId, PostReactionType } from '@lens-protocol/client'
import {
  ArrowPathRoundedSquareIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
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

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const timestamp = post.timestamp
    ? moment(post.timestamp).fromNow()
    : 'just now'

  const [media, setMedia] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [liked, setLiked] = useState(post.operations?.hasUpvoted || false)
  const [bookmarked, setBookmarked] = useState(post.operations?.hasBookmarked || false)
  const [reposted, setReposted] = useState(post.operations?.hasReposted.optimistic || false)
  const [likes, setLikes] = useState(post.stats.upvotes || 0)
  const [comments, setComments] = useState(post.stats.comments || 0)
  const [reposts, setReposts] = useState(post.stats.reposts || 0)
  const [bookmarks, setBookmarks] = useState(post.stats.bookmarks || 0)

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  const justClosedModalRef = useRef(false)
  
  const [user] = useAtom(userAtom);
  
  const router = useRouter()

  

  useEffect(() => {

    if(!user) return;

    console.log(post)

    if (post.metadata.__typename === "ImageMetadata") {
      const images = [post.metadata.image.item];
      const attachments = post.metadata.attachments.map(
      (a) => a.item
      );
      setMedia([...images, ...attachments]);
    }

    setLiked(post?.operations?.hasUpvoted!);
    setReposted(post?.operations?.hasReposted!.optimistic!);
    setBookmarked(post?.operations?.hasBookmarked!);
    setComments(post.stats.comments);
    setReposts(post.stats.reposts);
    setBookmarks(post.stats.bookmarks);
    console.log(post?.operations)

  }, [post, user])

  const postInteraction = async (interaction: string) => {

    const resumed = await client.resumeSession();
    if (resumed.isErr()) return console.error(resumed.error);

    const sessionClient = resumed.value;

    if(interaction === 'like')
    {
      setLiked(!liked);
      if(!liked && post.operations)
      {
        setLikes(likes + 1)
        const result = await addReaction(sessionClient, {
          post: postId(post.id),
          reaction: PostReactionType.Upvote
        });
        
        if (result.isErr()) {
          setLikes(likes - 1)
          return console.error(result.error);
        }
        
        // Boolean indicating success adding the reaction
        
      }
      if(liked && post.operations)
      {
        setLikes(likes - 1)
        const result = await undoReaction(sessionClient, {
          post: postId(post.id),
          reaction: PostReactionType.Upvote,
        });
        
        if (result.isErr()) {
          setLikes(likes + 1)
          return console.error(result.error);
        }
        
        // Boolean indicating success adding the reaction
        
      }
        
        //await likePost(post.id, user.id, liked);
    }
    if(interaction === 'repost')
    {
      const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
      const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
      const signer = wallet.connect(provider);

      await repost(sessionClient, {
        post: postId(post.id),
      }).andThen(handleOperationWith(signer));
      setReposted(true);

    }

    if(interaction === 'bookmark')
    {
      const result = await bookmarkPost(sessionClient, {
        post: postId(post.id),
      });
  
      if (result.isErr()) {
        return console.error(result.error);
      }
      setBookmarked(true)
    }

    if(interaction === 'comment')
    {
      router.push(`/post/${post.id}`)
    }

  }

  const handleCardClick = () => {
    if (justClosedModalRef.current) {
      justClosedModalRef.current = false // reset it
      return
    }
    router.push(`/post/${post.id}`)
  }

  return (
    <div className="bg-stone-900 rounded-xl p-4 text-white border-b-2 border-yellow-500 z-0">
      <div onClick={() => handleCardClick()}>
      <div className="flex items-center gap-3 mb-2">
        <img
          src={post.author.metadata?.picture}
          alt="avatar"
          className="w-12 h-12 rounded-full border border-yellow-400"
        />
        <div>
          <div className="flex flex-row gap-2">
            <p className="font-semibold">{post.author.metadata?.name}</p>
            <p className="text-gray-400">{timestamp}</p>
          </div>
          <p className="text-gray-400">@{post.author.username?.localName || post.author.metadata?.name}</p>
        </div>
      </div>

      {post.metadata.__typename === 'ImageMetadata' && <h2 className="text-lg mb-2">{post.metadata?.title}</h2>}
      <p className="text-md text-gray-300 py-3">
        {post.metadata.__typename === "TextOnlyMetadata"
        ? post.metadata.content
        : <></>}
      </p>

      {post.metadata.__typename === "ImageMetadata" && media.length > 0 && (
        <div onClick={(e) => e.stopPropagation()}>
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            useKeyboardArrows
            showIndicators
            className="rounded-md overflow-hidden h-64 sm:h-96 mb-4 border border-gray-700 cursor-pointer"
            onClickItem={(index) => {
              setCurrentSlide(index);
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

      <div className="flex justify-between text-gray-400 text-sm border-t border-stone-700 pt-3">
        <button
          onClick={() => postInteraction('like')}
          className="flex items-center gap-2 hover:text-yellow-500 transition"
        >
          {liked ? <HeartSolid color="#eab308" width={20} /> : <HeartIcon color="#eab308" width={20} />}
          { likes }
        </button>

        <button
          onClick={() => postInteraction('comment')}
          className="flex items-center gap-2 hover:text-yellow-500 transition"
        >
          <ChatBubbleLeftEllipsisIcon color="#eab308" width={20} />
          { comments }
        </button>

        <button
          onClick={() => postInteraction('repost')}
          className={`flex items-center gap-2 transition ${
            reposted ? 'font-bold text-yellow-500' : 'hover:text-yellow-500'
          }`}
        >  {
            reposted ?
            <ArrowPathRoundedSquareIcon color="#eab308" width={20} strokeWidth={2.5}/>
            :
            <ArrowPathRoundedSquareIcon width={20} color="#eab308" />
          }
          { reposts }
        </button>

        <button
          onClick={() => postInteraction('bookmark')}
          className="flex items-center gap-2 hover:text-yellow-500 transition"
        >
          {bookmarked ? (
            <BookmarkSolid color="#eab308" width={20} />
          ) : (
            <BookmarkIcon color="#eab308" width={20} />
          )}
          { bookmarks }
        </button>
      </div>
    </div>
    
  )
  
  
}

export default PostCard
