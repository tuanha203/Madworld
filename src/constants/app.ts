import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

export const NETWORK_OPTIONS = [] as any;

export const SELL_TYPE = {
  FIX_PRICE: 'FIX_PRICE',
  AUCTION: 'AUCTION',
};

export const ASSET_TYPE = {
  ERC721: 'ERC721',
  ERC1155: 'ERC1155',
};

export const EDIT_PRICE_CURRENCY = [
  {
    value: 'UMAD',
    text: 'UMAD',
    image: '/icons/mad_icon_outlined.svg',
  },
  {
    value: 'ETH',
    text: 'ETH',
    image: '/icons/Eth.svg',
  },
  {
    value: 'WETH',
    text: 'WETH',
    image: '/icons/weth.svg',
  },
];

export const SELL_CURRENCY = [
  {
    value: 'UMAD',
    text: 'UMAD',
    image: '/icons/mad_icon_outlined.svg',
  },
  {
    value: 'ETH',
    text: 'ETH',
    image: '/icons/Eth.svg',
  },
];

export const AUCTION_CURRENCY = [
  {
    value: 'UMAD',
    text: 'UMAD',
    image: '/icons/mad_icon_outlined.svg',
  },
  {
    value: 'WETH',
    text: 'WETH',
    image: '/icons/weth.svg',
  },
];
export const DUTCH_AUCTION_CURRENCY = [
  {
    value: 'UMAD',
    text: 'UMAD',
    image: '/icons/mad_icon_outlined.svg',
  },
  {
    value: 'ETH',
    text: 'ETH',
    image: '/icons/Eth.svg',
  },
];

export const CURRENCY_SELECT = {
  BNB: 'BNB',
  UMAD: 'UMAD',
  ETH: 'ETH',
  WETH: 'WETH',
};
export const DECIMALS = {
  BNB_DECIMAL: 18,
  XTR_DECIMAL: 8,
  BUSD_DECIMALS: 18,
  WBNB_DECIMALS: 18,
  ETH_DECIMALS: 18,
  WETH_DECIMALS: 18,
  USDT_DECIMALS: 6,
};

// TODO
export const TOKEN = {
  BNB: 'BNB',
  WBNB: 'WBNB',
  BUSD: 'BUSD',
  XTR: 'XTR',
  ETH: 'ETH',
  WETH: 'WETH',
  USDT: 'USDT',
  UMAD: 'UMAD',
};
export const PAYMENT_TOKEN = {
  BNB: 'BNB',
  WBNB: 'WBNB',
  BUSD: 'BUSD',
  XTR: 'XTR',
  ETH: 'ETH',
  WETH: 'WETH',
  USDT: 'USDT',
  UMAD: 'UMAD',
};
export const SALE_TYPE = {
  FIXED_PRICE: 0,
  AUCTION: 1,
  OPEN_FOR_BID: 2,
};

export const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const TRADING_ACTIONS = [
  { label: 'List for sale', value: 0 },
  { label: 'Minted', value: 1 },
  { label: 'Cancel List', value: 2 },
  { label: 'Sale', value: 3 },
  { label: 'All', value: 4 },
  { label: 'Bid', value: 7 },
  { label: 'Cancel Bid', value: 8 },
  { label: 'Created', value: 9 },
  { label: 'Offer Open', value: 10 },
  { label: 'Cancel Open', value: 11 },
  { label: 'Offer Open', value: 12 },
];

export const TRADING_TYPE = {
  LIST_FOR_SALE: 0,
  MINTED: 1,
  CANCEL_LIST: 2,
  SALE: 3,
  ALL: 4,
  BID: 7,
  CANCEL_BID: 8,
  CREATED: 9,
};

export const SUPPORTED_FILE_TYPE = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'audio/mpeg',
  'video/mp3',
  'video/mp4',
];

export const PREVIEW_SUPPORTED_FILE_TYPE = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

export const VIDEO_FILE_TYPE = ['video/mp3', 'video/mp4', 'audio/mpeg'];

export const FILE_VIDEO_EXTENSION = {
  MP4: 'video/mp4',
  MPEG: 'audio/mpeg',
};

export const FILE_EXTENSION_TYPE = ['.mp4', '.mp3', '.mpeg'];

export const FILE_EXTENSION = {
  MP4: '.mp4',
  MPEG: '.mpeg',
};

export const IMAGE_TYPE_UPLOAD = {
  USER_AVATAR: 'user_avatar',
  USER_COVER: 'user_cover',
  COLLECTION: 'collection',
  COLLECTION_COVER: 'collection_cover',
  NFT_PREVIEW: 'preview',
  NFT_URL: 'nft_url',
};

export enum COLLECTION_TAB {
  ASSET,
  INSIGHTS,
}

export enum ARTIST_TAB {
  ASSET = 'ASSET',
  INSIGHTS = 'INSIGHTS',
  FEED = 'FEED',
}

export enum ARTIST_SUBTAB {
  CREATE = 0,
  OWNED = 1,
  FAVORITE = 2,
}

export interface IdurationDate {
  type?: string | null;
  startDate: Date | null | number;
  endDate: Date | null | number;
}

