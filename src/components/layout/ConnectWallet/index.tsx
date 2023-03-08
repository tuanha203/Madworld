import { useWeb3React } from '@web3-react/core';
import { signWallet } from 'blockchain/utils';
import ModalCommon from 'components/common/modal';
import { NETWORK_CHAIN_ID } from 'constants/envs';
import get from 'lodash/get';
import { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userService from 'service/userService';
import { loginSuccess } from 'store/actions/login';
import { setConnectWalletStep, toggleModal } from 'store/actions/modal';
import { toastError } from 'store/actions/toast';
import { userGetProfileSuccess, userLoginSuccess, userLogoutWallet } from 'store/actions/user';
import { CONNECT_WALLET_STEP_LOGIN, MODAL_TYPE } from 'store/constants/modal';
import { IModalState } from 'store/reducers/modal';
import {
  AccountNotExist,
  CreateMadAccount,
  SelectWallet,
  VerifyAddress,
  Web3NotDetected,
  WelcomeBackUser,
  WrongNetwork,
} from './step';
import { STORAGE_KEYS } from 'utils/storage';

interface IConnectWalletProps {}

interface IMODAL_TITLE {
  [x: string]: string;
}

const MODAL_TITLE: IMODAL_TITLE = {
  [CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET]: 'Select a Wallet',
  [CONNECT_WALLET_STEP_LOGIN.WELCOME_BACK]: 'Welcome back',
  [CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK]: '',
  [CONNECT_WALLET_STEP_LOGIN.ACCOUNT_NOT_EXIST]: "Account don't exist",
  [CONNECT_WALLET_STEP_LOGIN.CREATE_ACCOUNT]: 'Create a MADworld Account',
};

const ConnectWallet: FC<IConnectWalletProps> = () => {
  const dispatch = useDispatch();
  const { toggleModalConnectWallet, stepConnectWallet } = useSelector(
    (state: { modal: IModalState }) => state.modal,
  );
  const logged = useSelector((state) => (state as any)?.user?.data?.walletAddress);
  const walletName = useSelector((state) => (state as any)?.login?.walletName);
  const [stepConnect, setStepConnect] = useState<CONNECT_WALLET_STEP_LOGIN>(
    stepConnectWallet || CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET,
  );
  const [loading, setLoading] = useState<'signIn' | 'signUp' | undefined>();
  const [profile, setProfile] = useState({} as any);
  const { account, library, chainId, connector, activate, deactivate } = useWeb3React();

  const handleToggleModal = (status: boolean) => {
    dispatch(
      toggleModal({
        type: MODAL_TYPE.CONNECT_WALLET,
        status,
      }),
    );
  };

  const handleLogout = () => {
    deactivate();
    dispatch(userLogoutWallet());
  };

  const handleClose = () => {
    /**
     * * Prevent user from turn off modal
     */
    if (stepConnect === CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK) {
      return null;
    }
    if (
      stepConnect === CONNECT_WALLET_STEP_LOGIN.WELCOME_BACK ||
      stepConnect === CONNECT_WALLET_STEP_LOGIN.CREATE_ACCOUNT
    ) {
      setStepConnect(CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET);
      setProfile(undefined);
    }
    handleToggleModal(false);
  };

  const handleBindingStep = useCallback(() => {
    if (stepConnectWallet && stepConnectWallet !== stepConnect) {
      setStepConnect(stepConnectWallet);
    }
  }, [stepConnectWallet]);

  const handleDisconnect = () => {
    handleLogout();
    setProfile(undefined);
    dispatch(setConnectWalletStep({ stepConnectWallet: undefined }));
    setStepConnect(CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET);
  };

  const handleSignWallet = useCallback(async () => {
    if (!library) return;
    try {
      return await signWallet(library);
    } catch (error) {
      setLoading(undefined);
      dispatch(toastError('You declined the action in your wallet'));
    }
  }, [connector, library]);

  const handleValidateAccount = async () => {
    try {
      if (account) {
        /**
         * * Clean up step in reducer because stepConnectWallet priority get from reducer than component state
         */
        dispatch(setConnectWalletStep({ stepConnectWallet: undefined }));
        const [profileRes, _] = await userService.getPublicUserInfo({ address: account || '' });
        if (!profileRes) {
          if (profile) {
            setProfile(undefined);
          }
          setStepConnect(CONNECT_WALLET_STEP_LOGIN.ACCOUNT_NOT_EXIST);
        }
        /**
         * * Exist account
         */
        if (profileRes) {
          setStepConnect(CONNECT_WALLET_STEP_LOGIN.WELCOME_BACK);
          setProfile(profileRes);
          dispatch(userGetProfileSuccess(profileRes));
          return;
        }
      }
    } catch (error) {
    }
  };

  const handleCheckLogin = useCallback(async () => {
    if (!account && !library) return;
    if (chainId?.toString() !== NETWORK_CHAIN_ID) {
      setStepConnect(CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK);
      return;
    } else if (!logged && stepConnect === CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK) {
      // check khi user đang đăng nhập mà thay đổi account
      setStepConnect(CONNECT_WALLET_STEP_LOGIN.WELCOME_BACK);
    } else if (logged && stepConnect === CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK) {
      handleToggleModal(false);
      setStepConnect(CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET);
    }

    await handleValidateAccount();
  }, [account, library, chainId]);

  const handleSignIn = useCallback(async () => {
    setLoading('signIn');
    try {
      const signature = await handleSignWallet();
      if (signature) {
        const credentials = {
          walletAddress: account,
          signature,
        };

        const [data, error] = await userService.login(credentials);
        if (data && data?.accessToken) {
          if (account) localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, account);
          dispatch(loginSuccess(data));
          dispatch(
            userLoginSuccess({
              account,
              accessToken: data?.accessToken,
              userId: data?.userId,
            }),
          );
          const [profileRes, _] = await userService.getPublicUserInfo({ address: account || '' });
          if (profileRes) {
            dispatch(userGetProfileSuccess(profileRes));
          }
          /**
           * * Handle clear state when login success
           */
          setLoading(undefined);
          handleToggleModal(false);
          setStepConnect(CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET);
        }
      }
    } catch (error) {
    }
  }, [account, library, walletName]);

  const handleSignUp = useCallback(
    async (values: { email: string; username: string }) => {
      setLoading('signUp');
      try {
        const signature = await handleSignWallet();
        if (signature) {
          const credentials = {
            walletAddress: account,
            ...values,
          };
          const [data, error] = await userService.signup(credentials);
          if (data) {
            /**
             * * Back to login when sign up success
             */
            setLoading(undefined);
            setProfile(data?.account);
            await handleSignIn();
          }
        }
      } catch (error) {}
    },
    [account, library],
  );

  const renderStep = () => {
    switch (stepConnect) {
      case CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET:
        return (
          <SelectWallet
            onSignIn={handleCheckLogin}
            onWrongNetwork={() => {
              setStepConnect(CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK);
            }}
            onUnavailableMetamask={() =>
              setStepConnect(CONNECT_WALLET_STEP_LOGIN.WEB3_NOT_DETECTED)
            }
          />
        );

      case CONNECT_WALLET_STEP_LOGIN.WELCOME_BACK:
        return (
          <WelcomeBackUser
            username={get(profile, 'artist.username', '')}
            onSignIn={() => {
              handleSignIn();
            }}
            loading={Boolean(loading === 'signIn')}
          />
        );

      case CONNECT_WALLET_STEP_LOGIN.ACCOUNT_NOT_EXIST:
        return (
          <AccountNotExist
            address={account}
            onSignUp={() => setStepConnect(CONNECT_WALLET_STEP_LOGIN.CREATE_ACCOUNT)}
            onSwitchAccount={() => {
              setProfile(undefined);
              setStepConnect(CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET);
            }}
          />
        );

      case CONNECT_WALLET_STEP_LOGIN.CREATE_ACCOUNT:
        return (
          <CreateMadAccount address={account} onSignUp={handleSignUp} loading={Boolean(loading)} />
        );

      case CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK:
        return <WrongNetwork onDisconnect={handleDisconnect} />;

      case CONNECT_WALLET_STEP_LOGIN.VERIFY_ADDRESS:
        return <VerifyAddress />;

      case CONNECT_WALLET_STEP_LOGIN.WEB3_NOT_DETECTED:
        return (
          <Web3NotDetected
            onCancel={() => {
              setStepConnect(CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET);
            }}
          />
        );

      default:
        break;
    }
  };

  useEffect(() => {
    handleCheckLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleCheckLogin]);

  useEffect(() => {
    handleBindingStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleBindingStep]);

  return (
    <ModalCommon
      open={toggleModalConnectWallet as boolean}
      handleClose={handleClose}
      title={MODAL_TITLE[stepConnect] || ''}
      wrapperClassName={`lg:!w-[450px] md:!w-[390px] sm:!w-[calc(100%_-_2rem)] sm:px-6`}
      headerClassName="text--headline-xsmall !text-left !text-dark-on-surface"
      isCloseIcon={stepConnect === CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK ? false : true}
    >
      <div className="w-full">{renderStep()}</div>
    </ModalCommon>
  );
};

export default ConnectWallet;
