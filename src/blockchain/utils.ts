import { genERC721Contract, genRoyaltyFeeSetterContract } from './instance';
import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import _ from 'lodash';

import {
  genERC20PaymentContract,
  genMainContractEther,
  genRegistryContractEther,
} from 'blockchain/instance';
import { getSigner, convertPriceToBigDecimals, multiply, getProvider } from 'blockchain/ether';
import { LOGIN_SIGN_MESSAGE } from 'constants/text';
import SingleCollectableABI from 'blockchain/abi/singleCollectable.json';
import MultipleCollectableABI from 'blockchain/abi/multipleCollectable.json';
import {
  ERC20_ADDRESS,
  PAYMENT_TOKEN,
  DECIMALS_ERC20,
  MARKET_RAW_FEE_BUY_TOKEN,
} from 'constants/index';
import { NETWORK_ADD_CHAINS, ASSET_TYPE, RATE_GAS_LIMIT } from 'constants/app';

const NEXT_PUBLIC_EXCHANGE = process.env.NEXT_PUBLIC_EXCHANGE!;
const NEXT_PUBLIC_PROXY = process.env.NEXT_PUBLIC_PROXY!;
const NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS =
  process.env.NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS! || '0x25acC3e8BB990dE893d3981015F3AC6E9A1eCA12'; // TODO

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const HOW_TO_CALL = 0;
const FEE_METHOD = 1;
const STATIC_EXTRA_DATA = '0x00';
const EXTRA = '0';

export const signMessage = async (msg: any, library: any) => {
  if (!library || !msg) throw new Error('invalid params');

  const signer = library.getSigner();
  const address = await signer.getAddress();
  const isWc = 'walletconnect' in localStorage;
  if (isWc) {
    const provider: any = await getProvider();
    const signature = await provider.send('personal_sign', [
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(msg)),
      address.toLowerCase(),
    ]);
    return signature;
  }

  const signature = await library.provider.send('personal_sign', [
    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(msg)),
    address.toLowerCase(),
  ]);
  return signature?.result;
};

export const signWallet = (library: any) => {
  return signMessage(LOGIN_SIGN_MESSAGE, library);
};

export const changeNetwork = async (chainId: string) => {
  if (typeof window === 'undefined') {
    return null;
  }
  const { ethereum } = window as any;

  if (!ethereum) throw new Error('No crypto wallet found');

  const network_chain = _.get(NETWORK_ADD_CHAINS, chainId as any);

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network_chain.chainId }],
    });
  } catch (e: any) {
    if (e.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            ...network_chain,
          },
        ],
      });
      return;
    }
  }
};

export const checkUserHasProxy = async (userAddress: string) => {
  try {
    const registerContract = await genRegistryContractEther();

    const res = await registerContract.proxies(userAddress);
    if (res !== NULL_ADDRESS) {
      return [res, null, true]; // true = 'has registered'
    }
    const proxy = await registerContract.registerProxy();

    return [proxy, null, false];
  } catch (error) {
    return [null, error];
  }
};

export const isUserApprovedERC20 = async (contractAddress: string, userAddress: string) => {
  try {
    const contract = await genERC20PaymentContract(contractAddress);
    const allowance = await contract.allowance(userAddress, NEXT_PUBLIC_PROXY);

    if (allowance.toString() !== '0') {
      return [true];
    }
    return false;
  } catch (error) {
    console.log(error);

    return false;
  }
};

