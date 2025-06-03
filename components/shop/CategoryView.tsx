'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { fetchPost, fetchPosts } from '@lens-protocol/client/actions'
import { client } from '@/helper/lensClient'
import { AnyPost, evmAddress, Post, postId } from '@lens-protocol/client'
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Navbar from '../nav/Navbar'
import BottomNav from '../nav/BottomNav'
 
const CategoryView = () => {
    const { id } = useParams()
    const router = useRouter();
    
    const [user] = useAtom(userAtom);

    const [category, setCategory] = useState<Post>()
    const [products, setProducts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchCategory = async () => {
        
            const result = await fetchPost(client, {
                post: postId(id as string),
            });
            
            if (result.isErr()) {
                return console.error(result.error);
            }
            
            const postResult = result.value;
            setCategory(postResult as Post);
    
            if(postResult?.__typename === 'Post')
            {
                if(postResult.metadata.__typename === 'ImageMetadata')
                {
                    const fetchedPosts = await fetchPosts(client, {
                        filter: {
                          authors: [evmAddress(user.accountAddress!)],
                          feeds: [
                            {
                              feed: evmAddress("0xf57F719A9d7e456b8106E1d7054E4F56a103E411"),
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
                    const catArr = items.filter((item: AnyPost) => item.__typename === 'Post') as Post[];
                    console.log(catArr)
                    setProducts(catArr)
                }
            }
        }

        fetchCategory()
    }, [id])


    if (!category) {
        return <div className="text-center text-white p-8 h-screen ">Loading...</div>
    }

    return (
        <>  
            <Navbar/>
            <div className="flex items-center gap-4 my-4 pb-3 border-b border-gray-600">
                <button
                    onClick={() => history.back()}
                    className="p-2 rounded-full hover:bg-stone-800 transition"
                >
                    <ChevronLeftIcon width={24} color="#eab308"/>
                </button>
                {category?.metadata.__typename === 'ImageMetadata' && <h1 className="text-xl font-bold text-yellow-500">{category?.metadata.title}</h1>}
            </div>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-[96%] mx-auto">
                {
                    products.length > 0 ? 

                    products.map((product) => (
                        product.metadata.__typename === 'ImageMetadata' &&
    
                        <div key={product.metadata.title} className="bg-stone-900 rounded-xl border border-yellow-500 overflow-hidden shadow-sm hover:shadow-lg transition w-full p-1" onClick={() => router.push(`/shop/product/${product.id}?fromTab=Shop`)}>
                        <img
                            src={product.metadata.image.item}
                            alt={product.metadata.title!}
                            className="w-full h-36 object-contain"
                        />
                        <div className="p-3">
                            <h3 className="text-lg font-semibold text-white">{product.metadata.title}</h3>
                            <p className="text-yellow-500 font-bold text-lg">{product.metadata.attributes[2].value} {product.metadata.attributes[3].value}</p>
                            <p className="text-md text-gray-400 my-1">{product.metadata.attributes[1].value}</p>
                            {
                            product.metadata.attributes[1].value === 'Digital' ?
                            
                            <button className='btn btn-warning'>Buy Now</button> 
                            : 
                            <a
                                href={product.metadata.attributes[4].value}
                                className="mt-2 inline-block w-full bg-yellow-500 text-black text-sm font-bold text-center py-1.5 rounded-lg border border-yellow-500 hover:bg-yellow-400"
                                target="_blank"
                                rel="noopener noreferrer"
                            >View Product</a>
                            }
                        </div>
                        </div>
                    ))
                    
                    :

                    <div className='h-screen'>
                    </div>
                    
                }
            </div>
            <BottomNav/>
        </>
    )
    
}

export default CategoryView
