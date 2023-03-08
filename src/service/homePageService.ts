import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';
import { serialize } from 'utils/url';

interface IHostItemsParam {
  limit?: string | number | undefined;
  page?: string | number | undefined;
  hotTimeFilter?: string | undefined;
  trendingType?: string | undefined;
  userAddress?: string;
}
interface ITrengdingItemsParam {
  limit: string | number | undefined;
  page: string | number | undefined;
  trendingType: string | undefined;
}
interface ISubscribeEmail {
  email: string;
}

const homePageService = {
  getListItemHot: async ({
    limit,
    page,
    hotTimeFilter,
    trendingType,
    userAddress,
  }: IHostItemsParam) => {
    try {
      const queryObject = { limit, page, hotTimeFilter, trendingType, userAddress };

      const filterQueryObject = Object.entries(queryObject).reduce((a, [b, c]) => {
        if (c !== undefined) {
          a[b] = c;
        }
        return a;
      }, {} as any);

      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/trending/hot?${serialize(filterQueryObject)}`,
      );

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getListItemTrending: async ({ limit, page, trendingType }: ITrengdingItemsParam) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/trending/trend?limit=${limit}&page=${page}&trendingType=${trendingType}`,
      );

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  subscribeEmail: async ({ email }: ISubscribeEmail) => {
    try {
      const dataBody = {
        email,
      };
      const response = await Request.post(
        `${SERVER_API_ENDPOINT}/subscribe`,
        JSON.stringify(dataBody),
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default homePageService;
