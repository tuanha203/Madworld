import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';

interface IAssetService {
  collectionAddress: string | string[] | undefined;
  tokenId: string | string[] | undefined;
  limit?: number;
  page?: number;
  walletAddress?: string;
}
interface IAssetNftService {
  address: string;
  id: string;
  limit: number;
  page: number;
  walletAddress?: string;
}
interface IReportNft {
  nftId: string;
  reason: string;
  originalCollectionId?: number;
}
interface IQueryDataAssetDetail {
  address: string;
  tokenId: string;
}

const assetService = {
  getAssetDetail: async ({ collectionAddress, tokenId, walletAddress = '' }: IAssetService) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/nft/detail/${collectionAddress}/${tokenId}?walletAddress=${walletAddress}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  queryDataAssetDetail: async ({ address, tokenId }: IQueryDataAssetDetail) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/nft/query-data/${address}/${tokenId}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  queryDataMoreCollection: async ({ address, limit, cursor }: any) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/collection/query-data/${address}`;
      if (limit) uri += `?limit=${limit}`;
      if (cursor) uri += `&cursor=${cursor}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getRarityAssetDetail: async ({ collectionAddress, tokenId }: IAssetService) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/nft/detail-rarity/${collectionAddress}/${tokenId}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getPropertiesAssetDetail: async ({ collectionAddress, tokenId }: IAssetService) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/nft/detail-properties/${collectionAddress}/${tokenId}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getListNft: async ({ address, id, walletAddress, limit, page }: IAssetNftService) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/nft/all?limit=${limit}&page=${page}&ignoreNftId=${id}&collectionAddress=${address}`;
      if (walletAddress) uri += `&walletAddress=${walletAddress}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getUnlockableContent: async (id: number) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/nft/unlockable-content/${id}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  fetchAssetDetails: async ({ collectionAddress, tokenId }: IAssetService) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/nft/detail/${collectionAddress}/${tokenId}`;
      return await fetch(uri);
    } catch (error) {
      return error;
    }
  },
  fetchSEOAssetDetails: async ({ collectionAddress, tokenId }: IAssetService) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/nft/seo-detail/${collectionAddress}/${tokenId}`;
      return await fetch(uri);
    } catch (error) {
      return error;
    }
  },
  reportNft: async ({ nftId, reason = '', originalCollectionId }: IReportNft) => {
    const data: IReportNft = {
      nftId: nftId,
      reason: reason,
    };
    if (originalCollectionId) {
      data.originalCollectionId = originalCollectionId;
    }
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/report`, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default assetService;
