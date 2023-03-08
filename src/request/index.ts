import axios from 'axios';
import StorageUtils, { STORAGE_KEYS } from 'utils/storage';
import { store } from 'store/configureStore';

import { toastError } from 'store/actions/toast';
import { userActions } from 'store/constants/user';
import { CONNECT_WALLET_STEP_LOGIN, modalActions, MODAL_TYPE } from 'store/constants/modal';
import { ACCOUNT_NO_EXISTING } from 'constants/message';

class Request {
  instance;
  constructor() {
    const instance = axios.create({
      baseURL: 'http://localhost:3100/api/v1',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    instance.interceptors.request.use(
      async (config) => {
        const accessToken = StorageUtils.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const userLoggedIn = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS) as any;
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
          config.headers['wallet-address'] = userLoggedIn;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      (next) => {
        return Promise.resolve(next);
      },
      (error) => {
        const responseStatus = error.response?.status;
        const message = error.response?.data?.message;
        const isTokenExpire = (responseStatus === 401);
        if (isTokenExpire) {
          if (StorageUtils.hasOwnProperty('accessToken')) {
            store.dispatch(toastError('Your session has expired, please sign in again.'));
          } else {
            store.dispatch({
              type: modalActions.MODAL_TOGGLE_MODAL,
              payload: {
                type: MODAL_TYPE.CONNECT_WALLET,
                status: true,
                stepConnectWallet: CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET,
              },
            });
          }
          StorageUtils.removeItem('persist:login');
          StorageUtils.removeItem('accessToken');
          StorageUtils.removeItem('AddressServiceFee');
          StorageUtils.removeItem('networkType');
          StorageUtils.removeItem(STORAGE_KEYS.USER_ID);
          StorageUtils.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          StorageUtils.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
          StorageUtils.removeItem(STORAGE_KEYS.WALLET_CONNECT);
          store.dispatch({
            type: userActions.USER_LOGOUT_WALLET,
          });
        }
        return Promise.reject(error);
      },
    );

    this.instance = instance;
  }

  get = (url: string, params?: any) => {
    return this.instance.get(url, { params });
  };

  post = (url: string, data: any) => {
    return this.instance.post(url, data);
  };

  put = (url: string, data?: any) => {
    return this.instance.put(url, data);
  };

  patch = (url: string, data?: any) => {
    return this.instance.patch(url, data);
  };

  delete = (url: string) => {
    return this.instance.delete(url);
  };
}

export default new Request();