export interface IExpirationDate {
  type: string | null;
  date: Date | null | any;
}

export const NETWORK_CHAINS = {
  97: 'BSC Testnet',
  4: 'Rinkeby',
  1: 'Ethereum',
};
export const NETWORK_ADD_CHAINS = {
  97: {
    chainId: '0x61',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: [
      'https://data-seed-prebsc-1-s1.binance.org:8545/',
      'https://data-seed-prebsc-2-s1.binance.org:8545/',
      'https://data-seed-prebsc-1-s2.binance.org:8545/',
      'https://data-seed-prebsc-2-s2.binance.org:8545/',
      'https://data-seed-prebsc-1-s3.binance.org:8545/',
      'https://data-seed-prebsc-2-s3.binance.org:8545/',
    ],
    chainName: 'Binance Smart Chain TESTNET',
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  4: {
    chainId: '0x4',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/6dd6484e21ac444daba5d006ac7438c8'],
    chainName: 'Rinkeby Ethereum TESTNET',
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
  },
  1: {
    chainId: '0x1',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/5b93acd936864df3a1bd78c7de311458'],
    chainName: 'Ethereum Mainnet',
    blockExplorerUrls: ['https://etherscan.io'],
  },
};

export const CREATE_ASSET_TYPE = {
  ASSET_DETAIL: 0,
  ADVANCED_DETAIL: 1,
  PRICE_DETAIL: 2,
};

export const STEP_CREATE_ASSET = ['Asset Details', 'Advanced Details', 'Price Details'];

export enum STATE_STEP {
  'LOADING' = 'LOADING',
  'UNCHECKED' = 'UNCHECKED',
  'CHECKED' = 'CHECKED',
}

export const DEFAULT_IMAGE = {
  COVER: '/images/no-image.jpg',
  AVATAR: '/images/avatar-default.png',
};

export const STEP_MAKE_OFFER = {
  MAKE_AN_OFFER: 1,
  CONFIRM_ACCEPT_THIS_OFFER: 2,
  ACCEPT_THIS_OFFER: 3,
};

export enum TYPE_MEDIA {
  'MP4' = 'MP4',
  'MP3' = 'MP3',
  'MPEG' = 'MPEG',
}

export enum TYPE_SALE {
  FIXED_PRICE = 'fix_price',
  AUCTION_ENG = 'english_auction',
  AUCTION_DUT = 'dutch_auction',
}

export const NETWORK_EXPLORER = {
  BSC: 'https://testnet.bscscan.com/tx',
  RINKEBY: 'https://rinkeby.etherscan.io/tx',
};

export const NEXT_PUBLIC_UMAD_ADDRESS = process.env.NEXT_PUBLIC_UMAD_ADDRESS!;
export const NEXT_PUBLIC_WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS!;
export const NEXT_PUBLIC_ETH_ADDRESS = process.env.NEXT_PUBLIC_ETH_ADDRESS;
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

export const EMAIL_REGEX =
  /^(?=^.{10,30}$)(?=^[A-Za-z0-9])[A-Za-z0-9\._]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/gm;

export enum NFT_SALE_ACTIONS {
  LIST = 'list',
  CANCEL = 'cancel',
  SOLD_OUT = 'sold_out',
}

export enum OFFER_SALE_NFT_ACTION {
  CANCEL = 'cancel',
  NOT_ACCEPT = 'not_accept',
  ACCEPT = 'accept',
}

export enum TRANSACTION_NOTIFICATION {
  PURCHASE = 'purchase',
  ACCEPT_BID_PURCHASE = 'accept_bid_purchase',
  ACCEPT_OFFER_PURCHASE = 'accept_offer_purchase',
  LISTING = 'listing',
  LIKES = 'likes',
  BID = 'bid',
  OFFER = 'offer',
  FOLLOW = 'follow',
  HIDE_NFT = 'hide_nft',
  REPORT = 'report',
  SHOW_NFT = 'show_nft',
}

export const NOTIFICATION_TITLE = {
  purchase: 'PURCHASE',
  accept_bid_purchase: 'BID',
  accept_offer_purchase: 'OFFER',
  listing: 'LISTING',
  likes: 'LIKES',
  bid: 'BID',
  offer: 'OFFER',
  follow: 'FOLLOW',
  hide_nft: 'HIDE NFT',
  report: 'REPORT',
  show_nft: 'SHOW NFT'
}

export const LIST_SALE_TYPE = [
  { label: 'Not for sale', value: 'not_for_sale' },
  { label: 'Sales fixed price', value: 'fix_price' },
  { label: 'Auction', value: 'auction' },
];
export const URL_SOCIAL = {
  discord: 'https://discord.gg/',
  telegram: 'https://web.telegram.org/',
  twitter: 'https://twitter.com/',
};

export enum TRENDING_TYPE {
  COLLECTION = 'COLLECTION',
  ARTIST = 'ARTIST',
  OFFERS = 'OFFERS',
}

export enum TYPE_LIKES {
  NFT = 'NFT',
  COLLECTION = 'COLLECTION',
  USER = 'USER',
}

export const TYPE_DURATION = {
  UNLIMITED: 'UNLIMITED',
  LIMITED: 'LIMITED',
};

export enum TIME {
  HOURS = 'HOURS',
  MINUTES = 'MINUTES',
  SECONDS = 'SECONDS',
}

export const REGEX_POSITIVE_NUMBER = /^(?!00)(\d+(\.)?\d*)?$/;

export const LIMIT_NFT_LIST = 12;

export enum TYPE_IMAGE {
  'MP4' = 'mp4',
  'MP3' = 'mp3',
  'MPEG' = 'mpeg',
  'MPGA' = 'mpga',
  'IMAGE' = 'image',
  'OGG' = 'ogg',
  'WAV' = 'wav',
  'WEBM' = 'webm',
}

export const NetworkContextName = 'NETWORK';

export enum TYPE_COLLECTION {
  'ERC721' = 'ERC721',
  'ERC1155' = 'ERC1155',
}

export enum WINDOW_MODE {
  'SM' = 'sm',
  'MD' = 'md',
  'LG' = 'lg',
  'XL' = 'xl',
  '2XL' = '2xl',
}
export const NFT_FILE_SIZE = 104857600;
export const SUPPORTED_FORMATS_PREVIEW_IMAGE = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
];

