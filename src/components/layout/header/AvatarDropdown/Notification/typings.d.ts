import { TRANSACTION_NOTIFICATION } from 'constants/app';

export interface INotificationRecords {
  items: INotificationItem[];
  totalPages: number;
  nextPage?: number;
  hasMore: boolean;
}

export interface INotificationData {
  items: INotificationItem[];
  meta: IMeta;
}

export interface IMeta {
  itemCount: number;
  totalItem: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface INotificationItem {
  id: number;
  transactionType: TRANSACTION_NOTIFICATION;
  isRead: boolean;
  deletedAt?: any;
  createdAt?: string;
  updatedAt?: string;
  user: IUser;
  nft?: INft;
  nftHistory?: INftHistory;
  like?: ILike;
  report?: any;
  follower?: any;
}

export interface IUser {
  id: number;
  walletAddress: string;
  email: string;
  phoneNumber: any;
  description: any;
  username: string;
  isVerify: boolean;
  coverImg: any;
  avatarImg: any;
  websiteUrl: any;
  twitterUrl: any;
  telegramUrl: any;
  discordUrl: any;
  isWhitelist: boolean;
  isBranded: boolean;
  registerAt: any;
  createdAt: string;
  updatedAt: string;
}

export interface INft {
  id: number;
  nftUrl: string;
  nftImagePreview: string;
  title: string;
  viewNumber: number;
  isUnlockableContent: boolean;
  isDisplay: boolean;
  isSensitive: boolean;
  unlockableContent: string;
  isExplicitSensitiveContent: boolean;
  isFreezeMetadata: boolean;
  isMinted: boolean;
  externalLink: string;
  description: string;
  maxQuantity: number;
  tokenId: string;
  blockNumberMinted: any;
  isErrorURI: boolean;
  replacementPattern: string;
  cid: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreator {
  id: number;
  walletAddress: string;
  email: string;
  phoneNumber: any;
  description: any;
  username: string;
  isVerify: boolean;
  coverImg: any;
  avatarImg: any;
  websiteUrl: any;
  twitterUrl: any;
  telegramUrl: any;
  discordUrl: any;
  isWhitelist: boolean;
  isBranded: boolean;
  registerAt: any;
  createdAt: string;
  updatedAt: string;
}

export interface ICollection {
  id: number;
  creatorId: number;
  title: string;
  description: string;
  symbol: string;
  name: string;
  shortUrl: string;
  address: string;
  transactionHash: string;
  royalty: string;
  networkType: any;
  type: string;
  bannerUrl: any;
  thumbnailUrl: any;
  website: any;
  discordLink: any;
  telegramLink: any;
  twitterLink: any;
  externalLink: any;
  isVerify: boolean;
  isImport: boolean;
  isDrop: boolean;
  stakingUrl: any;
  vrUrl: any;
  governanceUrl: any;
  gameUrl: any;
  blockNumber: any;
  createdAt: string;
  updatedAt: string;
}

export interface INftHistory {
  id: number;
  nftId: number;
  price: string;
  price_umad: string;
  price_usd: string;
  currencyToken: string;
  quantity: number;
  activityType: string;
  fromAddress: string;
  toAddress?: string;
  transactionHash?: string;
  blockTimestamp: string;
  blockNumber: any;
  createdAt: string;
  updatedAt: string;
}

export interface ILike {
  id: number;
  userId: number;
  targetId: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  account: IAccount;
}

export interface IAccount {
  id: number;
  walletAddress: string;
  email: string;
  phoneNumber: any;
  description: any;
  username: string;
  isVerify: boolean;
  coverImg: any;
  avatarImg: any;
  websiteUrl: any;
  twitterUrl: any;
  telegramUrl: any;
  discordUrl: any;
  isWhitelist: boolean;
  isBranded: boolean;
  registerAt: string;
  createdAt: string;
  updatedAt: string;
}
