import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import _ from 'lodash';

import {
  genMainContractEther,
  genFactoryContract,
} from 'blockchain/instance';
import { getSigner, convertPriceToBigDecimals, multiply, getProvider } from 'blockchain/ether';
import SingleCollectableABI from 'blockchain/abi/singleCollectable.json';
import MultipleCollectableABI from 'blockchain/abi/multipleCollectable.json';
import {
  ERC20_ADDRESS,
  PAYMENT_TOKEN,
  DECIMALS_ERC20,
  MARKET_RAW_FEE_BUY_TOKEN,
} from 'constants/index';
import { ASSET_TYPE, RATE_GAS_LIMIT } from 'constants/app';


const NEXT_PUBLIC_EXCHANGE = process.env.NEXT_PUBLIC_EXCHANGE!;
const NEXT_PUBLIC_PROXY = process.env.NEXT_PUBLIC_PROXY!;
const NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS =
  process.env.NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS! || '0xda80b638545fAd6789aCE471836eA74e14Ce919b'; // TODO
const NEXT_PUBLIC_SERVER_API_ENDPOINT = process.env.NEXT_PUBLIC_SERVER_API_ENDPOINT;

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const HOW_TO_CALL = 0;
const FEE_METHOD = 1;
const STATIC_EXTRA_DATA = '0x00';
const EXTRA = '0';

export const genMetadataContractUri = (shortUrl: string, address: string | undefined | null) => {
  const id = new Date().getTime();
  const metadataContractUri = shortUrl + address + id;
  return String(metadataContractUri);
};

export const genTokenIdForMainStore = (address: string, supply: number) => {
  const id = new Date().getTime();
  const hex = address + id.toString(16).padStart(14, '0') + supply.toString(16).padStart(10, '0');
  const number = new BigNumber(hex.toLowerCase());
  return String(number.toFixed());
};

export const createCollectionERC721 = async (
  displayName: string,
  token_symbol: string,
  metadataContractUri: string,
) => {
  try {
    const madworldFactoryContract = await genFactoryContract();
    const contract = await madworldFactoryContract.newCollection(
      displayName,
      token_symbol,
      'ipfs://',
      `${NEXT_PUBLIC_SERVER_API_ENDPOINT}/nft/metadata/${metadataContractUri}`,
    );
    
    return [contract, null];

    // const result = await contract.wait(1);

    // const data = {
    //   collectionAddress: result?.events[0]?.address,
    //   transactionHash: result?.transactionHash,
    // };
    // return [data, null];
  } catch (error) {
    return [null, error];
  }
};

export const createCollectionERC1155 = async (
  displayName: string,
  token_symbol: string,
  metadataContractUri: string,
) => {
  try {
    const madworldFactoryContract = await genFactoryContract();
    const contract = await madworldFactoryContract.newCollectionMultipleSupply(
      displayName,
      token_symbol,
      'ipfs://',
      `${NEXT_PUBLIC_SERVER_API_ENDPOINT}/nft/metadata/${metadataContractUri}`,
    );

    return [contract, null];

    // const result = await contract.wait(1);

    // const data = {
    //   collectionAddress: result?.events[0]?.address,
    //   transactionHash: result?.transactionHash,
    // };
    // return [data, null];
  } catch (error) {
    return [null, error];
  }
};

export const signPutDataOnSaleCreated = async (listingData: {
  quantity?: number;
  tokenId: string;
  nftType: string;
  collectionAddress: string;
  tokenType: string;
  price: number | string;
  reserveBuyer?: string;
  cidIPFS?: string;
}) => {
  try {
    let callDataEncoded = '';
    let replacementPattern = '';

    const exchangeContractInstant = await genMainContractEther();
    const signer = await getSigner();
    const address = await signer.getAddress();
    const makerAddress = address.toLowerCase();

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[listingData.tokenType],
      numberOfDecimals: DECIMALS_ERC20[listingData.tokenType],
      feeService: MARKET_RAW_FEE_BUY_TOKEN[listingData.tokenType],
    };

    const listingTimeValue = (Math.floor(Date.now() / 1000) - 120).toString();
    const saltValue = ethers.utils
      .keccak256(Buffer.from(Math.floor(Date.now() / 1000).toString(), 'hex').slice(2))
      .toString();

    if (listingData.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncoded = iface.encodeFunctionData('mintAndTransfer', [
        makerAddress,
        NULL_ADDRESS,
        listingData?.tokenId,
        listingData?.cidIPFS,
      ]);
      const replacementPatternRaw =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
      replacementPattern =
        replacementPatternRaw + '0'.repeat(callDataEncoded.length - replacementPatternRaw.length);
    } else {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncoded = iface.encodeFunctionData('transfer', [
        makerAddress,
        NULL_ADDRESS,
        listingData?.tokenId,
        listingData?.quantity,
        '0x00',
        listingData?.cidIPFS,
      ]);
      const replacementPatternRaw =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPattern =
        replacementPatternRaw + '0'.repeat(callDataEncoded.length - replacementPatternRaw.length);
    }
    const basePrice = convertPriceToBigDecimals(listingData.price, paymentToken.numberOfDecimals);
    const makerHashOrder = await exchangeContractInstant.hashOrder_(
      [
        NEXT_PUBLIC_EXCHANGE, // sc address
        makerAddress, // maker address
        listingData?.reserveBuyer || NULL_ADDRESS, // taker address
        NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS, // protocolFee
        listingData.collectionAddress, //collection address
        NULL_ADDRESS, // static target
        paymentToken.tokenAddress, // payment token address
      ],
      [
        paymentToken.feeService * 100, // MARKET_RAW_FEE
        0, // MARKET_RAW_FEE
        basePrice, // base price - token decimals
        EXTRA, // extra
        listingTimeValue, // listingTime
        0, // expirationTime for auction
        saltValue, // salt
      ],
      FEE_METHOD, // feeMethod default: 1
      1, // side - 1: sell, 0: buy
      0, // saleKind - 0: fixed price, 1: auction
      HOW_TO_CALL, // howToCall default: 0
      callDataEncoded,
      replacementPattern,
      STATIC_EXTRA_DATA, // staticExtraData, default: 0x00
    );

    const hashOrderMessage = Buffer.from(makerHashOrder.slice(2), 'hex');
    const signedMessage = await signer.signMessage(hashOrderMessage);

    const decodedSignature = ethers.utils.splitSignature(signedMessage);

    const dataPutOnSale = {
      calldata: callDataEncoded,
      expirationTime: '0', // fixed-price: 0
      extra: EXTRA, // = 0 default
      feeMethod: FEE_METHOD, // = 1 default
      feeRecipient: NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS, // set in env address
      hash: makerHashOrder, // makerHashOrder
      howToCall: HOW_TO_CALL, // = 0 default
      maker: makerAddress, // user who create nft
      makerRelayerFee: (paymentToken.feeService * 100).toString(),
      taker: listingData?.reserveBuyer || NULL_ADDRESS,
      takerRelayerFee: 0,
      saleKind: 0, // saleKind - 0: fixed price, 1: auction,
      listingTime: listingTimeValue,
      salt: saltValue,
      side: 1, // side:  sell = 1, buy = 0,
      staticExtraData: STATIC_EXTRA_DATA, // default
      staticTarget: '0x0000000000000000000000000000000000000000', // default
      r: decodedSignature?.r,
      v: decodedSignature?.v,
      s: decodedSignature?.s,
      sellHash: makerHashOrder || '', // sellHash - orderHash to crawler check order,
      replacementPattern: replacementPattern,
    };
    return [dataPutOnSale, null];
  } catch (error) {
    return [null, error];
  }
};

