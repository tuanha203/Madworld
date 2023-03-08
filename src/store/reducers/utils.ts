import { utilsActions } from 'store/constants/utils';

export interface IUtilsState {
  dutchAuctionPrice: string;
}

const initialState: IUtilsState = {
  dutchAuctionPrice: '0',
};

const utilsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case utilsActions.SET_DUTCH_AUCTION_PRICE: {
      return {
        ...state,
        dutchAuctionPrice: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default utilsReducer;
