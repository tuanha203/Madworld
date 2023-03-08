import Request from '../request';
import {SERVER_API_ENDPOINT} from 'constants/envs';
import {filterQueryURL} from 'utils/utils';


const dropCollectionService = {
  getDropCollectionAll: async (queryObject: any) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/drop-collection/user-site?${filterQueryURL(queryObject)}`)
      return [response.data, null]
    } catch (error) {
      return [null, error];
    }
  },

  getDropCollectionCategoriesList: async () => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/drop-collection/all-category`)
      return [response.data, null]
    } catch (error) {
      return [null, error];
    }
  },
  turnOffDisplay: async (id: string) => {
    try {
      const dropsURL = `${SERVER_API_ENDPOINT}/drop-collection/${id}`;
      const param = {
        isDisplay: false,
        isDisplayHomepage: false,
      };
      const response = await Request.put(dropsURL, param)
      return [response, null]
    } catch (error) {
      return [null, error];
    }
  }
};

export default dropCollectionService;
