import { useState, FC, memo, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { SUPPORTED_WALLETS } from 'blockchain/connectors';
import { OutlinedButton } from 'components/common';
import CircularProgressIndicator from 'components/common/progress-indicator';
import { setConnectNetwork, setConnectWallet, setWalletName } from 'store/actions/login';
import { DEEP_LINK_METAMASK, NETWORK_ID } from 'constants/envs';
import { toastError } from 'store/actions/toast';
import { WALLET_NAME } from 'blockchain/connectors';
import StorageUtils, { STORAGE_KEYS } from 'utils/storage';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { checkNetwork } from 'utils/func';
import { useMobileDetect } from 'hooks/useMobileDetect';
interface ConnectWalletContentProps {
  onSignIn: () => void;
  onUnavailableMetamask: () => void;
  onWrongNetwork: () => void;
}

const ConnectWalletContent: FC<ConnectWalletContentProps> = (props) => {
  const { onSignIn, onUnavailableMetamask, onWrongNetwork } = props;
  const { activate, deactivate } = useWeb3React();
  const { button } = useSelector((state:any) => state.theme);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<string | undefined>(undefined);

  const detectWallet = useMobileDetect();
  const isMobile = detectWallet.isMobile();

  const isMetaMaskInstalled = () => {
    return (window as any)?.ethereum?.isMetaMask;
  };

  const handleConnectWallet = async (connector: any, connectorSelected: string) => {
    if (!connectorSelected) return;
    StorageUtils.removeItem(STORAGE_KEYS.WALLET_CONNECT);
    await deactivate();

    if (!isMobile && !isMetaMaskInstalled() && connectorSelected === WALLET_NAME.METAMASK) {
      onUnavailableMetamask();
      return;
    }

    if (isMobile && connectorSelected === WALLET_NAME.METAMASK) {
      window.open(DEEP_LINK_METAMASK);
    }
    dispatch(setWalletName(connectorSelected));

    if (connector instanceof WalletConnectConnector) {
      connector.walletConnectProvider = undefined;
    }

    connector &&
      (await activate(connector, undefined, true)
        .then(async () => {
          const walletAddress = await connector.getAccount();
          let networkId = await connector.getChainId();
          if (connectorSelected === WALLET_NAME.METAMASK) {
            networkId = parseInt(NETWORK_ID as string, 16);
          }
          const isNetWork = checkNetwork(networkId as number);
          if (!isNetWork && connectorSelected === WALLET_NAME.METAMASK) {
            dispatch(setConnectNetwork(true));
          } else if (!isNetWork && connectorSelected === WALLET_NAME.WALLET_CONNECT) {
            deactivate();
            onWrongNetwork();
          } else {
            dispatch(setConnectNetwork(true));
          }
          dispatch(setConnectWallet(true));
          dispatch(setWalletName(connectorSelected));
          StorageUtils.setItem(STORAGE_KEYS.WALLET_ADDRESS, walletAddress);
          console.log('onSignIn');

          onSignIn();
        })
        .catch((error: any) => {
          setLoading(undefined);
          if (error?.code === -32002) {
            dispatch(toastError('Error connecting to Metamask'));
          }
          if (error instanceof UnsupportedChainIdError) {
            onWrongNetwork();
          }
        }));
  };

  useEffect(() => {
    return () => {
      setLoading(undefined);
    };
  }, []);

  const renderWallet = () => {
    return SUPPORTED_WALLETS.map((wallet) => (
      <div key={wallet.id} className={loading && loading !== wallet.name ? 'hidden' : ''}>
        <OutlinedButton
          fullWidth
          onClick={() => {
            // connectorSelectedRef.current = wallet.id;
            handleConnectWallet(wallet.connector, wallet.id);
            setLoading(wallet.name);
          }}
          style={button?.outline}
        >
          <figure className="w-[20px]">
            <img src={wallet.icon} alt={wallet.name} />
          </figure>
          {wallet.name}
        </OutlinedButton>
      </div>
    ));
  };

  return (
    <Stack spacing={4} className="w-full mt-2">
      <div className="text-archive-Neutral-Variant70 text--title-small">
        Sign In with one of available wallet providers or create a new wallet.
      </div>
      {renderWallet()}
      {Boolean(loading) && (
        <div className="flex justify-center items-center gap-3">
          <div className="scale-[.60] -ml-2">
            <CircularProgressIndicator />
          </div>
          <p className="text-primary-60 text--body-large">Initializing...</p>
        </div>
      )}
      <div className="text-center text--body-medium">
        <div className="mb-1">New to Ethereum?</div>
        <a
          className="text-primary-90 cursor-pointer"
          href="https://ethereum.org/en/wallets/"
          target={'_blank'}
        >
          Learn more about wallets
        </a>
      </div>
    </Stack>
  );
};

export default memo(ConnectWalletContent);
