import Request from '../request';
import { customAxios } from 'request/customAxios';
import { AWS_API_ENDPOINT, SERVER_API_ENDPOINT } from 'constants/envs';

interface ICredentials {
  walletAddress?: string | null | string[];
  signature?: string;
  address?: string;
}

const ACCOUNT_ENDPOINT = `${SERVER_API_ENDPOINT}/account`;
const ACCOUNT_LOGIN_ENDPOINT = `${ACCOUNT_ENDPOINT}/login`;
const ACCOUNT_REGISTER_ENDPOINT = `${ACCOUNT_ENDPOINT}/register`;
const ACCOUNT_CHECK_USERNAME_ENDPOINT = `${ACCOUNT_ENDPOINT}/check`;

const userService = {
  login: async (credentials: ICredentials) => {
    try {
      const response = await Request.post(ACCOUNT_LOGIN_ENDPOINT, credentials);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getPublicUserInfo: async (credentials: ICredentials) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/account/${credentials.address}`;
      if (credentials.walletAddress) uri += `?walletAddress=${credentials.walletAddress}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  fetchUserInfo: async (address: string) => {
    try {
      let userUrl = `${SERVER_API_ENDPOINT}/account/${address}`;
      return await fetch(userUrl);
    } catch (error) {
      return error;
    }
  },

  fetchSEOUserInfo: async (address: string) => {
    try {
      let userUrl = `${SERVER_API_ENDPOINT}/account/seo/${address}`;
      return await fetch(userUrl);
    } catch (error) {
      return error;
    }
  },

  signup: async (credentials: ICredentials) => {
    try {
      const response = await Request.post(ACCOUNT_REGISTER_ENDPOINT, credentials);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  checkUsername: async (username: string) => {
    try {
      const response = await Request.get(`${ACCOUNT_CHECK_USERNAME_ENDPOINT}?username=${username}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  updateUserProfile: async (data: any) => {
    try {
      const response = await Request.patch(`${SERVER_API_ENDPOINT}/account`, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  // editUserProfile: async data => {
  //     try {
  //         const res = await Request.patch(`${SERVER_API_ENDPOINT}/user/profile`, data)
  //         return [res.data, null]
  //     } catch (error) {
  //         return [null, error.response.data]
  //     }
  // },
  // getUserInfo: async queryParam => {
  //     try {
  //         const response = await Request.get(`${SERVER_API_ENDPOINT}/user?${queryParam}`)
  //         if (response.data === USER_IS_BANNED_CODE) {
  //             message.error('User has been banned!')
  //             return [null, { message: '' }]
  //         }
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },
  // getUserByCustomUrl: async queryParam => {
  //     try {
  //         const response = await Request.get(`${SERVER_API_ENDPOINT}/user?customUrl=${queryParam.customUrl}`)
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },
  // confirmVerified: async queryParam => {
  //     try {
  //         const response = await Request.get(`${SERVER_API_ENDPOINT}/user/twitter/verify?username=${queryParam}`)
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },
  // checkCustomUrl: async queryParam => {
  //     try {
  //         const response = await Request.get(`${SERVER_API_ENDPOINT}/user/checkUrl?customUrl=${queryParam.customUrl}`)
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },

  // uploadAvatar: async ({ userId, imgFile }) => {
  //     const { type } = imgFile
  //     const extension = type.split('/')[1]

  //     const name = new Date().getTime()

  //     const accessToken = localStorage.getItem('accessToken')

  //     const config = {
  //         headers: {
  //             Authorization: accessToken,
  //             'x-amz-tagging': `token=${accessToken}`,
  //             'Content-Type': type
  //         }
  //     }
  //     try {
  //         const response = await customAxios({
  //             method: 'put',
  //             url: `${AWS_API_ENDPOINT}/user-avatar/${userId}/${name}.${extension}`,
  //             data: imgFile,
  //             headers: config.headers
  //         })
  //         return [response, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },

  // uploadCoverImage: async ({ userId, imgFile }) => {
  //     const { type } = imgFile
  //     const extension = type.split('/')[1]

  //     const name = new Date().getTime()

  //     const accessToken = localStorage.getItem('accessToken')

  //     const config = {
  //         headers: {
  //             Authorization: accessToken,
  //             'x-amz-tagging': `token=${accessToken}&type=cover`,
  //             'Content-Type': type
  //         }
  //     }
  //     try {
  //         const response = await customAxios({
  //             method: 'put',
  //             url: `${AWS_API_ENDPOINT}/user-avatar/${userId}/${name}.${extension}`,
  //             data: imgFile,
  //             headers: config.headers
  //         })
  //         return [response, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },
  // followUser: async userId => {
  //     try {
  //         const response = await Request.post(`${SERVER_API_ENDPOINT}/user/follow-user?${userId}`)
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },
  // unfollowUser: async userId => {
  //     try {
  //         const response = await Request.post(`${SERVER_API_ENDPOINT}/user/unfollow-user?${userId}`)
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },

  // getFollowingList: async (userId, offset = 0, limit = 100) => {
  //     try {
  //         const response = await Request.get(
  //             `${SERVER_API_ENDPOINT}/user-follow-user/follow-user?offset=${offset}&limit=${limit}&userId=${userId}`
  //         )
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },

  // getFollowerList: async (userId, offset = 0, limit = 100) => {
  //     try {
  //         const response = await Request.get(
  //             `${SERVER_API_ENDPOINT}/user-follow-user/follower-user?offset=${offset}&limit=${limit}&userId=${userId}`
  //         )
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },

  // getUploadAvatarUrl: async data => {
  //     const { imgFile, type } = data
  //     const accessToken = localStorage.getItem('accessToken')
  //     const userId = localStorage.getItem('userId')
  //     let imageId = getNFTImageName(imgFile)
  //     try {
  //         const res = await customAxios({
  //             method: 'put',
  //             url: `${AWS_API_ENDPOINT}/nft-image/${userId}/pre-signed`,
  //             params: {
  //                 imageId,
  //                 type
  //             },
  //             headers: {
  //                 Authorization: `${accessToken}`
  //             }
  //         })
  //         return [res.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },

  // claimPACEToken: async () => {
  //     try {
  //         const response = await Request.get(`${SERVER_API_ENDPOINT}/user/getSignClaimPace`)
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },
  // updateClaimedPACEToken: async () => {
  //     try {
  //         const response = await Request.put(`${SERVER_API_ENDPOINT}/user/signClaimPace`)
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // },
  // postReceiveEmailUpdate: async data => {
  //     try {
  //         const response = await Request.post(`${SERVER_API_ENDPOINT}/receive-updates-users`, data)
  //         return [response.data, null]
  //     } catch (error) {
  //         return [null, error]
  //     }
  // }
};

export default userService;
