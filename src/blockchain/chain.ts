
export enum SupportedChainId {
  RINKEBY = 4,
  BSC_TESTNET = 97,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.BSC_TESTNET]: 'bsc_testnet',
  [SupportedChainId.RINKEBY]: 'rinkeby',
}

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number'
) as SupportedChainId[]
