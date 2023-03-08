import { memo, FC, useMemo, ReactNode } from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import ImageBase from 'components/common/ImageBase';
import moment from 'moment';
import get from 'lodash/get';
import Link from 'next/link';

import { Avatar } from 'components/modules';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import { NOTIFICATION_TITLE, TRANSACTION_NOTIFICATION, TYPE_IMAGE, TYPE_LIKES } from 'constants/app';
import { roundNumber } from 'utils/formatNumber';
import { abbreviateNumber, checkTypeMedia, shortenAddress } from 'utils/func';
import { convertUrlImage } from 'utils/image';

import { INotificationItem } from './typings';
import { addCommaToNumberHasApproximately } from 'utils/currencyFormat';

interface INotificationItemProps {
  notification: INotificationItem;
  currentNotificationId?: number;
  onDelete: (id: number) => void;
  markedReadAll?: boolean;
}

interface INotificationTradingContentProps {
  extendTitle?: ReactNode;
  title: string;
  separateWord: string;
  actionBy: string;
  price: string;
  currencyToken: string;
}

type NotificationThumbProperties = {
  [x: string]: (notification: INotificationItem) => {
    slug: string | null | undefined;
    previewUrl?: string;
    url: string;
    alt: string;
    isVerified?: boolean;
  };
};

const MEDIA_ICONS: Record<string, string> = {
  [TYPE_IMAGE.MP3]: '/icons/mp3_icons_card.svg',
  [TYPE_IMAGE.MP4]: '/icons/mp4_icons_card.svg',
};

const ASSETS_PATH = (collectionAddr: string, tokenId: string) =>
  `/asset/${collectionAddr}/${tokenId}`;

const COLLECTION_PATH = (collectionAddr: string) => `/collection/${collectionAddr}`;

const ARTIST_PATH = (walletAddress: string) => `/artist/${walletAddress}`;

const THUMBNAIL_PATH = (notification: INotificationItem) =>
  get(notification, 'nftHistory.nft.nftImagePreview') || get(notification, 'nftHistory.nft.nftUrl');

/**
 * * Define thumbnail properties follow notification type
 */
