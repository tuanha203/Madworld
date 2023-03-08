import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import BigNumber from 'bignumber.js';
import {
  ActivityBidSvg,
  ActivityMintedSvg,
  ActivityOfferSvg,
  ActivitySaleSvg,
  ActivityTagSvg,
  ActivityTransferSvg,
  EtherscanLinkSvg,
} from 'components/common/iconography/iconsComponentSVG';
import { CustomEthPrice, MadPriceMedium } from 'components/common/price';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { NULL_ADDRESS, WINDOW_MODE } from 'constants/app';
import { LINK_SCAN } from 'constants/envs';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { addCommaToNumberHasApproximately } from 'utils/currencyFormat';
import { formatNumber } from 'utils/formatNumber';
import { abbreviateNumber, shortenNameNoti } from 'utils/func';

const ACTION_HAS_TX_HASH = ['mint', 'transfer', 'sale'];

const NULL_ADDRESS_SHORTEN = '0x0000000000000000000000000000000000000000';

const ItemFeedActivity = ({ data }: any) => {
  const {
    activityType,
    blockTimestamp,
    currencyToken,
    fromUser,
    toUser,
    transactionHash,
    quantity,
    price,
    fromAddress,
    toAddress,
  } = data || {};

  const router = useRouter();
  const [show, setShow] = useState(false);
  const { text, icon } = useSelector((state:any) => state.theme);
  const ICON_BY_TYPE: any = {
    list: <ActivityTagSvg className="mr-[2px] w-[20px] height-[20px]" color={icon?.color} />,
    transfer: (
      <ActivityTransferSvg className="mr-[2px] w-[20px] height-[20px]" color={icon?.color} />
    ),
    mint: <ActivityMintedSvg className="mr-[2px] w-[20px] height-[20px]" color={icon?.color} />,
    offer: <ActivityOfferSvg className="mr-[2px] w-[20px] height-[20px]" color={icon?.color} />,
    sale: <ActivitySaleSvg className="mr-[2px] w-[20px] height-[20px]" color={icon?.color} />,
    bid: <ActivityBidSvg className="mr-[2px] w-[20px] height-[20px]" color={icon?.color} />,
  };
  const { walletAddress: addressFrom, username: userNameFrom } = fromUser || {};
  const { walletAddress: addressTo, username: userNameTo } = toUser || {};

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
    : userNameFrom || fromAddress?.slice(0, 6) || '-';
  const toName = userNameTo || toAddress?.slice(0, 6) || '-';
  const windowMode = useDetectWindowMode();

  const calculateTotalPrice = (price: any, quantity: any) => {
    const totalPrice = new BigNumber(price).multipliedBy(quantity).toFixed().toString();
    return totalPrice;
  };

  return (
    <div className="offering-list xl:w-[530px] w-[100%]">
      <div className="py-4 px-6 rounded-xl bg-background-dark-600 ">
        <div className="flex justify-between">
          <div className="flex gap-1 xl:w-[120px]">
            <div className="shrink-0">
              {isMintingAction ? ICON_BY_TYPE['mint'] : ICON_BY_TYPE[activityType]}
            </div>
            <div className="flex flex-col justify-between ">
              <div className="text--subtitle leading-none	capitalize">{actionName}</div>
              <div
                className="flex gap-0.5 items-center text-primary-90 text--body-small"
                style={text}
              >
                {moment(blockTimestamp * 1000).fromNow()}
                {ACTION_HAS_TX_HASH.includes(typeAction) && (
                  <a
                    href={`${LINK_SCAN}tx/${transactionHash}`}
                    className="shrink-0"
                    target="_blank"
                  >
                    <EtherscanLinkSvg  className="cursor-pointer hover:opacity-70" color={icon?.color} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="hidden xl:flex flex-col xl:w-[50px]">
            <div className="text--label-small h-[24px]">From</div>
            <ContentTooltip
              title={isMintingAction ? NULL_ADDRESS_SHORTEN : userNameFrom || fromAddress}
              disableHoverListener={fromName?.length <= 5}
            >
              <div>
                <Link
                  href={fromAddress && fromName !== '-' ? `/artist/${fromAddress}` : router.asPath}
                >
                  <a
                    className="text-primary-90 text--body-small cursor-pointer leading-none	mt-auto"
                    style={text}
                  >
                    {shortenNameNoti(fromName, 5)}
                  </a>
                </Link>
              </div>
            </ContentTooltip>
          </div>
          <div className="hidden xl:flex flex-col xl:w-[50px]">
            <div className="text--label-small h-[24px]">To</div>
            <ContentTooltip
              title={userNameTo || toAddress}
              disableHoverListener={toName?.length <= 5}
            >
              <div>
                <Link href={toAddress && toName !== '-' ? `/artist/${toAddress}` : router.asPath}>
                  <a
                    className="text-primary-90 text--body-small cursor-pointer leading-none mt-auto"
                    style={text}
                  >
                    {shortenNameNoti(toName, 5)}
                  </a>
                </Link>
              </div>
            </ContentTooltip>
          </div>
          <div className="hidden xl:flex flex-col xl:w-[50px]">
            <div className="text--label-small h-[24px]">Quantity</div>

            <div>
              <a
                className="text-primary-90 text--body-small leading-none mt-auto my-auto"
                style={text}
              >
                {formatNumber(quantity)}
              </a>
            </div>
          </div>
          {[WINDOW_MODE.XL, WINDOW_MODE['2XL']].includes(windowMode) ? (
            <div className="w-[150px] mt-auto">
              {currencyToken && price && typeAction !== 'transfer' ? (
                currencyToken !== 'umad' ? (
                  <ContentTooltip
                    title={`${addCommaToNumberHasApproximately(
                      calculateTotalPrice(price, quantity),
                      20,
                    )} ${currencyToken?.toUpperCase()}`}
                    arrow
                  >
                    <div>
                      <CustomEthPrice
                        eth={String(abbreviateNumber(calculateTotalPrice(price, quantity) || 0, 2))}
                        customClass="mad-price-small text--title-medium flex self-end items-center"
                        currency={currencyToken?.toUpperCase()}
                        customClassImage={`w-5 h-[24px]`}
                        fontSize="text-[16px]"
                      />
                    </div>
                  </ContentTooltip>
                ) : (
                  <ContentTooltip
                    arrow
                    title={`${addCommaToNumberHasApproximately(
                      calculateTotalPrice(price, quantity),
                      20,
                    )} UMAD`}
                  >
                    <div>
                      <MadPriceMedium
                        umad={String(
                          abbreviateNumber(calculateTotalPrice(price, quantity) || 0, 2),
                        )}
                      />
                    </div>
                  </ContentTooltip>
                )
              ) : null}
            </div>
          ) : (
            <>
              {currencyToken !== 'umad' ? (
                <div className="xl:w-[135px] mt-auto uppercase flex">
                  <ContentTooltip
                    arrow
                    title={`${addCommaToNumberHasApproximately(
                      calculateTotalPrice(price, quantity),
                      20,
                    )} ${currencyToken?.toUpperCase()}`}
                  >
                    <>
                      {price && (
                        <div>
                          <CustomEthPrice
                            eth={String(
                              abbreviateNumber(calculateTotalPrice(price, quantity) || 0, 2),
                            )}
                            customClass="mad-price-small text--title-medium flex self-end items-center uppercase"
                            currency={currencyToken?.toUpperCase()}
                            customClassImage={`w-5 h-[24px]`}
                            fontSize="text-[16px]"
                          />
                        </div>
                      )}

                      <div
                        className="flex lg:hidden flex-col justify-between gap-2"
                        onClick={() => setShow(!show)}
                      >
                        {!show ? (
                          <KeyboardArrowDownIcon sx={{ color: '#F4B1A3' }} />
                        ) : (
                          <KeyboardArrowUpIcon sx={{ color: '#F4B1A3' }} />
                        )}
                      </div>
                    </>
                  </ContentTooltip>
                </div>
              ) : (
                <div className="xl:w-[135px] mt-auto uppercase flex">
                  <ContentTooltip
                    arrow
                    className="uppercase"
                    title={`${addCommaToNumberHasApproximately(
                      calculateTotalPrice(price, quantity),
                      20,
                    )} UMAD`}
                  >
                    <>
                      {price && (
                        <div>
                          <MadPriceMedium
                            umad={String(
                              abbreviateNumber(calculateTotalPrice(price, quantity) || 0, 2),
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex lg:hidden flex-col justify-between gap-2 "
                        onClick={() => setShow(!show)}
                      >
                        {!show ? (
                          <KeyboardArrowDownIcon sx={{ color: '#F4B1A3' }} />
                        ) : (
                          <KeyboardArrowUpIcon sx={{ color: '#F4B1A3' }} />
                        )}
                      </div>
                    </>
                  </ContentTooltip>
                </div>
              )}
            </>
          )}
        </div>
        <div
          className={`lg:hidden w-[100%] rounded-xl ${
            !show ? 'view-hidden' : 'view-hidden-disable'
          } overflow-hidden bg-background-dark-600  h-[auto] `}
        >
          <div className="flex items-center justify-between gap-6 py-4">
            <div className="md:hidden flex w-[70px] flex-col gap-2 truncate">
              <div className="text--label-small">From</div>
              <div className="text-[#D6C7F2] text--label-medium truncate">
                <ContentTooltip
                  title={isMintingAction ? NULL_ADDRESS_SHORTEN : userNameFrom || fromAddress}
                >
                  <div>
                    <Link
                      href={
                        fromAddress && fromName !== '-' ? `/artist/${fromAddress}` : router.asPath
                      }
                    >
                      <a
                        className="text-primary-90 text--body-small cursor-pointer leading-none	mt-auto"
                        style={text}
                      >
                        {shortenNameNoti(fromName, 5)}
                      </a>
                    </Link>
                  </div>
                </ContentTooltip>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[70px] truncate">
              <div className="text--label-small">To</div>
              <div className="text-[#D6C7F2] text--body-medium truncate minw-[20px]">
                <ContentTooltip title={userNameTo || toAddress}>
                  <div>
                    <Link
                      href={toAddress && toName !== '-' ? `/artist/${toAddress}` : router.asPath}
                    >
                      <a
                        className="text-primary-90 text--body-small text-sm cursor-pointer leading-none mt-auto"
                        style={text}
                      >
                        {shortenNameNoti(toName, 5)}
                      </a>
                    </Link>
                  </div>
                </ContentTooltip>
              </div>
            </div>
            <div className="flex flex-col gap-2 truncate">
              <div className="text--label-small">Quantity</div>
              <div className=" text-secondary-60 text--body-medium truncate" style={text}>
                {formatNumber(quantity)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemFeedActivity;
