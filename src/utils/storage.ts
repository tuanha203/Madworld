export enum STORAGE_KEYS {
  ACCOUNT = 'account',
  ACCESS_TOKEN = 'accessToken',
  WALLET_ADDRESS = 'walletAddress',
  WALLET_CONNECT = 'walletconnect',
  SIGNATURE = 'signature',
  USER_ID = 'userId',
}

const StorageUtils = {
  setItem: (key: string, value: any) => {
    localStorage.setItem(key, value);
  },
  setSessionStorageItem: (key: string, value: any) => {
    sessionStorage.setItem(key, value);
  },
  getItem: (key: string) => {
    return localStorage.getItem(key);
  },
  getSessionStorageItem: (key: string) => {
    return sessionStorage.getItem(key);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  removeSessionStorageItem: (key: string) => {
    sessionStorage.removeItem(key);
  },
  hasOwnProperty: (key: string): boolean => {
    return localStorage.hasOwnProperty(key);
  },
};

export default StorageUtils;
