import { abbreviateNumber, formatPricePercent } from "./func";

export const getValue = (value: string): string => {
    const temptValue = parseFloat(value);
    if (!temptValue || temptValue === 0) return '0';
    return `${abbreviateNumber(temptValue)}`;
    // if (temptValue) return roundNumber(temptValue.toFixed(2)).toString();
  
    // return temptValue.toFixed(2);
  };
  
export  const getVolumeChangedValue = (value: string): string => {
    const volumeTradedChange = parseFloat(value);
    if (Number.isNaN(volumeTradedChange)) return '-';
    return `${formatPricePercent(volumeTradedChange)}%`;
  };