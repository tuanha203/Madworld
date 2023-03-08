import { FC, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import notificationService from 'service/notificationService';
import { toastError } from 'store/actions/toast';
import { EventSocket } from 'constants/text';
import socket from 'configsocket';

import NotificationPopover from './NotificationPopover';

interface INotificationProps {}

const Notification: FC<INotificationProps> = (props) => {
  const dispatch = useDispatch();
  const logged = useSelector((state) => (state as any)?.user?.data?.walletAddress);
  const avatarDropdownAnchorElRef = useRef<HTMLDivElement>(null);
  const [toggleNotificationDropdown, setToggleNotificationDropdown] = useState(null);
  const [countNotifications, setCountNotifications] = useState(0);
  const { icon } = useSelector((state:any) => state.theme);

  const handleOpen = async (event: any) => {
    setToggleNotificationDropdown(event.currentTarget);
  };

  const handleClose = () => {
    setToggleNotificationDropdown(null);
  };

  const getCountNotifications = async () => {
    try {
      if (!logged) return;
      const [response, errors] = await notificationService.getCountNotifications();
      if (errors) throw errors;
      setCountNotifications(get(response, 'notifications', 0));
    } catch (error) {
      /**
       * * TODO: toast error message
       */
      // dispatch(toastError('Something went wrong'));
    }
  };

  useEffect(() => {
    getCountNotifications();
  }, [logged]);

  useEffect(() => {
    if (socket) {
      socket.on(EventSocket.NOTIFICATION, (res) => {
        getCountNotifications();
      });
    }
  }, [socket]);

  return (
    <>
      <div
        ref={(ref) =>
          ((avatarDropdownAnchorElRef as MutableRefObject<HTMLDivElement | null>).current = ref)
        }
        className="notification flex flex-row items-center mr-2"
      >
        <IconButton onClick={handleOpen} sx={{ p: 0 }}>
          <NotificationsNoneOutlinedIcon style={icon} className="text-primary-60 " />
        </IconButton>
        <div
          className={`w-6 h-6 flex items-center justify-center bg-primary-dark text-white rounded-full text--label-small ${
            countNotifications === 0 ? 'invisible' : ''
          }`}
        >
          {countNotifications}
        </div>
      </div>

      <NotificationPopover
        ref={avatarDropdownAnchorElRef}
        open={Boolean(toggleNotificationDropdown)}
        onClose={handleClose}
        onResetCountNotifications={() => {
          setCountNotifications(0);
          getCountNotifications();
        }}
      />
    </>
  );
};

export default Notification;
