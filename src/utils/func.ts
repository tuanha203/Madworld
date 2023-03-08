import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import _ from 'lodash';
import { TYPE_IMAGE, TYPE_MEDIA } from 'constants/app';
import { NETWORK_ID } from 'constants/envs';

interface IProps {
  address?: string;
  start?: number;
  chars?: number;
  personalSite?: string | null | undefined;
  name?: string;
  price?: any;
  params?: number;
  img?: any;
  callback?: any;
}

export function shortenAddress(address = '', start = 10, chars = 4) {
  return `${address?.substring(0, start)}...${address?.substring(address.length - chars)}`;
}

export function shortenPersonalSite(personalSite = '', start = 30, chars = 10) {
  return `${personalSite?.substring(0, start)}...${personalSite?.substring(
    personalSite?.length - chars,
  )}`;
}
export function shortenName(name = '', start = 10) {
  return `${name?.substring(0, start)}...`;
}
export function shortenNameNoti(name = '', start = 10) {
  name = String(name);
  return name?.length <= start ? `${name?.substring(0, start)}` : `${name?.substring(0, start)}...`;
}
export const roundNumber = (price: any, params = 6) => {
  if (!price || !parseFloat(price)) return 0;
  if (price < 10 ** -params) return '~' + ' ' + new BigNumber(10 ** -params).toFormat().toString();
  // const numb = parseFloat(price)
  return new BigNumber(price).decimalPlaces(params).toFormat().toString();
};

export const makeNumberTwoDigit = (number: number) => {
  return number < 10 ? `0${number}` : number;
};

export const getBase64 = (img: any, callback: any) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

export const EllipsisMiddle = (account: string) => {
  return account ? account.slice(0, 6) + '...' + account.slice(-4) : '';
};

export const EllipsisDisplayName = (account: string) => {
  return account && account.slice(0, 6);
};

export const abbreviateNumber = (number: number | string, digits = 2) => {
  number = Number(number) || 0;
  if (number === 0 || !number) return 0;

  if (number < 1) {
    if (number <= 0.009) return '~0.01';
    return parseFloat(number.toFixed(2));
  }

  const si_suffixes = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  const item = si_suffixes
    .slice()
    .reverse()
    .find(function (item) {
      return number >= item.value;
    });

  // fix: https://jira.sotatek.com/browse/MAD2-640
  const numberConverted = (number / item.value).toFixed(digits).replace(rx, '$1') * item.value;

  const item2 = si_suffixes
    .slice()
    .reverse()
    .find(function (item) {
      return numberConverted >= item.value;
    });

  return item2
    ? (numberConverted / item2.value).toFixed(digits).replace(rx, '$1') + item2.symbol
    : 0;
};

