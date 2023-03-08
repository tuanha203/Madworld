import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';

interface PropertiesService {
  type: string;
  search?: string;
  address: any;
}

const propertiesService = {
  getPropertiesArtris: async ({ type, search, address }: PropertiesService) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/properties-nft?walletAddress=${address}&type=${type}`;
      if (search) uri += `&search=${search}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default propertiesService;
