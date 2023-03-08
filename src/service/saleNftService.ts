import { SERVER_API_ENDPOINT } from 'constants/envs';
import Request from '../request';

const saleNftService = {
  putDataOnSale: async (body: any) => {
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/nft-sale`, body);

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  // get ve thong tin cua nft sau khi put on sale
  getNftSaleDetailById: async (nftSaleId: number) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/nft-sale/${nftSaleId}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  // get tat ca nft sale theo nftid
  getNftSaleDetailNftId: async (nftId: number, limit: number, page: number) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/nft-sale/by-nft/${nftId}?limit=${limit}&page=${page}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  offerNft: async (data: any) => {
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/offer-sale-nft/for-offer`, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  bidNftSale: async (data: any) => {
    try {
      const response = await Request.post(
        `${SERVER_API_ENDPOINT}/offer-sale-nft/for-auction`,
        data,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  cancelOfferSuccess: async (offerId: number) => {
    try {
      const response = await Request.patch(
        `${SERVER_API_ENDPOINT}/offer-sale-nft/cancel/${offerId}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getOffersByNftId: async (
    nftId: number,
    { limit, page }: { limit: number; page: number },
    query?: string,
  ) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/offer-sale-nft/offers/${nftId}${query}`,
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getTopOffersByNftId: async (
    nftId: number,
    {
      limit,
      page,
      priceType,
      walletAddress,
    }: {
      limit?: number;
      page?: number;
      priceType?: 'DESC' | 'ASC' | undefined;
      walletAddress?: string | undefined | null;
    },
  ) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/offer-sale-nft/best-offers/${nftId}?priceType=${priceType}`,
        {
          limit,
          page,
          walletAddress,
        },
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getBestOfferByOwner: async (
    nftId: number,
    {
      limit,
      page,
      priceType,
      walletAddress,
    }: {
      limit?: number;
      page?: number;
      priceType?: 'DESC' | 'ASC' | undefined;
      walletAddress?: string | undefined | null;
    },
  ) => {
    try {
      const response = await Request.get(
        `${SERVER_API_ENDPOINT}/offer-sale-nft/offers/${nftId}?priceType=${priceType}&walletAddress=${walletAddress}`,
        {
          limit,
          page,
        },
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  getOfferDetailById: async (offerId: number) => {
    try {
      const response = await Request.get(`${SERVER_API_ENDPOINT}/offer-sale-nft/${offerId}`);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  likeCollection: async (params: any) => {
    try {
      const response = await Request.post(`${SERVER_API_ENDPOINT}/nft/like`, params);
      return [response, null];
    } catch (error) {
      return [null, error];
    }
  },

  editPriceListing: async (
    body: {
      newPrice: number;
      startDate?: number;
      expireDate?: number;
      sellHash: string;
      metadata: any;
      type?: string;
      startPrice?: number | string;
    },
    nftSaleId: string | number,
  ) => {
    try {
      const response = await Request.patch(
        `${SERVER_API_ENDPOINT}/nft-sale/update-price/${nftSaleId}`,
        body,
      );

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },

  updateNftSaleCreated: async (id: number | string, data: any) => {
    try {
      const response = await Request.put(`${SERVER_API_ENDPOINT}/nft/update/${id}`, data);

      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  },
};

export default saleNftService;
