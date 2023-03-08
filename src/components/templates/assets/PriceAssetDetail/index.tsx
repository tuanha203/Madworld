import BigNumber from 'bignumber.js';
import { DollarPrice, MadPrice, CustomEthPrice } from 'components/common/price';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import saleNftService from 'service/saleNftService';
import { roundNumber } from 'utils/func';
import { calculateDecliningPrice, setIntervalImmediately } from 'utils/utils';

const CustomHeaderPrice = ({ children }: any) => (
  <div className="mb-6 font-Chakra text-sm text-gray-c4 font-bold">{children}</div>
);
const PriceAssetDetail = ({
  assetDataDetail,
  bestNftSale,
  isBid = false,
  bestOfferOwner,
  setPriceBidSuggest,
  className,
  shortView,
}: any) => {
  const { priceNativeCoinUsd, priceUmadUsd } = useSelector((state: any) => ({
    priceNativeCoinUsd: state?.system?.priceNativeCoinUsd,
    priceUmadUsd: state?.system?.priceUmadUsd,
  }));

  const isDutchAuction = bestNftSale?.type === 'dutch_auction';

  const [headerText, setHeaderText] = useState<string>('');
  const [objPrice, setObjPrice] = useState<any>({});

  const [bestOffer, setBestOffer] = useState();
  const getBestOfferOfNft = async (nftId: number) => {
    try {
      const [data] = await saleNftService.getTopOffersByNftId(nftId, {
        limit: 1,
        page: 1,
        priceType: 'DESC',
      });

      setBestOffer(get(data, 'items.0'));
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isEmpty(bestNftSale) && typeof assetDataDetail?.id === 'number') {
      getBestOfferOfNft(assetDataDetail?.id);
    } else if (bestOfferOwner?.price) {
      getBestOfferOfNft(assetDataDetail?.id);
    }
  }, [assetDataDetail?.id, bestNftSale?.id, bestOfferOwner]);

  useEffect(() => {
    let dutchAuctionPriceId: any;
    if (isEmpty(bestNftSale) && bestOffer) {
      setHeaderText('Best Offer');
      setObjPrice(bestOffer);
      setPriceBidSuggest(bestOffer);
    } else if (isBid && isEmpty(bestOffer)) {
      setHeaderText('Minimum bid');
      setObjPrice(bestNftSale);
      setPriceBidSuggest(bestNftSale);
    } else if (isBid && bestOffer) {
      setHeaderText('Top bid');
      setObjPrice(bestOffer);
      setPriceBidSuggest(bestOffer);
    } else if (isDutchAuction) {
      setHeaderText('');
      dutchAuctionPriceId = setIntervalImmediately(() => {
        const currentTime = moment().unix();
        const expireDate = +bestNftSale?.expireDate;
        const startDate = +bestNftSale?.startDate;

        if (currentTime >= expireDate) {
          setObjPrice({ ...bestNftSale, price: bestNftSale?.endPrice });
          clearInterval(dutchAuctionPriceId);
          return;
        }

        if (currentTime < startDate) {
          setObjPrice({ ...bestNftSale, price: bestNftSale?.startPrice });
          clearInterval(dutchAuctionPriceId);
          return;
        }

        const priceDeclining = calculateDecliningPrice({
          startPrice: bestNftSale?.startPrice,
          endPrice: bestNftSale?.endPrice,
          expireDate,
          startDate: bestNftSale?.startDate,
        });

        setObjPrice({ ...bestNftSale, price: priceDeclining });
      }, 1000);

      setPriceBidSuggest(bestOffer);
    } else {
      setHeaderText('');
      setObjPrice(bestNftSale);
      setPriceBidSuggest(bestOffer);
    }
    return () => clearInterval(dutchAuctionPriceId);
  }, [bestNftSale?.id, bestOffer, isBid, bestNftSale?.price]);
  const calculdateDisplayPrice = useCallback((objPrice: any, priceConvert: any = '') => {
    const totalPrice = new BigNumber(objPrice?.price)
      .multipliedBy(objPrice?.quantity)
      .toFixed()
      .toString();
    if (priceConvert) {
      const totalPriceConvert = new BigNumber(totalPrice)
        .multipliedBy(priceConvert)
        .toFixed()
        .toString();
      return totalPriceConvert;
    }
    return totalPrice;
  }, []);
  if (isEmpty(bestNftSale) && isEmpty(bestOffer)) return <></>;

  const symbol = objPrice?.currencyToken?.toUpperCase();

  const IconDutchAuction = isDutchAuction && (
    <ContentTooltip
      title={`Price declining. The buy-it-now price is declining from ${roundNumber(
        bestNftSale?.startPrice,
        8,
      )} ${symbol} to ${roundNumber(bestNftSale?.endPrice, 8)} ${symbol}, ending in ${moment(
        +bestNftSale?.expireDate * 1e3,
      ).format('MMM Do, YYYY [at] h:mma')} ${moment().format('Z').slice(0, 3)}`}
    >
      <img src="/icons/IconDutchAuction.svg" alt="" className="ml-2" />
    </ContentTooltip>
  );

  return (
    <div className={`mt-[25px] ${className}`}>
      {headerText && <CustomHeaderPrice>{headerText}</CustomHeaderPrice>}

      {objPrice?.currencyToken === 'umad' ? (
        <>
          <div className="flex">
            <MadPrice
              fullDisplay={true}
              umad={String(roundNumber(objPrice?.price, 8))}
              customClass="text-[28px] max-w-[90vw] xl:max-w-full xl:w-[unset]"
              customClassIcon="xl:max-w-[unset]"
              shortView={shortView}
            />
            {IconDutchAuction}
          </div>
          <div className="usdEth pt-2.5 sm:mb-3 lg:mb-0">
            <DollarPrice
              dollar={String(roundNumber(objPrice?.price * priceUmadUsd, 8))}
            />
          </div>
        </>
      ) : (
        <>
          <div className="flex">
            <CustomEthPrice
              eth={`${String(roundNumber(objPrice?.price, 8))}`}
              shortView={shortView}
              customClass="text-[28px] w-[90vw] xl:w-[unset]"
              currency={objPrice?.currencyToken?.toUpperCase() || 'ETH'}
              fontSize="text-[28px] font-bold"
            />
            {IconDutchAuction}
          </div>
          <div className="usdEth pt-2.5 flex w-[90vw] xl:w-[unset]">
            <div className="border-r border-[#6F7978] px-3 mr-3  w-[45vw] xl:w-[unset]">
              <DollarPrice
                dollar={String(roundNumber(objPrice?.price * priceNativeCoinUsd, 8))}
              />
            </div>
            <MadPrice
              umad={
                priceUmadUsd
                  ? String(roundNumber((objPrice?.price * priceNativeCoinUsd) / priceUmadUsd, 8))
                  : '-'
              }
              customClass="text-base font-normal"
              customClassIcon="w-5"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PriceAssetDetail;
