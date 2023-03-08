export const LOGIN_SIGN_MESSAGE = process.env.NEXT_PUBLIC_LOGIN_SIGN_MESSAGE;
//   'Welcome to MADworld Marketplace! Click Sign to sign in.';
export const METAMASK_MESSAGE = 'Welcome to MADworld Marketplace! Click Sign to sign in.';

export const ERROR_CODE_USER_DENIED_METAMASK = 4001;

export const SOCKET_EVENT_UPLOAD_COLLECTION_IMAGE = 'COLLECTION_IMAGE';
export const SOCKET_EVENT_UPLOAD_COLLECTION_BANNER = 'COLLECTION_BANNER';
export const SOCKET_EVENT_CHANGE_AVATAR = 'USER_PROFILE_AVATAR';
export const SOCKET_EVENT_CHANGE_COVER = 'USER_PROFILE_BANNER';
export const SOCKET_EVENT_NFTS_IMAGE = 'NFTS_IMAGE';
export const SOCKET_EVENT_ACTIVITY = 'ACTIVITY';


export const SOCIAL_LINK = {
  INSTAGRAM: 'https://www.instagram.com',
  TWITTER: 'https://twitter.com',
  TELEGRAM: 'https://t.me',
  DISCORD: 'https://discord.gg',
  GITHUB: 'https://github.com',
  FACEBOOK: 'https://www.facebook.com',
  YOUTUBE: 'https://www.youtube.com',
  TIKTOK: 'https://www.tiktok.com',
  MEDIUM: 'https://medium.com',
};

export const COMING_SOON = 'Coming soon';

export const SWAP_UMAD_UNISWAP =
  'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x31c2415c946928e9FD1Af83cdFA38d3eDBD4326f&chain=mainnet';
export const SWAP_WETH_UNISWAP =
  'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2&chain=mainnet';

export enum EventSocket {
  IMPORT_COLLECTION_SUCCESS = 'IMPORT_COLLECTION_SUCCESS',
  NFT_IMAGE_PREVIEW = 'NFT_IMAGE_PREVIEW',
  NFT_URL = 'NFT_URL',
  ACCOUNT_PROFILE_AVATAR = 'ACCOUNT_PROFILE_AVATAR',
  ACCOUNT_PROFILE_BANNER = 'ACCOUNT_PROFILE_BANNER',
  COLLECTION_IMAGE = 'COLLECTION_IMAGE',
  COLLECTION_BANNER = 'COLLECTION_BANNER',
  INTERNAL_SALE = 'INTERNAL_SALE', // TODO not use
  CANCEL_INTERNAL_SALE = 'CANCEL_INTERNAL_SALE',
  INTERNAL_ROYALTY_UPDATE = 'INTERNAL_ROYALTY_UPDATE',
  NOTIFICATION = 'NOTIFICATION',
  TRANSFER_NFT_SUCCESS = 'TRANSFER_NFT_SUCCESS',
  UPDATED_PAYOUT_ADDRESS = 'UPDATED_PAYOUT_ADDRESS',
}

export const PLEASE_RELOAD_PAGE = 'There are some changes made recently, please reload the page!';

export const DESCRIPTION = {
  INIT_WALLET:
    'To start selling for the first time on MADworld, you need to set up your wallet. This requires gas fee once only.',
  APPROVE_UMAD:
    'To start selling for the first time on MADworld, you need to allow a website to use your UMAD.',
  APPROVE_SALE_ITEM:
    'To start listing for the first time on MADworld, you need to approve this item for sale. This requires gas fee once only.',
};