export const isUserApprovedERC20Amount = async (
  contractAddress: string,
  userAddress: string,
  amount: string,
  tokenType: string,
) => {
  try {
    const contract = await genERC20PaymentContract(contractAddress);
    const allowance = await contract.allowance(userAddress, NEXT_PUBLIC_PROXY);

    return new BigNumber(allowance.toString()).gte(
      new BigNumber(amount).multipliedBy(10 ** DECIMALS_ERC20[tokenType.toLowerCase()]),
    );
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const userAllowanceERC20 = async (contractAddress: string, userAddress: string) => {
  try {
    const contract = await genERC20PaymentContract(contractAddress);
    const allowance = await contract.allowance(userAddress, NEXT_PUBLIC_PROXY);
    return allowance?.toString();
  } catch (error) {
    console.log('userAllowanceERC20', error);
    return '0';
  }
};

export const handleUserApproveERC20 = async (contractAddress: string) => {
  try {
    const contract = await genERC20PaymentContract(contractAddress);
    const approve = await contract.approve(NEXT_PUBLIC_PROXY, MAX_INT);
    return [approve, null];
  } catch (error) {
    return [null, error];
  }
};

export const getOperatorRegistry = async (userAddress: string) => {
  try {
    const contract = await genRegistryContractEther();
    const res = await contract.proxies(userAddress);
    if (res !== NULL_ADDRESS) {
      return res;
    }
    return;
  } catch (error) {
    return error;
  }
};

export const isUserApprovedERC721 = async (contractAddress: any, userAddress: string) => {
  try {
    const proxiesContract = await getOperatorRegistry(userAddress);
    const contract = await genERC721Contract(contractAddress);
    const isApprovedForAll = await contract.isApprovedForAll(userAddress, proxiesContract);
    return isApprovedForAll;
  } catch (error) {
    console.log('isUserApprovedERC721', error);
    return false;
  }
};

export const handleUserApproveForAllERC721 = async (contractAddress: any, userAddress: any) => {
  try {
    const proxiesContract = await getOperatorRegistry(userAddress);
    const contract = await genERC721Contract(contractAddress);
    const approveForAll = await contract.setApprovalForAll(proxiesContract, true);
    return [approveForAll, null];
  } catch (error) {
    return [null, error];
  }
};

export const getERC20AmountBalance = async (contractAddress: string, walletAddress: string) => {
  try {
    const contract = await genERC20PaymentContract(contractAddress);
    const response = await contract.balanceOf(walletAddress);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const checkForCollectionSetter = async (addressCollection: string) => {
  try {
    const contract = await genRoyaltyFeeSetterContract();
    const response = await contract.checkForCollectionSetter(addressCollection);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const updateRoyaltyInfoForCollectionIfSetter = async (
  addressCollection: string,
  addressSetter: string,
  addressReceiver: string,
  fee: string | number,
) => {
  try {
    const contract = await genRoyaltyFeeSetterContract();
    const proxy = await contract.updateRoyaltyInfoForCollectionIfSetter(
      addressCollection,
      addressSetter,
      addressReceiver,
      fee,
    );
    return [proxy, null];
    // const res = await proxy.wait(1);
    // return [res, null];
  } catch (error) {
    return [null, error];
  }
};

export const signPutDataOnSale = async (listingData: {
  quantity: number;
  tokenId: string;
  nftType: string;
  collectionAddress: string;
  tokenType: string;
  price: string;
  reserveBuyer?: string;
}) => {
  try {
    console.log('listingData: ', listingData);

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
      // singleTransfer
      // safeTransferFrom(address,address,uint256)
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncoded = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        address,
        listingData?.reserveBuyer || NULL_ADDRESS,
        listingData.tokenId,
      ]);
      replacementPattern =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
    } else {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      //transfer
      // safeTransferFrom
      callDataEncoded = iface.encodeFunctionData('safeTransferFrom', [
        address,
        listingData?.reserveBuyer || NULL_ADDRESS,
        listingData.tokenId,
        listingData.quantity,
        '0x00',
      ]);
      replacementPattern =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
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
      sellHash: makerHashOrder || '', // sellHash - orderHash to crawler check order
    };
    return [dataPutOnSale, null];
  } catch (error) {
    return [null, error];
  }
};

export const signPutDataOnSaleAuction = async (listingData: {
  quantity: number;
  tokenId: string;
  nftType: string;
  collectionAddress: string;
  tokenType: string;
  price: string;
  reserveBuyer?: string;
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
      // singleTransfer
      // safeTransferFrom(address,address,uint256)
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncoded = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        address,
        listingData?.reserveBuyer || NULL_ADDRESS,
        listingData.tokenId,
      ]);
      replacementPattern =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
    } else {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      //transfer
      // safeTransferFrom
      callDataEncoded = iface.encodeFunctionData('safeTransferFrom', [
        address,
        listingData?.reserveBuyer || NULL_ADDRESS,
        listingData.tokenId,
        listingData.quantity,
        '0x00',
      ]);
      replacementPattern =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
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
      sellHash: makerHashOrder || '', // sellHash - orderHash to crawler check order
    };
    return [dataPutOnSale, null];
  } catch (error) {
    console.log('error: ', error);

    return [null, error];
  }
};

