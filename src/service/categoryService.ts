import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';

const categoryService = {
  get: async (param: any) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/category/all`;
      if (param.isDisplay !== undefined) uri += `?isDisplay=${param.isDisplay}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default categoryService;