const NOTIFICATION_THUMB_PROPERTIES: NotificationThumbProperties = {
  [TRANSACTION_NOTIFICATION.PURCHASE]: (notification) => ({
    slug: ASSETS_PATH(
      get(notification, 'nftHistory.nft.collection.address'),
      get(notification, 'nftHistory.nft.tokenId'),
    ),
    previewUrl: THUMBNAIL_PATH(notification),
    url: get(notification, 'nftHistory.nft.nftUrl'),
    alt: get(notification, 'nftHistory.nft.title'),
  }),
  [TRANSACTION_NOTIFICATION.ACCEPT_OFFER_PURCHASE]: (notification) => ({
    slug: ASSETS_PATH(
      get(notification, 'nftHistory.nft.collection.address'),
      get(notification, 'nftHistory.nft.tokenId'),
    ),
    previewUrl: THUMBNAIL_PATH(notification),
    url: get(notification, 'nftHistory.nft.nftUrl'),
    alt: get(notification, 'nftHistory.nft.title'),
  }),
  [TRANSACTION_NOTIFICATION.ACCEPT_BID_PURCHASE]: (notification) => ({
    slug: ASSETS_PATH(
      get(notification, 'nftHistory.nft.collection.address'),
      get(notification, 'nftHistory.nft.tokenId'),
    ),
    previewUrl: THUMBNAIL_PATH(notification),
    url: get(notification, 'nftHistory.nft.nftUrl'),
    alt: get(notification, 'nftHistory.nft.title'),
  }),
  [TRANSACTION_NOTIFICATION.LISTING]: (notification) => ({
    slug: ASSETS_PATH(
      get(notification, 'nftHistory.nft.collection.address'),
      get(notification, 'nftHistory.nft.tokenId'),
    ),
    previewUrl: THUMBNAIL_PATH(notification),
    url: get(notification, 'nftHistory.nft.nftUrl'),
    alt: get(notification, 'nftHistory.nft.title'),
  }),
  [TRANSACTION_NOTIFICATION.FOLLOW]: (notification) => ({
    slug: ARTIST_PATH(get(notification, 'follow.follower.walletAddress')),
    url: get(notification, 'follow.follower.avatarImg'),
    alt: get(notification, 'follow.follower.username'),
    isVerified: get(notification, 'follow.follower.isVerify'),
  }),
  [TRANSACTION_NOTIFICATION.BID]: (notification) => ({
    slug: ASSETS_PATH(
      get(notification, 'nftHistory.nft.collection.address'),
      get(notification, 'nftHistory.nft.tokenId'),
    ),
    previewUrl: THUMBNAIL_PATH(notification),
    url: get(notification, 'nftHistory.nft.nftUrl'),
    alt: get(notification, 'nftHistory.nft.title'),
  }),
  [TRANSACTION_NOTIFICATION.OFFER]: (notification) => ({
    slug: ASSETS_PATH(
      get(notification, 'nftHistory.nft.collection.address'),
      get(notification, 'nftHistory.nft.tokenId'),
    ),
    previewUrl: THUMBNAIL_PATH(notification),
    url: get(notification, 'nftHistory.nft.nftUrl'),
    alt: get(notification, 'nftHistory.nft.title'),
  }),
  [TRANSACTION_NOTIFICATION.REPORT]: (notification) => ({
    slug: ASSETS_PATH(
      get(notification, 'report.nft.collection.address'),
      get(notification, 'report.nft.tokenId'),
    ),
    previewUrl:
      get(notification, 'report.nft.nftImagePreview') || get(notification, 'report.nft.nftUrl'),
    url: get(notification, 'report.nft.nftUrl'),
    alt: get(notification, 'report.nft.title'),
  }),
  [TRANSACTION_NOTIFICATION.SHOW_NFT]: (notification) => ({
    slug: ASSETS_PATH(
      get(notification, 'nft.collection.address'),
      get(notification, 'nft.tokenId'),
    ),
    previewUrl: get(notification, 'nft.nftImagePreview') || get(notification, 'nft.nftUrl'),
    url: get(notification, 'nft.nftUrl'),
    alt: get(notification, 'nft.title'),
  }),
  [TRANSACTION_NOTIFICATION.HIDE_NFT]: (notification) => ({
    slug: null,
    previewUrl: get(notification, 'nft.nftImagePreview') || get(notification, 'nft.nftUrl'),
    url: get(notification, 'nft.nftUrl'),
    alt: get(notification, 'nft.title'),
  }),
  [TRANSACTION_NOTIFICATION.LIKES]: (notification) => {
    const notificationLike = get(notification, 'like');
    let slug = '';
    let previewUrl = '';
    let url = '';
    let alt = '';
    let isVerified = false;

    if (notificationLike?.type === TYPE_LIKES.NFT) {
      slug = ASSETS_PATH(
        get(notificationLike, 'infoLike.collection.address'),
        get(notificationLike, 'infoLike.tokenId'),
      );
      previewUrl =
        get(notificationLike, 'infoLike.nftImagePreview') ||
        get(notificationLike, 'infoLike.nftUrl');
      url = get(notificationLike, 'infoLike.nftUrl');
      alt = get(notificationLike, 'infoLike.title', '');
    }

    if (notificationLike?.type === TYPE_LIKES.USER) {
      slug = ARTIST_PATH(get(notificationLike, 'account.walletAddress'));
      url = get(notificationLike, 'account.avatarImg');
      alt = get(notificationLike, 'account.username', '');
      isVerified = get(notificationLike, 'account.isVerify');
    }

    if (notificationLike?.type === TYPE_LIKES.COLLECTION) {
      slug = COLLECTION_PATH(get(notificationLike, 'infoLike.address'));
      url = get(notificationLike, 'infoLike.thumbnailUrl');
      previewUrl = get(notificationLike, 'infoLike.thumbnailUrl');
      alt =
        get(notificationLike, 'infoLike.name') ||
        shortenAddress(get(notificationLike, 'infoLike.address', ''));
    }

    return {
      slug,
      previewUrl,
      url,
      alt,
      isVerified,
    };
  },
};