export const signPutDataOnSaleAuctionCreated = async (listingData: {
  quantity: number;
  tokenId: string;
  nftType: string;
  collectionAddress: string;
  tokenType: string;
  price: number | string;
  reserveBuyer?: string;
  cidIPFS: string | undefined | null;
}) => {
  try {
    let callDataEncoded = '';
    let replacementPattern = '';

    const exchangeContractInstant = await genMainContractEther();
    const signer = await getSigner();
    const address = await signer.getAddress();
    const makerAddress = address.toLowerCase();
    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[listingData.tokenType],
      numberOfDecimals: DECIMALS_ERC20[listingData.tokenType],
      feeService: MARKET_RAW_FEE_BUY_TOKEN[listingData.tokenType],
    };

    const listingTimeValue = (Math.floor(Date.now() / 1000) - 120).toString();
    const saltValue = ethers.utils
      .keccak256(Buffer.from(Math.floor(Date.now() / 1000).toString(), 'hex').slice(2))
      .toString();

    if (listingData.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncoded = iface.encodeFunctionData('mintAndTransfer', [
        makerAddress,
        NULL_ADDRESS,
        listingData?.tokenId,
        listingData?.cidIPFS,
      ]);
      const replacementPatternRaw =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
      replacementPattern =
        replacementPatternRaw + '0'.repeat(callDataEncoded.length - replacementPatternRaw.length);
    } else {
    }

    const basePrice = convertPriceToBigDecimals(listingData.price, paymentToken.numberOfDecimals);

    const makerHashOrder = await exchangeContractInstant.hashOrder_(
      [
        NEXT_PUBLIC_EXCHANGE, // sc address
        makerAddress, // maker address
        listingData?.reserveBuyer || NULL_ADDRESS, // taker address
        NULL_ADDRESS, // protocolFee
        listingData.collectionAddress, //collection address
        NULL_ADDRESS, // static target
        paymentToken.tokenAddress, // payment token address
      ],
      [
        0, // MARKET_RAW_FEE
        paymentToken.feeService * 100, // MARKET_RAW_FEE
        basePrice, // base price - token decimals
        EXTRA, // extra
        listingTimeValue, // listingTime
        0, // expirationTime for auction
        saltValue, // salt
      ],
      FEE_METHOD, // feeMethod default: 1
      1, // side - 1: sell, 0: buy
      0, // saleKind - 0: fixed price, 1: auction
      HOW_TO_CALL, // howToCall default: 0
      callDataEncoded,
      replacementPattern,
      STATIC_EXTRA_DATA, // staticExtraData, default: 0x00
    );

    const hashOrderMessage = Buffer.from(makerHashOrder.slice(2), 'hex');

    const signedMessage = await signer.signMessage(hashOrderMessage);

    const decodedSignature = ethers.utils.splitSignature(signedMessage);

    const dataPutOnSale = {
      calldata: callDataEncoded,
      expirationTime: '0', // fixed-price: 0
      extra: EXTRA, // = 0 default
      feeMethod: FEE_METHOD, // = 1 default
      feeRecipient: NULL_ADDRESS, // set in env address
      hash: makerHashOrder, // makerHashOrder
      howToCall: HOW_TO_CALL, // = 0 default
      maker: makerAddress, // user who create nft
      makerRelayerFee: 0,
      taker: listingData?.reserveBuyer || NULL_ADDRESS,
      takerRelayerFee: (paymentToken.feeService * 100).toString(),
      saleKind: 0, // saleKind - 0: fixed price, 1: auction,
      listingTime: listingTimeValue,
      salt: saltValue,
      side: 1, // side:  sell = 1, buy = 0,
      staticExtraData: STATIC_EXTRA_DATA, // default
      staticTarget: '0x0000000000000000000000000000000000000000', // default
      r: decodedSignature?.r,
      v: decodedSignature?.v,
      s: decodedSignature?.s,
      sellHash: makerHashOrder || '', // sellHash - orderHash to crawler check order,
      replacementPattern,
    };
    return [dataPutOnSale, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleCancelListingOrderCreated = async (listingData: {
  nftType: string;
  maker: string;
  feeRecipient: string;
  collectionAddress: string;
  tokenType: string;
  makerRelayerFee: string;
  takerRelayerFee: string;
  price: string;
  quantity: number;
  listingTime: string;
  salt: string;
  calldata: string;
  v: number;
  r: string;
  s: string;
  reserveBuyer: string;
  replacementPattern: string;
}) => {
  try {
    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[listingData.tokenType],
      numberOfDecimals: DECIMALS_ERC20[listingData.tokenType],
    };

    const basePrice = convertPriceToBigDecimals(listingData.price, paymentToken.numberOfDecimals);

    const exchangeContractInstant = await genMainContractEther();

    const transaction = await exchangeContractInstant.cancelOrder_(
      [
        NEXT_PUBLIC_EXCHANGE, // sc address
        listingData.maker, // maker address
        listingData?.reserveBuyer || NULL_ADDRESS, // taker address
        listingData.feeRecipient, // protocolFee
        listingData.collectionAddress, //collection address
        NULL_ADDRESS, // static target
        paymentToken.tokenAddress, // payment token address
      ],
      [
        listingData.makerRelayerFee,
        listingData.takerRelayerFee,
        basePrice, // base price - token decimals
        EXTRA, // extra
        listingData.listingTime, // listingTime
        0, // expirationTime for auction
        listingData.salt, // salt
      ],
      FEE_METHOD, // feeMethod default: 1
      1, // side - 1: sell, 0: buy
      0, // saleKind - 0: fixed price, 1: auction
      HOW_TO_CALL, // howToCall default: 0
      listingData.calldata,
      listingData?.replacementPattern,
      STATIC_EXTRA_DATA,
      listingData.v,
      listingData.r,
      listingData.s,
    );

    return [transaction, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleOrderCanMatchCreated = async (dataListingOnSale: {
  nftType: string;
  calldata: string;
  maker: string;
  taker: string;
  tokenId: string;
  quantity: number;
  feeRecipient: string;
  makerRelayerFee: string;
  takerRelayerFee: string;
  collectionAddress: string;
  listingTime: string;
  price: number | string;
  salt: string;
  tokenType: string;
  replacementPatternSeller?: string | undefined;
  cidIPFS?: string;
}) => {
  try {
    let callDataEncodedBuyer = '';
    let replacementPatternBuyer = '';
    let replacementPatternSeller = dataListingOnSale?.replacementPatternSeller;

    const signer = await getSigner();
    const signerAddressForBuyer = (await signer.getAddress()).toLowerCase();

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[dataListingOnSale.tokenType],
      numberOfDecimals: DECIMALS_ERC20[dataListingOnSale.tokenType],
    };

    const basePrice = convertPriceToBigDecimals(
      dataListingOnSale.price,
      paymentToken.numberOfDecimals,
    );

    if (dataListingOnSale.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('mintAndTransfer', [
        NULL_ADDRESS,
        signerAddressForBuyer,
        dataListingOnSale?.tokenId,
        dataListingOnSale?.cidIPFS,
      ]);
      let replacementPatternRaw =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternBuyer =
        replacementPatternRaw +
        '0'.repeat(dataListingOnSale?.calldata.length - replacementPatternRaw.length);
    } else {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('mintTo', [
        signerAddressForBuyer,
        dataListingOnSale?.tokenId,
        dataListingOnSale?.quantity,
        '0x00',
        dataListingOnSale?.cidIPFS,
      ]);
      let replacementPatternRaw =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternBuyer =
        replacementPatternRaw +
        '0'.repeat(dataListingOnSale?.calldata.length - replacementPatternRaw.length);
    }

    const exchangeContract = await genMainContractEther();

    const canBeMatched = await exchangeContract.ordersCanMatch_(
      [
        // buyer data
        NEXT_PUBLIC_EXCHANGE, //exchange.address,
        signerAddressForBuyer, // maker address
        dataListingOnSale.maker, // taker address
        '0x0000000000000000000000000000000000000000', // fee recipient
        dataListingOnSale.collectionAddress, // collection address
        '0x0000000000000000000000000000000000000000', // default
        paymentToken.tokenAddress, //  paymentToken.address [ETH address or USDT address]

        // seller data
        NEXT_PUBLIC_EXCHANGE,
        dataListingOnSale.maker, // maker address
        dataListingOnSale?.taker || '0x0000000000000000000000000000000000000000', // taker address
        dataListingOnSale.feeRecipient, // fee recipient
        dataListingOnSale.collectionAddress,
        '0x0000000000000000000000000000000000000000',
        paymentToken.tokenAddress,
      ],
      [
        // data of buyer
        dataListingOnSale.makerRelayerFee, // makerRelayerFee
        dataListingOnSale.takerRelayerFee, // takerRelayerFee
        basePrice, // base price - token decimals, //basePrice
        0, // extra // default: 0
        dataListingOnSale.listingTime, // buy time
        0,
        dataListingOnSale.salt, // salt example

        // data of seller
        dataListingOnSale.makerRelayerFee,
        dataListingOnSale.takerRelayerFee,
        basePrice,
        0, //extra
        dataListingOnSale.listingTime,
        0, // expirationTime
        dataListingOnSale.salt, // salt example
      ],
      [1, 0, 0, 0, 1, 1, 0, 0],
      callDataEncodedBuyer,
      dataListingOnSale.calldata, //callDataEncoded
      replacementPatternBuyer,
      replacementPatternSeller,
      '0x00',
      '0x00',
    );

    return [canBeMatched, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleAtomicMatchCreated = async (dataListingOnSale: {
  tokenId: string;
  quantity: number;
  nftType: string;
  maker: string;
  taker: string;
  feeRecipient: string;
  listingTime: string;
  calldata: string;
  price: number | string;
  takerRelayerFee: string;
  makerRelayerFee: string;
  salt: string;
  collectionAddress: string;
  tokenType: string;
  v: number;
  r: string;
  s: string;
  replacementPatternSeller?: string | undefined;
  cidIPFS?: string;
}) => {
  try {
    let callDataEncodedBuyer = '';
    let replacementPatternBuyer = '';
    let replacementPatternSeller = dataListingOnSale?.replacementPatternSeller;

    const signer = await getSigner();
    const signerAddressForBuyer = (await signer.getAddress()).toLowerCase();

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[dataListingOnSale.tokenType],
      numberOfDecimals: DECIMALS_ERC20[dataListingOnSale.tokenType],
    };

    const basePrice = convertPriceToBigDecimals(
      dataListingOnSale.price,
      paymentToken.numberOfDecimals,
    );

    const price = convertPriceToBigDecimals(
      multiply(dataListingOnSale.price, dataListingOnSale.quantity),
      paymentToken.numberOfDecimals,
    );

    if (dataListingOnSale.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('mintAndTransfer', [
        NULL_ADDRESS,
        signerAddressForBuyer,
        dataListingOnSale?.tokenId,
        dataListingOnSale?.cidIPFS,
      ]);
      let replacementPatternRaw =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternBuyer =
        replacementPatternRaw +
        '0'.repeat(dataListingOnSale?.calldata.length - replacementPatternRaw.length);
    } else {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('transfer', [
        NULL_ADDRESS,
        signerAddressForBuyer,
        dataListingOnSale?.tokenId,
        dataListingOnSale?.quantity,
        '0x00',
        dataListingOnSale?.cidIPFS,
      ]);
      let replacementPatternRaw =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternBuyer =
        replacementPatternRaw +
        '0'.repeat(dataListingOnSale?.calldata.length - replacementPatternRaw.length);
    }
    const exchangeContractInstant = await genMainContractEther();

    const estimatedGas = await exchangeContractInstant.estimateGas.atomicMatch_(
      [
        // buyer data
        NEXT_PUBLIC_EXCHANGE, //exchange.address,
        signerAddressForBuyer, // maker address
        dataListingOnSale.maker, // taker address
        NULL_ADDRESS, // fee recipient
        dataListingOnSale.collectionAddress, // collection address
        NULL_ADDRESS, // default
        paymentToken.tokenAddress, //  paymentToken.address [ETH address or USDT address]

        // seller data
        NEXT_PUBLIC_EXCHANGE,
        dataListingOnSale.maker, // maker address
        dataListingOnSale?.taker || NULL_ADDRESS, // taker address
        dataListingOnSale.feeRecipient, // fee recipient
        dataListingOnSale.collectionAddress,
        NULL_ADDRESS,
        paymentToken.tokenAddress,
      ],
      [
        // data of buyer
        dataListingOnSale.makerRelayerFee, // makerRelayerFee
        dataListingOnSale.takerRelayerFee, // takerRelayerFee
        basePrice, //basePrice
        0, // extra // default: 0
        dataListingOnSale.listingTime, // buy time
        0,
        dataListingOnSale.salt, // salt example

        // data of seller
        dataListingOnSale.makerRelayerFee,
        dataListingOnSale.takerRelayerFee,
        basePrice,
        0, //extra
        dataListingOnSale.listingTime,
        0, // expirationTime
        dataListingOnSale.salt, // salt example
      ],
      [1, 0, 0, 0, 1, 1, 0, 0],
      callDataEncodedBuyer,
      dataListingOnSale.calldata, //callDataEncoded
      replacementPatternBuyer,
      replacementPatternSeller,
      '0x00',
      '0x00',

      [dataListingOnSale.v, dataListingOnSale.v],
      [
        dataListingOnSale.r,
        dataListingOnSale.s,
        dataListingOnSale.r,
        dataListingOnSale.s,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
      {
        value: dataListingOnSale.tokenType === PAYMENT_TOKEN.ETH ? price.toString() : '0',
      },
    );

    const transaction = await exchangeContractInstant.atomicMatch_(
      [
        // buyer data
        NEXT_PUBLIC_EXCHANGE, //exchange.address,
        signerAddressForBuyer, // maker address
        dataListingOnSale.maker, // taker address
        NULL_ADDRESS, // fee recipient
        dataListingOnSale.collectionAddress, // collection address
        NULL_ADDRESS, // default
        paymentToken.tokenAddress, //  paymentToken.address [ETH address or USDT address]

        // seller data
        NEXT_PUBLIC_EXCHANGE,
        dataListingOnSale.maker, // maker address
        dataListingOnSale?.taker || NULL_ADDRESS, // taker address
        dataListingOnSale.feeRecipient, // fee recipient
        dataListingOnSale.collectionAddress,
        NULL_ADDRESS,
        paymentToken.tokenAddress,
      ],
      [
        // data of buyer
        dataListingOnSale.makerRelayerFee, // makerRelayerFee
        dataListingOnSale.takerRelayerFee, // takerRelayerFee
        basePrice, //basePrice
        0, // extra // default: 0
        dataListingOnSale.listingTime, // buy time
        0,
        dataListingOnSale.salt, // salt example

        // data of seller
        dataListingOnSale.makerRelayerFee,
        dataListingOnSale.takerRelayerFee,
        basePrice,
        0, //extra
        dataListingOnSale.listingTime,
        0, // expirationTime
        dataListingOnSale.salt, // salt example
      ],
      [1, 0, 0, 0, 1, 1, 0, 0],
      callDataEncodedBuyer,
      dataListingOnSale.calldata, //callDataEncoded
      replacementPatternBuyer,
      replacementPatternSeller,
      '0x00',
      '0x00',

      [dataListingOnSale.v, dataListingOnSale.v],
      [
        dataListingOnSale.r,
        dataListingOnSale.s,
        dataListingOnSale.r,
        dataListingOnSale.s,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
      {
        value: dataListingOnSale.tokenType === PAYMENT_TOKEN.ETH ? price.toString() : '0',
        gasLimit: estimatedGas.toString(),
      },
    );

    return [transaction, null];
  } catch (error) {
    return [null, error];
  }
};

export const buildDataBidCreated = async (bidData: {
  taker: string;
  collectionAddress: string;
  price: string;
  expirationTime: number;
  nftType: string;
  tokenType: string;
  quantity: number;
  tokenId: string;
  cidIPFS?: string;
}) => {
  try {
    const exchangeContractInstant = await genMainContractEther();
    const signer = await getSigner();
    const bidderAddress = (await signer.getAddress()).toLowerCase();

    let callDataEncodedBuyer = '';
    let replacementPattern = '';

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[bidData.tokenType],
      numberOfDecimals: DECIMALS_ERC20[bidData.tokenType],
      feeService: MARKET_RAW_FEE_BUY_TOKEN[bidData.tokenType],
    };

    const saltValue = ethers.utils
      .keccak256(Buffer.from(Math.floor(Date.now() / 1000).toString(), 'hex').slice(2))
      .toString();

    const listingTimeValue = (Math.floor(Date.now() / 1000) - 120).toString();

    if (bidData.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('mintAndTransfer', [
        NULL_ADDRESS,
        bidderAddress,
        bidData.tokenId,
        bidData?.cidIPFS,
      ]);

      const replacementPatternRaw =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPattern =
        replacementPatternRaw +
        '0'.repeat(callDataEncodedBuyer.length - replacementPatternRaw.length);
    } else {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('transfer', [
        NULL_ADDRESS,
        bidderAddress,
        bidData.tokenId,
        bidData?.quantity,
        '0x00',
        bidData?.cidIPFS,
      ]);
      const replacementPatternRaw =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPattern =
        replacementPatternRaw +
        '0'.repeat(callDataEncodedBuyer.length - replacementPatternRaw.length);
    }

    const basePrice = convertPriceToBigDecimals(bidData.price, paymentToken.numberOfDecimals);

    const makerHashOrder = await exchangeContractInstant.hashOrder_(
      [
        NEXT_PUBLIC_EXCHANGE, // sc address
        bidderAddress, // bidder address
        bidData.taker || NULL_ADDRESS, // auction owner address
        NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS, // protocolFee address
        bidData.collectionAddress, //collection address
        NULL_ADDRESS, // static target
        paymentToken.tokenAddress, // payment token address
      ],
      [
        0,
        paymentToken.feeService * 100,
        basePrice, // base price - token decimals
        EXTRA, // extra
        listingTimeValue, // listingTime
        bidData.expirationTime, // expirationTime for auction
        saltValue, // salt
      ],
      1, // feeMethod default: 1
      0, // side - 1: sell, 0: buy
      0, // saleKind - 0: fixed price, 1: auction
      0, // howToCall default: 0
      callDataEncodedBuyer,
      replacementPattern,
      STATIC_EXTRA_DATA,
    );
    const hashOrderMessage = Buffer.from(makerHashOrder.slice(2), 'hex');
    const signedMessage = await signer.signMessage(hashOrderMessage);

    const decodedSignature = ethers.utils.splitSignature(signedMessage);

    const dataPlaceABid = {
      calldata: callDataEncodedBuyer,
      expirationTime: bidData.expirationTime,
      extra: EXTRA, // = 0 default
      feeMethod: FEE_METHOD, // = 1 default
      feeRecipient: NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS, // set in env address
      hash: makerHashOrder, // makerHashOrder
      howToCall: HOW_TO_CALL, // = 0 default
      maker: bidderAddress,
      makerRelayerFee: 0,
      taker: bidData.taker, // user who create auction
      takerRelayerFee: (paymentToken.feeService * 100).toString(),
      saleKind: 0, //1: auction,
      listingTime: listingTimeValue,
      salt: saltValue,
      side: 0, // side:  sell = 1, buy = 0,
      staticExtraData: STATIC_EXTRA_DATA, // default
      staticTarget: NULL_ADDRESS, // default
      r: decodedSignature?.r,
      v: decodedSignature?.v,
      s: decodedSignature?.s,
      sellHash: makerHashOrder || '',
      replacementPattern: replacementPattern,
    };

    return [dataPlaceABid, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleAtomicMatchForAcceptOfferCreated = async (dataPlaceBid: {
  tokenId: string;
  quantity: number;
  calldata: string;
  nftType: string;
  expirationTime: string;
  maker: string;
  taker: string;
  feeRecipient: string;
  listingTime: string;
  price: number | string | undefined;
  takerRelayerFee: string;
  makerRelayerFee: string;
  salt: string;
  collectionAddress: string;
  tokenType: string;
  v: number;
  r: string;
  s: string;
  cidIPFS?: string;
  replacementPattern?: string;
}) => {
  try {
    const exchangeContractInstant = await genMainContractEther();
    let callDataEncoded = '';
    let replacementPatternBuyer = dataPlaceBid?.replacementPattern;
    let replacementPatternSeller = '';

    const signer = await getSigner();
    const ownerAddress = await signer.getAddress();

    if (dataPlaceBid.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);

      callDataEncoded = iface.encodeFunctionData('mintAndTransfer', [
        ownerAddress,
        NULL_ADDRESS,
        dataPlaceBid.tokenId,
        dataPlaceBid?.cidIPFS,
      ]);
      let replacementPatternRaw =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternSeller =
        replacementPatternRaw + '0'.repeat(callDataEncoded.length - replacementPatternRaw.length);
    } else {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncoded = iface.encodeFunctionData('transfer', [
        ownerAddress,
        NULL_ADDRESS,
        dataPlaceBid.tokenId,
        dataPlaceBid.quantity,
        '0x00',
        dataPlaceBid?.cidIPFS,
      ]);
      let replacementPatternRaw =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternSeller =
        replacementPatternRaw + '0'.repeat(callDataEncoded.length - replacementPatternRaw.length);
    }

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[dataPlaceBid.tokenType],
      numberOfDecimals: DECIMALS_ERC20[dataPlaceBid.tokenType],
      feeService: MARKET_RAW_FEE_BUY_TOKEN[dataPlaceBid.tokenType],
    };

    const basePrice = convertPriceToBigDecimals(dataPlaceBid.price, paymentToken.numberOfDecimals);

    const estimatedGas = await exchangeContractInstant.estimateGas.atomicMatch_(
      [
        // buyer data
        NEXT_PUBLIC_EXCHANGE, //exchange.address,
        dataPlaceBid.maker, // maker address - owner of auction
        NULL_ADDRESS, // taker address -  user who place a bid
        dataPlaceBid.feeRecipient, // fee recipient
        dataPlaceBid.collectionAddress, // collection address
        NULL_ADDRESS, // default
        paymentToken.tokenAddress, // weth address

        // seller data
        NEXT_PUBLIC_EXCHANGE,
        ownerAddress, // user who place a bid
        NULL_ADDRESS, // owner of auction
        NULL_ADDRESS, // fee recipient
        dataPlaceBid.collectionAddress,
        NULL_ADDRESS,
        paymentToken.tokenAddress, // weth address
      ],
      [
        // data of buyer
        dataPlaceBid.makerRelayerFee, // makerRelayerFee
        dataPlaceBid.takerRelayerFee, // takerRelayerFee
        basePrice, //basePrice
        0, // extra // default: 0
        dataPlaceBid.listingTime, // buy time
        dataPlaceBid.expirationTime,
        dataPlaceBid.salt, // salt example

        // data of seller
        dataPlaceBid.makerRelayerFee,
        dataPlaceBid.takerRelayerFee,
        basePrice,
        0, //extra
        dataPlaceBid.listingTime,
        dataPlaceBid.expirationTime, // expirationTime
        dataPlaceBid.salt, // salt example
      ],
      [
        1, // fee method
        0, // side: buy
        0, // sale kind:
        0, // how to call

        1, //
        1, //side: sell
        0, // sale kind:
        0,
      ],

      dataPlaceBid.calldata,
      callDataEncoded,
      replacementPatternBuyer,
      replacementPatternSeller,
      '0x00',
      '0x00',

      [dataPlaceBid.v, dataPlaceBid.v],
      [
        dataPlaceBid.r,
        dataPlaceBid.s,
        dataPlaceBid.r,
        dataPlaceBid.s,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
    );

    const transaction = await exchangeContractInstant.atomicMatch_(
      [
        // buyer data
        NEXT_PUBLIC_EXCHANGE, //exchange.address,
        dataPlaceBid.maker, // maker address - owner of auction
        NULL_ADDRESS, // taker address -  user who place a bid
        dataPlaceBid.feeRecipient, // fee recipient
        dataPlaceBid.collectionAddress, // collection address
        NULL_ADDRESS, // default
        paymentToken.tokenAddress, // weth address

        // seller data
        NEXT_PUBLIC_EXCHANGE,
        ownerAddress, // user who place a bid
        NULL_ADDRESS, // owner of auction
        NULL_ADDRESS, // fee recipient
        dataPlaceBid.collectionAddress,
        NULL_ADDRESS,
        paymentToken.tokenAddress, // weth address
      ],
      [
        // data of buyer
        dataPlaceBid.makerRelayerFee, // makerRelayerFee
        dataPlaceBid.takerRelayerFee, // takerRelayerFee
        basePrice, //basePrice
        0, // extra // default: 0
        dataPlaceBid.listingTime, // buy time
        dataPlaceBid.expirationTime,
        dataPlaceBid.salt, // salt example

        // data of seller
        dataPlaceBid.makerRelayerFee,
        dataPlaceBid.takerRelayerFee,
        basePrice,
        0, //extra
        dataPlaceBid.listingTime,
        dataPlaceBid.expirationTime, // expirationTime
        dataPlaceBid.salt, // salt example
      ],
      [
        1, // fee method
        0, // side: buy
        0, // sale kind:
        0, // how to call

        1, //
        1, //side: sell
        0, // sale kind:
        0,
      ],
      dataPlaceBid.calldata,
      callDataEncoded,
      replacementPatternBuyer,
      replacementPatternSeller,
      '0x00',
      '0x00',

      [dataPlaceBid.v, dataPlaceBid.v],
      [
        dataPlaceBid.r,
        dataPlaceBid.s,
        dataPlaceBid.r,
        dataPlaceBid.s,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
      {
        gasLimit: estimatedGas.toString(),
      },
    );

    return [transaction, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleAtomicMatchForAcceptBidCreated = async (dataPlaceBid: {
  tokenId: string;
  quantity: number;
  calldata: string;
  nftType: string;
  expirationTime: string;
  maker: string;
  taker: string;
  feeRecipient: string;
  listingTime: string;
  price: number | string | undefined;
  takerRelayerFee: string;
  makerRelayerFee: string;
  salt: string;
  collectionAddress: string;
  tokenType: string;
  v: number;
  r: string;
  s: string;
  cidIPFS?: string;
  replacementPattern?: string;
}) => {
  try {
    const exchangeContractInstant = await genMainContractEther();
    let callDataEncoded = '';
    let replacementPatternBuyer = dataPlaceBid?.replacementPattern;
    let replacementPatternSeller = '';

    const signer = await getSigner();
    const ownerAddress = await signer.getAddress();

    if (dataPlaceBid.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);

      callDataEncoded = iface.encodeFunctionData('mintAndTransfer', [
        ownerAddress,
        NULL_ADDRESS,
        dataPlaceBid.tokenId,
        dataPlaceBid?.cidIPFS,
      ]);
      let replacementPatternRaw =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternSeller =
        replacementPatternRaw + '0'.repeat(callDataEncoded.length - replacementPatternRaw.length);
    } else {
    }

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[dataPlaceBid.tokenType],
      numberOfDecimals: DECIMALS_ERC20[dataPlaceBid.tokenType],
      feeService: MARKET_RAW_FEE_BUY_TOKEN[dataPlaceBid.tokenType],
    };

    const basePrice = convertPriceToBigDecimals(dataPlaceBid.price, paymentToken.numberOfDecimals);

    const estimatedGas = await exchangeContractInstant.estimateGas.atomicMatch_(
      [
        // buyer data
        NEXT_PUBLIC_EXCHANGE, //exchange.address,
        dataPlaceBid.maker, // maker address - owner of auction
        dataPlaceBid.taker, // taker address -  user who place a bid
        dataPlaceBid.feeRecipient, // fee recipient
        dataPlaceBid.collectionAddress, // collection address
        NULL_ADDRESS, // default
        paymentToken.tokenAddress, // weth address

        // seller data
        NEXT_PUBLIC_EXCHANGE,
        dataPlaceBid.taker, // user who place a bid
        dataPlaceBid.maker, // owner of auction
        NULL_ADDRESS, // fee recipient
        dataPlaceBid.collectionAddress,
        NULL_ADDRESS,
        paymentToken.tokenAddress, // weth address
      ],
      [
        // data of buyer
        dataPlaceBid.makerRelayerFee, // makerRelayerFee
        dataPlaceBid.takerRelayerFee, // takerRelayerFee
        basePrice, //basePrice
        0, // extra // default: 0
        dataPlaceBid.listingTime, // buy time
        dataPlaceBid.expirationTime,
        dataPlaceBid.salt, // salt example

        // data of seller
        dataPlaceBid.makerRelayerFee,
        dataPlaceBid.takerRelayerFee,
        basePrice,
        0, //extra
        dataPlaceBid.listingTime,
        dataPlaceBid.expirationTime, // expirationTime
        dataPlaceBid.salt, // salt example
      ],
      [
        1, // fee method
        0, // side: buy
        0, // sale kind:
        0, // how to call

        1, //
        1, //side: sell
        0, // sale kind:
        0,
      ],

      dataPlaceBid.calldata,
      callDataEncoded,
      replacementPatternBuyer,
      replacementPatternSeller,
      '0x00',
      '0x00',

      [dataPlaceBid.v, dataPlaceBid.v],
      [
        dataPlaceBid.r,
        dataPlaceBid.s,
        dataPlaceBid.r,
        dataPlaceBid.s,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
    );

    const transaction = await exchangeContractInstant.atomicMatch_(
      [
        // buyer data
        NEXT_PUBLIC_EXCHANGE, //exchange.address,
        dataPlaceBid.maker, // maker address - owner of auction
        dataPlaceBid.taker, // taker address -  user who place a bid
        dataPlaceBid.feeRecipient, // fee recipient
        dataPlaceBid.collectionAddress, // collection address
        NULL_ADDRESS, // default
        paymentToken.tokenAddress, // weth address

        // seller data
        NEXT_PUBLIC_EXCHANGE,
        dataPlaceBid.taker, // user who place a bid
        dataPlaceBid.maker, // owner of auction
        NULL_ADDRESS, // fee recipient
        dataPlaceBid.collectionAddress,
        NULL_ADDRESS,
        paymentToken.tokenAddress, // weth address
      ],
      [
        // data of buyer
        dataPlaceBid.makerRelayerFee, // makerRelayerFee
        dataPlaceBid.takerRelayerFee, // takerRelayerFee
        basePrice, //basePrice
        0, // extra // default: 0
        dataPlaceBid.listingTime, // buy time
        dataPlaceBid.expirationTime,
        dataPlaceBid.salt, // salt example

        // data of seller
        dataPlaceBid.makerRelayerFee,
        dataPlaceBid.takerRelayerFee,
        basePrice,
        0, //extra
        dataPlaceBid.listingTime,
        dataPlaceBid.expirationTime, // expirationTime
        dataPlaceBid.salt, // salt example
      ],
      [
        1, // fee method
        0, // side: buy
        0, // sale kind:
        0, // how to call

        1, //
        1, //side: sell
        0, // sale kind:
        0,
      ],
      dataPlaceBid.calldata,
      callDataEncoded,
      replacementPatternBuyer,
      replacementPatternSeller,
      '0x00',
      '0x00',

      [dataPlaceBid.v, dataPlaceBid.v],
      [
        dataPlaceBid.r,
        dataPlaceBid.s,
        dataPlaceBid.r,
        dataPlaceBid.s,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
      {
        gasLimit: estimatedGas.toString(),
      },
    );

    return [transaction, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleCancelBidCreated = async (bidInfo: {
  calldata?: string;
  maker: string;
  taker: string;
  collectionAddress: string;
  price: number | string | undefined;
  expirationTime: string;
  listingTime: string;
  nftType: string;
  salt: string;
  tokenId: string;
  makerRelayerFee: string;
  takerRelayerFee: string;
  quantity: number;
  tokenType: string;
  feeRecipient: string;
  v: number;
  r: string;
  s: string;
  replacementPattern?: string;
}) => {
  try {
    const paceArtExchangeContract = await genMainContractEther();
    let callDataEncodedBuyer = '';
    let replacementPattern = '';

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[bidInfo.tokenType],
      numberOfDecimals: DECIMALS_ERC20[bidInfo.tokenType],
      feeService: MARKET_RAW_FEE_BUY_TOKEN[bidInfo.tokenType],
    };

    const basePrice = convertPriceToBigDecimals(bidInfo.price, paymentToken.numberOfDecimals);

    const transaction = await paceArtExchangeContract.cancelOrder_(
      [
        NEXT_PUBLIC_EXCHANGE, // sc address
        bidInfo.maker, // bidder address
        bidInfo.taker, // auction owner address
        bidInfo.feeRecipient, // protocolFee address
        bidInfo.collectionAddress, //collection address
        NULL_ADDRESS, // static target
        paymentToken.tokenAddress, // payment token address
      ],
      [
        bidInfo.makerRelayerFee,
        bidInfo.takerRelayerFee,
        basePrice, // base price - token decimals
        EXTRA, // extra
        bidInfo.listingTime, // listingTime
        bidInfo.expirationTime, // expirationTime for auction
        bidInfo.salt, // salt
      ],
      1, // feeMethod default: 1
      0, // side - 1: sell, 0: buy
      0, // saleKind - 0: fixed price, 1: auction
      0, // howToCall default: 0
      bidInfo?.calldata,
      bidInfo?.replacementPattern,
      STATIC_EXTRA_DATA,
      bidInfo.v,
      bidInfo.r,
      bidInfo.s,
    );

    return [transaction, null];
  } catch (error) {
    return [null, error];
  }
};

export const buildDataPutAuctionCreated = async (listingData: {
  taker?: string;
  collectionAddress: string;
  price: number;
  expirationTime?: number;
  nftType: string;
  tokenType: string;
  quantity: number;
  tokenId: string;
}) => {
  try {
  } catch (error) {}
};

export const signPutDataOnSaleDutchAuctionCreated = async (listingData: {
  quantity?: number;
  tokenId: string;
  nftType: string;
  collectionAddress: string;
  tokenType: string;
  staringPrice: number | string; // starting price
  endingPrice: number | string; // ending price
  reserveBuyer?: string;
  cidIPFS?: string;
  expireTime: number;
  startTime?: string | number;
}) => {
  try {
    let callDataEncoded = '';
    let replacementPattern = '';
    
    const exchangeContractInstant = await genMainContractEther();
    const signer = await getSigner();
    const address = await signer.getAddress();
    const makerAddress = address.toLowerCase();

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[listingData.tokenType],
      numberOfDecimals: DECIMALS_ERC20[listingData.tokenType],
      feeService: MARKET_RAW_FEE_BUY_TOKEN[listingData.tokenType],
    };

    const listingTimeValue = String(listingData?.startTime);
    const expireTime = listingData?.expireTime;
    
    const saltValue = ethers.utils
      .keccak256(Buffer.from(Math.floor(Date.now() / 1000).toString(), 'hex').slice(2))
      .toString();

    if (listingData.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncoded = iface.encodeFunctionData('mintAndTransfer', [
        makerAddress,
        NULL_ADDRESS,
        listingData?.tokenId,
        listingData?.cidIPFS,
      ]);
      const replacementPatternRaw =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
      replacementPattern =
        replacementPatternRaw + '0'.repeat(callDataEncoded.length - replacementPatternRaw.length);
    } else {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncoded = iface.encodeFunctionData('transfer', [
        makerAddress,
        NULL_ADDRESS,
        listingData?.tokenId,
        listingData?.quantity,
        '0x00',
        listingData?.cidIPFS,
      ]);
      const replacementPatternRaw =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPattern =
        replacementPatternRaw + '0'.repeat(callDataEncoded.length - replacementPatternRaw.length);
    }
    const isEthPayment = listingData.tokenType === PAYMENT_TOKEN.ETH;
    
    const endPriceConvert = convertPriceToBigDecimals(
      listingData.endingPrice,
      paymentToken.numberOfDecimals,
    );

    let basePrice;
    let extraPriceConvert;
    
    if(isEthPayment) {
      
      const startPriceEstimate 
        = new BigNumber(listingData.staringPrice).multipliedBy(100 - parseFloat(paymentToken.feeService)).dividedBy(100).toString();
      basePrice = convertPriceToBigDecimals(startPriceEstimate, paymentToken.numberOfDecimals);
      extraPriceConvert = new BigNumber(basePrice).minus(endPriceConvert).toString();
    } else {
      basePrice = convertPriceToBigDecimals(listingData.staringPrice, paymentToken.numberOfDecimals);
      extraPriceConvert = new BigNumber(basePrice).minus(endPriceConvert).toString();
    }
    
    const makerHashOrder = await exchangeContractInstant.hashOrder_(
      [
        NEXT_PUBLIC_EXCHANGE, // sc address
        makerAddress, // maker address
        listingData?.reserveBuyer || NULL_ADDRESS, // taker address
        NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS,
        listingData.collectionAddress, //collection address
        NULL_ADDRESS, // static target
        paymentToken.tokenAddress, // payment token address
      ],
      [
        paymentToken.feeService * 100, // MARKET_RAW_FEE, makerRelayerFee
        0, // MARKET_RAW_FEE // takerRelayerFee
        basePrice, // base price - token decimals, starting price
        extraPriceConvert, // extra
        listingTimeValue, // listingTime
        expireTime, // expirationTime for auction
        saltValue, // salt
      ],
      FEE_METHOD, // feeMethod default: 1
      1, // side - 1: sell, 0: buy
      1, // saleKind - 0: fixed price | english auction, 1: dutch auction
      HOW_TO_CALL, // howToCall default: 0
      callDataEncoded,
      replacementPattern,
      STATIC_EXTRA_DATA, // staticExtraData, default: 0x00
    );

    const hashOrderMessage = Buffer.from(makerHashOrder.slice(2), 'hex');
    const signedMessage = await signer.signMessage(hashOrderMessage);

    const decodedSignature = ethers.utils.splitSignature(signedMessage);

    const dataPutOnSale = {
      calldata: callDataEncoded,
      expirationTime: expireTime, // fixed-price: 0
      extra: extraPriceConvert, // = 0 default
      feeMethod: FEE_METHOD, // = 1 default
      feeRecipient: NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS, // set in env address
      hash: makerHashOrder, // makerHashOrder
      howToCall: HOW_TO_CALL, // = 0 default
      maker: makerAddress, // user who create nft
      makerRelayerFee: (paymentToken.feeService * 100).toString(),
      taker: listingData?.reserveBuyer || NULL_ADDRESS,
      takerRelayerFee: 0,
      saleKind: 0, // saleKind - 0: fixed price, 1: auction,
      listingTime: listingTimeValue,
      salt: saltValue,
      side: 1, // side:  sell = 1, buy = 0,
      staticExtraData: STATIC_EXTRA_DATA, // default
      staticTarget: '0x0000000000000000000000000000000000000000', // default
      r: decodedSignature?.r,
      v: decodedSignature?.v,
      s: decodedSignature?.s,
      sellHash: makerHashOrder || '', // sellHash - orderHash to crawler check order,
      replacementPattern: replacementPattern,
    };
    return [dataPutOnSale, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleAtomicMatchDutchAuctionCreated = async (dataListingOnSale: {
  tokenId: string;
  quantity: number;
  nftType: string;
  maker: string;
  taker: string;
  feeRecipient: string;
  listingTime: string;
  calldata: string;
  price: number | string; // start price
  endPrice: number | string; // end price
  priceBuyer: number | string;
  takerRelayerFee: string;
  makerRelayerFee: string;
  salt: string;
  collectionAddress: string;
  tokenType: string;
  v: number;
  r: string;
  s: string;
  replacementPatternSeller?: string | undefined;
  cidIPFS?: string;
  expireTime: string;
}) => {
  try {
    let callDataEncodedBuyer = '';
    let replacementPatternBuyer = '';
    let replacementPatternSeller = dataListingOnSale?.replacementPatternSeller;

    const isEthPayment = dataListingOnSale.tokenType === PAYMENT_TOKEN.ETH;

    const expireTime = +dataListingOnSale?.expireTime;
    const signer = await getSigner();
    const signerAddressForBuyer = (await signer.getAddress()).toLowerCase();

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[dataListingOnSale.tokenType],
      numberOfDecimals: DECIMALS_ERC20[dataListingOnSale.tokenType],
    };

    const endPriceConvert = convertPriceToBigDecimals(
      dataListingOnSale.endPrice,
      paymentToken.numberOfDecimals,
    ); // end price


    let basePrice;
    let extraPriceConvert;

    if (isEthPayment) {
      const serviceFee = new BigNumber(dataListingOnSale.makerRelayerFee).dividedBy(100).toString();
      const startPriceEstimate 
        = new BigNumber(dataListingOnSale.price).multipliedBy(100 - parseFloat(serviceFee)).dividedBy(100).toString();
      basePrice = convertPriceToBigDecimals(
        startPriceEstimate,
        paymentToken.numberOfDecimals,
      ); // start price
      extraPriceConvert = new BigNumber(basePrice).minus(endPriceConvert).toString(); //extra price = start price - end price;
    } else {
      basePrice = convertPriceToBigDecimals(
        dataListingOnSale.price,
        paymentToken.numberOfDecimals,
      ); // start price
  
      extraPriceConvert = new BigNumber(basePrice).minus(endPriceConvert).toString(); //extra price = start price - end price;
    }

    // contact to hai.pham@sotatek.com for explaining
    const totalFee = 1 + (isEthPayment ? +dataListingOnSale.makerRelayerFee / 10000 : 0);
    
    const priceBuyer = new BigNumber(dataListingOnSale.priceBuyer).multipliedBy(totalFee).toString();

    const priceBuyerConvert = new BigNumber(priceBuyer).decimalPlaces(paymentToken.numberOfDecimals)?.toString() as string;

    const basePriceBuyer = convertPriceToBigDecimals(
      priceBuyerConvert,
      paymentToken.numberOfDecimals,
    );
    

    const iface = new ethers.utils.Interface(SingleCollectableABI);
    callDataEncodedBuyer = iface.encodeFunctionData('mintAndTransfer', [
      NULL_ADDRESS,
      signerAddressForBuyer,
      dataListingOnSale?.tokenId,
      dataListingOnSale?.cidIPFS,
    ]);
    let replacementPatternRaw =
      '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    replacementPatternBuyer =
      replacementPatternRaw +
      '0'.repeat(dataListingOnSale?.calldata.length - replacementPatternRaw.length);
    const exchangeContractInstant = await genMainContractEther();

    const estimatedGas = await exchangeContractInstant.estimateGas.atomicMatch_(
      [
        // buyer data
        NEXT_PUBLIC_EXCHANGE, //exchange.address,
        signerAddressForBuyer, // maker address
        dataListingOnSale.maker, // taker address
        NULL_ADDRESS,
        dataListingOnSale.collectionAddress, // collection address
        NULL_ADDRESS, // default
        paymentToken.tokenAddress, //  paymentToken.address [ETH address or USDT address]

        // seller data
        NEXT_PUBLIC_EXCHANGE,
        dataListingOnSale.maker, // maker address
        dataListingOnSale?.taker || NULL_ADDRESS, // taker address
        dataListingOnSale.feeRecipient,
        dataListingOnSale.collectionAddress,
        NULL_ADDRESS,
        paymentToken.tokenAddress,
      ],
      [
        // data of buyer
        
        dataListingOnSale.takerRelayerFee, // takerRelayerFee
        dataListingOnSale.makerRelayerFee, // makerRelayerFee
        basePriceBuyer, //basePrice
        0, // extra // default: 0
        dataListingOnSale.listingTime,// buy time
        expireTime,
        dataListingOnSale.salt, // salt example

        // data of seller
        dataListingOnSale.makerRelayerFee,
        dataListingOnSale.takerRelayerFee,
        basePrice,
        extraPriceConvert, //extra
        dataListingOnSale.listingTime,
        expireTime, // expirationTime
        dataListingOnSale.salt, // salt example
      ],
      [1, 0, 1, 0, 1, 1, 1, 0],
      callDataEncodedBuyer,
      dataListingOnSale.calldata, //callDataEncoded
      replacementPatternBuyer,
      replacementPatternSeller,
      '0x00',
      '0x00',

      [dataListingOnSale.v, dataListingOnSale.v],
      [
        dataListingOnSale.r,
        dataListingOnSale.s,
        dataListingOnSale.r,
        dataListingOnSale.s,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
      {
        value: dataListingOnSale.tokenType === PAYMENT_TOKEN.ETH ? basePriceBuyer : '0',
      },
    );

    const transaction = await exchangeContractInstant.atomicMatch_(
      [
        // buyer data
        NEXT_PUBLIC_EXCHANGE, //exchange.address,
        signerAddressForBuyer, // maker address
        dataListingOnSale.maker, // taker address
        NULL_ADDRESS,
        dataListingOnSale.collectionAddress, // collection address
        NULL_ADDRESS, // default
        paymentToken.tokenAddress, //  paymentToken.address [ETH address or USDT address]

        // seller data
        NEXT_PUBLIC_EXCHANGE,
        dataListingOnSale.maker, // maker address
        dataListingOnSale?.taker || NULL_ADDRESS, // taker address
        dataListingOnSale.feeRecipient,
        dataListingOnSale.collectionAddress,
        NULL_ADDRESS,
        paymentToken.tokenAddress,
      ],
      [
        // data of buyer
        dataListingOnSale.takerRelayerFee, // takerRelayerFee
        dataListingOnSale.makerRelayerFee, // makerRelayerFee
        basePriceBuyer, //basePrice
        0, // extra // default: 0
        dataListingOnSale.listingTime,// listing time
        expireTime,
        dataListingOnSale.salt, // salt example

        // data of seller
        dataListingOnSale.makerRelayerFee, // makerRelayerFee
        dataListingOnSale.takerRelayerFee, // takerRelayerFee
        basePrice, // start price
        extraPriceConvert, //extra price 
        dataListingOnSale.listingTime,
        expireTime, // expirationTime
        dataListingOnSale.salt, // salt example
      ],
      [1, 0, 1, 0, 1, 1, 1, 0],
      callDataEncodedBuyer,
      dataListingOnSale.calldata, //callDataEncoded
      replacementPatternBuyer,
      replacementPatternSeller,
      '0x00',
      '0x00',

      [dataListingOnSale.v, dataListingOnSale.v],
      [
        dataListingOnSale.r,
        dataListingOnSale.s,
        dataListingOnSale.r,
        dataListingOnSale.s,
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ],
      {
        value: dataListingOnSale.tokenType === PAYMENT_TOKEN.ETH ? basePriceBuyer : '0',
        gasLimit: new BigNumber(estimatedGas.toString()).multipliedBy(RATE_GAS_LIMIT).toString(),
      },
    );

    return [transaction, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleCancelListingDutchAuctionCreated = async (listingData: {
  nftType: string;
  maker: string;
  feeRecipient: string;
  collectionAddress: string;
  tokenType: string;
  makerRelayerFee: string;
  takerRelayerFee: string;
  price: string;
  quantity: number;
  listingTime: string;
  salt: string;
  calldata: string;
  v: number;
  r: string;
  s: string;
  reserveBuyer: string;
  replacementPattern: string;
  extraPrice: number | string; // ending price
  cidIPFS?: string;
  expireTime: number;
  startTime?: number | string;
}) => {
  try {
    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[listingData.tokenType],
      numberOfDecimals: DECIMALS_ERC20[listingData.tokenType],
    };

    const endPriceConvert = convertPriceToBigDecimals(
      listingData.extraPrice,
      paymentToken.numberOfDecimals,
    );

    const expireTime = listingData?.expireTime;

    const isEthPayment = listingData.tokenType === PAYMENT_TOKEN.ETH;

    let basePrice;
    let extraPriceConvert;

    if (isEthPayment) {
      const serviceFee = new BigNumber(listingData.makerRelayerFee).dividedBy(100).toString();
      const startPriceEstimate 
        = new BigNumber(listingData.price).multipliedBy(100 - parseFloat(serviceFee)).dividedBy(100).toString();
      basePrice = convertPriceToBigDecimals(startPriceEstimate, paymentToken.numberOfDecimals);
      extraPriceConvert = new BigNumber(basePrice).minus(endPriceConvert).toString();
    } else {
      basePrice = convertPriceToBigDecimals(listingData.price, paymentToken.numberOfDecimals);
      extraPriceConvert = new BigNumber(basePrice).minus(endPriceConvert).toString();
    }

    const exchangeContractInstant = await genMainContractEther();

    const transaction = await exchangeContractInstant.cancelOrder_(
      [
        NEXT_PUBLIC_EXCHANGE, // sc address
        listingData.maker, // maker address
        listingData?.reserveBuyer || NULL_ADDRESS, // taker address
        listingData.feeRecipient, // recipient fee
        listingData.collectionAddress, //collection address
        NULL_ADDRESS, // static target
        paymentToken.tokenAddress, // payment token address
      ],
      [
        listingData.makerRelayerFee,
        listingData.takerRelayerFee,
        basePrice, // base price - token decimals: start price
        extraPriceConvert, // extra = start price - end price
        listingData.listingTime, // listingTime
        expireTime, // expirationTime for auction
        listingData.salt, // salt
      ],
      FEE_METHOD, // feeMethod default: 1
      1, // side - 1: sell, 0: buy
      1, // saleKind - 0: fixed price, 1: auction
      HOW_TO_CALL, // howToCall default: 0
      listingData.calldata,
      listingData?.replacementPattern,
      STATIC_EXTRA_DATA,
      listingData.v,
      listingData.r,
      listingData.s,
    );

    return [transaction, null];
  } catch (error) {
    return [null, error];
  }
};