export const SUPPORTED_FORMATS_VIDEO = ['video/mp4', 'video/webm'];

export const SUPPORTED_FORMATS_AUDIO = ['audio/ogg', 'audio/mp3', 'audio/wav', 'audio/mpeg'];

export const TYPE_MEDIA_NFT = {
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
};

export const METHOD_SELL_AUCTION = {
  SELL_TO_HIGHTEST_BIDDER: 'SELL_TO_HIGHTEST_BIDDER',
  SELL_WITH_DECLINING_PRICE: 'SELL_WITH_DECLINING_PRICE',
};

export const CONFIRMATION_MESSAGE = 'Leave site? \nChanges you made may not be saved.';

export const REGEX_PRICE_ONLY_NUMBER = /^[0-9]*$/;
export const MAX_PRICE = 1e10;

export const initialTime = {
  [TIME.HOURS]: moment().hours().toString(),
  [TIME.MINUTES]: moment().minutes().toString(),
  [TIME.SECONDS]: moment().seconds().toString(),
};

export const currentTimeInPopup = moment(
  new Date().setHours(
    Number(initialTime[TIME.HOURS]),
    Number(initialTime[TIME.MINUTES]),
    Number(initialTime[TIME.SECONDS]),
  ),
).unix();

export const initStepNoListYourAsset = [
  {
    indexNum: 1,
    title: 'Uploading to IPFS',
    des: 'Uploading of all media assets and metadata to IPFS.',
    state: STATE_STEP.LOADING,
    link: '',
    isShowDes: true,
    subDes: '',
  },
];

export const RATE_GAS_LIMIT = 2;

export const INITIAL_LEVELS_STATS = { name: '', level: 2, maxLevel: 4 };
export const INITIAL_PROPERTIES = { value: '', name: '' };
export const MAX_LEVEL = 1e21;
export const BACKSPACE_KEY = 'Backspace';

export const EXTRA_TIME_DUTCH_AUCTION = 20;

export const TYPES_DURATION_DEFAULT = [
  { type: 'Unlimited', startDate: null, endDate: null },
  { type: '1 week', startDate: moment().unix(), endDate: moment().add(7, 'days').unix() },
  { type: '1 month', startDate: moment().unix(), endDate: moment().add(30, 'days').unix() },
  { type: '1 year', startDate: moment().unix(), endDate: moment().add(365, 'days').unix() },
  { type: 'Custom date', startDate: null, endDate: null },
];

export const TYPES_DURATION_DUTCH_AUCTION = [
  { type: '1 week', startDate: moment().unix(), endDate: moment().add(7, 'days').unix() },
  { type: '1 month', startDate: moment().unix(), endDate: moment().add(30, 'days').unix() },
  { type: '1 year', startDate: moment().unix(), endDate: moment().add(365, 'days').unix() },
  { type: 'Custom date', startDate: null, endDate: null },
];

export const TYPES_DURATION_MAKE_OFFER = [
  { type: 'Unlimited', date: 0 },
  { type: '1 week', date: moment(new Date()).add(7, 'days') },
  { type: '1 month', date: moment(new Date()).add(1, 'months') },
  { type: '1 year', date: moment(new Date()).add(1, 'years') },
  { type: 'Custom date', date: null },
];

export const useStylesTooltipFontSize12 = makeStyles(() => ({
  tooltip: {
    backgroundColor: '#1F262C',
    fontSize: '12px',
    padding: '10px',
    color: '#fff',
    fontFamily: 'Chakra Petch',
    maxWidth: '500px',
  },
  arrow: {
    color: '#1F262C',
  },
}));

export const MODEL_TYPES = {
  GLB: 'glb',
  GLTF: 'gltf'
}

export const CONTENT_TYPES_MODEL = {
  GLB: 'model/gltf-binary',
  GLTF: 'model/gltf+json'
}