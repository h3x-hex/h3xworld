"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import {
  client
} from "@/helper/lensClient";
import { addReaction, bookmarkPost, repost, undoReaction } from "@lens-protocol/client/actions";

import { fetchPost } from "@lens-protocol/client/actions";
import { Post, postId, PostReactionType } from "@lens-protocol/client";
import {
  ArrowPathRoundedSquareIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronLeftIcon,
  HeartIcon,
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


const FullPost = () => {
    const { id } = useParams();
    const [media, setMedia] = useState<string[]>([]);
    const [timestamp, setTimestamp] = useState<string>();
    const [post, setPost] = useState<Post>();
    const [currentSlide, setCurrentSlide] = useState(0)

    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [reposted, setReposted] = useState(false)

    const [likes, setLikes] = useState(0)
    const [comments, setComments] = useState(0)
    const [reposts, setReposts] = useState(0)
    const [bookmarks, setBookmarks] = useState(0)

    const [modalOpen, setModalOpen] = useState<boolean>(false);

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
                post: postId(post!.id),
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
                post: postId(post!.id),
                reaction: PostReactionType.Upvote,
                });
                
                if (result.isErr()) {
                return console.error(result.error);
                }
                
                // Boolean indicating success adding the reaction
            }
            
            //await likePost(post!.id, user.id, liked);
        }
        if(interaction === 'repost')
        {
            const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
            const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
            const signer = wallet.connect(provider);

            await repost(sessionClient, {
            post: postId(post!.id),
            }).andThen(handleOperationWith(signer));
            setReposted(true);
        }

        if(interaction === 'bookmark')
        {
            const result = await bookmarkPost(sessionClient, {
            post: postId(post!.id),
            });
        
            if (result.isErr()) {
            return console.error(result.error);
            }
            setBookmarked(true)
        }

        if(interaction === 'comment')
        {
            router.push(`/post/${post!.id}`)
        }

    }
    

    return (
    <>
        <Navbar/>
        {
            post && 

            <div className="max-w-2xl mx-auto p-4 text-white">
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
                        src={post.author.metadata?.picture}
                        alt="avatar"
                        className="w-16 h-16 rounded-full border border-yellow-400"
                    />
                    <div>
                        <div className="flex flex-row gap-2">
                            <p className="font-semibold">{post.author.metadata?.name}</p>
                            <p className="text-gray-400">{timestamp}</p>
                        </div>
                        <p className="text-gray-400">@{post.author.username?.localName || post.author.metadata?.name}</p>
                    </div>
                </div>

                {post.metadata.__typename === 'ImageMetadata' && <h2 className="text-lg font-semibold mb-2 py-3">{post.metadata?.title}</h2>}

                {post.metadata.__typename === "ImageMetadata" && media.length > 0 && (
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
                    {post.metadata.__typename === "TextOnlyMetadata"
                    ? post.metadata.content
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
                    {reposts}
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
                    {bookmarks}
                    </button>
                </div>

                <div className="mt-6">
                <h3 className="text-lg font-bold text-yellow-500 mb-2 flex items-center gap-2">
                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5" /> Comments
                </h3>
                <div className="h-96 bg-stone-950">

                </div>
                
                </div>
            </div>
        }
        <BottomNav/>
    </>
    );
};

export default FullPost;