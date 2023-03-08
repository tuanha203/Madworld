import { getContractInstanceEther } from 'blockchain/ether';

import ExchangeABI from 'blockchain/abi/exchange.json';
import RegistryABI from 'blockchain/abi/Registry.json';
import ERC20ABI from 'blockchain/abi/ERC20.json';
import ERC721ABI from 'blockchain/abi/ERC721.json';
import ERC1155ABI from 'blockchain/abi/ERC1155.json';
import RoyaltyFeeSetterABI from 'blockchain/abi/RoyaltyFeeSetter.json';

import FactoryABI from 'blockchain/abi/factory.json';

const NEXT_PUBLIC_REGISTRY = process.env.NEXT_PUBLIC_REGISTRY!;
const NEXT_PUBLIC_EXCHANGE = process.env.NEXT_PUBLIC_EXCHANGE!;
const NEXT_PUBLIC_ROYALTY_FEE_SETTER = process.env.NEXT_PUBLIC_ROYALTY_FEE_SETTER!;

const NEXT_PUBLIC_FACTORY = process.env.NEXT_PUBLIC_FACTORY!;

export const genMainContractEther = () => {
  return getContractInstanceEther(ExchangeABI, NEXT_PUBLIC_EXCHANGE);
};

export const genRegistryContractEther = () => {
  return getContractInstanceEther(RegistryABI, NEXT_PUBLIC_REGISTRY);
};

export const genERC20PaymentContract = (contractAddress: string) => {
  return getContractInstanceEther(ERC20ABI, contractAddress);
};

export const genERC721Contract = (contractAddress: string) => {
  return getContractInstanceEther(ERC721ABI, contractAddress);
}

export const genERC1155Contract = (contractAddress: string) => {
  return getContractInstanceEther(ERC1155ABI, contractAddress);
}
export const genRoyaltyFeeSetterContract = () => {
  return getContractInstanceEther(RoyaltyFeeSetterABI, NEXT_PUBLIC_ROYALTY_FEE_SETTER);
}

// contract factory
export const genFactoryContract = () => {
  return getContractInstanceEther(FactoryABI, NEXT_PUBLIC_FACTORY);
}