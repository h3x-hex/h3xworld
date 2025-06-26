"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import { client } from "@/helper/lensClient";
import { addReaction, bookmarkPost, repost, undoBookmarkPost, undoReaction } from "@lens-protocol/client/actions";
import { MediaImageMimeType } from '@lens-protocol/metadata'
import { fetchPost } from "@lens-protocol/client/actions";
import { Post, postId, PostReactionType } from "@lens-protocol/client";
import {
  ArrowPathRoundedSquareIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronLeftIcon,
  HeartIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartSolid,
  BookmarkIcon as BookmarkSolid,
} from '@heroicons/react/24/solid'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ImageModal from './ImageModal'
import { useAtom } from "jotai";
import { userAtom } from "@/store/authState";
import { ethers } from "ethers";
import { handleOperationWith } from "@lens-protocol/client/ethers";
import Navbar from "../nav/Navbar";
import BottomNav from "../nav/BottomNav";
import CommentBox from "./CommentBox";
import { goldColor, greyColor, whiteColor } from "@/constants/colors";
import QuoteModal from "../modals/QuoteModal";
import { uploadMediaToLens } from "@/utils/uploadMediaLens";
import { uploadPostToLens } from "@/utils/uploadPostLens";
import Comments from "./Comments";

interface PostAttachment {
  item: string,
  type: MediaImageMimeType,
}

type MediaFile = {
  file: File|null
  url: string
  type: string
}

