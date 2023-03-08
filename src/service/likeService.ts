import { TYPE_LIKES } from 'constants/app';
import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';
export interface ILike {
  targetId: number,
  type: TYPE_LIKES
}
const likeService = {
  like: async (params: ILike) => {
    const { targetId, type } = params;
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/like`, {
        targetId,
        type,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default likeService;
