import { textOnly, MediaImageMimeType, image} from '@lens-protocol/metadata'
import { addReaction, bookmarkPost, repost, undoBookmarkPost, undoReaction, post } from "@lens-protocol/client/actions";
import { Post, uri, postId, evmAddress } from '@lens-protocol/client'
import { storageClient } from '@/helper/storageClient';
import { client } from "@/helper/lensClient";
import { handleOperationWith, signMessageWith } from '@lens-protocol/client/ethers'


interface PostAttachment {
  item: string,
  type: MediaImageMimeType,
}


type MediaFile = {
  file: File|null
  url: string
  type: string
}

export const uploadPostToLens = async (mediaLength: number, content: string, filesURI: PostAttachment[], postType: string, postItemId?: string, feedAddress?: string, portfolioCollection?: string, signer?: any) => {

    const resumed = await client.resumeSession();
    if (resumed.isErr()) return console.error(resumed.error);

    const sessionClient = resumed.value;

    const extraAttachments = filesURI.length > 1
        ? filesURI.slice(1)
        : [];

    if(mediaLength > 1)
    {

        const metadata = portfolioCollection ? image({
            title: content,
            image: filesURI[0],
            attachments: extraAttachments,
            tags: [portfolioCollection]
        }) : image({
            title: content,
            image: filesURI[0],
            attachments: extraAttachments,
        });
        const { uri:contentUri } = await storageClient.uploadAsJson(metadata);

        if(postType === 'comment')
        {
            const result = await post(sessionClient, {
                contentUri: uri(contentUri),
                commentOn: {
                    post: postId(postItemId!), // the postItem to comment on
                },
            });
        }
        else
        {
            await post(sessionClient, { 
                contentUri: uri(contentUri),
                feed: evmAddress(feedAddress!),
            }).andThen(handleOperationWith(signer));
        }
         
    }
    if(mediaLength === 1)
    {
        const metadata = portfolioCollection ? image({
            title: content,
            image: filesURI[0],
            tags: [portfolioCollection]
        }) : image({
            title: content,
            image: filesURI[0],
        });
        const { uri:contentUri } = await storageClient.uploadAsJson(metadata);

        if(postType === 'comment')
        {
            const result = await post(sessionClient, {
                contentUri: uri(contentUri),
                commentOn: {
                    post: postId(postItemId!), // the postItem to comment on
                },
            });
        }
        else
        {
            await post(sessionClient, { 
                contentUri: uri(contentUri),
                feed: evmAddress(feedAddress!),
            }).andThen(handleOperationWith(signer));
        }
    }

    else
    {
        const metadata = textOnly({
            content: content,
        });
        const { uri:contentUri } = await storageClient.uploadAsJson(metadata);

        if(postType === 'comment')
        {
            const result = await post(sessionClient, {
                contentUri: uri(contentUri),
                commentOn: {
                    post: postId(postItemId!), // the postItem to comment on
                },
            });
        }
    }
}