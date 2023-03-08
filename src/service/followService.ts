import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';

const followService = {
  checkFollow: async (address: string) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/follow/check-follow/${address}`);
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  },
  toggleFollow: async (walletAddress: string) => {
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/follow`, {
        walletAddress,
      });
      return [response, null];
    } catch (error) {
      return [null, error];
    }
  },
  getListFollower: async (
    artistAddress: string,
    userAddress: string,
    page: number,
    limit: number,
  ) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/follow/followers/${artistAddress}?page=${page}&limit=${limit}&walletAddress=${userAddress}`,
      );
      return [response.data, null];
    } catch (error) {
      console.log(error);
      return [null, error];
    }
  },
};

export default followService;
