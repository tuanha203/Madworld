import BigNumber from 'bignumber.js';
import { abbreviateNumber } from './currencyFormat';

export const formatPrecisionAmount = (amount: any, precision = 18) => {
  const rawValue = new BigNumber(`${amount}`).toFixed(precision);
  return amount && parseFloat(amount) !== Infinity ? new BigNumber(rawValue).toFormat() : '0';
};

export const balanceFormat = (amount: any, fixed = 0, precision: any) => {
  if (amount == null) return 'Not available';
  return Number(new BigNumber(`${amount}e-${precision}`).toFixed(fixed));
};

export const balanceFormatKeepValue = (amount: any, precision: any) => {
  if (amount == null) return 'Not available';
  return new BigNumber(`${amount}e-${precision}`);
};
export const fromWei = (amount: any, precision = 18) =>
  new BigNumber(`${amount}e+${precision}`).toString();

const formatAfterDecial = (number: any) => {
  if (!number) return 0;
  let newNumber = number;
  for (let i = number.length - 1; i >= 0; i--) {
    if (newNumber[i] === '0') newNumber = newNumber.substring(0, newNumber.length - 1);
    else {
      break;
    }
  }
  return newNumber;
};

export const formatNumber = (num: any, number_decimal = 18) => {
  if (!num) return 0;
  if (Number(new BigNumber(num)) < Number(new BigNumber(`1e-${number_decimal}`))) return 0;
  const numString = new BigNumber(num).toString().split('.');
  const beforeDecimal = numString[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  if (numString.length > 1) {
    let afterDecimal = formatAfterDecial(numString[1].substring(0, number_decimal));
    if (afterDecimal === '0' || afterDecimal === '') return beforeDecimal;
    return beforeDecimal + '.' + afterDecimal;
  } else {
    return beforeDecimal;
  }
};

export const roundNumber = (number: any) => {
  if (Math.round(number).toString().length > 9) {
    return `${(number / 1000000000).toLocaleString('en-US')} B`;
  } else if (Math.round(number).toString().length > 6) {
    return `${(number / 1000000).toLocaleString('en-US')} M`;
  } else if (Math.round(number).toString().length > 3) {
    return `${(number / 1000).toLocaleString('en-US')} K`;
  } else return formatNumber(number);
};

export const stakingRoundNumber = (number: any) => {
  number = number.toString().replace(/,/g, '');
  if (Math.round(number).toString().length > 9) {
    if (Math.round(number).toString().length === 12)
      return `${parseFloat((number / 1000000000).toString().substring(0, 5)).toString()}B`;
    return `${parseFloat((number / 1000000000).toString().substring(0, 4)).toString()}B`;
  } else if (Math.round(number).toString().length > 6) {
    if (Math.round(number).toString().length === 9)
      return `${parseFloat((number / 1000000).toString().substring(0, 5)).toString()}M`;
    return `${parseFloat((number / 1000000).toString().substring(0, 4)).toString()}M`;
  } else if (Math.round(number).toString().length > 3) {
    if (Math.round(number).toString().length === 6)
      return `${parseFloat((number / 1000).toString().substring(0, 5)).toString()}K`;
    return `${parseFloat((number / 1000).toString().substring(0, 4)).toString()}K`;
  } else return parseFloat((formatNumber(number) as any).substring(0, 6)).toString();
};

export const roundingNumber = (value: any) => {
  const COUNT_FORMATS = [
    {
      // 0 - 999
      letter: '',
      limit: 1e3,
    },
    {
      // 1,000 - 999,999
      letter: 'K',
      limit: 1e6,
    },
    {
      // 1,000,000 - 999,999,999
      letter: 'M',
      limit: 1e9,
    },
    {
      // 1,000,000,000 - 999,999,999,999
      letter: 'B',
      limit: 1e12,
    },
    {
      // 1,000,000,000,000 - 999,999,999,999,999
      letter: 'T',
      limit: 1e15,
    },
  ];
  if (!value) {
    return 0;
  }
  // Format Method:
  let format = COUNT_FORMATS.find((format) => value < format.limit) || COUNT_FORMATS[COUNT_FORMATS.length - 1];
  
  value = (1000 * value) / (format as any).limit;
  value = Math.round(value * 10) / 10; // keep one decimal number, only if needed
  return value + (format as any).letter;
};

export const formatInputNumber = (num: any) => {
  if (!num) return;
  if (num === '.') return '0.';
  if (num === '0') return '';
  let input = num
    .toString()
    .replace(/[^0-9.]/g, '')
    .replace(/(\..*?)\..*/g, '$1');
  if (!input.includes('.')) {
    return Number(input).toLocaleString('en-US');
  } else {
    const numString = input.toString().split('.');
    const beforeDecimal = numString[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return beforeDecimal + '.' + numString[1];
  }
};

export const formatWalletAddress = (address: string) => {
  if (!address) return '';
  let formatedAddress = address.toString();
  return formatedAddress.slice(0, 6) + '...' + formatedAddress.slice(formatedAddress.length - 4);
};

export const formatNumberToFix = (numb: any) => {
  if (!numb) {
    return 0;
  }
  if (numb.toString().length >= 7) {
    return numb.toFixed(8);
  }

  return numb;
};

export const convertToIncreaseOrDecreasePercent = (value: any, total: any) => {
  if (total === 0) return 0;
  const percent = (value / total) * 100;
  if (percent > 0) {
    return `+${abbreviateNumber(percent)}%`;
  }
  if (percent < 0) {
    return `-${abbreviateNumber(percent)}%`;
  }
};
