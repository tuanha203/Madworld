import { userActions } from 'store/constants/user';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { ILoginState } from 'store/reducers/login';
import { getERC20AmountBalance } from 'blockchain/utils';
import { convertBigNumberValueToNumber } from 'blockchain/ether';
import { ERC20_ADDRESS } from 'constants/index';
import { DECIMALS } from 'constants/app';
import { ethers } from 'ethers';
import { RPC_CHAIN } from 'constants/chain';

export const useUpdateBalance = () => {
  const { library, account, chainId } = useWeb3React();
  const [refresh, setRefresh] = useState<number>(0);
  const accessToken = useSelector(
    (state: { login: ILoginState }) => state.login.loginData?.accessToken,
  );
  const dispatch = useDispatch();

  const handleGetBalance = useCallback(async () => {
    if (!accessToken || !library || !account) return;
    try {
      
      const provider = ethers.getDefaultProvider(RPC_CHAIN[chainId as any]);

      const temptNativeCoinBalance = await provider.getBalance(account);

      const temptUamdBalance = await getERC20AmountBalance(ERC20_ADDRESS.umad, account as string);

      const temptWethBalance = await getERC20AmountBalance(ERC20_ADDRESS.weth, account as string);

      const numberNativeBalance = convertBigNumberValueToNumber(
        temptNativeCoinBalance,
        DECIMALS.ETH_DECIMALS,
      );

      const numberWethBalance = temptWethBalance[0]
        ? convertBigNumberValueToNumber(temptWethBalance[0], DECIMALS.WETH_DECIMALS)
        : 0;

      const numberUmadBalance = temptUamdBalance[0]
        ? convertBigNumberValueToNumber(temptUamdBalance[0], DECIMALS.XTR_DECIMAL)
        : 0;

      dispatch({
        type: userActions.USER_UPDATE_BALANCE,
        payload: {
          bnbBalance: numberNativeBalance,
          ethBalance: numberNativeBalance,
          wethBalance: numberWethBalance,
          umadBalance: numberUmadBalance,
        },
      });
    } catch (error) {
      console.log('Error getBalance', error);
    }
  }, [library, account, accessToken, chainId]);

  useEffect(() => {
    if (refresh) {
      handleGetBalance();
    }
  }, [refresh]);
  return {
    updateBalance: () => setRefresh(Date.now()),
  };
};
