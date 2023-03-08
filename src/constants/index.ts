import { NEXT_PUBLIC_WETH_ADDRESS } from './app';
export const METADATA = '';

export const DECIMALS_ERC20: any = {
  umad: 8,
  eth: 18,
  weth: 18,
};

// TODO
export const ERC20_ADDRESS: any = {
  umad: process.env.NEXT_PUBLIC_UMAD_ADDRESS,
  eth: '0x0000000000000000000000000000000000000000',
  weth: process.env.NEXT_PUBLIC_WETH_ADDRESS,
};

export const MARKET_RAW_FEE_BUY_TOKEN: any = {
  umad: 1,
  eth: 2.5,
  weth: 2.5,
};

export const PAYMENT_TOKEN: any = {
  ETH: 'eth',
  UMAD: 'umad',
  WETH: 'weth',
};

export const NFT_SALE_TYPES = {
  FIX_PRICE: 'fix_price',
  ENGLISH_AUCTION: 'english_auction',
  DUTCH_AUCTION: 'dutch_auction',
  AUCTION: 'auction',
};

export const NFT_SALE_ACTIONS = {
  LIST: 'list',
  CANCEL: 'cancel',
  SOLD_OUT: 'sold_out',
};

export const PROPERTIES_FILTER = {
  Traits: [
    'Bad luck',
    'Charismatic',
    'Sexy',
    'Gracefulness',
    'Sensitive',
    'Joker',
    'Witty',
    'Devoted',
    'Authentic',
    'Independent',
    'Nurturance',
  ],
};

export const REGEX_PRICE = /^(?!00)\d{0,16}(\.\d{0,8})?$/;

export const REGEX_QUANTITY = /^[1-9]\d*$/;

export const CURRENCY_CONFIG = {
  umad: {
    address: process.env.NEXT_PUBLIC_UMAD_ADDRESS,
    decimal: 8,
  },
  weth: {
    address: process.env.NEXT_PUBLIC_WETH_ADDRESS,
    decimal: 18,
  },
  eth: {
    address: process.env.NEXT_PUBLIC_ETH_ADDRESS,
    decimal: 18,
  },
};
