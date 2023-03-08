import { useState, useEffect } from 'react';
import { getPriceToken } from 'utils/getPrice';

export const usePriceToken = (symbol: string) => {
  const [price, setPrice] = useState<number>(0);
  useEffect(() => {
    getPriceToken(symbol).then((res: any) => setPrice(res));
  }, []);
  return price;
};
