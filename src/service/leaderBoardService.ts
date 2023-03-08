import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';

export type LeaderBoardCategory = 'TODAY' | 'LAST7DAYS' | 'LAST30DAYS';
export interface ILeaderBoardParams {
  type: LeaderBoardCategory;
  isBrand?: 0 | 1;
  isHot?: 0 | 1;
}

const leaderBoardService = {
  getLeaderBoardAccount: async (params: ILeaderBoardParams) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/account/leaderboard`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getLeaderBoardCollection: async (params: ILeaderBoardParams) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/collection/leaderboard`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default leaderBoardService;
