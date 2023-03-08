import Request from '../request';
import { AWS_API_ENDPOINT, SERVER_API_ENDPOINT } from 'constants/envs';
import { transformJsonToFormData } from 'utils/transformation';
import { getNFTImageName } from 'utils/image';
import { customAxios } from 'request/customAxios';
import { getContentTypeModel } from 'utils/createNft';

type IFileType = 'COLLECTION_THUMBNAIL' | 'COLLECTION_BANNER' | 'NFT_URL' | 'NFT_PREVIEW_IMAGE';

const uploadService = {
  uploadFile: async (type: IFileType, file: File) => {
    const formData = new FormData();
    transformJsonToFormData(formData, { type, file });
    return await Request.post(`${SERVER_API_ENDPOINT}/upload-file`, formData);
  },

  putNftImage: async (data: any) => {
    const { imgFile, nftId, collectionId } = data;
    const accessToken = localStorage.getItem('accessToken');
    let headers = {
      'x-amz-tagging': data.previewImgId
        ? `token=${accessToken}&nft_id=${nftId}&collectionId=${collectionId}&isImport=1&preview_img_id=${data.previewImgId}`
        : `token=${accessToken}&nft_id=${nftId}&collectionId=${collectionId}&isImport=1&preview_img_id=`,
      'Content-Type': imgFile.type,
      // 'Content-Type': 'image/svg',
    };

    try {
      const res = await customAxios({
        method: 'put',
        url: data?.uploadUrl,
        data: data?.imgFile,
        headers,
      });

      return [res, null];
    } catch (error) {
      console.log('error', error);
      return [null, error];
    }
  },

  putNftModel: async (data: any) => {
    const { extension, nftId, collectionId } = data;
    const accessToken = localStorage.getItem('accessToken');
    let contentType = getContentTypeModel(extension);
    let headers = {
      'x-amz-tagging': data.previewImgId
        ? `token=${accessToken}&nft_id=${nftId}&collectionId=${collectionId}&isImport=1&preview_img_id=${data.previewImgId}`
        : `token=${accessToken}&nft_id=${nftId}&collectionId=${collectionId}&isImport=1&preview_img_id=`,
      'Content-Type': contentType,
    };
    try {
      const res = await customAxios({
        method: 'put',
        url: data?.uploadUrl,
        data: data?.imgFile,
        headers,
      });
      return [res, null];
    } catch (error) {
      return [null, error];
    }
  },

  getPreSignUrl: async (data: any) => {
    const { imgFile, type } = data;
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    let imageId = getNFTImageName(imgFile);
    try {
      const res = await customAxios({
        method: 'put',
        url: `${AWS_API_ENDPOINT}/nft-image/${userId}/pre-signed`,
        params: {
          imageId,
          type,
          collectionId: data?.collectionId,
        },
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getUploadNFTPresignUrl: async (data: any) => {
    const { imgFile, nftId } = data;
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    let imageId = getNFTImageName(imgFile);
    try {
      const res = await customAxios({
        method: 'put',
        url: `${AWS_API_ENDPOINT}/nft-image/${userId}/pre-signed`,
        params: {
          imageId,
          nftId: nftId,
        },
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getUploadNFTPresignVideo: async (data: any) => {
    const { imgFile, nftId } = data;
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    let imageId = getNFTImageName(imgFile);
    try {
      const res = await customAxios({
        method: 'put',
        url: `${AWS_API_ENDPOINT}/nft-image/${userId}/pre-signed`,
        params: {
          imageId,
          nftId: nftId,
          type: 'video',
        },
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getUploadNFTPresignModel: async (data: any, extension: any) => {
    const { nftId } = data;
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    let name = new Date().getTime();
    let imageId = `${name}.${extension}`;
    try {
      const res = await customAxios({
        method: 'put',
        url: `${AWS_API_ENDPOINT}/nft-image/${userId}/pre-signed`,
        params: {
          imageId,
          nftId: nftId,
          type: '',
        },
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getUploadPreviewImage: async (data: any) => {
    const { imgFile, nftId } = data;
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    let imageId = getNFTImageName(imgFile);
    try {
      const res = await customAxios({
        method: 'put',
        url: `${AWS_API_ENDPOINT}/nft-image/${userId}/pre-signed`,
        params: {
          imageId,
          nftId: nftId,
          type: 'preview',
        },
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getMp3PresignUrl: async (data: any) => {
    const { imgFile, nftId } = data;
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    let imageId = getNFTImageName(imgFile);
    try {
      const res = await customAxios({
        method: 'put',
        url: `${AWS_API_ENDPOINT}/nft-image/${userId}/pre-signed`,
        params: {
          imageId,
          nftId: nftId,
          type: 'audio',
        },
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      return [res.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default uploadService;
