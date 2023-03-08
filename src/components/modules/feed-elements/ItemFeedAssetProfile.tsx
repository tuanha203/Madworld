import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ImageBase from 'components/common/ImageBase';
import { CustomEthPrice, MadPriceMedium } from 'components/common/price';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { NULL_ADDRESS } from 'constants/app';
import { LINK_SCAN } from 'constants/envs';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { addCommaToNumberHasApproximately } from 'utils/currencyFormat';
import { abbreviateNumber, shortenNameNoti } from 'utils/func';

const bidIcon = '/icons/asset-detail/activity-bid.svg';
const mintedIcon = '/icons/asset-detail/activity-minted.svg';
const saleIcon = '/icons/asset-detail/activity-sale.svg';
const tagIcon = '/icons/asset-detail/activity-tag.svg';
const transferIcon = '/icons/asset-detail/activity-transfer.svg';
const offerIcon = '/icons/asset-detail/activity-offer.svg';

// TODO: more config
const ICON_BY_TYPE: any = {
  list: tagIcon,
  transfer: transferIcon,
  mint: mintedIcon,
  offer: offerIcon,
  sale: saleIcon,
  bid: bidIcon,
};

const ACTION_HAS_TX_HASH = ['mint', 'transfer', 'sale'];

const NULL_ADDRESS_SHORTEN = '0x0000000000000000000000000000000000000000';

