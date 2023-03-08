import { ReactNode, useEffect, FC } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useDispatch, useSelector } from 'react-redux';
import { MODAL_TYPE, CONNECT_WALLET_STEP_LOGIN, modalActions } from 'store/constants/modal';
import { closedAllModal, setConnectWalletStep } from 'store/actions/modal';
import { ILoginState } from 'store/reducers/login';
import { userChangeAccount, userLogoutWallet } from 'store/actions/user';
import { NETWORK_CHAIN_ID, NETWORK_ID } from 'constants/envs';
import { useUpdateBalance } from 'hooks/useUpdateBalance';
import ConnectWalletModal from './ConnectWallet';
import Initial from './Initial';
import useUpdateEffect from 'hooks/useUpdateEffect';
import StorageUtils from 'utils/storage';
import Web3 from 'web3';
interface IAppContainerProps {
  children: ReactNode;
}

const AppContainer: FC<IAppContainerProps> = ({ children }) => {
  const { account, library, error, deactivate, chainId } = useWeb3React();
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: { login: ILoginState }) => state.login.loginData?.accessToken,
  );
  const { walletName } = useSelector((state: { login: ILoginState }) => state.login);

  const { updateBalance } = useUpdateBalance();

  const handleToggleModal = (
    type: MODAL_TYPE,
    status: boolean,
    stepConnectWallet?: CONNECT_WALLET_STEP_LOGIN | '-1',
  ) => {
    dispatch({
      type: modalActions.MODAL_TOGGLE_MODAL,
      payload: {
        type,
        status,
        stepConnectWallet,
      },
    });
  };

  const handleSetConnectWalletStep = (stepConnectWallet?: CONNECT_WALLET_STEP_LOGIN | '-1') => {
    dispatch(
      setConnectWalletStep({
        stepConnectWallet,
      }),
    );
  };

  const handleLogout = () => {
    deactivate();
    dispatch(userLogoutWallet());
  };

  useEffect(() => {
    const onChangeNetwork = () => {
      handleToggleModal(MODAL_TYPE.CONNECT_WALLET, true, CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK);
    };

    if (accessToken && chainId && chainId?.toString() !== NETWORK_CHAIN_ID) {
      onChangeNetwork();
      dispatch(closedAllModal());
    }
  }, [chainId]);

  useEffect(() => {
    dispatch(closedAllModal());
  }, [account]);

  useEffect(() => {
    const { ethereum } = window as any;
    if (walletName !== 'walletConnect') {
      ethereum?._metamask.isUnlocked().then((isUnlocked: any) => {
        if (!isUnlocked) {
          handleLogout();
        }
      });
    }

    if (!library && !library?.provider && !account) {
      return;
    }
    const onChangeAccount = ([accountConnected]: any) => {
      if (!accountConnected) {
        handleToggleModal(
          MODAL_TYPE.CONNECT_WALLET,
          false,
          CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET,
        );
        handleSetConnectWalletStep(CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET);
        handleLogout();
        return;
      }
      if (accountConnected?.toLowerCase() === account?.toLowerCase()) return;
      dispatch(userChangeAccount());
      handleSetConnectWalletStep(CONNECT_WALLET_STEP_LOGIN.WELCOME_BACK);
      handleToggleModal(MODAL_TYPE.CONNECT_WALLET, true, CONNECT_WALLET_STEP_LOGIN.WELCOME_BACK);
    };

    const onChangeNetwork = (chainId: number) => {
      if (chainId.toString() !== NETWORK_ID) {
        handleSetConnectWalletStep(CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK);
        handleToggleModal(MODAL_TYPE.CONNECT_WALLET, true, CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK);
      } else {
        handleToggleModal(
          MODAL_TYPE.CONNECT_WALLET,
          false,
          CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK,
        );
      }
    };

    const onDisconnect = (values: number) => {
      // console.log('onDisconnect', values);
    };

    if (library.provider && library.provider.on) {
      library.provider && library.provider.on('accountsChanged', onChangeAccount);
      library.provider && library.provider.on('chainChanged', onChangeNetwork);
      library.provider && library.provider.on('disconnect', onDisconnect);
    }
    return () => {
      library.provider?.removeListener('accountsChanged', onChangeAccount); // need func reference to remove correctly
      library.provider?.removeListener('chainChanged', onChangeNetwork); // need func reference to remove correctly
      library.provider?.removeListener('disconnect', onDisconnect);
    };
  }, [account, library, error]);

  useEffect(() => {
    if (accessToken) {
      updateBalance();
    }
  }, [accessToken]);

  return (
    <>
      {children}
      <Initial />
      <ConnectWalletModal key={`${chainId}_${account}`} />
    </>
  );
};

export default AppContainer;
