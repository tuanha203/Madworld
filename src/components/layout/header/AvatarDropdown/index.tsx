import { FC, useState, useRef, MutableRefObject, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Avatar } from 'components/modules';
import { get } from 'lodash';
import { useUpdateBalance } from 'hooks/useUpdateBalance';

import Notification from './Notification';
import AvatarPopover from './AvatarPopover';
import { useSelector } from 'react-redux';
interface IAvatarDropdownProps {
  user: any;
}

const AvatarDropdown: FC<IAvatarDropdownProps> = (props) => {
  const { user } = props;

  const avatarDropdownAnchorElRef = useRef<HTMLDivElement>(null);

  const [toggleAvatarDropdown, setToggleAvatarDropdown] = useState(null);
  const { updateBalance } = useUpdateBalance();
  const { icon } = useSelector((state:any) => state.theme);

  useEffect(() => {
    if (toggleAvatarDropdown) {
      updateBalance();
    }
  }, [toggleAvatarDropdown]);

  const handleClosePopover = () => {
    setToggleAvatarDropdown(null);
  };

  const imgProfile = get(user, 'profile.artist.avatarImg');
  const isVerify = get(user, 'profile.artist.isVerify');
  return (
    <div className="connected flex items-center gap-8">
      <Box sx={{ flexGrow: 0 }}>
        <div
          ref={(ref) =>
            ((avatarDropdownAnchorElRef as MutableRefObject<HTMLDivElement | null>).current = ref)
          }
        >
          <IconButton
            onClick={(event: any) => setToggleAvatarDropdown(event.currentTarget)}
            sx={{ p: 0 }}
          >
            <Avatar verified={isVerify} styleVerified={icon} mode="larger" src={imgProfile} size="36" />
          </IconButton>
        </div>
      </Box>

      <Notification />

      <AvatarPopover
        user={user}
        ref={avatarDropdownAnchorElRef}
        open={Boolean(toggleAvatarDropdown)}
        onClose={handleClosePopover}
      />
    </div>
  );
};

export default AvatarDropdown;