const getValue = (value: string): string => {
  // const temptValue = parseFloat(value);
  // if (!temptValue || temptValue === 0) return '0';

  // if (temptValue) return roundNumber(temptValue.toFixed(8)).toString().replace(' ', '');

  // return temptValue.toFixed(8);
  return String(addCommaToNumberHasApproximately(value || 0, 8))
};

/**
 * * For trading actions like listing, offering...
 */
const NotificationTradingContent: FC<INotificationTradingContentProps> = ({
  extendTitle,
  title,
  separateWord,
  actionBy,
  price,
  currencyToken,
}) => {
  return (
    <div className="text--body-small text-secondary-60">
      <Stack direction="row" spacing={0.25} flexWrap="wrap">
        {extendTitle}
        <OverflowTooltip title={title} className="font-bold max-w-[120px]">
          <>{title}</>
        </OverflowTooltip>
        <span className="text-white">{separateWord}</span>
        <OverflowTooltip title={actionBy} className="font-bold max-w-[120px]">
          <span>{actionBy}</span>
        </OverflowTooltip>
        {price && (
          <span className="text-white">
            for {getValue(price) || ''} {currencyToken}
          </span>
        )}
      </Stack>
    </div>
  );
};

const NotificationItem: FC<INotificationItemProps> = (props) => {
  const { notification, currentNotificationId, onDelete } = props;

  const previewImageInfo = useMemo(() => {
    return {
      slug: NOTIFICATION_THUMB_PROPERTIES[notification.transactionType](notification).slug,
      previewUrl:
        NOTIFICATION_THUMB_PROPERTIES[notification.transactionType](notification).previewUrl,
      url: NOTIFICATION_THUMB_PROPERTIES[notification.transactionType](notification).url,
      alt: NOTIFICATION_THUMB_PROPERTIES[notification.transactionType](notification).alt,
      isVerified:
        NOTIFICATION_THUMB_PROPERTIES[notification.transactionType](notification).isVerified,
    };
  }, [notification]);

  const readClass = useMemo(() => {
    return notification.isRead
      ? ''
      : 'bg-background-700 rounded shadow-elevation-light-3 mb-1 px-2';
  }, [notification]);

  const renderContent = () => {
    const nftTitle = get(notification, 'nftHistory.nft.title', '');
    const price = get(notification, 'nftHistory.price', 0);
    const quantity = get(notification, 'nftHistory.quantity', 1);
    const pricePerUnit = (parseFloat(price) * parseInt(quantity)).toString();

    switch (notification.transactionType) {
      case TRANSACTION_NOTIFICATION.PURCHASE:
        return (
          <NotificationTradingContent
            title={nftTitle}
            separateWord={'purchased by'}
            actionBy={get(notification, 'nftHistory.toAddress.username', '')}
            price={pricePerUnit}
            currencyToken={get(notification, 'nftHistory.currencyToken', '').toUpperCase()}
          />
        );
      
      case TRANSACTION_NOTIFICATION.ACCEPT_OFFER_PURCHASE:
        return (
          <NotificationTradingContent
            extendTitle={
              <span className='text-white'>Your offer for</span>
            }
            title={nftTitle}
            separateWord={'has been accepted by'}
            actionBy={get(notification, 'nftHistory.fromAddress.username', '')}
            price={pricePerUnit}
            currencyToken={get(notification, 'nftHistory.currencyToken', '').toUpperCase()}
          />
        );
      
      case TRANSACTION_NOTIFICATION.ACCEPT_BID_PURCHASE:
        return (
          <NotificationTradingContent
            extendTitle={
              <span className='text-white'>Your bid for</span>
            }
            title={nftTitle}
            separateWord={'has been accepted by'}
            actionBy={get(notification, 'nftHistory.fromAddress.username', '')}
            price={pricePerUnit}
            currencyToken={get(notification, 'nftHistory.currencyToken', '').toUpperCase()}
          />
        );

      case TRANSACTION_NOTIFICATION.LISTING:
        return (
          <NotificationTradingContent
            title={nftTitle}
            separateWord={'listed by'}
            actionBy={get(notification, 'nftHistory.fromAddress.username', '')}
            price={pricePerUnit}
            currencyToken={get(notification, 'nftHistory.currencyToken', '').toUpperCase()}
          />
        );

      case TRANSACTION_NOTIFICATION.OFFER:
        const offerActivity = get(notification, 'nftHistory.activityType');
        const offerSeparatedWord =
          offerActivity === 'offer' ? 'has been offered by' : 'has been accepted';

        const offerActionBy =
          offerActivity === 'offer' ? get(notification, 'nftHistory.fromAddress.username', '') : '';

        return (
          <NotificationTradingContent
            extendTitle={
              <span className="text-white">{offerActivity === 'sale' ? 'Your offer for' : ''}</span>
            }
            title={nftTitle}
            separateWord={offerSeparatedWord}
            actionBy={offerActionBy}
            price={pricePerUnit}
            currencyToken={get(notification, 'nftHistory.currencyToken', '').toUpperCase()}
          />
        );

      case TRANSACTION_NOTIFICATION.BID:
        const bidActivity = get(notification, 'nftHistory.activityType');
        const bidSeparatedWord =
          bidActivity === 'bid' ? 'has been bidden by' : 'has been automatically accepted';
        const bidActionBy =
          bidActivity === 'bid' ? get(notification, 'nftHistory.fromAddress.username', '') : '';

        return (
          <NotificationTradingContent
            extendTitle={
              <span className="text-white">{bidActivity === 'bid' ? '' : 'Your bid for'}</span>
            }
            title={nftTitle}
            separateWord={bidSeparatedWord}
            actionBy={bidActionBy}
            price={pricePerUnit}
            currencyToken={get(notification, 'nftHistory.currencyToken', '').toUpperCase()}
          />
        );

      case TRANSACTION_NOTIFICATION.FOLLOW:
        return (
          <div className="text--body-small text-secondary-60">
            <div>
              <Stack direction="row" spacing={0.25} flexWrap="wrap">
                <OverflowTooltip 
                  title={get(notification, 'follow.follower.username') || get(notification, 'follow.follower.walletAddress', '')} 
                  className="font-bold max-w-[120px]"
                >
                  <span className="font-bold">
                    {get(notification, 'follow.follower.username') ||
                      shortenAddress(get(notification, 'follow.follower.walletAddress', ''), 6)}
                  </span>
                </OverflowTooltip>
                
                <span className="text-white"> started following you</span>
              </Stack>
            </div>
          </div>
        );

      case TRANSACTION_NOTIFICATION.HIDE_NFT:
        return (
          <div className="text--body-small text-secondary-60">
            <div>
              <span className="font-bold">{get(notification, 'nft.title')}</span>
              <span className="text-white"> is no longer visible on MADworld marketplace.</span>
            </div>
          </div>
        );

      case TRANSACTION_NOTIFICATION.SHOW_NFT:
        return (
          <div className="text--body-small text-secondary-60">
            <div>
              <span className="font-bold">{get(notification, 'nft.title')}</span>
              <span className="text-white"> is now visible on MADworld marketplace</span>
            </div>
          </div>
        );

      case TRANSACTION_NOTIFICATION.REPORT:
        const reportNftTitle = get(notification, 'report.nft.title');
        const reportUsername = get(notification, 'report.account.username');
        return (
          <div className="text--body-small text-secondary-60 break-words">
            <OverflowTooltip
              title={reportNftTitle}
              className="font-bold max-w-[120px] inline-block align-bottom"
            >
              <>{reportNftTitle}</>
            </OverflowTooltip>
            <span className="text-white"> has been reported as </span>
            <span className="font-bold">
              {get(notification, 'report.reason').replace(/_/g, ' ')}
            </span>
            <span className="text-white"> by </span>
            <OverflowTooltip
              title={reportUsername}
              className="font-bold max-w-[208px] inline-block align-bottom"
            >
              <span>{reportUsername}</span>
            </OverflowTooltip>
          </div>
        );

      case TRANSACTION_NOTIFICATION.LIKES:
        const notificationLike = notification.like;
        let title = '';

        let separateWord = 'liked by';
        let actionBy =
          get(notificationLike, 'account.username', '') ||
          shortenAddress(get(notificationLike, 'account.walletAddress', ''), 6);

        if (notificationLike?.type === TYPE_LIKES.NFT) {
          title = get(notificationLike, 'infoLike.title', '');
        }

        if (notificationLike?.type === TYPE_LIKES.USER) {
          title =
            get(notificationLike, 'account.username', '') ||
            shortenAddress(get(notificationLike, 'account.walletAddress', ''), 6);
          separateWord = 'liked';
          actionBy = 'you';
        }

        if (notificationLike?.type === TYPE_LIKES.COLLECTION) {
          title =
            get(notificationLike, 'infoLike.title') ||
            shortenAddress(get(notificationLike, 'infoLike.address', ''));
        }

        return (
          <div className="text--body-small text-secondary-60">
            <Stack direction="row" spacing={0.25} flexWrap="wrap">
              <OverflowTooltip title={title} className="font-bold max-w-[120px]">
                <span>{title}</span>
              </OverflowTooltip>
              <span className="text-white"> {separateWord} </span>
              <OverflowTooltip title={actionBy} className="max-w-[120px]">
                <span
                  className={
                    notificationLike?.type === TYPE_LIKES.USER ? 'text-white' : 'font-bold'
                  }
                >
                  {actionBy}
                </span>
              </OverflowTooltip>
            </Stack>
          </div>
        );

      default:
        break;
    }
  };

  const renderThumbnail = () => {
    if (previewImageInfo.slug && previewImageInfo.slug.includes('/artist/')) {
      return (
        <Avatar
          mode="larger"
          verified={Boolean(previewImageInfo.isVerified)}
          onClick={() => {}}
          customClass="w-[48px] h-[52px] border-[2px] mr-3 rounded-full border-primary-dark cursor-pointer"
          rounded
          src={previewImageInfo.url && convertUrlImage(previewImageInfo.url)}
        />
      );
    }
    const mediaType = checkTypeMedia(previewImageInfo.url);

    return (
      <div className="w-[48px] h-[52px] mr-3 cursor-pointer relative">
        <ImageBase
          url={previewImageInfo.previewUrl ? convertUrlImage(previewImageInfo.previewUrl) : ''}
          errorImg={'Default'}
          layout="fill"
          alt={previewImageInfo.alt}
          type="HtmlImage"
          className={`object-cover !w-full !h-full`}
        />
        {MEDIA_ICONS[mediaType] && (
          <div className={`w-[15px] h-[15px] absolute right-1 top-[2px] z-[12px]`}>
            <img className="" src={MEDIA_ICONS[mediaType]} />
          </div>
        )}
      </div>
    );
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      className={`relative px-2 py-3 h-[76px] ${readClass}`}
    >
      <div>
        <Link
          href={{
            pathname: previewImageInfo.slug,
          }}
          passHref
        >
          {renderThumbnail()}
        </Link>
      </div>

      <Stack
        spacing={0.5}
        className={`relative mr-auto ${previewImageInfo.slug ? 'cursor-pointer' : ''}`}
        width="100%"
      >
        <Link
          href={{
            pathname: previewImageInfo.slug,
          }}
          passHref
        >
          <a className="absolute top-0 left-0 w-full h-full"></a>
        </Link>

        <Stack direction="row" spacing={1} className="text--title-small text-white">
          {/* <span>{notification.transactionType.replace('_', ' ').toUpperCase()}</span> */}
          <span>{NOTIFICATION_TITLE[notification.transactionType]}</span>
          <span className="text-[11px]">{moment(notification.createdAt).fromNow()}</span>
        </Stack>
        {renderContent()}
      </Stack>

      <IconButton onClick={() => onDelete(notification.id)} size="small">
        {currentNotificationId && currentNotificationId === notification.id ? (
          <CircularProgress size={24} className="text-primary-60" />
        ) : (
          <CancelRoundedIcon className="text-primary-60" />
        )}
      </IconButton>
    </Stack>
  );
};

export default NotificationItem;
