import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import RPC from './rpc';

// const supportedChainIds = Object.values(SupportedChainId) as number[];
const WALLET_CONNECT_BRIDGE_URL = 'https://bridge.walletconnect.org';

export const injected = new InjectedConnector({});

export const walletConnect = new WalletConnectConnector({
  supportedChainIds: [1, 4, 97, 5],
  rpc: RPC,
  bridge: WALLET_CONNECT_BRIDGE_URL,
  qrcode: true,
});

export enum WALLET_NAME {
  WALLET_CONNECT = 'walletConnect',
  METAMASK = 'metamask',
}

export const CONNECTORS: any = {
  metamask: injected,
  walletConnect: walletConnect,
};

export const SUPPORTED_WALLETS = [
  {
    connector: injected,
    id: WALLET_NAME.METAMASK,
    name: 'MetaMask',
    icon: '/icons/MetaMask_Fox.svg',
  },
  {
    connector: walletConnect,
    id: WALLET_NAME.WALLET_CONNECT,
    name: 'WalletConnect',
    icon: '/icons/WalletConnect-icon.svg',
  },
];
