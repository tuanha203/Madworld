import axios from 'axios';
import { PAYMENT_TOKEN } from 'constants/app';

export const getPrice = async (sym: string) => {
  let symbol = '';

  if (!sym) return null;

  switch (sym.toLowerCase()) {
    case PAYMENT_TOKEN.XTR:
      symbol = 'xtremcoin';
      break;
    case PAYMENT_TOKEN.BNB:
      symbol = 'binancecoin';
      break;
    case PAYMENT_TOKEN.WBNB:
      symbol = 'wbnb';
      break;
    case PAYMENT_TOKEN.WETH:
      symbol = 'weth';
      break;
    case PAYMENT_TOKEN.ETH:
      symbol = 'ethereum';
      break;
    case PAYMENT_TOKEN.BUSD:
      symbol = 'wbnb';
      break;
    case PAYMENT_TOKEN.USDT:
      symbol = 'usdt';
      break;
    default:
      symbol = 'binancecoin';
  }

  return new Promise((resolve, reject) => {
    try {
      axios
        .get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`)
        .then((data) => {
          if (data.data[`${symbol}`]) {
            resolve(data.data[`${symbol}`].usd);
            return;
          }
          resolve(1);
        });
    } catch (error) {
      resolve(1);
    }
  });
};

export const getPriceFooter = async () => {
  return await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=xtremcoin,bitcoin,ethereum,binancecoin&vs_currencies=usd`,
  );
};

export const getPriceToken = async (symbol: string) => {
  try {
    const resp = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`,
    );
    return resp.data[symbol].usd;
  } catch (err: any) {
    console.error('getPriceOfToken: ', err);
    return 0;
  }
};
