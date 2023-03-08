import { FC } from 'react';
import Stack from '@mui/material/Stack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import { Avatar } from 'components/modules';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import get from 'lodash/get';

interface IProfileInfoProps {
  user: any;
  onCloseNav: () => void;
}

const ProfileInfo: FC<IProfileInfoProps> = (props) => {
  const { user, onCloseNav } = props;
  const { artist } = useSelector((state) => (state as any)?.user?.profile);
  const { text, icon } = useSelector((state:any) => state.theme);
  const userData = get(user, 'data');

  const username =
    artist?.username ||
    (get(userData, 'walletAddress', '') && get(userData, 'walletAddress', '').slice(0, 6));

  const imgProfile = get(user, 'profile.artist.avatarImg');

  return (
    <Stack spacing={1.375} className="mb-16">
      <div className="text--headline-medium text-white">Profile Information</div>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar mode="larger" verified={artist?.isVerify} styleVerified={icon} src={imgProfile} size="36" />
          <OverflowTooltip title={username} className="max-w-[120px]">
            <div className="text--title-medium text-white">{username} </div>
          </OverflowTooltip>
        </Stack>

        <Link
          href={{
            pathname: `/artist/${userData.walletAddress}`,
          }}
          passHref
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={() => onCloseNav()}
            className="text--label-large cursor-pointer"
          >
            <PersonOutlineIcon className="text-secondary-60" style={icon} />
            <span className="text-secondary-60 whitespace-nowrap" style={text}>Go to profile</span>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

export default ProfileInfo;
