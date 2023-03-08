import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected, walletConnect, WALLET_NAME } from 'blockchain/connectors';
import StorageUtils, { STORAGE_KEYS } from 'utils/storage';
import { isMobile } from 'react-device-detect';
import { useDispatch } from 'react-redux';
import { userLogoutWallet } from 'store/actions/user';

export function useEagerConnect() {
  const { activate, active, library } = useWeb3React();
  const [tried, setTried] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogoutWallet());
  };

  useEffect(() => {
    const { ethereum } = window as any;

    const isWalletConnected = 'walletconnect' in localStorage;
    // if (!walletLastConnected) return handleLogout();
    if (!isWalletConnected) {
      injected.isAuthorized().then((isAuthorized: boolean) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
            handleLogout();
          });
        } else {
          if (isMobile && ethereum) {
            activate(injected, undefined, true).catch(() => {
              setTried(true);
              handleLogout();
            });
          } else {
            setTried(true);
          }
        }
      });
    }

    if (isWalletConnected && !library) {
      setTimeout(() => {
        activate(walletConnect).catch(() => {
          setTried(true);
          handleLogout();
        });
      }, 2000);
    }
    // } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally only running on mount (make sure it's only mounted once :)) // if the connection worked, wait until we get confirmation of that to flip the flag

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useWeb3React();

  useEffect((): any => {
    const ethereum = (window as any)?.ethereum;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        activate(injected);
      };
      const handleChainChanged = (chainId: string | number) => {
        activate(injected);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}