const FullPost = () => {
    const { id } = useParams();
    const [media, setMedia] = useState<string[]>([]);
    const [timestamp, setTimestamp] = useState<string>();
    const [postItem, setPost] = useState<Post>();
    const [currentSlide, setCurrentSlide] = useState(0)

    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [reposted, setReposted] = useState(false)

    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState(0)
    const [reposts, setReposts] = useState(0)
    const [quotes, setQuotes] = useState(0)
    const [bookmarks, setBookmarks] = useState(0)

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [dropdownOpen, setDropDownOpen] = useState(false);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    
    const [user] = useAtom(userAtom);

    const router = useRouter()

    useEffect(() => {
    const loadPostAndComments = async () => {
        //if (!id) return;

        const resumed = await client.resumeSession();
        if (resumed.isErr()) return console.error(resumed.error);

        const sessionClient = resumed.value;
        
        const result = await fetchPost(sessionClient, {
            post: postId(id as string),
        });
        
        if (result.isErr()) {
            return console.error(result.error);
        }

        
        const postResult = result.value;
        console.log(postResult)
        if (postResult && postResult.__typename === "Post") {
            setPost(postResult);

            setLiked(postResult?.operations?.hasUpvoted!);
            setReposted(postResult?.operations?.hasReposted!.optimistic!);
            setBookmarked(postResult?.operations?.hasBookmarked!);

            setLikes(postResult.stats.upvotes);
            setComments(postResult.stats.comments);
            setReposts(postResult.stats.reposts);
            setQuotes(postResult.stats.quotes);
            setBookmarks(postResult.stats.bookmarks);

            setTimestamp(postResult.timestamp
            ? moment(postResult.timestamp).fromNow()
            : 'just now')

            // media
            if (postResult.metadata.__typename === "ImageMetadata") {
                const images = [postResult.metadata.image.item];
                const attachments = postResult.metadata.attachments.map(
                (a) => a.item
                );
                setMedia([...images, ...attachments]);
            }
            console.log(postResult?.operations?.hasUpvoted!)        
        }
    };
        loadPostAndComments();
    }, []);

    const postInteraction = async (interaction: string) => {

        const resumed = await client.resumeSession();
        if (resumed.isErr()) return console.error(resumed.error);

        const sessionClient = resumed.value;

        if(interaction === 'like')
        {
            setLiked(!liked);
            if(!liked)
            {
                const result = await addReaction(sessionClient, {
                    post: postId(postItem!.id),
                    reaction: PostReactionType.Upvote
                });
                
                if (result.isErr()) {
                return console.error(result.error);
                }
                
                // Boolean indicating success adding the reaction
            }
            else
            {
                const result = await undoReaction(sessionClient, {
                    post: postId(postItem!.id),
                    reaction: PostReactionType.Upvote,
                });
                
                if (result.isErr()) {
                return console.error(result.error);
                }
                
                // Boolean indicating success adding the reaction
            }
            
            //await likePost(postItem!.id, user.id, liked);
        }
        if(interaction === 'repost')
        {
            const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
            const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
            const signer = wallet.connect(provider);

            await repost(sessionClient, {
                post: postId(postItem!.id),
            }).andThen(handleOperationWith(signer));
            setReposted(true);
        }

        if(interaction === 'bookmark')
        {
            if(!bookmarked && postItem!.operations)
            {
                const result = await bookmarkPost(sessionClient, {
                    post: postId(postItem!.id),
                });
            
                if (result.isErr()) {
                return console.error(result.error);
                }
                setBookmarked(true)
                setBookmarks(bookmarks + 1)
            }
            if(bookmarked && postItem!.operations)
            {
                const result = await undoBookmarkPost(sessionClient, {
                    post: postId(postItem!.id),
                });
            
                if (result.isErr()) {
                return console.error(result.error);
                }
                setBookmarked(false)
                setBookmarks(bookmarks - 1)
            }
        }

        if(interaction === 'comment')
        {
            router.push(`/postItem/${postItem!.id}`)
        }

    }
    
    const handleCommentSubmit = async (content: string, media: MediaFile[]) => {
        
        const filesURI: PostAttachment[] =  await uploadMediaToLens(media);

        uploadPostToLens(media.length, content, filesURI, 'comment', postItem!.id, undefined, undefined, undefined);
        
    }

    return (
    <>
        <Navbar/>
        {
            postItem && 

            <div className="max-w-2xl mx-auto p-4 text-white min-h-screen">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-stone-800 transition"
                    >
                        <ChevronLeftIcon width={24} color="#eab308"/>
                    </button>
                    <h1 className="text-2xl font-bold text-white pb-1">Post</h1>
                </div>

                <div className="bg-stone-950 pb-3">
                <div className="flex items-center gap-3 mb-2">
                    <img
                        src={postItem.author.metadata?.picture}
                        alt="avatar"
                        className="w-16 h-16 rounded-full border border-yellow-400"
                    />
                    <div>
                        <div className="flex flex-row gap-2">
                            <p className="font-semibold">{postItem.author.metadata?.name}</p>
                            <p className="text-gray-400">{timestamp}</p>
                        </div>
                        <p className="text-gray-400">@{postItem.author.username?.localName || postItem.author.metadata?.name}</p>
                    </div>
                </div>

                {postItem.metadata.__typename === 'ImageMetadata' && <h2 className="text-lg font-semibold mb-2 py-3">{postItem.metadata?.title}</h2>}

                {postItem.metadata.__typename === "ImageMetadata" && media.length > 0 && (
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop
                        useKeyboardArrows
                        showIndicators
                        className="rounded-md overflow-hidden mb-4 border border-gray-700"
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
                )}

                {modalOpen && (
                    <ImageModal
                        media={media}
                        startIndex={currentSlide}
                        onClose={() => setModalOpen(false)}
                    />
                )}

                <p className="text-xl text-gray-100">
                    {postItem.metadata.__typename === "TextOnlyMetadata"
                    ? postItem.metadata.content
                    : <></>}
                </p>
                </div>

                <div className="flex justify-between text-gray-400 text-sm border-t border-stone-700 pt-3">
                    <button
                        onClick={() => postInteraction('like')}
                        className="flex items-center gap-2 hover:text-yellow-500 transition"
                    >
                    {liked ? <HeartSolid color="#eab308" width={20} /> : <HeartIcon color="#eab308" width={20} />}
                    {likes}
                    </button>

                    <button
                        onClick={() => postInteraction('comment')}
                        className="flex items-center gap-2 hover:text-yellow-500 transition"
                    >
                    <ChatBubbleLeftEllipsisIcon color="#eab308" width={20} />
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

                    <QuoteModal
                        isOpen={isQuoteOpen}
                        onClose={() => setIsQuoteOpen(false)}
                        quotedPost={postItem}
                        quotedPostMedia={media}
                    />

                    <button
                        onClick={() => postInteraction('bookmark')}
                        className="flex items-center gap-2 hover:text-yellow-500 transition"
                    >
                    {bookmarked ? (
                        <BookmarkSolid color="#eab308" width={20} />
                    ) : (
                        <BookmarkIcon color="#D2D2D2" width={20} />
                    )}
                    {bookmarks}
                    </button>
                </div>

                <div className="mt-6">
                <h3 className="text-lg font-bold text-yellow-500 mb-2 flex items-center gap-2">
                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5" /> Comments
                </h3>
                <div className="h-36 bg-stone-950">
                    <CommentBox onPost={handleCommentSubmit}/>
                </div>
                <div className="pt-2">
                    <Comments postItemId={postItem.id}/>
                </div>
                </div>
            </div>
        }
        <BottomNav/>
    </>
    );
};

export default FullPost;