'use client'

import { fetchPostReferences } from '@lens-protocol/client/actions'
import { Post, AnyPost, postId, PostReferenceType, PostId } from "@lens-protocol/client";
import React, { useEffect, useState } from "react";
import { client } from '@/helper/lensClient';
import CommentCard from './CommentCard';

interface CommentsProps
{
    postItemId: string | PostId,
}

const Comments: React.FC<CommentsProps> = ( { postItemId } ) => {

    const [comments, setComments] = useState<Post[]>([])

    useEffect(() => {

        const fetchComments = async () => {

            const result = await fetchPostReferences(client, {
                referencedPost: postId(postItemId),
                referenceTypes: [PostReferenceType.CommentOn],
            })

            if (result.isErr()) {
                return console.error(result.error);
            }

            
            const { items } = result.value;
            const postArr = items.filter((item: AnyPost) => item.__typename === 'Post') as Post[];

            setComments(postArr);
            console.log(postArr)
        }

        fetchComments();

    }, [])

    return (
        <div>
            { comments &&

                (comments.map((comment) => (
                    <CommentCard comment={comment}/>
                )))
            }
        </div>
    )
}

export default Comments