import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';
const searchCollectService = {
  getCollection: async (address: any) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/collection/info/${address}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getNft: async (address: any, limit?: 12, cursor?: string) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/collection/query-data`;
      if (address) uri += `/${address}`;
      if (limit) uri += `?limit=${limit}`;
      if (cursor) uri += `&cursor=${cursor}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default searchCollectService;
