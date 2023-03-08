import { SERVER_API_ENDPOINT, SERVER_DOMAIN } from 'constants/envs';
import Request from '../request';
import _, { isUndefined, omit, omitBy } from 'lodash';
import { string } from 'prop-types';
import uploadService from './uploadService';
import socket from 'configsocket';
import { EventSocket } from 'constants/text';

interface InftService {
  limit?: string | string[] | number | undefined;
  page?: string | string[] | number | undefined;
  keyword?: string | string[] | undefined;
  sortField?: string | string[] | undefined;
  sortDirection?: string | string[] | undefined;
  without?: string | string[] | undefined;
  startPrice?: string | string[] | undefined;
  endPrice?: string | string[] | undefined;
  owner?: string | string[] | undefined;
  saleTypes?: string;
  priceType?: string | string[] | undefined;
  collectionIds?: string | string[] | undefined;
}
interface IPropertiesNFT {
  name: string;
  value: string;
}
interface INFTInternalCreated {
  nftUrl?: string;
  nftImagePreview?: string;
  properties?: IPropertiesNFT[];
  levels?: any;
  stats?: any;
  title?: string;
  isUnlockableContent?: boolean;
  unlockableContent?: string;
  isExplicitSensitiveContent?: boolean;
  isFreezeMetadata?: boolean;
  externalLink?: string;
  description?: string;
  maxQuantity: number | string | undefined;
  tokenId?: string;
  collectionAddress?: string;
  categoryIds?: number[] | string[];
}

interface IProperty {
  name: string;
  value: string;
}

interface ILevel {
  name: string;
  level: number;
  maxLevel: number;
}

interface ICreateNFT {
  title: string;
  description?: string;
  externalLink?: string;
  properties?: Array<IProperty>;
  levels?: Array<ILevel>;
  stats?: Array<ILevel>;
  isUnlockableContent: boolean;
  isExplicitSensitiveContent: boolean;
  explicitSensitiveContent?: string;
  unlockableContent?: string;
  maxQuantity: number;
  tokenId: string;
  collectionAddress: string;
  categoryIds: Array<number>;
}

const nftService = {
  getListNFT: async (params: InftService | any) => {
    const customParams = {
      ...params,
      saleTypes: params?.saleType?.join(',') || '',
      collectionIds: params?.collectionIds?.replaceAll('-', ','),
      tokenTypes: params?.priceType?.replaceAll('-', ',')?.toLowerCase(),
    };

    delete customParams.saleType;
    delete customParams.priceType;
    const paramsFiltered = omitBy(customParams, isUndefined);

    try {
      let uri = `${SERVER_API_ENDPOINT}/nft/all?${new URLSearchParams(paramsFiltered).toString()}`;
      const response = await Request.get(uri);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  refreshNFtMetaData: async (data: any) => {
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/nft/refresh`, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  updateNftLambda: async (id: any, data: any) => {
    try {
      const response = await Request.put(`${SERVER_DOMAIN}/nfts/image-path?id=${id}`, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  uploadNftImage: async (id: any, data: any) => {
    try {
      const response = await Request.put(`${SERVER_API_ENDPOINT}/nft/update-image/${id}`, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  uploadNFTPreview: async (data: any) => {
    try {
      const [res] = await uploadService.getUploadPreviewImage(data);
      await uploadService.putNftImage({
        imgFile: data?.imgFile,
        nftId: data?.nftId,
        collectionId: data?.collectionId,
        uploadUrl: res?.upload_url,
        previewImgId: '',
      });
      return res?.path;
    } catch (error) {
      return [null, error];
    }
  },

  uploadNFTUrl: async (data: any) => {
    try {
      const [res] = await uploadService.getUploadNFTPresignUrl(data);
      await uploadService.putNftImage({
        imgFile: data?.imgFile,
        nftId: data?.nftId,
        collectionId: data?.collectionId,
        uploadUrl: res?.upload_url,
        previewImgId: '',
      });
      return res?.path
    } catch (error) {
      return [null, error];
    }
  },

  uploadNFTAudio: async (data: any) => {
    try {
      const [res] = await uploadService.getMp3PresignUrl(data);
      await uploadService.putNftImage({
        imgFile: data?.imgFile,
        nftId: data?.nftId,
        collectionId: data?.collectionId,
        uploadUrl: res?.upload_url,
        previewImgId: '',
      });
      return res?.path
    } catch (error) {
      return [null, error];
    }
  },

  uploadNFTModel: async (data: any) => {
    try {
      const { imgFile } = data;
      let extension = imgFile.name.split(".").pop();
      const [res] = await uploadService.getUploadNFTPresignModel(data, extension);
     await uploadService.putNftModel({
        imgFile: data?.imgFile,
        nftId: data?.nftId,
        collectionId: data?.collectionId,
        uploadUrl: res?.upload_url,
        previewImgId: '',
        extension,
      });
      return res?.path
    } catch (error) {
      return [null, error];
    }
  },

  uploadNFTVideo: async (data: any) => {
    try {
      const [res] = await uploadService.getUploadNFTPresignVideo(data);
      await uploadService.putNftImage({
        imgFile: data?.imgFile,
        nftId: data?.nftId,
        collectionId: data?.collectionId,
        uploadUrl: res?.upload_url,
        previewImgId: '',
      });
      return res?.path
    } catch (error) {
      return [null, error];
    }
  },

  createNFT: async (params: ICreateNFT) => {
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/nft`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  updateNFTAudio: async (params: ICreateNFT) => {
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/nfts/image-path?`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default nftService;