const ItemFeedAssetProfile = ({ data }: any) => {
  const {
    activityType,
    createdAt,
    currencyToken,
    fromUser,
    toUser,
    transactionHash,
    quantity, // TODO
    price,
    fromAddress,
    toAddress,
  } = data || {};

  const router = useRouter();

  const [show, setShow] = useState(false);
  const { walletAddress: addressFrom, username: userNameFrom } = fromUser || {};
  const { walletAddress: addressTo, username: userNameTo } = toUser || {};
  const { icon } = useSelector((state:any) => state.theme);
  const handleRedirect = (address: string) => {
    if (address) {
      router.push(`/artist/${address}`);
    }
  };
  const typeAction = activityType?.toLowerCase();

  const isMintingAction = fromAddress === NULL_ADDRESS;
  const actionName = isMintingAction ? ACTION_HAS_TX_HASH[0] : activityType;
  const fromName = isMintingAction
    ? NULL_ADDRESS_SHORTEN
    : userNameFrom || addressFrom?.slice(0, 6) || '-';
  const toName = userNameTo || addressTo?.slice(0, 6) || '-';

  return (
    <div className="xl:py-4 xl:px-6 p-3 rounded-xl xl:w-auto w-full bg-background-dark-600">
      <div className="offering-list xl:w-[750px] w-full flex justify-between xl:items-[unset] items-center">
        <div className="xl:flex hidden gap-1">
          <div className="mr-7 xl:inline-block hidden">
            <img
              src={isMintingAction ? ICON_BY_TYPE['mint'] : ICON_BY_TYPE[activityType]}
              className="mr-[2px] pb-[6px]"
            />
            <span className="text--subtitle leading-none	capitalize">{actionName}</span>
          </div>
          <div className="flex">
            <ImageBase
              url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi7rL0Pf8pWzzgGOO_fbzQmkiNcRsNANakhg&usqp=CAU"
              errorImg="Avatar"
              alt="avatar"
              width="48px"
              height="48px"
              type="HtmlImage"
              className={`object-cover mr-[17px]`}
            />{' '}
            <div className="flex flex-col">
              <div className="text--subtitle leading-none	capitalize">Lucky Luck #123</div>
              <div className="flex gap-0.5 items-center text-archive-Neutral-Variant70 text-[11px] font-bold">
                {moment(createdAt).fromNow()}
                {ACTION_HAS_TX_HASH.includes(typeAction) && (
                  <a href={`${LINK_SCAN}tx/${transactionHash}`} target="_blank">
                    <img
                      src="/icons/etherscan-link.svg"
                      className="cursor-pointer hover:opacity-70"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="xl:hidden flex items-center">
          <div className="flex items-center w-8 h-8 overflow-hidden object-cover mr-[17px]">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi7rL0Pf8pWzzgGOO_fbzQmkiNcRsNANakhg&usqp=CAU"
              alt="avatar"
            />
          </div>
          <div className="xl:hidden flex flex-col justify-between min-w-[10px]">
            <div className="text--title-medium truncate ">Lucky Luck #123</div>
            <div className="flex gap-0.5 items-center text-archive-Neutral-Variant70 text-[11px] font-bold">
              {moment(createdAt).fromNow()}
              {ACTION_HAS_TX_HASH.includes(typeAction) && (
                <a href={`${LINK_SCAN}tx/${transactionHash}`} target="_blank">
                  <img
                    src="/icons/etherscan-link.svg"
                    className="cursor-pointer hover:opacity-70"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="xl:flex hidden flex-col w-[70px]">
          <div className="text--label-small h-[24px]">From</div>
          <ContentTooltip
            title={isMintingAction ? NULL_ADDRESS_SHORTEN : userNameFrom || addressFrom}
          >
            <div>
              <Link
                href={addressFrom && fromName !== '-' ? `/artist/${addressFrom}` : router.asPath}
              >
                <a className="text-primary-90 font-bold cursor-pointer leading-none	mt-auto">
                  {shortenNameNoti(fromName, 5)}
                </a>
              </Link>
            </div>
          </ContentTooltip>
        </div>
        <div className="xl:flex hidden flex-col w-[70px]">
          <div className="text--label-small h-[24px]">To</div>
          <ContentTooltip title={userNameTo || addressTo}>
            <div>
              <Link href={addressTo && toName !== '-' ? `/artist/${addressTo}` : router.asPath}>
                <a className="text-primary-90 font-bold cursor-pointer leading-none mt-auto">
                  {shortenNameNoti(toName, 5)}
                </a>
              </Link>
            </div>
          </ContentTooltip>
        </div>
        <div className="xl:flex hidden flex-col w-[50px]">
          <div className="text--label-small h-[24px]">Quantity</div>
          <div className="text-primary-90">1</div>
        </div>
        <div className="xl:w-[135px] flex">
          {currencyToken && price ? (
            currencyToken !== 'umad' ? (
              <ContentTooltip
                title={`${addCommaToNumberHasApproximately(
                  price,
                  20,
                )} ${currencyToken?.toUpperCase()}`}
              >
                <div>
                  <CustomEthPrice
                    eth={String(abbreviateNumber(price || 0, 2))}
                    customClass="mad-price-small text--title-medium flex self-end items-center"
                    currency={currencyToken?.toUpperCase()}
                    customClassImage={`w-5 h-[24px]`}
                  />
                </div>
              </ContentTooltip>
            ) : (
              <ContentTooltip title={`${addCommaToNumberHasApproximately(price, 20)} UMAD`}>
                <div>
                  <MadPriceMedium umad={String(abbreviateNumber(price || 0, 2))} />
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
        className={`xl:hidden w-[100%] rounded-xl ${
          !show ? 'view-hidden' : 'view-hidden-disable'
        } overflow-hidden`}
      >
        <div className="flex items-center justify-between gap-6 pt-2">
          <div className="xl:hidden flex flex-col gap-2 truncate">
            <div className="text--label-small">From</div>
            <div className="text-[#D6C7F2] text--label-medium truncate">
              <ContentTooltip
                title={isMintingAction ? NULL_ADDRESS_SHORTEN : userNameFrom || addressFrom}
              >
                <div>
                  <Link
                    href={
                      addressFrom && fromName !== '-' ? `/artist/${addressFrom}` : router.asPath
                    }
                  >
                    <a className="text-primary-90 font-bold cursor-pointer leading-none	mt-auto">
                      {shortenNameNoti(fromName, 5)}
                    </a>
                  </Link>
                </div>
              </ContentTooltip>
            </div>
          </div>
          <div className="flex flex-col gap-2 truncate">
            <div className="text--label-small">To</div>
            <div className="text-[#D6C7F2] text--body-medium truncate minw-[20px]">
              <ContentTooltip title={userNameTo || addressTo}>
                <div>
                  <Link href={addressTo && toName !== '-' ? `/artist/${addressTo}` : router.asPath}>
                    <a className="text-primary-90 font-bold cursor-pointer leading-none mt-auto">
                      {shortenNameNoti(toName, 5)}
                    </a>
                  </Link>
                </div>
              </ContentTooltip>
            </div>
          </div>
          <div className="flex flex-col  gap-2 truncate text-center">
            <div className="text--label-small ">Quantity</div>
            <div className=" text-secondary-60 text--body-medium truncate">{data?.quantity}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemFeedAssetProfile;
