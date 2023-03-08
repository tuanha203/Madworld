export const dec2hex = (number: string | number): string => `0x${(+number).toString(16)}`;

export const switchNetwork = (library: any, chainId: string, cb?: () => void): any => {
  const { ethereum } = window as any;
  try {
    return library
      ?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: dec2hex(chainId) }],
      })
      .then(() => {
        if (typeof cb === 'function') {
          cb();
        }
      })
      .catch((err: any) => {
        console.log('switch network:', err);
      });
  } catch (err: any) {
    console.error('switch network error', err);
  }
};
