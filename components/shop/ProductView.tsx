'use client'

import React, { useEffect, useState } from 'react'
import { useParams} from 'next/navigation'
import { fetchPost } from '@lens-protocol/client/actions'
import { client } from '@/helper/lensClient'
import { Post, postId } from '@lens-protocol/client'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Navbar from '../nav/Navbar'
import BottomNav from '../nav/BottomNav'
 
const ProductView = () => {
    const { id } = useParams()

    const [product, setProduct] = useState<Post>()

    useEffect(() => {
        const fetchProduct = async () => {
        
            const result = await fetchPost(client, {
                post: postId(id as string)
            });
            
            if (result.isErr()) {
                return console.error(result.error);
            }
            
            const fetchedProduct = result.value;
            setProduct(fetchedProduct as Post)

        }

        fetchProduct()
    }, [id])

    if (!product) {
        return <div className="text-center text-white p-8 h-screen ">Loading product...</div>
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
                {product?.metadata.__typename === 'ImageMetadata' && <h1 className="text-xl font-bold text-yellow-500">{product?.metadata.title}</h1>}
            </div>
            {
                product.metadata.__typename == 'ImageMetadata' && (

                    <div className="p-6 max-w-xl mx-auto text-white h-screen">
                        <img src={product.metadata.image.item} alt={product.metadata.title!} className="w-full rounded-lg mb-4" />
                        <h1 className="text-2xl font-bold mb-2">{product.metadata.title!}</h1>
                        <p className="text-yellow-500 text-xl mb-4">${product.metadata.attributes[2].value}</p>
                        <p className="text-gray-300">{product.metadata.attributes[0].value}</p>

                        <div className='pt-3'>   
                        {
                            product.metadata.attributes[1].value === 'Digital' ?
                            
                            <button className='btn btn-warning text-black'>Buy Now</button> 
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

                    

                )
            }
            <BottomNav/>
        </>
    )
    
}

export default ProductView
