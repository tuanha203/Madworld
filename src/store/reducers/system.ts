import { systemActions } from 'store/constants/system';

export interface ISystemState {
  loading?: boolean;
  MARKET_RAW_FEE?: number;
  MARKET_FEE?: number;
  priceNativeCoinUsd: number;
  priceUmadUsd?: number;
  priceUmadUsd24hChange?: number;
}

const initialState: ISystemState = {
  loading: false,
  MARKET_RAW_FEE: 0,
  MARKET_FEE: 0,
  priceNativeCoinUsd: 0,
  priceUmadUsd: 0,
  priceUmadUsd24hChange: 0,
};

const systemReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case systemActions.UPDATE_NATIVE_COIN_USD_PRICE: {
      return {
        ...state,
        priceNativeCoinUsd: action.payload,
      };
    }
    case systemActions.UPDATE_UMAD_USD_PRICE: {
      return {
        ...state,
        priceUmadUsd: action.payload,
      };
    }
    case systemActions.UPDATE_UMAD_USD_PRICE_24H_CHANGE: {
      return {
        ...state,
        priceUmadUsd24hChange: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default systemReducer;
