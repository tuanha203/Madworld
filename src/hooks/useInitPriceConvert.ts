import {
  updateNativeCoinToUsd,
  updateUmadToUsd,
  updateUmadToUsd24hChange,
} from './../store/actions/system';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import coingeckoService from 'service/coingeckoService';
import { get } from 'lodash';

const NATIVE_COIN = 'ethereum'; //ethereum

export const useInitPriceConvert = () => {
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state);

  const init = useCallback(async () => {
    try {
      const data = await coingeckoService.getPriceCoingecko(NATIVE_COIN, 'usd');
      const nativeCoinToUsd = get(data[NATIVE_COIN], 'usd');
      dispatch(updateNativeCoinToUsd(nativeCoinToUsd));
      const data2 = await coingeckoService.getPriceCoingecko('madworld', 'usd');
      const umadToUsd = get(data2, 'madworld.usd');
      const umadUsd24hChange = get(data2, 'madworld.usd_24h_change');
      dispatch(updateUmadToUsd(umadToUsd));
      dispatch(updateUmadToUsd24hChange(umadUsd24hChange));
    } catch (error) {
      console.log('init: ', error);
    }
  }, []);

  useEffect(() => {
    init();
  }, []);

  return null;
};
