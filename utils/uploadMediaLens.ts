import { MediaImageMimeType } from '@lens-protocol/metadata'
import { storageClient } from '@/helper/storageClient';
import { lensAccountOnly } from '@lens-chain/storage-client'
import { chains } from '@lens-chain/sdk/viem'

interface PostAttachment {
  item: string,
  type: MediaImageMimeType,
}


type MediaFile = {
  file: File|null
  url: string
  type: string
}

export const uploadMediaToLens = async (media: MediaFile[]) => {

    const filesURI: PostAttachment[] = [];

    const acl = lensAccountOnly(
        '0x2a88fDB064A1aFE5A0Cabf19E176B24CdA2EE1F7',
        chains.testnet.id
    );

    for (let i = 0; i < media.length; i++) 
    {
        if(media[i].type === 'GIF')
        {
            const uploadedFileUri = await storageClient.uploadFile(media[i].file!, { acl });
            filesURI.push({ item: uploadedFileUri.gatewayUrl, type: MediaImageMimeType.GIF });
        }
        else
        {
            const uploadedFileUri = await storageClient.uploadFile(media[i].file!, { acl });
            filesURI.push({ item: uploadedFileUri.gatewayUrl, type: MediaImageMimeType.WEBP });
        }
    }

    return filesURI;
}