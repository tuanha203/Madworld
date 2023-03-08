import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ActivityBidSvg, ActivityMintedSvg, ActivityOfferSvg, ActivitySaleSvg, ActivityTagSvg, ActivityTransferSvg, EtherscanLinkSvg } from 'components/common/iconography/iconsComponentSVG';
import ImageBase from 'components/common/ImageBase';
import { CustomEthPrice, MadPriceMedium } from 'components/common/price';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { NULL_ADDRESS, TYPE_IMAGE } from 'constants/app';
import { LINK_SCAN } from 'constants/envs';
import get from 'lodash/get';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { addCommaToNumberHasApproximately } from 'utils/currencyFormat';
import { formatNumber } from 'utils/formatNumber';
import { abbreviateNumber, checkTypeMedia, shortenNameNoti } from 'utils/func';
// TODO: more config


const ACTION_HAS_TX_HASH = ['mint', 'transfer', 'sale'];

const NULL_ADDRESS_SHORTEN = '0x0000000000000000000000000000000000000000';

interface IItemData {
  activityType: string;
  createdAt?: string;
  currencyToken?: string;
  transactionHash?: string;
  quantity: string; // TODO
  price: string;
  fromAddress: string;
  toAddress: string;
  nft?: any;
  title?: string;
  from?: any;
  to?: any;
}

interface IItemFeedProps<T> {
  data: T;
}

const MEDIA_ICONS: Record<string, string> = {
  [TYPE_IMAGE.MP3]: '/icons/mp3_icons_card.svg',
  [TYPE_IMAGE.MP4]: '/icons/mp4_icons_card.svg',
};

