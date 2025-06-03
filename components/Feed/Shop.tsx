'use client'

import { client } from '@/helper/lensClient'
import { evmAddress, Post } from '@lens-protocol/client'
import { fetchPosts } from '@lens-protocol/client/actions'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface PostsFeedProps {
  address: string;
}

const ShopGrid = ({address}: PostsFeedProps) => {

  const [productsList, setProductsList] = useState<Post[]>([]);
  const [categoriesList, setCategoriesList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const fetchProducts = async () => {
    setIsLoading(true);

    const result = await fetchPosts(client, {
      filter: {
        authors: [evmAddress(address)],
        feeds: [
          {
            feed: evmAddress("0xcf1932d62a06AE38D70879895441FcD0b4339044"),
          }
        ],
      },
    });
  
    if (result.isErr()) {
      return console.error(result.error);
    }
  
    const { items } = result.value;
    console.log(items)
    const postArr = items.filter((item) => item.__typename === 'Post') as Post[];
    setProductsList(postArr);
    setIsLoading(false);

  };

  const fetchCategories = async () => {
    setIsLoading(true);

    const result = await fetchPosts(client, {
      filter: {
        authors: [evmAddress(address)],
        feeds: [
          {
            feed: evmAddress("0xf57F719A9d7e456b8106E1d7054E4F56a103E411"),
          }
        ],
      },
    });
  
    if (result.isErr()) {
      return console.error(result.error);
    }
  
    const { items } = result.value;
    console.log(items)
    const postArr = items.filter((item) => item.__typename === 'Post') as Post[];
    setCategoriesList(postArr);
    setIsLoading(false);

  };

  useEffect(() => {
      
    fetchCategories();
    fetchProducts();
      
    
  }, [])


  return (
    <>
    {
      isLoading ?

      <div className='h-full pb-64 bg-stone-950 mx-auto flex items-center justify-center pt-32'><span className="loading loading-spinner text-warning text-lg"></span></div>

      :

      <div className="bg-black min-h-screen text-white p-5">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 text-center">Shop</h2>
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
        {categoriesList.map((category) => (
            category.metadata.__typename === 'ImageMetadata' &&

            <div key={category.metadata.title} className="bg-stone-900 rounded-xl border border-yellow-500 overflow-hidden shadow-sm hover:shadow-lg transition w-full p-1" onClick={() => router.push(`/shop/category/${category.id}?fromTab=Shop`)}>
              <img
                src={category.metadata.image.item}
                alt={category.metadata.title!}
                className="w-full h-36 object-contain"
              />
              <div className="p-3">
                <h2 className="text-lg font-semibold text-white">{category.metadata.title}</h2>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-2">Featured Products</h3>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mx-auto">
          {productsList.map((product) => (
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
                  
                  <button className='btn btn-warning w-full'>Buy Now</button> 
                  : 
                  <a
                    href={product.metadata.attributes[4].value}
                    className="mt-2 inline-block w-full bg-yellow-500 text-black text-sm font-bold text-center py-1.5 rounded-lg border border-yellow-500 hover:bg-yellow-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Buy Now</a>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      }
    </>
  )
}

export default ShopGrid
