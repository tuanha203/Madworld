import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Popover from '@mui/material/Popover';
import { useWeb3React } from '@web3-react/core';
import { Divider, OutlinedButton, TextButton, TonalButton } from 'components/common';
import { IconEth, IconMadOutlined, IconWeth } from 'components/common/iconography/IconBundle';
import { Avatar } from 'components/modules';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  forwardRef,
  memo,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setConnectWalletStep } from 'store/actions/modal';
import { userLogoutWallet } from 'store/actions/user';
import { CONNECT_WALLET_STEP_LOGIN } from 'store/constants/modal';
import { ILoginState } from 'store/reducers/login';
import { ISystemState } from 'store/reducers/system';
import { formatNumber } from 'utils/formatNumber';
import { FullScreenDialog } from 'components/modules/dialogs';
import ImportCollection from '../../../templates/import-collection';
import { IconEthSVG } from 'components/common/iconography/iconsComponentSVG';

interface IAvatarPopoverProps {
  open: boolean;
  user?: any;
  onClose: () => void;
}

const AvatarPopover = forwardRef<HTMLDivElement | null, PropsWithChildren<IAvatarPopoverProps>>(
  (props, ref) => {
    const { open, user, onClose } = props;
    const { deactivate } = useWeb3React();
    const dispatch = useDispatch();
    const router = useRouter();
    const { asPath } = router;
    const userData = get(user, 'data');

    const { artist } = useSelector((state) => (state as any)?.user?.profile);
    const { priceNativeCoinUsd } = useSelector((state: { system: ISystemState }) => state.system);
    const { text, icon, button } = useSelector((state: any) => state.theme);
    const [userBalances, setUserBalances] = useState<{ [x: string]: string }>({
      ethBalance: '0',
      wethBalance: '0',
      umadBalance: '0',
      ethUsdBalance: '0',
      wethUsdBalance: '0',
    });

    const handleLogout = () => {
      deactivate();
      dispatch(userLogoutWallet());
      dispatch(
        setConnectWalletStep({ stepConnectWallet: CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET }),
      );

      if (asPath === '/create/erc-721' || asPath === '/create') {
        router.push('/marketplace');
      }
    };

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

    useEffect(() => {
      calcAndFormatGetBalance();
    }, [calcAndFormatGetBalance]);

    const imgProfile = get(user, 'profile.artist.avatarImg');

    return (
      <>
        <Popover
          anchorEl={(ref as MutableRefObject<HTMLDivElement | null>).current}
          open={open}
          onClose={onClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            style: {
              backgroundColor: 'transparent',
              borderRadius: 8,
            },
          }}
        >
          <div className="w-[440px] flex flex-col py-6 px-16 bg-background-dark-600 relative">
            <div className="flex gap-4 mb-6">
              <Avatar
                mode="larger"
                verified={artist?.isVerify}
                styleVerified={icon}
                src={imgProfile}
                size="medium"
              />
              <div>
                <div className="max-w-[250px] truncate text-white text--subtitle">
                  {artist?.username ||
                    (get(userData, 'walletAddress', '') &&
                      get(userData, 'walletAddress', '').slice(0, 6))}
                </div>

                <div
                  style={text}
                  className="text-primary-90 text--title-small cursor-pointer"
                  onClick={onClose}
                >
                  <Link
                    href={{
                      pathname: `/artist/${userData.walletAddress}`,
                    }}
                    passHref
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-white">
              <div className="text--title-small">Connected</div>
              <div className="flex flex-col gap-y-4 my-4">
                <div className="flex items-center">
                  <IconEthSVG style={{ color: 'white' }} />
                  <div className="ml-2">
                    <div className="text--body-small text-medium-emphasis">Ether</div>
                    <div className="text--subtitle">
                      {userBalances.ethBalance} ETH{' '}
                      <span className="text--body-small text-medium-emphasis">
                        ${userBalances.ethUsdBalance}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <IconEthSVG style={icon} />
                  <div className="ml-2">
                    <div className="text--body-small text-medium-emphasis">Wrapped Ether</div>
                    <div className="text--subtitle">
                      {userBalances.wethBalance} WETH{' '}
                      <span className="text--body-small text-medium-emphasis">
                        ${userBalances.wethUsdBalance}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <IconMadOutlined size={'w-[32px] w-6 h-[100%]'} />
                  <div className="ml-2">
                    <div className="text--body-small text-medium-emphasis">MADworld</div>
                    <div className="text--subtitle">{userBalances.umadBalance} UMAD</div>
                  </div>
                </div>
              </div>
            </div>
            <Divider customClass="my-4" />
            {artist?.isWhitelist && (
              <Link
                href={{
                  pathname: `/import-collection`,
                }}
              >
                <TonalButton
                  onClick={() => {
                    onClose();
                  }}
                  text="Import an existing smart contract"
                  customClass={`text--label-large mb-4`}
                  sx={{ background: `${button?.default?.background} !important` }}
                />
              </Link>
            )}
            <div className="mb-4">
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
                  onClick={onClose}
                >
                  <a className="w-full text-left" style={text}>
                    Edit Profile
                  </a>
                </TextButton>
              </Link>
            </div>
            <OutlinedButton
              style={button?.outline}
              text="Sign out"
              customClass={button?.outline || '!text-primary-60'}
              onClick={handleLogout}
            />
          </div>
        </Popover>
      </>
    );
  },
);

export default memo(AvatarPopover);
