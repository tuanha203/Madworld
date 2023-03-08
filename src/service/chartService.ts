import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';

interface IParamsInsightArtist {
  artistAddress: string;
  period: string;
  collectionId?: string;
  isWithRarity: boolean;
}

const chartService = {
  getSalesChart: async (userAddress: string) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/account/sales-chart/${userAddress}`,
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  },
  floorPriceChart: async (userAddress: string) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/account/floor-price-chart/${userAddress}`,
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  },
  highestSaleChart: async (userAddress: string) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/account/highest-sale-chart/${userAddress}`,
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  },
  assetSoldChart: async (userAddress: string) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/account/asset-sold-chart/${userAddress}`,
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  },
  assetCreated: async (userAddress: string) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/account/asset-category-chart/${userAddress}`,
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  },
  artistInsight: async ({
    artistAddress,
    period,
    collectionId,
    isWithRarity,
  }: IParamsInsightArtist) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/account/insight/${artistAddress}?period=${period}&collectionId=${collectionId}&isWithRarity=${isWithRarity}`,
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  },
  mostViewNftChart: async (artistAddress = '') => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/account/most-view-nfts-chart/${artistAddress}`,
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  },
};

export default chartService;