export const handleCancelListingOrder = async (listingData: {
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
}) => {
  try {
    let replacementPattern = '';
    if (listingData.nftType === ASSET_TYPE.ERC721) {
      replacementPattern =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
    } else if (listingData.nftType === ASSET_TYPE.ERC1155) {
      replacementPattern =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    }

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
      replacementPattern,
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

export const handleOrderCanMatch = async (dataListingOnSale: {
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
  price: string;
  salt: string;
  tokenType: string;
}) => {
  try {
    let callDataEncodedBuyer = '';
    let replacementPatternBuyer = '';
    let replacementPatternSeller = '';

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
      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        dataListingOnSale.maker,
        signerAddressForBuyer,
        dataListingOnSale.tokenId,
      ]);
      replacementPatternSeller =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternBuyer =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    } else if (dataListingOnSale.nftType === ASSET_TYPE.ERC1155) {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom', [
        dataListingOnSale.maker,
        signerAddressForBuyer,
        dataListingOnSale.tokenId,
        dataListingOnSale.quantity,
        '0x00',
      ]);
      replacementPatternSeller =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternBuyer =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
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
    console.log('error: ', error);

    return [null, error];
  }
};

export const handleAtomicMatch = async (dataListingOnSale: {
  tokenId: string;
  quantity: number;
  nftType: string;
  maker: string;
  taker: string;
  feeRecipient: string;
  listingTime: string;
  calldata: string;
  price: string;
  takerRelayerFee: string;
  makerRelayerFee: string;
  salt: string;
  collectionAddress: string;
  tokenType: string;
  v: number;
  r: string;
  s: string;
}) => {
  try {
    let callDataEncodedBuyer = '';
    let replacementPatternBuyer = '';
    let replacementPatternSeller = '';

    const signer = await getSigner();
    let signerAddressForBuyer = await signer.getAddress();
    signerAddressForBuyer = signerAddressForBuyer.toLowerCase();

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
      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        dataListingOnSale.maker,
        signerAddressForBuyer,
        dataListingOnSale.tokenId,
      ]);
      replacementPatternSeller =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternBuyer =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    } else if (dataListingOnSale.nftType === ASSET_TYPE.ERC1155) {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);

      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom', [
        dataListingOnSale.maker,
        signerAddressForBuyer,
        dataListingOnSale.tokenId,
        dataListingOnSale.quantity,
        '0x00',
      ]);
      replacementPatternSeller =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternBuyer =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
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

export const buildDataBid = async (bidData: {
  taker: string;
  collectionAddress: string;
  price: string;
  expirationTime: number;
  nftType: string;
  tokenType: string;
  quantity: number;
  tokenId: string;
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
      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        bidData.taker,
        bidderAddress,
        bidData.tokenId,
      ]);
      replacementPattern =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    } else if (bidData.nftType === ASSET_TYPE.ERC1155) {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom', [
        bidData.taker,
        bidderAddress,
        bidData.tokenId,
        bidData.quantity,
        STATIC_EXTRA_DATA,
      ]);
      replacementPattern =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    }

    const basePrice = convertPriceToBigDecimals(bidData.price, paymentToken.numberOfDecimals);

    const makerHashOrder = await exchangeContractInstant.hashOrder_(
      [
        NEXT_PUBLIC_EXCHANGE, // sc address
        bidderAddress, // bidder address
        bidData.taker, // auction owner address
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
    };

    return [dataPlaceABid];
  } catch (error) {
    return [null, error];
  }
};

export const handleAtomicMatchForAcceptOffer = async (dataPlaceBid: {
  tokenId: string;
  quantity: number;
  calldata: string;
  nftType: string;
  expirationTime: string;
  maker: string;
  taker: string;
  feeRecipient: string;
  listingTime: string;
  price: string;
  takerRelayerFee: string;
  makerRelayerFee: string;
  salt: string;
  collectionAddress: string;
  tokenType: string;
  v: number;
  r: string;
  s: string;
}) => {
  try {
    const exchangeContractInstant = await genMainContractEther();
    let callDataEncoded = '';
    let replacementPatternBuyer = '';
    let replacementPatternSeller = '';

    const signer = await getSigner();
    const ownerAddress = await signer.getAddress();

    if (dataPlaceBid.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);

      callDataEncoded = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        ownerAddress,
        NULL_ADDRESS,
        dataPlaceBid.tokenId,
      ]);

      replacementPatternBuyer =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternSeller =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
    } else if (dataPlaceBid.nftType === ASSET_TYPE.ERC1155) {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);

      callDataEncoded = iface.encodeFunctionData('safeTransferFrom', [
        ownerAddress,
        NULL_ADDRESS,
        dataPlaceBid.tokenId,
        dataPlaceBid.quantity,
        STATIC_EXTRA_DATA,
      ]);

      replacementPatternBuyer =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternSeller =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
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

