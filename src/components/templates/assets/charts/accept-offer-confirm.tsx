import { FC, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import Link from 'next/link';

import { IconTokenOutlined } from 'components/common/iconography/IconBundle';
import { FilledButton } from 'components/common/buttons';
import Card from 'components/modules/AcceptThisOfferModal/Card';
import saleNftService from 'service/saleNftService';
import { MARKET_RAW_FEE_BUY_TOKEN } from 'constants/index';
import { OFFER_SALE_NFT_ACTION, PAYMENT_TOKEN, TYPE_IMAGE } from 'constants/app';
import { formatNumber, formatPrecisionAmount } from 'utils/formatNumber';
import ImageBase from 'components/common/ImageBase';
import coingeckoService from 'service/coingeckoService';
import get from 'lodash/get';
import { addCommaToNumberHasApproximately } from 'utils/currencyFormat';
import { shortenNameNoti } from 'utils/func';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { checkTypeMedia } from 'utils/func';
import { useDispatch } from 'react-redux';
import { toastError } from 'store/actions/toast';
import { MESSAGES_ERROR } from 'constants/message';
import { getERC20AmountBalance } from 'blockchain/utils';
import { PLEASE_RELOAD_PAGE } from 'constants/text';

interface IAcceptThisOfferProps {
  handleClose: () => void;
  handleAccept: (id: any) => void;
  offerId: number;
  assetDataDetail: any;
  isERC1155?: boolean;
  totalNftOfOwner: number;
}

const AcceptThisOffer: FC<IAcceptThisOfferProps> = (props) => {
  const dispatch = useDispatch();
  const { handleClose, handleAccept, offerId, assetDataDetail, isERC1155, totalNftOfOwner } = props;
  const [offerDetail, setOfferDetail] = useState<any>({});
  const [price, setPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const typeImage = checkTypeMedia(assetDataDetail?.nftUrl);
  const royalty = assetDataDetail?.collection?.royalty || 0;
  const royaltyFee =
    new BigNumber(offerDetail?.price || 0)
      .multipliedBy(royalty / 100)
      .multipliedBy(get(offerDetail, 'quantity', 1))
      .toString() || 0;

  const serviceFee = useMemo(() => {
    if (!offerDetail?.currencyToken) return 0;
    const tokenFee = offerDetail?.currencyToken;
    return new BigNumber(offerDetail?.price)
      .multipliedBy(offerDetail?.quantity)
      .multipliedBy(MARKET_RAW_FEE_BUY_TOKEN[tokenFee] / 100)
      .toString();
  }, [offerDetail]);

  useEffect(() => {
    const init = async () => {
      const [res] = await saleNftService.getOfferDetailById(offerId);
      setOfferDetail(res);

      if (res?.currencyToken === 'umad') {
        const priceRes = await coingeckoService.getPriceCoingecko('madworld', 'usd');
        const priceUsd = get(priceRes, 'madworld.usd', 0);
        setPrice(Number(priceUsd));
      } else {
        const priceRes = await coingeckoService.getPriceCoingecko('ethereum', 'usd');
        const priceUsd = get(priceRes, 'ethereum.usd', 0);
        setPrice(Number(priceUsd));
      }
    };
    if (offerId) {
      init();
    }
  }, [offerDetail?.currencyToken, offerId]);

  const totalEarning = new BigNumber(offerDetail?.price * offerDetail?.quantity)
    .minus(serviceFee)
    .minus(royaltyFee)
    .toString();

  const decimal = offerDetail?.currencyToken?.toUpperCase() === 'UMAD' ? 8 : 18;
  const checkValidBalanceOfTaker = async (
    currency: string,
    userAddress: string,
    amount: string,
  ) => {
    if (currency === 'umad') {
      const [balance, error] = await getERC20AmountBalance(
        process.env.NEXT_PUBLIC_UMAD_ADDRESS as string,
        userAddress as string,
      );

      if (parseInt(amount) < balance / 1e8) {
        return true;
      }

      dispatch(toastError(MESSAGES_ERROR.OFFER_MAKER_NO_ENOUGH_BALANCE));
      return false;
    } else if (currency === 'weth') {
      const [balance, error] = await getERC20AmountBalance(
        process.env.NEXT_PUBLIC_WETH_ADDRESS as string,
        userAddress as string,
      );
      if (parseInt(amount) < balance / 1e18) {
        return true;
      }
      dispatch(toastError(MESSAGES_ERROR.OFFER_MAKER_NO_ENOUGH_BALANCE));

      return false;
    } else {
      console.error('Not implement with currency', currency);
      dispatch(toastError(MESSAGES_ERROR.UNKNOWN));
      return false;
    }
  };
  const checkThisOffer = async () => {
    setIsLoading(true);
    const [offerDetail, err] = await saleNftService.getOfferDetailById(offerId);
    if (err) {
      setIsLoading(false);
      console.error(err);
      return;
    }

    if (get(offerDetail, 'quantity', 1) > totalNftOfOwner) {
      setIsLoading(false);
      dispatch(toastError(MESSAGES_ERROR.NO_ENOUGH_QUANTITY));
      return;
    }

    const totalPriceOffer = new BigNumber(offerDetail?.price)
      .multipliedBy(offerDetail?.quantity)
      .toFixed()
      .toString();

    const isValid = await checkValidBalanceOfTaker(
      offerDetail?.currencyToken?.toLowerCase(),
      offerDetail?.user?.walletAddress,
      totalPriceOffer,
    );

    if (!isValid) {
      setIsLoading(false);
      return
    }

    if (offerDetail?.type !== OFFER_SALE_NFT_ACTION.NOT_ACCEPT) {
      setIsLoading(false);
      return dispatch(toastError(PLEASE_RELOAD_PAGE));
    }
    handleClose();
    handleAccept(offerId);
  };
  return (
    <>
      <div className="modal-content md:pb-8 md:pt-3 w-full">
        <Card>
          <div>
            <h3 className="text--headline-xsmall justify-self-start w-full">Item</h3>
            <div className="w-full flex items-center gap-2">
              <div className="h-[72px] w-[72px] mx-auto overflow-hidden rounded-lg flex items-center justify-center">
                <div className="relative">
                  <ImageBase
                    url={assetDataDetail?.nftImagePreview || assetDataDetail?.nftUrl}
                    type="HtmlImage"
                    style={{
                      minWidth: '10px',
                      maxWidth: '72px',
                      height: '72px',
                      objectFit: 'contain',
                    }}
                  />
                  <div className={`flex absolute top-[4px] justify-between right-[3px]`}>
                    {typeImage === TYPE_IMAGE.MP3 && (
                      <img className="w-[13px] h-[13px] ml-auto" src="/icons/mp3_icons_card.svg" />
                    )}
                    {typeImage === TYPE_IMAGE.MP4 && (
                      <img className="w-[13px] h-[13px] ml-auto" src="/icons/mp4_icons_card.svg" />
                    )}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm">
                  Collection{' '}
                  <ContentTooltip title={assetDataDetail?.collection?.name} arrow>
                    <span>
                      <Link href={`/collection/${assetDataDetail?.collection?.address}`}>
                        <a className="text-primary-90 cursor-pointer font-bold" target="_blank">
                          {shortenNameNoti(assetDataDetail?.collection?.name, 15)}
                        </a>
                      </Link>
                    </span>
                  </ContentTooltip>
                </p>
                <ContentTooltip title={assetDataDetail.title}>
                  <span>
                    <Link
                      href={`/asset/${assetDataDetail?.collection?.address}/${assetDataDetail?.tokenId}`}
                    >
                      <a target="_blank">
                        <p className="text-lg text-primary-90 cursor-pointer font-bold">
                          {shortenNameNoti(assetDataDetail.title, 15)}
                        </p>
                      </a>
                    </Link>
                  </span>
                </ContentTooltip>
                {isERC1155 && (
                  <div className="opacity-[.38] text-sm">
                    Quantity: {formatNumber(offerDetail?.quantity)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center font-bold items-end">
            <ContentTooltip
              title={`${addCommaToNumberHasApproximately(
                new BigNumber(offerDetail?.price).multipliedBy(offerDetail?.quantity),
                // new BigNumber(offerDetail?.price),
                18,
              )} ${offerDetail?.currencyToken?.toUpperCase()}`}
            >
              <p className="text-base mb-1">
                {addCommaToNumberHasApproximately(
                  new BigNumber(offerDetail?.price).multipliedBy(offerDetail?.quantity),
                  // new BigNumber(offerDetail?.price),
                  8,
                )}{' '}
                {offerDetail?.currencyToken?.toUpperCase()}
              </p>
            </ContentTooltip>
            <ContentTooltip
              title={`$${addCommaToNumberHasApproximately(
                new BigNumber(offerDetail?.price)
                  .multipliedBy(offerDetail?.quantity)
                  .multipliedBy(price),
                18,
              )}`}
            >
              <p className="text-medium-emphasis text-sm">
                ($
                {addCommaToNumberHasApproximately(
                  new BigNumber(offerDetail?.price)
                    .multipliedBy(offerDetail?.quantity)
                    .multipliedBy(price),
                  8,
                )}
                )
              </p>
            </ContentTooltip>
          </div>
        </Card>
        <Card>
          <div className="w-full">
            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-bold text-base">Service Fee</p>
                <div className="flex flex-col items-end">
                  <ContentTooltip
                    title={`${addCommaToNumberHasApproximately(
                      serviceFee,
                      18,
                    )} ${offerDetail?.currencyToken?.toUpperCase()}`}
                  >
                    <p className="font-bold text-base mb-1">
                      {addCommaToNumberHasApproximately(serviceFee, 8)}{' '}
                      {offerDetail?.currencyToken?.toUpperCase()}
                    </p>
                  </ContentTooltip>
                  <ContentTooltip
                    title={`$${addCommaToNumberHasApproximately(
                      new BigNumber(serviceFee).multipliedBy(price)?.toString(),
                      18,
                    )}`}
                  >
                    <p className="font-bold text-sm text-medium-emphasis">
                      ($
                      {addCommaToNumberHasApproximately(
                        new BigNumber(serviceFee).multipliedBy(price)?.toString(),
                        8,
                      )}
                      )
                    </p>
                  </ContentTooltip>
                </div>
              </div>
            </div>
            <br />
            <div className="w-full">
              <div className="flex justify-between">
                <p className="font-bold text-base">Royalty Fee</p>
                <div className="flex flex-col items-end">
                  <ContentTooltip
                    title={`${addCommaToNumberHasApproximately(
                      royaltyFee,
                      18,
                    )} ${offerDetail?.currencyToken?.toUpperCase()}`}
                  >
                    <p className="font-bold text-base mb-1">
                      {addCommaToNumberHasApproximately(royaltyFee, 8)}{' '}
                      {offerDetail?.currencyToken?.toUpperCase()}
                    </p>
                  </ContentTooltip>
                  <ContentTooltip
                    title={`$${addCommaToNumberHasApproximately(
                      new BigNumber(royaltyFee).multipliedBy(price)?.toString(),
                      18,
                    )}`}
                  >
                    <p className="font-bold text-sm text-medium-emphasis">
                      ($
                      {addCommaToNumberHasApproximately(
                        new BigNumber(royaltyFee).multipliedBy(price)?.toString(),
                        8,
                      )}
                      )
                    </p>
                  </ContentTooltip>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <p className="font-bold text--headline-xsmall">Total Earning</p>
          <div className="font-bold text-base">
            <ContentTooltip
              title={`${formatPrecisionAmount(
                totalEarning,
                decimal,
              )} ${offerDetail?.currencyToken?.toUpperCase()}`}
            >
              <div className="font-bold text--total--price flex align-center mb-1">
                {offerDetail?.currencyToken?.toUpperCase() === PAYMENT_TOKEN.WETH ? (
                  <IconTokenOutlined image="/icons/weth.svg" className="mr-3 w-[18px]" />
                ) : (
                  <IconTokenOutlined image="/icons/mad_icon_outlined.svg" className="mr-3" />
                )}
                {addCommaToNumberHasApproximately(totalEarning, 8)}{' '}
                {offerDetail?.currencyToken?.toUpperCase()}
              </div>
            </ContentTooltip>
            <ContentTooltip title={`$${new BigNumber(totalEarning).multipliedBy(price)}`}>
              <p className="font-bold text-sm text-medium-emphasis text-right">
                ($
                {addCommaToNumberHasApproximately(
                  new BigNumber(totalEarning).multipliedBy(price),
                  8,
                )}
                )
              </p>
            </ContentTooltip>
          </div>
        </Card>
        <div className="mt-6">
          <FilledButton
            loading={isLoading}
            onClick={() => {
              checkThisOffer();
            }}
            text="Accept"
            customClass="!text--label-large ml-auto sm:w-full md:w-auto"
          />
        </div>
      </div>
    </>
  );
};

export default AcceptThisOffer;
