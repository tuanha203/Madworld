import { loginApiActions } from '../constants/login';

import userService from 'service/userService';

export const loginApi = (credentials: any) => {
  return async (dispatch: any) => {
    dispatch({ type: loginApiActions.LOGIN_LOADING });

    const [data, error] = await userService.login({
      ...credentials,
      walletAddress: credentials?.walletAddress?.toLowerCase(),
    });

    if (data && data?.access_token) {
      localStorage.setItem('accessToken', data?.access_token);
      localStorage.setItem('userId', data?.userId);

      dispatch({
        type: loginApiActions.LOGIN_SUCCESS,
        payload: data,
      });
      return;
    }

    if (error) {
      dispatch({
        type: loginApiActions.LOGIN_FAILURE,
        payload: error.response.status,
      });
    }
  };
};

export const setConnectWallet = (payload: any) => {
  return (dispatch: any) => {
    dispatch({
      type: loginApiActions.SET_CONNECT_WALLET,
      payload,
    });
  };
};

export const setConnectNetwork = (payload: any) => {
  return (dispatch: any) => {
    dispatch({
      type: loginApiActions.SET_CONNECT_NETWORK,
      payload,
    });
  };
};

export const setAccount = (payload: any) => {
  return (dispatch: any) => {
    dispatch({
      type: loginApiActions.SET_ACCOUNT,
      payload,
    });
  };
};

export const setWalletName = (payload: string) => {
  return {
    type: loginApiActions.SET_WALLET_NAME,
    payload,
  };
};

export const loginSuccess = (payload: any) => {
  return (dispatch: any) => {
    dispatch({
      type: loginApiActions.LOGIN_SUCCESS,
      payload,
    });
  };
};