export const handleAtomicMatchForAcceptBid = async (dataPlaceBid: {
  tokenId: string;
  quantity: number;
  nftType: string;
  expirationTime: string;
  maker: string;
  taker: string;
  feeRecipient: string;
  listingTime: string;
  calldata: string;
  price: string;
  takerRelayerFee: string;
  makerRelayerFee: string;
  salt: string;
  collectionAddress: string;
  tokenType: string;
  v: number;
  r: string;
  s: string;
}) => {
  try {
    const exchangeContractInstant = await genMainContractEther();
    let callDataEncodedBuyer = '';
    let replacementPatternBuyer = '';
    let replacementPatternSeller = '';

    if (dataPlaceBid.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        dataPlaceBid.taker,
        dataPlaceBid.maker,
        dataPlaceBid.tokenId,
      ]);

      replacementPatternBuyer =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternSeller =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
    } else if (dataPlaceBid.nftType === ASSET_TYPE.ERC1155) {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom', [
        dataPlaceBid.taker,
        dataPlaceBid.maker,
        dataPlaceBid.tokenId,
        dataPlaceBid.quantity,
        STATIC_EXTRA_DATA,
      ]);

      replacementPatternBuyer =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      replacementPatternSeller =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
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

      callDataEncodedBuyer,
      dataPlaceBid.calldata, //callDataEncoded
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
        dataPlaceBid.taker, // taker address - user who place a bid
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
      callDataEncodedBuyer,
      dataPlaceBid.calldata, //callDataEncoded
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

export const handleCancelBid = async (bidInfo: {
  maker: string;
  taker: string;
  collectionAddress: string;
  price: string;
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

    if (bidInfo.nftType === ASSET_TYPE.ERC721) {
      const iface = new ethers.utils.Interface(SingleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
        bidInfo.taker,
        bidInfo.maker,
        bidInfo.tokenId,
      ]);
      replacementPattern =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    } else if (bidInfo.nftType === ASSET_TYPE.ERC1155) {
      const iface = new ethers.utils.Interface(MultipleCollectableABI);
      callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom', [
        bidInfo.taker,
        bidInfo.maker,
        bidInfo.tokenId,
        bidInfo.quantity,
        STATIC_EXTRA_DATA,
      ]);
      replacementPattern =
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    }

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
      callDataEncodedBuyer,
      replacementPattern,
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

export const buildDataPutAuction = async (listingData: {
  taker?: string;
  collectionAddress: string;
  price: string;
  expirationTime?: number;
  nftType: string;
  tokenType: string;
  quantity: number;
  tokenId: string;
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
    const iface = new ethers.utils.Interface(SingleCollectableABI);
    callDataEncoded = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
      address,
      NULL_ADDRESS,
      listingData.tokenId,
    ]);
    replacementPattern =
      '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';

    const basePrice = convertPriceToBigDecimals(listingData.price, paymentToken.numberOfDecimals);

    const makerHashOrder = await exchangeContractInstant.hashOrder_(
      [
        NEXT_PUBLIC_EXCHANGE, // sc address
        makerAddress, // maker address
        NULL_ADDRESS, // taker address
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

    const dataPutOnAuction = {
      calldata: callDataEncoded,
      expirationTime: '0', // fixed-price: 0
      extra: EXTRA, // = 0 default
      feeMethod: FEE_METHOD, // = 1 default
      feeRecipient: NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS, // set in env address
      hash: makerHashOrder, // makerHashOrder
      howToCall: HOW_TO_CALL, // = 0 default
      maker: makerAddress, // user who create nft
      makerRelayerFee: (paymentToken.feeService * 100).toString(),
      taker: NULL_ADDRESS,
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
      sellHash: makerHashOrder || '', // sellHash - orderHash to crawler check order
    };
    return [dataPutOnAuction, null];
  } catch (error) {
    return [null, error];
  }
};

