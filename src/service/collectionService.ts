import Request from '../request';
import { SERVER_API_ENDPOINT } from 'constants/envs';
import uploadService from './uploadService';
import { EventSocket } from 'constants/text';
import socket from 'configsocket';
import { filterQueryURL } from 'utils/utils';

type IListNftOffCollectionType = {
  limit?: number;
  page?: number;
  keyword?: string;
  sortField?: string;
  sortDirection?: string;
  nftId?: string;
  saleType?: string[];
  properties?: any;
  endPrice?: number;
  startPrice?: number;
  priceType?: string;
};

type ICollectionDetailType = {
  address: string | null;
  walletAddress?: string | null;
};

type ICollectionFeed = {
  address: string;
  limit: number | null;
  page: number | null;
  type: string | null;
};

type ICollectionChart = {
  address: string;
  period: string;
  itemsSold?: string;
};

const collectionService = {
  postCollection: async (data: any) => {
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/collection`, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  updateCollection: async (collectionId: string, params: any) => {
    try {
      const response = await Request.patch(`${SERVER_API_ENDPOINT}/collection/${collectionId}`, {
        ...params,
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  uploadCollectionCover: async (data: any) => {
    try {
      const [res] = await uploadService.getPreSignUrl(data);
      await uploadService.putNftImage({
        imgFile: data?.imgFile,
        nftId: '',
        collectionId: data?.collectionId,
        uploadUrl: res?.upload_url,
        previewImgId: '',
      });
      // await new Promise((resolve) => {
      //   socket.on(EventSocket.COLLECTION_BANNER, (res) => {
      //     if (res.data.collectionId === data?.collectionId) {
      //       resolve(true);
      //     }
      //   });
      // });
      return res?.path;
    } catch (error) {
      console.log('err', error);
      return false;
    }
  },

  uploadCollectionImage: async (id: any, params: any) => {
    try {
      const response = await Request.patch(`${SERVER_API_ENDPOINT}/collection/image/${id}`, params);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  uploadCollection: async (data: any) => {
    try {
      const [res] = await uploadService.getPreSignUrl(data);
      await uploadService.putNftImage({
        imgFile: data?.imgFile,
        nftId: '',
        collectionId: data?.collectionId,
        uploadUrl: res?.upload_url,
        previewImgId: '',
      });
      // await new Promise((resolve) => {
      //   socket.on(EventSocket.COLLECTION_IMAGE, (res) => {
      //     if (res.data.collectionId === data?.collectionId) {
      //       resolve(true);
      //     }
      //   });
      // });
      return res?.path;
    } catch (error) {
      console.log('err', error);
      return false;
    }
  },

  getCollectionAll: async (queryObject: any) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/collection/all?${filterQueryURL(queryObject)}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getCollectionDetail: async (params: ICollectionDetailType) => {

    const { address, walletAddress } = params;
    try {
      const resultByAddress = await Request.get(
        `${SERVER_API_ENDPOINT}/collection/detail/${address}?userAddress=${walletAddress}`,
      );
      return [resultByAddress, null];
    } catch (error) {
      return [null, error];
    }
  },

  fetchCollectionDetails: async (address: string) => {
    try {
      let collectionUrl = `${SERVER_API_ENDPOINT}/collection/detail/${address}`;
      return await fetch(collectionUrl);
    } catch (error) {
      return error;
    }
  },

  fetchSEOCollectionDetails: async (address: string) => {
    try {
      let collectionUrl = `${SERVER_API_ENDPOINT}/collection/seo-detail/${address}`;
      return await fetch(collectionUrl);
    } catch (error) {
      return error;
    }
  },

  getListNFTOfCollection: async (address: string, params: any) => {
    try {
      for (const key in params) {
        if (
          params &&
          params[key] &&
          typeof params[key] === 'string' &&
          params[key].indexOf('-') > -1
        )
          params[key] = params[key].split('-').toString();
        if (key === 'saleType' && params['saleType'])
          params['saleTypes'] = JSON.parse(params.saleType).toString(); // this stupid. I KNOW

        if (key === 'priceType' && params['priceType']) params['tokenTypes'] = params['priceType'];
      }

      delete params.saleType;
      delete params.priceType;

      const result = await Request.get(`${SERVER_API_ENDPOINT}/nft/all`, {
        ...params,
        collectionAddress: address,
      });
      return [result, null];
    } catch (error) {
      return [null, error];
    }
  },

  getPropertiesCollection: async (addressCollection?: string, searchValue?: string) => {
    try {
      const result = await Request.get(`${SERVER_API_ENDPOINT}/properties-nft`, {
        collectionAddress: addressCollection,
        searchValue: searchValue,
      });
      return result;
    } catch (error) {
      return [null, error];
    }
  },

  checkUrlAlreadyTaken: async (shortUrl?: string) => {
    try {
      const result = await Request.get(
        `${SERVER_API_ENDPOINT}/collection/checkUrl?&shortUrl=${shortUrl}`,
      );
      return result && true;
    } catch (error) {
      return false;
    }
  },

  getCollectionFeed: async ({
    address,
    params,
  }: {
    address: string;
    params: { limit: number; page: number; type?: string };
  }) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/collection/insights/${address}`,
        params,
      );
      return [response, null];
    } catch (error) {
      return [null, error];
    }
  },

  getChartCollection: async (param: ICollectionChart) => {
    try {
      const { period, address, itemsSold } = param;
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/collection/insights/chart/${address}`,
        {
          period: period,
          itemsSold: itemsSold,
        },
      );
      return [response, null];
    } catch (error) {
      return [null, error];
    }
  },

  getAllCategoryCollection: async (isDisplay?: number) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/category/all?&isDisplay=${isDisplay}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getCollectionOfOwner: async (typeCollection?: string) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/collection?type=${typeCollection}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
  getCollectionInfo: async (collectionAddress?: string) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/collection/info/${collectionAddress}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  importCollection: async (address?: string) => {
    try {
      const response = await Request.post(
        `${SERVER_API_ENDPOINT}/collection/import/${address}`,
        {},
      );
      return [response, null];
    } catch (error: any) {
      return [null, error?.response?.data];
    }
  },

  getCollecitonBranded: async () => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/collection/branded`, {});
      return [response, null];
    } catch (error: any) {
      return [null, error?.response?.data];
    }
  },
  // getCollectionDetail: async ({
  //   properties,
  //   shortUrl,
  //   verification,
  //   sort,
  //   categories,
  //   limit,
  //   offset,
  //   keyword,
  // }) => {
  //   try {
  //     const response = await Request.get(
  //       `${SERVER_API_ENDPOINT}/collections/one?shortUrl=${shortUrl}&limit=${limit || ''}${
  //         offset ? `&offset=${offset}` : ''
  //       }
  //               ${verification ? `&verification=${verification}` : ''}${
  //         categories ? `&categories=${categories}` : ''
  //       }${sort ? `&sort=${sort}` : ''}${
  //         properties && properties.length ? `&properties=${properties}` : ''
  //       }${keyword ? `&keyword=${keyword}` : ''}`,
  //     );
  //     if (response.data === USER_IS_BANNED_CODE) {
  //       message.error('User has been banned!');
  //       return [null, { message: '' }];
  //     }
  //     return [response.data, null];
  //   } catch (error) {
  //     return [null, error];
  //   }
  // },
  // getListOfCollection: async () => {
  //   try {
  //     const response = await Request.get(`${SERVER_API_ENDPOINT}/collections`);
  //     return [response.data, null];
  //   } catch (error) {
  //     return [null, error];
  //   }
  // },

  // getPresignUrlCollectionCover: async (data) => {
  //   const { imgFile } = data;
  //   const accessToken = localStorage.getItem('accessToken');
  //   const userId = localStorage.getItem('userId');
  //   let imageId = getNFTImageName(imgFile);
  //   try {
  //     const res = await customAxios({
  //       method: 'put',
  //       url: `${AWS_API_ENDPOINT}/nft-image/${userId}/pre-signed`,
  //       params: {
  //         imageId,
  //         type: IMAGE_TYPE_UPLOAD.COLLECTION_COVER,
  //         collectionId: data?.collectionId,
  //       },
  //       headers: {
  //         Authorization: `${accessToken}`,
  //       },
  //     });
  //     return [res.data, null];
  //   } catch (error) {
  //     return [null, error];
  //   }
  // },
  // getPresignUrlCollectionAvatar: async (data) => {
  //   const { imgFile } = data;
  //   const accessToken = localStorage.getItem('accessToken');
  //   const userId = localStorage.getItem('userId');
  //   let imageId = getNFTImageName(imgFile);
  //   try {
  //     const res = await customAxios({
  //       method: 'put',
  //       url: `${AWS_API_ENDPOINT}/nft-image/${userId}/pre-signed`,
  //       params: {
  //         imageId,
  //         type: IMAGE_TYPE_UPLOAD.COLLECTION,
  //         collectionId: data?.collectionId,
  //       },
  //       headers: {
  //         Authorization: `${accessToken}`,
  //       },
  //     });
  //     return [res.data, null];
  //   } catch (error) {
  //     return [null, error];
  //   }
  // },
  // uploadCollectionCoverImage: async (data) => {
  //   const type = data.imgFile.type;
  //   const extension = type.split('/')[1];
  //   const name = new Date().getTime();
  //   const accessToken = localStorage.getItem('accessToken');
  //   const config = {
  //     headers: {
  //       Authorization: accessToken,
  //       'x-amz-tagging': `token=${accessToken}&collective_id=${data.collectionId}&type=cover`,
  //       'Content-Type': type,
  //     },
  //   };
  //   try {
  //     const response = await customAxios({
  //       method: 'put',
  //       url: `${AWS_API_ENDPOINT}/user-collective/${data.userId}/${data.collectionId}/${name}.${extension}`,
  //       data: data.imgFile,
  //       headers: config.headers,
  //     });
  //     return [response, null];
  //   } catch (error) {
  //     return [null, error];
  //   }
  // },
  // getAllCollection: async ({
  //   limit = 12,
  //   offset = 0,
  //   sortBy = 'Created',
  //   hasListPrice = true,
  //   hasOpenOffer = false,
  //   ownedByCreator = false,
  //   hasSold = false,
  //   userId,
  //   networkType,
  //   category = '',
  //   verification,
  //   notEmpty,
  //   onSaleStatus,
  //   nsfw,
  // }) => {
  //   try {
  //     const response = await Request.get(
  //       `${SERVER_API_ENDPOINT}/collections/all?${notEmpty ? `&notEmpty=${notEmpty}` : ''}${
  //         onSaleStatus ? `&onSaleStatus=${onSaleStatus}` : ''
  //       }&offset=${offset}${
  //         userId ? `&userId=${userId}` : ''
  //       }&limit=${limit}&sortBy=${sortBy}&hasListPrice=${hasListPrice}&hasSold=${hasSold}&hasOpenOffer=${hasOpenOffer}&ownedByCreator=${ownedByCreator}${
  //         networkType ? `&networkType=${networkType}` : ''
  //       }${verification ? `&verification=${verification}` : ''}${
  //         category !== -1 && category ? `&category=${category}` : ''
  //       }`,
  //       {
  //         nsfw,
  //       },
  //     );
  //     return [response.data, null];
  //   } catch (error) {
  //     return [null, error];
  //   }
  // },
  // getHotCollection: async ({ limit = 12, offset = 0 }) => {
  //   try {
  //     const response = await Request.get(
  //       `${SERVER_API_ENDPOINT}/collections/hot?offset=${offset}&limit=${limit}`,
  //     );
  //     return [response.data, null];
  //   } catch (error) {
  //     return [null, error];
  //   }
  // },
  // getTopCollection: async ({
  //   limit = 12,
  //   offset = 0,
  //   categoryId,
  //   day,
  //   networkType,
  //   key,
  //   order,
  // }) => {
  //   try {
  //     const response = await Request.get(
  //       `${SERVER_API_ENDPOINT}/collections/top?offset=${offset}&limit=${limit}${
  //         categoryId ? `&categoryId=${categoryId}` : ''
  //       }${day ? `&day=${day}` : ''}${networkType ? `&networkType=${networkType}` : ''}`,
  //       {
  //         key,
  //         order,
  //       },
  //     );
  //     return [response.data, null];
  //   } catch (error) {
  //     return [null, error];
  //   }
  // },
  // patchCollection: async (data) => {
  //   try {
  //     const response = await Request.patch(`${SERVER_API_ENDPOINT}/collections`, data);
  //     return [response.data, null];
  //   } catch (error) {
  //     return [null, error];
  //   }
  // },
};

export default collectionService;
