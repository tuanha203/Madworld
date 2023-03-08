import { SORT_TYPE_NFT_LIST } from './nft.enum';

export const NftSortOptions = [
  { name: 'Recently Added', value: SORT_TYPE_NFT_LIST.RECENTLY },
  { name: 'Ending Soon', value: SORT_TYPE_NFT_LIST.ENDING_SOON },
  { name: 'Price : Low to High', value: SORT_TYPE_NFT_LIST.PRICE_LOW_TO_HIGH },
  { name: 'Price : High to Low', value: SORT_TYPE_NFT_LIST.PRICE_HIGH_TO_LOW },
];