export const signPutDataOnSaleDutchAuction = async (listingData: {
  quantity?: number;
  tokenId: string;
  nftType: string;
  collectionAddress: string;
  tokenType: string;
  staringPrice: number | string; // starting price
  endingPrice: number | string; // ending price
  reserveBuyer?: string;
  expireTime: number;
  startTime?: number | string;
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

    // const listingTimeValue = (Math.floor(Date.now() / 1000) - 120).toString();
    const listingTimeValue = String(listingData?.startTime);
    const expireTime = listingData?.expireTime;

    const saltValue = ethers.utils
      .keccak256(Buffer.from(Math.floor(Date.now() / 1000).toString(), 'hex').slice(2))
      .toString();

    const iface = new ethers.utils.Interface(SingleCollectableABI);
    callDataEncoded = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
      makerAddress,
      listingData?.reserveBuyer || NULL_ADDRESS,
      listingData.tokenId,
    ]);
    replacementPattern =
      '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';

    const isEthPayment = listingData.tokenType === PAYMENT_TOKEN.ETH;
    const endPriceConvert = convertPriceToBigDecimals(
      listingData.endingPrice,
      paymentToken.numberOfDecimals,
    );

    let basePrice;
    let extraPriceConvert;

    if (isEthPayment) {
      console.log('100 - parseFloat(paymentToken.feeService): ', 100 - parseFloat(paymentToken.feeService));
      
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
        NEXT_PUBLIC_RECIPIENT_FEE_ADDRESS, // fee receip
        listingData.collectionAddress, //collection address
        NULL_ADDRESS, // static target
        paymentToken.tokenAddress, // payment token address
      ],
      [
        paymentToken.feeService * 100, // MARKET_RAW_FEE, makerRelayerFee
        0, // MARKET_RAW_FEE,
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

export const handleAtomicMatchDutchAuction = async (dataListingOnSale: {
  tokenId: string;
  quantity: number;
  nftType: string;
  maker: string;
  taker: string;
  feeRecipient: string;
  listingTime: string;
  calldata: string;
  price: number | string;
  endPrice: number | string;
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
      extraPriceConvert = new BigNumber(basePrice).minus(endPriceConvert).toString();
    } else {
      basePrice = convertPriceToBigDecimals(
        dataListingOnSale.price,
        paymentToken.numberOfDecimals,
      ); // start price
  
      extraPriceConvert = new BigNumber(basePrice).minus(endPriceConvert).toString();
    }

    // contact to hai.pham@sotatek.com for explaining
    const totalFee = 1 + (isEthPayment ? +dataListingOnSale.makerRelayerFee / 10000 : 0);

    const priceBuyer = new BigNumber(dataListingOnSale.priceBuyer).multipliedBy(totalFee).toFixed().toString();

    const priceBuyerConvert = new BigNumber(priceBuyer).decimalPlaces(paymentToken.numberOfDecimals)?.toString() as string;

    const basePriceBuyer = convertPriceToBigDecimals(
      priceBuyerConvert,
      paymentToken.numberOfDecimals,
    );

    const iface = new ethers.utils.Interface(SingleCollectableABI);
    callDataEncodedBuyer = iface.encodeFunctionData('safeTransferFrom(address,address,uint256)', [
      dataListingOnSale.maker,
      signerAddressForBuyer,
      dataListingOnSale.tokenId,
    ]);
    replacementPatternSeller =
      '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
    replacementPatternBuyer =
      '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

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
        dataListingOnSale.listingTime, // buy time
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
        dataListingOnSale.listingTime, // buy time
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
        gasLimit: new BigNumber(estimatedGas.toString()).multipliedBy(RATE_GAS_LIMIT).toString(),
      },
    );

    return [transaction, null];
  } catch (error) {
    return [null, error];
  }
};

export const handleCancelListingOrderDutchAuction = async (listingData: {
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
  extraPrice: string;
  cidIPFS: string;
  expireTime: string | number;
}) => {
  try {
    let replacementPattern = '';
    if (listingData.nftType === ASSET_TYPE.ERC721) {
      replacementPattern =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000';
    } else if (listingData.nftType === ASSET_TYPE.ERC1155) {
      replacementPattern =
        '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    }

    const paymentToken = {
      tokenAddress: ERC20_ADDRESS[listingData.tokenType],
      numberOfDecimals: DECIMALS_ERC20[listingData.tokenType],
    };

    const endPriceConvert = convertPriceToBigDecimals(
      listingData.extraPrice,
      paymentToken.numberOfDecimals,
    );

    const expireTime = +listingData?.expireTime;

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
        basePrice, // base price - token decimals
        extraPriceConvert, // extra
        listingData.listingTime, // listingTime
        expireTime, // expirationTime for auction
        listingData.salt, // salt
      ],
      FEE_METHOD, // feeMethod default: 1
      1, // side - 1: sell, 0: buy
      1, // saleKind - 0: fixed price, 1: auction
      HOW_TO_CALL, // howToCall default: 0
      listingData.calldata,
      replacementPattern,
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

export const decodeEventOrdersMatched = (data: string) => {
  const iface = new ethers.utils.Interface([
    'event OrdersMatched(bytes32 buyHash, bytes32 sellHash, address maker, address taker, uint256 price, bytes32 metadata )',
  ]);
  const resp = iface.decodeEventLog('OrdersMatched', data);
  return resp;
};
