import { ethers, providers, utils } from 'ethers';
import { injected, walletConnect } from './connectors';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

export const getProvider = async () => {
  // TODO: find a better to detect what user connect by
  // hint: redux
  const isWc = 'walletconnect' in localStorage;

  const provider = await (isWc ? walletConnect : injected).getProvider();
  return new providers.Web3Provider(provider);
};

export const getContractInstanceEther = async (ABIContract: any, contractAddress: string) => {
  const provider = await getProvider();
  const signer = provider.getSigner();

  return new ethers.Contract(contractAddress, ABIContract, signer);
};

export const getSigner = async () => {
  const provider = await getProvider();

  return provider.getSigner();
};

export const convertPriceToBigDecimals = (price: any, decimal: any): string => {
  const res = ethers.utils.parseUnits(price.toString(), decimal);

  return res.toString();
};

export const multiply = (a: any, b: any) => {
  return new BigNumber(a).multipliedBy(new BigNumber(b)).toString();
};

export const convertBigNumberValueToNumber = (weiBalance: any, decimal: any) => {
  const res = ethers.utils.formatUnits(weiBalance, decimal).toString();
  return res;
};

/**
 *
 * @param {string} address
 * @param {'wei' | 'kwei' | 'mwei' | 'gwei' | 'szabo' | 'finney' | 'ether'} unit
 * @returns
 */
export const getBalance = async (address: string, unit = 'ether', provider = null) => {
  if (!provider) {
    provider = (await getProvider()) as any;
  }

  const rawBalance = await (provider as any).getBalance(address);

  return utils.formatUnits(rawBalance, unit);
};

export const getWeb3Instance = (window?: any) => {
  if (typeof window === 'undefined') {
    return null;
  }
  const { ethereum, web3 } = window;
  if (ethereum && ethereum.isMetamask) {
    return new Web3(ethereum);
  }
  if (web3) {
    return new Web3(web3.currentProvider);
  }
  return null;
};
