import { userActions } from 'store/constants/user';
import { loginApiActions } from '../constants/login';

export interface ILoginState {
  loginData?: {
    accessToken?: string;
    tokenType?: string;
    userId?: string;
  };
  unlockedStatus?: boolean;
  error?: any;
  loading?: boolean;

  connectWallet?: boolean;
  account?: string;
  connectedNetwork?: boolean;
  walletName: string;
}

const initialState: ILoginState = {
  loginData: {},
  loading: false,
  unlockedStatus: false,
  error: '',
  // New logic connect wallet
  account: '',
  connectWallet: false,
  connectedNetwork: false,
  walletName: '',
};

const loginApiReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case loginApiActions.LOGIN_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }

    case loginApiActions.LOGIN_SUCCESS: {
      return {
        ...state,
        loginData: action.payload,
        loading: false,
      };
    }

    case loginApiActions.LOGIN_FAILURE: {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    }

    case loginApiActions.SET_CONNECT_WALLET: {
      return {
        ...state,
        connectWallet: action.payload,
      };
    }
    case loginApiActions.SET_CONNECT_NETWORK: {
      return {
        ...state,
        connectedNetwork: action.payload,
      };
    }
    case loginApiActions.SET_ACCOUNT: {
      return {
        ...state,
        account: action.payload,
      };
    }

    case userActions.USER_LOGOUT_WALLET: {
      return {
        ...initialState,
      };
    }

    case loginApiActions.GET_UNLOCK_STATUS: {
      return {
        ...state,
        unlockedStatus: action.payload.unlockedStatus,
      };
    }

    case loginApiActions.SET_WALLET_NAME: {
      return {
        ...state,
        walletName: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default loginApiReducer;
