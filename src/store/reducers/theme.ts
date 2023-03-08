import { themeActions } from 'store/constants/theme';
//
export interface IUtilsState {
  box: any;
  text: any;
  icon: any;
  media: {
    logos?: Array<{ index: number; url: string; description?: string; style?: any }>;
    links?: Array<{ index: number; url: string; name?: string; description?: string }>;
  };
  avatar: any;
  button: {
    outline?: any;
    default?: any;
  };
  background: any;
}

export const initialStateTheme: IUtilsState = {
  box: null,
  text: null,
  icon: null,
  media: {},
  avatar: null,
  button: {},
  background: null,
};

const themeReducer = (state = initialStateTheme, action: any) => {
  switch (action.type) {
    case themeActions.TOGGLE_THEME: {
      return {
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default themeReducer;
