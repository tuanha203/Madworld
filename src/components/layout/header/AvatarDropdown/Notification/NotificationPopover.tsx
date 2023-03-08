import {
  forwardRef,
  memo,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment';

import notificationService from 'service/notificationService';
import { toastError } from 'store/actions/toast';
import { ClosingIcon } from 'components/common/iconography/IconBundle';
import CircularProgressIndicator from 'components/common/progress-indicator';
import { OutlinedButton } from 'components/common';

import { EventSocket } from 'constants/text';
import socket from 'configsocket';

import { INotificationData, INotificationItem, INotificationRecords } from './typings';
import NotificationItem from './NotificationItem';

// import { TRANSACTION_NOTIFICATION } from 'constants/app';

interface INotificationPopoverProps {
  open: boolean;
  onClose: () => void;
  onResetCountNotifications: () => void;
}

const defaultNotificationData = {
  items: [],
  meta: {
    currentPage: 1,
    totalItem: 0,
    totalPages: 0,
    itemCount: 0,
    itemsPerPage: 0,
  },
};

const NotificationPopover = forwardRef<
  HTMLDivElement | null,
  PropsWithChildren<INotificationPopoverProps>
>((props, ref) => {
  const { open, onClose, onResetCountNotifications } = props;
  const dispatch = useDispatch();
  const userState = useSelector((state: { user: any }) => state.user);
  const [currentNotificationId, setCurrentNotificationId] = useState<undefined | number>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [readAll, setReadAll] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const temporaryNotificationDataRef = useRef<INotificationItem[]>([]);

  const [notificationData, setNotificationData] =
    useState<INotificationData>(defaultNotificationData);
  const [filters, setFilters] = useState<{ page?: number; limit?: number }>();

  const notificationRecords: INotificationRecords = useMemo(() => {
    if (notificationData.items.length) {
      const currentPage = get(notificationData, 'meta.currentPage', 1);
      const totalPages = get(notificationData, 'meta.totalPages', 0);
      const temptData = get(notificationData, 'items', []);

      const nextItems = uniqBy(
        [...temporaryNotificationDataRef.current]
          .concat(temptData)
          .sort((a: INotificationItem, b: INotificationItem) => {
            const timestampB = moment(b.createdAt).unix();
            const timestampA = moment(a.createdAt).unix();

            const createAt = timestampB - timestampA;

            /**
             * TODO: Update logic sort when paging
             */
            // if (!b.isRead) {
            //   return 1;
            // }
            // if (a.id !== b.id && createAt === 0) {
            //   return (
            //     SORT_PRIORITY[a.transactionType as TRANSACTION_NOTIFICATION] -
            //     SORT_PRIORITY[b.transactionType as TRANSACTION_NOTIFICATION]
            //   );
            // }

            return createAt;
          }),
        'id',
      );
      temporaryNotificationDataRef.current = nextItems;

      const nextPage = currentPage < totalPages ? currentPage + 1 : currentPage;

      return {
        items: nextItems,
        hasMore: currentPage < totalPages,
        totalPages,
        nextPage,
      };
    }
    return {
      items: [],
      hasMore: false,
      totalPages: 0,
      nextPage: 0,
    };
  }, [notificationData]);

  const notificationRecordsLength = notificationRecords.items.length;

  const isEmpty = notificationRecordsLength === 0;

  const handleLoadMoreNotification = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      page: notificationRecords.nextPage,
    }));
  }, [notificationRecords]);

  const getListNotifications = useCallback(
    async (params) => {
      try {
        if (!params) return;
        setLoading(true);
        const [response, errors] = await notificationService.getListNotifications(params);
        if (errors) throw errors;

        if (response) {
          setLoading(false);
          const items = get(response, 'items', []);
          const meta = get(response, 'meta');

          setNotificationData({
            items,
            meta,
          });
        }
      } catch (error) {
        setLoading(false);
        dispatch(toastError('Something went wrong'));
      }
    },
    [filters],
  );

  /**
   * * Temporary comment for future usage
   */
  // const markReadNotification = async (id: number) => {
  //   try {
  //     const [response, errors] = await notificationService.markReadNotification({ id });
  //     if (errors) {
  //       throw errors;
  //     }
  //     if (response) {
  //       const nextNotificationData = { ...notificationData };
  //       const index = nextNotificationData.items.findIndex((d) => d.id === response.id);
  //       if (index > -1) {
  //         nextNotificationData.items[index] = {
  //           ...nextNotificationData.items[index],
  //           isRead: true,
  //         };
  //       }
  //       temporaryNotificationDataRef.current = nextNotificationData.items;
  //       setNotificationData({
  //         items: nextNotificationData.items,
  //         meta: nextNotificationData.meta,
  //       });
  //       await getListNotifications(filters);
  //       onResetCountNotifications();
  //       onClose();
  //     }
  //   } catch (error) {
  //     dispatch(toastError('Something went wrong'));
  //   }
  // };

  const markReadAll = async () => {
    try {
      if (!open) return;

      const [_, errors] = await notificationService.markReadAllNotifications();
      if (errors) {
        throw errors;
      }
      setReadAll(true);
      await getListNotifications(filters);
      onResetCountNotifications();
    } catch (error) {
      dispatch(toastError('Something went wrong'));
    }
  };

  const deleteAllNotifications = async () => {
    try {
      setProcessing(true);
      const [response, errors] = await notificationService.softDeleteAllNotifications();
      if (errors) throw errors;

      if (response) {
        setProcessing(false);
        await getListNotifications(filters);
      }
    } catch (error) {
      setProcessing(false);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      setCurrentNotificationId(id);
      const [response, errors] = await notificationService.softDeleteNotification({
        id,
      });
      if (errors) throw errors;
      if (response) {
        const nextNotificationData = [...notificationRecords.items];

        const index = nextNotificationData.findIndex((d) => d.id === response.id);
        if (index > -1) {
          nextNotificationData.splice(index, 1);
          onResetCountNotifications();
        }
        const nextNotificationDataLength = nextNotificationData.length;
        temporaryNotificationDataRef.current = [];
        setNotificationData({
          items: nextNotificationData,
          meta: {
            ...notificationData.meta,
            totalItem: nextNotificationDataLength,
          },
        });
        setCurrentNotificationId(undefined);
      }
    } catch (error) {
      setCurrentNotificationId(undefined);
    }
  };

  const renderContent = () => {
    if (isEmpty) {
      return (
        <div className="py-4">
          <Stack spacing={2} alignItems="center" justifyContent="center" className="pt-6 mb-14">
            <img src="/images/empty_content.png" />
          </Stack>
          <Stack
            spacing={2}
            alignItems="center"
            justifyContent="center"
            className="text-third-gray px-10 text-center"
          >
            <div className="text--total--price text-third-gray">No Activity yet</div>
            <div className="text--body-large font-bold">
              When you get notifications, they’ll appear here
            </div>
          </Stack>
        </div>
      );
    }
    return (
      <InfiniteScroll
        dataLength={notificationRecordsLength}
        next={handleLoadMoreNotification}
        hasMore={notificationRecords.hasMore}
        height={notificationRecordsLength >= 5 ? '376px' : 'auto'}
        className="px-2"
        loader={
          <Stack direction="row" className="py-1">
            <span>Loading... </span> &nbsp;
            <CircularProgressIndicator size={20} />
          </Stack>
        }
        scrollableTarget="scrollableDiv"
      >
        {notificationRecords.items.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            currentNotificationId={currentNotificationId}
            onDelete={deleteNotification}
            markedReadAll={readAll}
          />
        ))}
      </InfiniteScroll>
    );
  };

  /**
   * * Temporary comment for future usage
   */
  useEffect(() => {
    if (open) {
      const hasUnreadNotifications = notificationRecords.items.filter(
        (item) => item.isRead === false,
      ).length;
      if (hasUnreadNotifications && !readAll) {
        markReadAll();
      }
    }
  }, [notificationRecords, readAll, open]);

  useEffect(() => {
    getListNotifications(filters);
  }, [getListNotifications]);

  useEffect(() => {
    if (open) {
      temporaryNotificationDataRef.current = [];
      setNotificationData(defaultNotificationData);
      setFilters({ page: 1, limit: 5 });
      setReadAll(false);
    }
  }, [open]);

  useEffect(() => {
    if (socket) {
      socket.on(EventSocket.NOTIFICATION, (res) => {
        const currentUserId = get(userState, 'profile.artist.id');
        const receivers = res.data.user;
        if (
          (Array.isArray(receivers) && receivers.length && receivers.includes(currentUserId)) ||
          receivers === currentUserId
        ) {
          temporaryNotificationDataRef.current = [];
          setFilters({ page: 1, limit: 5 });
        }
      });
    }
  }, [socket]);

  const openLoadingScreen = !notificationRecords.hasMore && (loading || processing);
  
  return (
    <Popover
      anchorEl={(ref as MutableRefObject<HTMLDivElement | null>).current}
      open={open}
      onClose={onClose}
      marginThreshold={2}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: -20,
        horizontal: 'left',
      }}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          borderRadius: '0px',
        },
      }}
    >
      <div className="w-[460px] overflow-hidden bg-background-10">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="bg-secondary-ref w-full h-[64px] px-6"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <ClosingIcon className="text-2xl cursor-pointer" onClick={onClose} />
            <div className="text--headline-small text-white">Notifications</div>
          </Stack>
          {!isEmpty && (
            <OutlinedButton
              onClick={deleteAllNotifications}
              customClass="!text-secondary-60 w-[112px] h-[40px] gap-0 font-bold"
              text="Clear all"
            />
          )}
        </Stack>
        <div className="py-1 relative overflow-auto" id="scrollableDiv">
          <Backdrop open={openLoadingScreen} className="absolute top-0 left-0 z-10">
            <Stack spacing={2} alignItems={'center'} justifyContent={'center'}>
              <CircularProgress className="text-primary-60" />
            </Stack>
          </Backdrop>
          {renderContent()}
        </div>
      </div>
    </Popover>
  );
});

export default memo(NotificationPopover);
