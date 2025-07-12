'use client'

import { userAtom } from '@/store/authState';
import { AnyPost, evmAddress, Post, postId } from '@lens-protocol/client';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react'
import Navbar from '../nav/Navbar';
import { fetchPost, fetchPosts } from '@lens-protocol/client/actions';
import { client } from '@/helper/lensClient';
import { useParams } from 'next/navigation';
import PostCard from './PostCard';
import BottomNav from '../nav/BottomNav';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const PortfolioCollection = () => {

    const { id } = useParams();
    
    const [posts, setPosts] = useState<Post[]>([]);
    const [portfolioCollection, setPortfolioCollection] = useState<Post>();

    const [gridView, setGridView] = useState(false);

    const [user] = useAtom(userAtom);

    useEffect(() => {

        const loadPostAndComments = async () => {

            const resumed = await client.resumeSession();
            if (resumed.isErr()) return console.error(resumed.error);

            const sessionClient = resumed.value;
            //if (!id) return;
            const result = await fetchPost(sessionClient, {
                post: postId(id as string),
            });
            
            if (result.isErr()) {
                return console.error(result.error);
            }
            
            const postResult = result.value;
            setPortfolioCollection(postResult as Post)

            if(postResult?.__typename === 'Post')
            {
                if(postResult.metadata.__typename === 'ImageMetadata')
                {
                    const fetchedPosts = await fetchPosts(sessionClient, {
                        filter: {
                        authors: [evmAddress(user.accountAddress!)],
                        feeds: [
                            {
                            feed: evmAddress("0x48d5E01d21Ad51993c297935b3d618b99f7e2868"),
                            }
                        ],
                        metadata: {
                            tags: { all: [postResult.metadata.title!] },
                        }
                        },
                    });

                    if (fetchedPosts.isErr()) {
                        console.error('Failed to load posts');
                        return;
                    }

                    const { items } = fetchedPosts.value;
                    const postArr = items.filter((item: AnyPost) => item.__typename === 'Post') as Post[];
                    console.log(postArr)
                    setPosts(postArr)
                }
            }

            console.log(postResult)
        };
        loadPostAndComments();
    }, []);

    return (
        <div className='h-screen bg-stone-950'>
            <Navbar/>
            <div className='flex flex-row gap-72'>
                <div className="flex items-center gap-4 my-4">
                    <button
                        onClick={() => history.back()}
                        className="p-2 rounded-full hover:bg-stone-800 transition"
                    >
                        <ChevronLeftIcon width={24} className='text-yellow-500'/>
                    </button>
                    {portfolioCollection?.metadata.__typename === 'ImageMetadata' && <h1 className="text-xl font-bold text-yellow-500">{portfolioCollection?.metadata.title}</h1>}
                </div>
                <div className='pt-6'>
                    <button className='' onClick={() => setGridView(!gridView)}>
                        {
                            gridView ?

                            <span className='material-symbols-outlined text-yellow-500'>grid_on</span>

                            :

                            <span className='material-symbols-outlined text-yellow-500'>post</span>
                        }
                    </button>
                </div>
            </div>
            <div className='w-full px-3'>
                {
                    posts &&

                    gridView == true?

                    <div className='grid grid-cols-3 gap-1'>
                        {(posts.map((post) => (
                            <PostCard key={post.id} postItem={post} gridView={gridView}/>
                        )))}
                        {(posts.map((post) => (
                            <PostCard key={post.id} postItem={post} gridView={gridView}/>
                        )))}
                        {(posts.map((post) => (
                            <PostCard key={post.id} postItem={post} gridView={gridView}/>
                        )))}
                    </div>

                    :

                    (posts.map((post) => (
                        <PostCard key={post.id} postItem={post} gridView={gridView}/>
                    )))

                }
            </div>
            <BottomNav/>
        </div>
    )
}

export default PortfolioCollection