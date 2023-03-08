import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { Avatar } from 'components/modules';
import { WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import get from 'lodash/get';
import Link from 'next/link';
import { LeaderBoardRecord } from 'pages/branded-projects';
import { memo, useCallback } from 'react';
import { IconVerified } from '../iconography/IconBundle';
import OverflowTooltip from '../tooltip/OverflowTooltip';
import { ILeaderBoardColumn } from './List';
interface ILeaderBoardItemProps<T> {
  index: number;
  record: LeaderBoardRecord;
  columns: ILeaderBoardColumn<any>[];
  actions?: any;
}

const LeaderBoardItem = <T extends unknown>(props: ILeaderBoardItemProps<T>) => {
  const { index, record, columns } = props;

  const windowMode = useDetectWindowMode();
  const isMobile = [WINDOW_MODE['SM'], WINDOW_MODE['MD'], WINDOW_MODE['LG']].includes(windowMode);

  const getTitle = (record: any) => {
    if (record.walletAddress) {
      if (record.username) {
        return record.username;
      }
      return record.walletAddress.slice(0, 6);
    }
    return record.title || record.name;
  };
  const getTooltip = (record: any) => {
    if (record.walletAddress) {
      return record.username || record.walletAddress;
    }
    return record.title || record.name;
  };
  const checkIsWalletAdress = (record: any): boolean => {
    if (record.walletAddress) {
      if (record.username) return false;
      return true;
    }
    return false;
  };
  const getRedirectLinkMobile = useCallback(() => {
    const c = columns[0];
    const address = get(record, get(c.options, 'avatarProps.address', ''));
    const path = get(c.options, 'avatarProps.path', '');
    return `${path}/${address}`;
  },[columns, record])
  if (isMobile) {
    return (
      <Stack direction={'row'} justifyContent="center" alignItems="center" spacing={2}>
        <div className="rounded-full flex justify-center items-center p-2 w-[32px] h-[32px] bg-primary-60 text-black text-center text--title-small shrink-0">
          {index + 1}
        </div>
        <div className="bg-background-700 rounded-lg p-4 ml-3 !w-[calc(100%-56px)]">
          <Link href={getRedirectLinkMobile()}>
            <div>
              <div className="flex items-center w-full">
                <Avatar
                  alt={record?.username}
                  mode="larger"
                  size={'28'}
                  src={record?.avatarImg || record?.thumbnailUrl || ''}
                  rounded
                  border
                />
                <OverflowTooltip
                  className="ml-2 text-primary-dark-2 text--body-medium text--headline-xsmall w-[calc(100%-28px)]"
                  title={getTooltip(record)}
                  isAddress={checkIsWalletAdress(record)}
                >
                  <>{getTitle(record)}</>
                </OverflowTooltip>
              </div>
              <div className="flex justify-between mt-3 mx-9">
                {columns.map((c, index) => {
                  const options = c.options;

                  const value = get(record, c.name, '');

                  if (c.type === 'avatar' || c.name === '') {
                    return;
                  }
                  return (
                    <div key={`${c.name}-${index}`}>
                      <p className="text--body-small text-primary-dark-2">{c.label}</p>
                      <p className="text--body-small leading-6 text-[14px]">
                        {options && options.onRender ? options.onRender(record) : value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Link>
        </div>
      </Stack>
    );
  }

  return (
    <Stack direction={'row'} justifyContent="center" alignItems="center" spacing={3}>
      <div className="rounded-full flex justify-center items-center p-2 w-[32px] h-[32px] bg-primary-60 text-black text-center text--body-small text-[14px] shrink-0">
        {index + 1}
      </div>
      <ListItem className="bg-background-700 rounded-lg py-7 px-6 !w-[calc(100%-56px)]" divider>
        {columns.map((c, index) => {
          const options = c.options;

          const value = get(record, c.name, '');
          const isVerify = get(record, 'isVerify', false);

          if (c.type === 'avatar') {
            const avatarLabel = get(record, get(c.options, 'avatarProps.label'));

            // const thumbnailUrl = convertUrlImage(
            //   get(record, get(c.options, 'avatarProps.url', '')),
            // );
            const thumbnailUrl = get(record, get(c.options, 'avatarProps.url', ''));
            const address = get(record, get(c.options, 'avatarProps.address', ''));
            const path = get(c.options, 'avatarProps.path', '');

            return (
              <ListItemAvatar
                key={`${c.name}-${index}`}
                sx={{ display: 'flex', alignItems: 'center', width: '30%', minWidth: '30px' }}
              >
                <Link href={`${path}/${address}`}>
                  <a className="flex items-center w-full">
                    <div className="relative">
                      <Avatar alt={avatarLabel}  mode="larger" rounded border src={thumbnailUrl || ''} />
                      {isVerify && (
                        <div className="absolute bottom-0 right-0">
                          <IconVerified customClass="w-[15px] h-[15px]" />
                        </div>
                      )}
                    </div>

                    <OverflowTooltip
                      className="ml-2 text-primary-dark-2 text--headline-xsmall mr-[15%]"
                      title={getTooltip(record)}
                      isAddress={checkIsWalletAdress(record)}
                    >
                      <>{getTitle(record)}</>
                    </OverflowTooltip>
                  </a>
                </Link>
              </ListItemAvatar>
            );
          }
          return (
            <ListItemText
              sx={{ flex: 'none', width: '54%' }}
              key={`${c.name}-${index}`}
              className={`${(options && options.cellClassName) || 'w-[18%]'}`}
              primary={options && options.onRender ? options.onRender(record) : value}
            />
          );
        })}
      </ListItem>
    </Stack>
  );
};

export default memo(LeaderBoardItem);
