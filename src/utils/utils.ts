import BigNumber from 'bignumber.js';
import moment from 'moment';
import { serialize } from 'utils/url';

function calculateTimeLeft(year: any, month: any, day: any) {
  // const year = new Date().getFullYear();
  const difference = +new Date(`${year}-${month}-${day}`) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

const commaNumber = require('comma-number');

const commaFormat = commaNumber.bindWith(',', '.');

const checkMin = (value: string) => {
  return (
    new BigNumber(value).lt(new BigNumber('0.01')) &&
    new BigNumber(value).gt(new BigNumber('0.000000'))
  );
};

const checkIsInteger = (value: string) => {
  return value && !isNaN(Number(value)) && Number.isInteger(parseFloat(value));
};

const commaForMatSpec = (value: string) => {
  if (Math.abs(Number(value)) >= 1.0e9) {
    return `${commaFormat(new BigNumber(`${Math.abs(Number(value)) / 1.0e9}`).dp(2, 1))}B`;
  } else {
    if (checkMin(value)) return '0.00';
    if (checkIsInteger(value)) return commaFormat(value.toString().split('.')[0]).toString();
    return commaFormat(new BigNumber(value).toFixed(2));
  }
};

const sortByVolumn = (collections: any, sortFallBack: (a: any, b: any) => void) => {
  return collections.sort((a: any, b: any) => {
    if (a?.volume === b?.volume) {
      return sortFallBack(a, b);
    }
    return a?.volume < b?.volume ? 1 : -1;
  });
};

const filterQueryURL = (queryObject: any) => {
  const filterQueryObject = Object.entries(queryObject).reduce((a, [b, c]) => {
    if (c) {
      if (Array.isArray(c)) {
        if (c.length == 0) return a;
        a[b] = JSON.stringify(c);
      } else {
        a[b] = c;
      }
    }
    return a;
  }, {} as any);

  return serialize(filterQueryObject);
};

const formatUrl = (path: string) => {
  const isValidDomain = path?.slice(0, 4) === 'http';
  if (isValidDomain) return path;
  return `https://${path}`;
};

const delay = (ms = 1000) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(200);
    }, ms),
  );

interface IParams {
  startPrice: string | number;
  endPrice: string | number;
  expireDate: number;
  startDate: number;
}

const calculateDecliningPrice = (data: IParams, isOrderMatch: boolean = false): string => {
  // Current price = Starting price - { (Starting price - Ending price) * [(Current time - Start Buy time)/ (End Buy time - Start Buy time) ] }
  try {
    const { startPrice, endPrice, expireDate, startDate } = data;

    const currentTime = moment().unix();

    if (currentTime >= +expireDate) {
      return endPrice as string;
    }

    if (currentTime < +startDate && !isOrderMatch) {
      return startPrice as string;
    }

    // (Starting price - Ending price)
    const changePrice = new BigNumber(startPrice).minus(endPrice).toNumber();

    //  [(Current time - Start Buy time)/ (End Buy time - Start Buy time) ]
    const durationRatio = (currentTime - startDate) / (expireDate - startDate);

    const extraPrice = changePrice * durationRatio;

    const currentPrice = new BigNumber(startPrice).minus(extraPrice).toString();
    return currentPrice;
  } catch (err: any) {
    console.error('Invalid params', err);
  }
};

const setIntervalImmediately = (func: () => void, interval: number) => {
  func();
  return setInterval(() => {
    func();
  }, interval);
};

export {
  calculateTimeLeft,
  commaForMatSpec,
  checkMin,
  checkIsInteger,
  sortByVolumn,
  filterQueryURL,
  formatUrl,
  delay,
  calculateDecliningPrice,
  setIntervalImmediately,
};
