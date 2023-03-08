import socket from 'configsocket';
import { ARTIST_SUBTAB } from 'constants/app';
import { SERVER_API_ENDPOINT } from 'constants/envs';
import { EventSocket } from 'constants/text';
import _ from 'lodash';
import Request from '../request';
import uploadService from './uploadService';

export interface IArtistService {
  owner?: string | string[] | undefined;
  limit: number;
  page?: number;
  type?: ARTIST_SUBTAB.CREATE | ARTIST_SUBTAB.FAVORITE | ARTIST_SUBTAB.OWNED | string;
  sortField?: string;
  priceType?: string;
  saleType?: string;
  startPrice?: number;
  endPrice?: number;
  walletAddress?: string;
  address: string;
  keyword?: string;
}

const artistService = {
  getColections: async ({
    owner,
    limit = 10,
    page,
    type,
    walletAddress,
    address,
    keyword = '',
  }: IArtistService) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/collection/artist/${address}?limit=${limit}&title=${encodeURIComponent(
        keyword,
      )}`;
      if (type) uri += `&type=${type}`;
      if (page) uri += `&page=${page}`;
      if (owner) uri += `&owner=${owner}`;
      if (walletAddress) uri += `&walletAddress=${walletAddress}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getNtfs: async (params: IArtistService | any) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/nft/all`;
      Object.keys(params).forEach((key: any, index: number) => {
        const element = params[key];
        let value = JSON.stringify(element);
        if (!_.isObject(element)) value = value.replaceAll('"', '');
        if (element && typeof element === 'string' && element.indexOf('-') > -1)
          value = value.split('-').toString();
        if (key === 'saleType' && params['saleType']) {
          value = element.toString(); // this stupid. I KNOW
          key = 'saleTypes';
        }
        if (key === 'title') value = encodeURIComponent(element)

        if (key === 'priceType' && params['priceType']) key = 'tokenTypes';

        if (index === 0) {
          uri += '?' + key + '=' + value;
        } else {
          uri += '&' + key + '=' + value;
        }
      });

      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      console.log('e', error);
      return [null, error];
    }
  },

  uploadProfileImage: async (params: any) => {
    try {
      const response = await Request.patch(`${SERVER_API_ENDPOINT}/account/image`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  uploadAvatar: async (data: any) => {
    try {
      const [res] = await uploadService.getPreSignUrl(data);
      await uploadService.putNftImage({
        imgFile: data?.imgFile,
        nftId: '',
        collectionId: data?.userId,
        uploadUrl: res?.upload_url,
        previewImgId: '',
      });
      return res?.path;
    } catch (error) {
      console.log('err', error);
      return error;
    }
  },

  uploadCover: async (data: any) => {
    try {
      const [res] = await uploadService.getPreSignUrl(data);
      await uploadService.putNftImage({
        imgFile: data?.imgFile,
        nftId: '',
        collectionId: data?.userId,
        uploadUrl: res?.upload_url,
        previewImgId: '',
      });
      return res?.path;
    } catch (error) {
      console.log('err', error);
      return error;
    }
  },
  verify: async (address: string | any) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/account/verify/${address}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getCount: async (address: string | any, keyword?: string) => {
    try {
      let uri = `${SERVER_API_ENDPOINT}/nft/artist-profile/count-nft?address=${address}`;
      if (keyword) {
        uri = `${uri}&title=${keyword}`;
      }
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getLeaderBoard: async (type: string, isBrand?: 0 | 1) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/account/leaderboard/`, {
        type: type,
        isBrand: isBrand,
      });
      return [response, null];
    } catch (error) {
      return [null, error];
    }
  },

  getArtistFeed: async ({ address, params }: { address: string; params: any }) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/account/${address}/feed`, params);
      return [response, null];
    } catch (error) {
      return [null, error];
    }
  },
  getLeaderBoardBrandedProject: async (type: string) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/account/leaderboard`, {
        type,
        isBrand: true,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default artistService;