export const abbreviateNumberFromMillion = (number: number | string, digits = 2) => {
  number = Number(number) || 0;
  if (number === 0 || !number) return 0;

  if (number < 1) {
    if (number <= 0.009) return '~0.01';
    return parseFloat(number.toFixed(2));
  }

  const si_suffixes = [
    { value: 1, symbol: '' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  const item = si_suffixes
    .slice()
    .reverse()
    .find(function (item) {
      return number >= item.value;
    });

  // fix: https://jira.sotatek.com/browse/MAD2-640
  const numberConverted = (number / item.value).toFixed(digits).replace(rx, '$1') * item.value;

  const item2 = si_suffixes
    .slice()
    .reverse()
    .find(function (item) {
      return numberConverted >= item.value;
    });

  return item2
    ? (numberConverted / item2.value).toFixed(digits).replace(rx, '$1') + item2.symbol
    : 0;
};

export const formatPricePercent = (number: any | string, digits = 2) => {
  if (number === '-' || !number) return number;
  number = Number(number);
  const operator = number > 0 ? '+' : '';

  const si_suffixes = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = si_suffixes
    .slice()
    .reverse()
    .find(function (item) {
      return Math.abs(number) >= item.value;
    });
  return item
    ? `${operator}${(number / item.value).toFixed(digits).replace(rx, '$1')}${item.symbol}`
    : 0;
};

export const secondsToTime = (duration: number) => {
  let seconds: number | string = Math.floor(duration);
  let minutes: number | string = Math.floor(seconds / 60);
  let hours: number | string = Math.floor(minutes / 60);
  let days: number | string = hours / 24;

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : Math.floor(minutes % 60);
  seconds = seconds < 10 ? '0' + seconds : Math.floor(seconds % 60);

  if (days >= 1) return `${Math.ceil(days)} days`;
  return `${hours}h ${minutes}m ${seconds}s`;
};

export const checkTypeMedia = (url: string | '') => {
  const type = url?.substring(url?.lastIndexOf('.') + 1);
  if (type === TYPE_IMAGE.MP3 || type === TYPE_IMAGE.MPEG || type === TYPE_IMAGE.MPGA || type === TYPE_IMAGE.OGG || type === TYPE_IMAGE.WAV) {
    return TYPE_IMAGE.MP3;
  } else if (type === TYPE_IMAGE.MP4 || type === TYPE_IMAGE.WEBM) {
    return TYPE_IMAGE.MP4;
  } else {
    return TYPE_IMAGE.IMAGE;
  }
};

export const checkTypeMediaCreateNft = (type: string | '') => {
  if (type === TYPE_IMAGE.MP3 || type === TYPE_IMAGE.MPEG || type === TYPE_IMAGE.MPGA || type === TYPE_IMAGE.OGG || type === TYPE_IMAGE.WAV) {
    return TYPE_IMAGE.MP3;
  } else if (type === TYPE_IMAGE.MP4 || type === TYPE_IMAGE.WEBM) {
    return TYPE_IMAGE.MP4;
  } else {
    return TYPE_IMAGE.IMAGE;
  }
};

const formatValuesProperties = (values: Array<string>, listChecked?: Array<any>) => {
  let checked = true;
  let indeterminate = false;
  const result = values.map((value: any, index: number) => {
    const result = listChecked?.find((item: any) => value.ids && value.ids.includes(parseInt(item)));
    if (result) {
      indeterminate = true;
    } else {
      checked = false
    }
    return {
      key: ++index,
      name: value,
      value: value,
      checked: !!result,
    };
  });

  if(checked) {
    indeterminate = false
  }


  return {
    result,
    checked,
    indeterminate,
  };
};

export const formatProperties = (data: Array<any>, listChecked?: Array<any>) => {
  return data?.map((properties: any, index) => {
    const { values, name, total } = properties;
    let child = formatValuesProperties(values, listChecked);
    return {
      key: name,
      name,
      value: total,
      open: false,
      checked: child.checked,
      indeterminate: child.indeterminate,
      child: child.result,
    };
  });
};

export function shortenNameNotiHasAddress(name = '', start = 10) {
  if (typeof name !== 'string') return 'unknown';

  if (Web3.utils.isAddress(name)) return name?.slice(0, 6);
  return name?.length <= start ? `${name?.substring(0, start)}` : `${name?.substring(0, start)}...`;
}

export const checkOwner = (address: string, accountConnected?: string | null | undefined) => {
  return accountConnected === address;
};

export function beautifulObject(obj: any) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (_.isString(element) && element === '') delete obj[key];
      if (_.isObject(element) && _.isEmpty(element)) delete obj[key];
      if (_.isArray(element) && element.length === 0) delete obj[key];
      if (_.isUndefined(element)) delete obj[key];
      if (_.isNaN(element)) obj[key] = 0;
      if (!element) delete obj[key];
    }
  }
  return obj;
}
export const checkNetwork = (chainId?: number) => {
  return chainId === parseInt(NETWORK_ID as string);
};

export const validationCreateNft = (filed: any, setFiledError: any, callback: any) => {
  // for ()
};
