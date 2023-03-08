import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

import { FilledButton, MadLogoWhite, TextButton } from 'components/common';
import { IconWallet } from 'components/common/iconography/IconBundle';

import { CONNECT_WALLET_STEP_LOGIN, modalActions, MODAL_TYPE } from 'store/constants/modal';

import AvatarDropdown from './AvatarDropdown';
import DrawerNav from './DrawerNav';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { IUserInitState } from 'store/reducers/user';
import { toastWarning } from 'store/actions/toast';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Logout'];

const theme = createTheme({
  components: {
    MuiMenu: {
      styleOverrides: {
        list: {
          backgroundColor: '#363642',
          color: 'white',
          padding: '1rem 2rem 1rem 1rem',
        },
      },
    },
  },
});

const Header = ({ connected, marketplace }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const user = useSelector((state) => (state as any).user);
  const walletAddressConnected = get(user, 'data.walletAddress', '');
  const userProfile = useSelector((state: { user: IUserInitState }) => state.user.profile);
  const { text, icon, button } = useSelector((state:any) => state.theme);
  const isConnected = get(user, 'data.walletAddress', '');
  const isVerifiedUser = get(user, 'profile.artist.isVerify', false);
  const isShowCreateButton = !isConnected || isVerifiedUser;
  const isUserFillFullInfo =
    get(userProfile, 'artist.email') && get(userProfile, 'artist.username');

  const isWhitelist =  get(userProfile, 'artist.isWhitelist')
  const handleToggleConnectWalletModal = (
    type: MODAL_TYPE,
    status: boolean,
    stepConnectWallet?: CONNECT_WALLET_STEP_LOGIN | '-1',
  ) => {
    dispatch({
      type: modalActions.MODAL_TOGGLE_MODAL,
      payload: {
        type,
        status,
        stepConnectWallet,
      },
    });
  };

  const handleCreateNFT = () => {
    if (!walletAddressConnected) {
      return handleToggleConnectWalletModal(
        MODAL_TYPE.CONNECT_WALLET,
        true,
        CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET,
      );
    }

    if (!isUserFillFullInfo) {
      return dispatch(toastWarning('Profile needs to be validated before being able to create NFT. Please go to edit profile to complete your profile. '))
    }
    
    router.push('/create');
  };

  useEffect(() => {
    /**
     * * Close drawer when route change
     */
    if (openDrawer) {
      setOpenDrawer(false);
    }
  }, [router.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <header className="header w-full bg-background-700 sticky top-0 left-0 z-[999]">
        <div className="hidden xl:block">
          <TopBar />
        </div>
        <div className="header-content container w-full mx-auto h-16 flex items-center justify-between bg-background-700 z-20 ">
          <div className={`ml-6 xl:mx-8 flex items-center gap-4 `}>
            <Link href="/">
              <a className="cursor-pointer">
                <MadLogoWhite />
              </a>
            </Link>
          </div>
          <div className="block xl:hidden">
            <IconButton onClick={() => setOpenDrawer(true)}>
              <MenuIcon className="text-white" fontSize="large" />
            </IconButton>
          </div>

          <NavBar />

          <div className="hidden xl:flex flex-row items-center gap-8">
            <div className="flex items-center gap-4 w-full">
              {isShowCreateButton && (
                <div>
                  <FilledButton
                    onClick={handleCreateNFT}
                    text="Create"
                    customClass="!py-[10px] !text--label-large !text-white"
                    style={button?.filled}
                  />
                </div>
              )}
              {!user?.data?.walletAddress ? (
                <TextButton
                  customClass="!text--label-large w-[175px]"
                  onClick={() =>
                    handleToggleConnectWalletModal(
                      MODAL_TYPE.CONNECT_WALLET,
                      true,
                      CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET,
                    )
                  }
                >
                  {' '}
                  <IconWallet color={icon?.color} />{' '}
                  <span className="text-secondary-60 whitespace-nowrap" style={text}>Connect Wallet</span>
                </TextButton>
              ) : (
                <AvatarDropdown user={user} key={user?.data?.walletAddress || ''} />
              )}
            </div>
          </div>
        </div>
        <div className="hidden sm:block md:block">
          <DrawerNav
            isOpenNav={openDrawer}
            user={user}
            isWhitelist={isWhitelist}
            onCloseNav={() => setOpenDrawer(false)}
            onCreateNft={handleCreateNFT}
            onConnectWallet={() => {
              handleToggleConnectWalletModal(
                MODAL_TYPE.CONNECT_WALLET,
                true,
                CONNECT_WALLET_STEP_LOGIN.SELECT_WALLET,
              );
            }}
          />
        </div>
      </header>
    </ThemeProvider>
  );
};

Header.defaultProps = {
  connected: false,
  marketplace: false,
};

export default Header;
