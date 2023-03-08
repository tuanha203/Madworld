import Request from '../request';
import { SERVER_API_ENDPOINT } from 'constants/envs';

const coingeckoService = {
  getPriceCoingecko: async (ids: string, vs_currencies: string) => {
    const response = await Request.get(
      `${SERVER_API_ENDPOINT}/coingecko?ids=${ids}&vs_currencies=${vs_currencies}`,
    );

    return response?.data;
  },
};

export default coingeckoService;
