import { userActions } from '../constants/user';

export interface IUserInitState {
  data: {
    walletAddress: string;
    bnbBalance: string;
    umadBalance: string;
    ethBalance: string;
    usdtBalance: string;
    wethBalance: string;
    //Usd balance
    bnbUsdBalance: string;
    umaUsdBalance: string;
    ethUsdBalance: string;
    wethUsdBalance: string;
  };
  profile: Partial<IUserProfile>;
}

export interface IUserProfileArtist {
  avatarImg: string;
  coverImg: string;
  createdAt: string;
  discordUrl: string;
  email: string;
  facebookUrl: string;
  id: number;
  twitterUrl: string;
  updatedAt: string;
  username: string;
  walletAddress: string;
  telegramUrl: string;
  websiteUrl: string;
  description?: string;
  isVerify?: boolean;
}

export interface IUserProfile {
  artist?: IUserProfileArtist;
  asset?: number;
  collections?: number | string;
  floorPrice?: number;
  highestSale?: number;
  likes?: number;
  owners?: number;
  pricePercent?: string;
  volumeTraded?: string | number;
  liked?: boolean;
  follows?: number;
}

const initialState: IUserInitState = {
  data: {
    walletAddress: '',
    bnbBalance: '',
    wethBalance: '',
    umadBalance: '',
    ethBalance: '',
    usdtBalance: '',
    bnbUsdBalance: '0',
    umaUsdBalance: '0',
    ethUsdBalance: '0',
    wethUsdBalance: '0',
  },
  profile: {},
};

const userReducer = (state: IUserInitState = initialState, action: any) => {
  switch (action.type) {
    case userActions.USER_UPDATE_BALANCE: {
      // const { umadBalance, bnbBalance, ethBalance, wethBalance, ethUsdBalance, wethUsdBalance } =
      //   action.payload;
      const temptData = {
        ...state.data,
        ...action.payload,
      };

      return {
        ...state,
        data: temptData,
      };
    }

    case userActions.USER_GET_PROFILE_SUCCESS: {
      return {
        ...state,
        profile: action.payload,
      };
    }
    case userActions.USER_LOGIN_SUCCESS: {
      return {
        ...state,
        data: {
          ...state.data,
          walletAddress: action.payload,
        },
      };
    }
    case userActions.USER_LOGOUT_WALLET: {
      return {
        ...initialState,
      };
    }

    default: {
      return state;
    }
  }
};

export default userReducer;
