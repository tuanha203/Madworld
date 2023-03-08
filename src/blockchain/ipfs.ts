import moment from 'moment';
import { NFTStorage, File } from 'nft.storage';

const NFT_STORAGE_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_KEY as string;
// const NFT_STORAGE_KEY =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhhZTcwMGU1NDQ0RmE2N2MyZDE0ZjE0OTc3M0U1MjBBZEMwYjlGNTAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NTcxMTQxMDk4MiwibmFtZSI6Im1hZHdvcmxkLXRlc3QifQ.2buhSmDp_FxofrE5bOv987h41fp8BJkrCRYY9rx97tQ';

export const uploadToIPFS: any = async (body: any) => {
  try {
    if (!NFT_STORAGE_KEY) {
      return;
    }
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });
    const image = body?.image;
    const file_name = generateNameOfNFT(image);

    
    const blob = image.slice(0, image.size, image.type);
    const newFile = new File([blob], file_name, {type: image.type}); 
    
    const metadata = await client.store({
      ...body,
      image: newFile
    });
    return [metadata, null];
  } catch (err: any) {
    return [null, err];
  }
};

export const uploadVideoAudioToIPFS: any = async (blob: any) => {
  try {
    if (!NFT_STORAGE_KEY) {
      return;
    }
    
    const file_name = generateNameOfNFT(blob);
    const image = blob.slice(0, blob.size, blob.type);
    const newFile = new File([image], file_name, {type: image.type}); 
    
    const someData = new Blob([newFile]);
    
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });
    const cid = await client.storeBlob(someData);

    return [cid, null];
  } catch (err: any) {
    console.error(err);
    return [null, err];
  }
};

export const generateNameOfNFT = (body: any) => {
  const fileType = body?.type.split('/')[1];
  const name = body?.name
  
  const timestamp = moment().unix();

  const desired = name.replace(/[^\w\s]/gi, '')

  return `nft_${timestamp}_${desired}.${fileType}`;
}