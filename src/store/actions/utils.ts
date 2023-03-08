import { utilsActions } from '../constants/utils';

export const setDutchAuctionPrice = (price: string | number) => {
  return {
    type: utilsActions.SET_DUTCH_AUCTION_PRICE,
    payload: price,
  };
};
