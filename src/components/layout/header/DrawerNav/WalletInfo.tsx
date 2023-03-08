import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useWeb3React } from '@web3-react/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { SUPPORTED_WALLETS } from 'blockchain/connectors';
import { IconCopy } from 'components/common/iconography/IconBundle';
import { setConnectWalletStep } from 'store/actions/modal';
import { userLogoutWallet } from 'store/actions/user';
import { CONNECT_WALLET_STEP_LOGIN } from 'store/constants/modal';
import { ISystemState } from 'store/reducers/system';

import { formatNumber } from 'utils/formatNumber';
import { shortenAddress } from 'utils/func';

import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { TextButton, TonalButton } from 'components/common';
import Link from 'next/link';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toastSuccess } from 'store/actions/toast';
import { toastMsgActons } from 'store/constants/toastMsg';
import BalanceInfo from '../BalanceInfo';

interface IWalletInfoProps {
  user: any;
  onCloseNav: () => void;
  isWhitelist: boolean;
}

interface IUserBalances {
  bnbBalance: string;
  ethBalance: string;
  wethBalance: string;
  umadBalance: string;
  ethUsdBalance: string;
  wethUsdBalance: string;
}

const WalletInfo: FC<IWalletInfoProps> = (props) => {
  const { user, isWhitelist, onCloseNav } = props;

  const [walletName, setWalletName] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { deactivate, connector } = useWeb3React();
  const { text, icon, button } = useSelector((state:any) => state.theme);
  const { priceNativeCoinUsd } = useSelector((state: { system: ISystemState }) => state.system);
  const [userBalances, setUserBalances] = useState<IUserBalances>({
    bnbBalance: '0',
    ethBalance: '0',
    wethBalance: '0',
    umadBalance: '0',
    ethUsdBalance: '0',
    wethUsdBalance: '0',
  });

  const userData = get(user, 'data');

  const formatNearlyNumber = (number: number) => {
    if (number > 0 && number < 1e-8) {
      return `~0.00000001`;
    }

    return formatNumber(number, 8).toString();
  };

  const calcAndFormatGetBalance = useCallback(() => {
    const numberNativeBalance = get(userData, 'bnbBalance', 0);

    const numberUmadBalance = get(userData, 'umadBalance', 0);

    const numberWethBalance = get(userData, 'wethBalance', 0);

    const ethUsdBalance =
      numberNativeBalance > 0
        ? formatNumber((numberNativeBalance as number) * priceNativeCoinUsd, 2).toString()
        : '0';

    const wethUsdBalance =
      numberWethBalance > 0
        ? formatNumber((numberWethBalance as number) * priceNativeCoinUsd, 2).toString()
        : '0';

    const nativeCoinBalance = formatNearlyNumber(numberNativeBalance);

    const umadBalance = formatNearlyNumber(numberUmadBalance);

    const wethBalance = formatNearlyNumber(numberWethBalance);

    setUserBalances({
      bnbBalance: nativeCoinBalance.toString(),
      ethBalance: nativeCoinBalance.toString(),
      wethBalance,
      umadBalance,
      ethUsdBalance,
      wethUsdBalance,
    });
  }, [userData]);

  const handleLogout = () => {
    deactivate();
    dispatch(userLogoutWallet());
    dispatch(setConnectWalletStep({ stepConnectWallet: CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET }));
    onCloseNav();

    if (router.asPath === '/create/erc-721' || router.asPath === '/create') {
      router.push('/marketplace');
    }
  };
  useEffect(() => {
    if (connector instanceof WalletConnectConnector) {
      setWalletName('WalletConnect');
    } else {
      setWalletName('Metamask');
    }
  }, [connector]);

  useEffect(() => {
    calcAndFormatGetBalance();
  }, [calcAndFormatGetBalance]);

  const clickCopy = () => {
    dispatch(toastSuccess('Link copied!'));
    setTimeout(() => {
      dispatch({ type: toastMsgActons.CLOSE });
    }, 3000);
  };

  return (
    <div className="mb-4">
      <div className="text--headline-medium text-white mb-8">Wallet Information</div>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <figure className="w-[20px]">
            <img src={SUPPORTED_WALLETS[walletName === 'Metamask' ? 0 : 1].icon} alt={walletName} />
          </figure>
          <span className="text--label-large text-white">{walletName} connected</span>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <CopyToClipboard text={get(userData, 'walletAddress', '') as string} onCopy={clickCopy}>
            <div className="cursor-pointer" onClick={() => {}}>
              <Tooltip title="Copy" placement="top">
                <span>
                  <IconCopy fontSize="small" style={icon} />
                </span>
              </Tooltip>
            </div>
          </CopyToClipboard>
          <div className="text-primary-60" style={text}>
            {shortenAddress(get(userData, 'walletAddress', ''), 2, 4)}
          </div>
        </Stack>
      </Stack>
      <BalanceInfo userBalances={userBalances} />
      <Divider />
      {isWhitelist && (
        <div className="mt-4">
          <Link
            href={{
              pathname: `/import-collection`,
            }}
          >
            <TonalButton
              onClick={onCloseNav}
              text="Import an existing smart contract"
              customClass={`text--label-large w-full`}
              sx={{background: `${button?.default?.background} !important`}}
            />
          </Link>
        </div>
      )}
      <div className="mt-3">
        <Link
          href={{
            pathname: `/artist/${userData.walletAddress}`,
            query: { edit: true },
          }}
        >
          <TextButton
            text=""
            customClass="!text-primary-60 justify-start w-full"
            icon={<PersonOutlineIcon className="text-primary-60" style={icon} />}
            onClick={onCloseNav}
          >
            <a className="w-full text-left" style={text}>Edit Profile</a>
          </TextButton>
        </Link>
      </div>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        className="text--label-large cursor-pointer py-6"
        onClick={handleLogout}
      >
        <LogoutIcon className="text-secondary-60" fontSize="small" style={icon} />
        <span className="text-secondary-60 whitespace-nowrap" style={text}>Logout</span>
      </Stack>
      <Divider />
    </div>
  );
};

export default WalletInfo;
