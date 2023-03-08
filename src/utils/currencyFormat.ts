import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: 40 });

// Format currency with seprator
export const currencyFormat = (value: any, currency = '$') => {
  //add seprator to value
  if (!value) return '$0.00';
  return `${currency}${abbreviateNumber(parseFloat(value).toFixed(2).toString(), 1)}`;
};

export const abbreviateNumber = (value: any, decimals = 0) => {
  if (!value) return 0;
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(decimals)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(decimals)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(decimals)}K`;
  return `${parseFloat(value).toFixed(decimals)}`;
};

export const addCommaToNumber = (value: any, decimal = 2) => {
  if (!value) return 0;
  value = parseFloat(value);
  return value.toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimal,
  });
};

export const addCommaToNumberHasApproximately = (value: any, decimal = 2) => {
  if (!value || value === '0' || !parseFloat(value)) return 0;
  value = parseFloat(value);

  if (value < 10 ** -decimal) return `~${new BigNumber(10 ** -decimal).toString()}`;

  return value.toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimal,
  });
};
