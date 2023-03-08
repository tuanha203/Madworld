import { applyMiddleware, createStore } from 'redux';

import { createWrapper } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middlewares = [thunk];

// if (process.env.NODE_ENV !== 'production') {
//     middlewares.push(createLogger())
// }

const makeConfiguredStore = (reducer: any) =>
  createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlewares)));

const makeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return makeConfiguredStore(rootReducer);
  } else {
    // we need it only on client side
    const { persistStore, persistReducer } = require('redux-persist');
    const storage = require('redux-persist/lib/storage').default;

    const persistConfig = {
      key: 'root', // make sure it does not clash with server keys
      storage,
      blacklist: ['modal', 'toast'],
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = makeConfiguredStore(persistedReducer);

    store.__persistor = persistStore(store); // Nasty hack

    return store;
  }
};

export const store = makeStore();

export const wrapper = createWrapper(() => {
  return store;
});