const ItemFeed = <T extends IItemData>({ data }: IItemFeedProps<T>) => {
  const {
    activityType,
    createdAt,
    currencyToken,
    transactionHash,
    quantity,
    price,
    fromAddress,
    from,
    to,
    toAddress,
    nft,
  } = data || {};

  const router = useRouter();
  const [show, setShow] = useState(false);
  const { icon, text } = useSelector((state:any) => state.theme);

  const typeAction = activityType?.toLowerCase();
  const typeMedia = checkTypeMedia(get(nft, 'nftUrl', ''));

  const ICON_BY_TYPE: any = {
    list: <ActivityTagSvg color={icon?.color} />,
    transfer: <ActivityTransferSvg color={icon?.color} />,
    mint: <ActivityMintedSvg color={icon?.color} />,
    offer: <ActivityOfferSvg color={icon?.color} />,
    sale: <ActivitySaleSvg color={icon?.color}  />,
    bid: <ActivityBidSvg color={icon?.color}  />,
  };

  const isMintingAction = fromAddress === NULL_ADDRESS;
  const userNameFrom = from?.username;
  const userNameTo = to?.username;

  const fromName = isMintingAction ? NULL_ADDRESS_SHORTEN?.slice(0, 6) : userNameFrom || '-';

  const toName = userNameTo || '-';

  const actionName = isMintingAction ? ACTION_HAS_TX_HASH[0] : activityType;
  const title = get(nft, 'title', '');

  const pricePerUnit = parseFloat(price) * parseInt(quantity);

  const assetPath = `/asset/${get(nft, 'collection.address')}/${get(nft, 'tokenId')}`;

  const renderProcessedBy = (username: string, address: string, tooltipTitle?: string) => {
    let addr =
      address && username !== '-'
        ? shortenNameNoti(username, 6)
        : address
          ? address.slice(0, 6)
          : '-';
    const titleTooltip = address && username !== '-' ? username : address ? address : '-';

    return (
      <ContentTooltip title={titleTooltip} placement="top" arrow>
        <div>
          <Link href={address && username !== '-' ? `/artist/${address}` : router.asPath}>
            <a
              className="text-primary-90 text--label-medium cursor-pointer leading-none mt-auto"
              style={text}
            >
              {addr}
            </a>
          </Link>
        </div>
      </ContentTooltip>
    );
  };
  const redirectToEther = (e: any, link: string) => {
    e.stopPropagation();
    // router.push(link);
    window.open(link, '_blank');
  };

  return (
    <Link
      href={{
        pathname: assetPath,
      }}
    // passHref
    >
      <div className="xl:py-4 xl:pl-4 xl:pr-4 p-3 rounded-xl xl:w-auto w-full bg-background-700">
        <div className="offering-list xl:w-[711px] w-full flex justify-between xl:items-[unset] items-center cursor-pointer">
          <div className="xl:flex hidden gap-1 sm:w-auto md:w-[200px] xl:w-[250px]">
            <div className="flex flex-col justify-center items-center min-w-[52px] mr-2">
              <div className="w-[20px] h-[20px] mb-2">
                {isMintingAction ? ICON_BY_TYPE['mint'] : ICON_BY_TYPE[activityType]}
              </div>
              <span className="text--label-small text-pink-bland font-size-[11px] leading-none	capitalize">
                {actionName}
              </span>
            </div>
            <div className="flex">
              <div className="relative">
                <ImageBase
                  url={nft?.nftImagePreview || nft?.nftUrl}
                  errorImg="Avatar"
                  alt="avatar"
                  width="48px"
                  height="48px"
                  type="HtmlImage"
                  className={`object-cover mr-2`}
                  style={{
                    width: '48px',
                    height: '48px',
                  }}
                />{' '}
                {MEDIA_ICONS[typeMedia] && (
                  <div className={`w-[15px] h-[15px] absolute right-[8px] top-[2px] z-[12px]`}>
                    <img className="" src={MEDIA_ICONS[typeMedia]} />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <ContentTooltip
                  className="text--subtitle leading-1 mb-1 max-w-[100px]"
                  title={title}
                  arrow
                  placement="top"
                >
                  <div className="text-ellipsis text--subtitle text-white-blur leading-1 mb-1 max-w-[100px]">
                    {title}
                  </div>
                </ContentTooltip>
                <div
                  className="flex gap-0.5 items-center text-primary-90 text-[12px] font-bold"
                  style={text}
                >
                  {moment(createdAt).fromNow()}
                  {ACTION_HAS_TX_HASH.includes(typeAction) && (
                    // <Link href={`${LINK_SCAN}tx/${transactionHash}`} passHref>
                    <a
                      href={`${LINK_SCAN}tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener"
                      onClick={(e: any) => e.stopPropagation()}
                    >
                      <EtherscanLinkSvg color={icon?.color}  className="cursor-pointer hover:opacity-70" />
                    </a>
                    // </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="xl:hidden flex items-center">
            <div className="h-[32px]">
              <ImageBase
                url={get(nft, 'nftUrl')}
                errorImg={'Default'}
                alt="avatar"
                type="HtmlImage"
                className={`object-cover mr-4 h-full`}
                style={{
                  width: '32px',
                  height: '32px',
                }}
              />
            </div>
            <div className="xl:hidden flex flex-col justify-between min-w-[10px]">
              <ContentTooltip
                className="text--subtitle leading-none mb-1 max-w-[100px]"
                title={title}
                arrow
                placement="top"
              >
                <div className="text-ellipsis text--subtitle leading-none mb-1 max-w-[100px] text-white-blur">
                  {title}
                </div>
              </ContentTooltip>
              <div className="flex flex-rơw justify-between items-center">
                <div className="flex flex-rơw items-center mr-2">
                  <img
                    src={isMintingAction ? ICON_BY_TYPE['mint'] : ICON_BY_TYPE[activityType]}
                    className="w-[10px] h-[10px] mr-1"
                  />
                  <span className="text--label-small font-size-[11px] leading-none	capitalize text-pink-bland">
                    {actionName}
                  </span>
                </div>
                <div className="flex gap-0.5 text-primary-90 items-center text-[12px] font-bold" style={text}>
                  {moment(createdAt).fromNow()}
                  <div>
                    {ACTION_HAS_TX_HASH.includes(typeAction) && (
                      <Link href={`${LINK_SCAN}tx/${transactionHash}`} passHref>
                        <a
                          href={`${LINK_SCAN}tx/${transactionHash}`}
                          target="_blank"
                          rel="noopener"
                        >
                          <EtherscanLinkSvg  className="cursor-pointer hover:opacity-70" color={icon?.color} />
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:flex hidden flex-col w-[70px]">
            <div className="text--label-small h-[24px]">From</div>
            {renderProcessedBy(
              fromName,
              fromAddress,
              isMintingAction ? NULL_ADDRESS_SHORTEN : userNameFrom || fromAddress,
            )}
          </div>
          <div className="xl:flex hidden flex-col w-[70px]">
            <div className="text--label-small h-[24px]">To</div>
            {renderProcessedBy(toName, toAddress)}
          </div>
          <div className="xl:flex hidden flex-col w-[50px]">
            <div className="text--label-small h-[24px]">Quantity</div>
            <div className="text-primary-90 text--label-medium" style={text}>
              {formatNumber(quantity)}
            </div>
          </div>
          <div className="sm:flex md:block sm:w-auto md:w-[135px] my-auto">
            {typeAction !== 'transfer' && currencyToken && price ? (
              currencyToken !== 'umad' ? (
                <ContentTooltip
                  title={`${addCommaToNumberHasApproximately(
                    pricePerUnit,
                    20,
                  )} ${currencyToken?.toUpperCase()}`}
                >
                  <div>
                    <CustomEthPrice
                      eth={String(abbreviateNumber(pricePerUnit || 0, 2))}
                      customClass="mad-price-small text--subtitle flex self-end items-center"
                      currency={currencyToken?.toUpperCase()}
                      customClassImage={`w-5 h-[24px]`}
                    />
                  </div>
                </ContentTooltip>
              ) : (
                <ContentTooltip
                  title={`${addCommaToNumberHasApproximately(pricePerUnit, 20)} UMAD`}
                >
                  <div>
                    <MadPriceMedium umad={String(abbreviateNumber(pricePerUnit || 0, 2))} />
                  </div>
                </ContentTooltip>
              )
            ) : null}
            <div
              className="flex xl:hidden flex-col justify-between gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setShow(!show);
              }}
            >
              {!show ? (
                <KeyboardArrowDownIcon sx={icon || { color: '#F4B1A3' }} />
              ) : (
                <KeyboardArrowUpIcon sx={icon || { color: '#F4B1A3' }} />
              )}
            </div>
          </div>
        </div>
        <div
          className={`xl:hidden w-[100%] rounded-xl ${!show ? 'view-hidden' : 'view-hidden-disable'
            } overflow-hidden`}
        >
          <div className="flex items-center justify-between gap-6 pt-2">
            <div className="xl:hidden flex flex-col gap-2 truncate">
              <div className="text--label-small">From</div>
              <div className="text-primary-90 text--label-medium truncate">
                {renderProcessedBy(
                  fromName,
                  fromAddress,
                  isMintingAction ? NULL_ADDRESS_SHORTEN : userNameFrom || fromAddress,
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 truncate">
              <div className="text--label-small">To</div>
              <div className="text-primary-90 text--body-medium truncate minw-[20px]">
                {renderProcessedBy(toName, toAddress)}
              </div>
            </div>
            <div className="flex flex-col  gap-2 truncate text-center">
              {typeAction !== 'transfer' && currencyToken && price && (
                <>
                  <div className="text--label-small ">Quantity</div>
                  <div className=" text-primary-90 text--body-medium truncate" style={text}>
                    {formatNumber(quantity)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemFeed;
