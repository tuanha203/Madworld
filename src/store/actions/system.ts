import { systemActions } from 'store/constants/system';

export const updateNativeCoinToUsd = (price: number) => {
  return {
    type: systemActions.UPDATE_NATIVE_COIN_USD_PRICE,
    payload: price,
  };
};

export const updateUmadToUsd = (price: number) => {
  return {
    type: systemActions.UPDATE_UMAD_USD_PRICE,
    payload: price,
  };
};

export const updateUmadToUsd24hChange = (price: number) => {
  return {
    type: systemActions.UPDATE_UMAD_USD_PRICE_24H_CHANGE,
    payload: price,
  };
};
