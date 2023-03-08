export interface IFeedRecords {
  items: IFeedItem[];
  totalPages: number;
  nextPage?: number;
  hasMore: boolean;
}

export interface IFeedData {
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
export interface IFeedItem {
  id?: number;
  nftId?: number;
  price: string;
  price_umad?: string;
  price_usd?: string;
  currencyToken?: string;
  quantity: string;
  activityType: string;
  fromAddress: string;
  toAddress: string;
  createdAt?: string;
  nft?: {
    id: number;
    title: string;
  };
}
