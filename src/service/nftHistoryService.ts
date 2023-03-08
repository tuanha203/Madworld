import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';

const nftHistoryService = {
  getChartPrice: async ({ period, nft_id }: { period: string; nft_id: number }) => {
    const response = await Request.get(
      `${SERVER_API_ENDPOINT}/nft-history/price/chart/${nft_id}?period=${period}`,
    );

    return [response.data, null];
  },

  getNftHistory: async (nftId: number, limit?: number, page?: number) => {
    const response = await Request.get(
      `${SERVER_API_ENDPOINT}/nft-history/${nftId}?limit=${limit || 10}&page=${page || 1}`,
    );

    return [response.data, null];
  },
};

export default nftHistoryService;
