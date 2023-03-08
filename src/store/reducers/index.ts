import { combineReducers } from 'redux';
import userReducer from './user';
import loginApiReducer from './login';
import { userActions } from '../constants/user';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import toastMsgReducer from './toastMsg';
import modalReducer from './modal';
import systemReducer from './system';
import forceUpdatingReducer from './forceUpdating';
import utilsReducer from './utils';
import themeReducer from './theme';

const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['previewAvatar'],
};

const loginPersistConfig = {
  key: 'login',
  storage,
  blacklist: [],
};

const appReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  login: persistReducer(loginPersistConfig, loginApiReducer),
  toast: toastMsgReducer,
  modal: modalReducer,
  system: systemReducer,
  forceUpdating: forceUpdatingReducer,
  utils: utilsReducer,
  theme: themeReducer
});

type actionType = {
  type: string;
  payload: any;
};
const rootReducer = (state: any, action: actionType) => {
  if (action.type === (userActions as any).USER_LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
