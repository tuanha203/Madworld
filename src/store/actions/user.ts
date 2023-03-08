import StorageUtils, { STORAGE_KEYS } from 'utils/storage';
import { userActions } from '../constants/user';

export const userLogoutWallet = () => {
  StorageUtils.removeItem('persist:login');
  StorageUtils.removeItem('AddressServiceFee');
  StorageUtils.removeItem('networkType');
  StorageUtils.removeItem(STORAGE_KEYS.USER_ID);
  StorageUtils.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  StorageUtils.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
  StorageUtils.removeItem(STORAGE_KEYS.WALLET_CONNECT);
  localStorage.clear();

  return (dispatch: any) => {
    dispatch({
      type: userActions.USER_LOGOUT_WALLET,
    });
  };
};

export const userChangeAccount = () => {
  StorageUtils.removeItem('persist:login');
  StorageUtils.removeItem('AddressServiceFee');
  StorageUtils.removeItem(STORAGE_KEYS.USER_ID);
  StorageUtils.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  StorageUtils.removeItem(STORAGE_KEYS.WALLET_ADDRESS);

  return (dispatch: any) => {
    dispatch({
      type: userActions.USER_LOGOUT_WALLET,
    });
  };
};

export const userLoginSuccess = (payload: {
  userId?: string;
  accessToken?: string;
  account?: string | null;
}) => {
  StorageUtils.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.accessToken);
  StorageUtils.setItem(STORAGE_KEYS.USER_ID, payload.userId);
  return (dispatch: any) => {
    dispatch({
      type: userActions.USER_LOGIN_SUCCESS,
      payload: payload.account,
    });
  };
};

export const userGetProfileSuccess = (payload: any) => {
  return (dispatch: any) => {
    dispatch({
      type: userActions.USER_GET_PROFILE_SUCCESS,
      payload,
    });
  };
};
