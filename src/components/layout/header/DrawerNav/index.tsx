import { FC } from 'react';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';

import SearchBarHeader from 'components/modules/search-bar-header';
import { ClosingIcon, IconWallet } from 'components/common/iconography/IconBundle';
import { OutlinedButton, FilledButton } from 'components/common';

import TopBar from '../TopBar';
import NavBar from '../NavBar';

import ProfileInfo from './ProfileInfo';
import WalletInfo from './WalletInfo';
import { get } from 'lodash';
import { useSelector } from 'react-redux';

interface IDrawerNavProps {
  isOpenNav: boolean;
  user: any;
  isWhitelist: boolean;
  onCloseNav: () => void;
  onCreateNft: () => void;
  onConnectWallet: () => void;
}

const DrawerNav: FC<IDrawerNavProps> = (props) => {
  const { isOpenNav, user, onCloseNav, onCreateNft, onConnectWallet, isWhitelist } = props;
  const isConnected = get(user, 'data.walletAddress', '');
  const { text, button, icon } = useSelector((state: any) => state.theme);
  const isVerifiedUser = get(user, 'profile.artist.isVerify', false);
  const isShowCreateButton = !isConnected || isVerifiedUser;

  const isSigned = user?.data?.walletAddress;

  const renderUserProfile = () => {
    if (isSigned) {
      return (
        <>
          <ProfileInfo user={user} onCloseNav={onCloseNav} />
          <WalletInfo user={user} isWhitelist={isWhitelist} onCloseNav={onCloseNav} />
        </>
      );
    }

    return (
      <div>
        <Stack spacing={2} mb={3}>
          <div>
            <OutlinedButton
              customClass="!text--label-large"
              text={
                <>
                  <IconWallet />
                  <span className="text-secondary-60 whitespace-nowrap" style={text}>
                    Connect Wallet
                  </span>
                </>
              }
              onClick={onConnectWallet}
            />
          </div>
        </Stack>
      </div>
    );
  };

  return (
    <Drawer
      anchor="left"
      open={isOpenNav}
      variant="temporary"
      onClose={onCloseNav}
      className="header drawerNav"
    >
      <div className="absolute right-6 top-5 cursor-pointer">
        <ClosingIcon className="text-4xl" onClick={onCloseNav} style={icon} />
      </div>
      <Stack
        spacing={2}
        className={`content mt-[76px] px-4 overflow-y-auto ${isSigned ? '' : '!h-auto'}`}
      >
        <TopBar />
        <div>
          {renderUserProfile()}
          {isShowCreateButton && (
            <div className="bg-background-asset-detail z-10 py-5 px-9 fixed w-full left-0 bottom-0 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
              <FilledButton
                fullWidth
                onClick={onCreateNft}
                text="Create"
                customClass="!py-[10px] !text--label-large !text-white"
                style={button?.default}
              />
            </div>
          )}
        </div>

        <NavBar isDrawer={true} handleCloseSearchResult={onCloseNav} />
      </Stack>
    </Drawer>
  );
};

export default DrawerNav;
