import { PAYMENT_TOKEN, TYPE_IMAGE } from 'constants/app';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumber } from 'utils/formatNumber';
import { checkTypeMedia, shortenNameNoti } from 'utils/func';
import ImageBase from 'components/common/ImageBase';
import Link from 'next/link';
import { TokenPrice } from 'components/common/price';
import { addCommaToNumberHasApproximately } from 'utils/currencyFormat';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { removeEventChangePage } from 'store/actions/forceUpdating';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';

interface INftItem {
  collectionName: string;
  nftName: string;
  nftImage: string;
  isErc1155: boolean;
  currency: string;
  quantity?: number;
  price: number;
  collectionAddress?: string;
  nftUrl?: string;
  supply?: number;
  typeUrl?: string;
}

const NftItem: FC<INftItem> = (props) => {
  const {
    collectionName = '',
    nftName = '',
    nftImage,
    isErc1155,
    currency,
    quantity,
    price,
    collectionAddress,
    nftUrl = '',
    supply = '',
    typeUrl = '',
  } = props;
  const dispatch = useDispatch();

  const isUMAD = currency === PAYMENT_TOKEN.UMAD;
  const typeImage = checkTypeMedia(nftUrl);

  const { priceNativeCoinUsd, priceUmadUsd } = useSelector((state: any) => ({
    priceNativeCoinUsd: state?.system?.priceNativeCoinUsd,
    priceUmadUsd: state?.system?.priceUmadUsd,
  }));

  const handleViewCollection = () => {
    dispatch(removeEventChangePage(1));
    setTimeout(() => {
      dispatch(removeEventChangePage(0));
    }, 500);
  };
  
  return (
    <div className="w-full lg:px-0 px-3">
      <div className="mb-2.5 font-bold text-lg">Item</div>
      <div className="flex justify-between">
        <div className="flex">
          <div className="w-fit mx-auto rounded-lg overflow-hidden flex items-center justify-center">
            <div className="relative">
              <ImageBase
                width="100%"
                height="100%"
                alt="No Data"
                className="max-w-[65px] max-h-[65px] object-contain"
                type="HtmlImage"
                layout="fill"
                errorImg="Default"
                url={URL.createObjectURL(nftImage)}
              />
              <div className={`flex absolute top-[4px] justify-between right-[3px]`}>
                {typeUrl ||
                  (typeImage === TYPE_IMAGE.MP3 && (
                    <img className="w-[13px] h-[13px] ml-auto" src="/icons/mp3_icons_card.svg" />
                  ))}
                {typeUrl ||
                  (typeImage === TYPE_IMAGE.MP4 && (
                    <img className="w-[13px] h-[13px] ml-auto" src="/icons/mp4_icons_card.svg" />
                  ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-around ml-3">
            <Link onClick={handleViewCollection} href={`/collection/${collectionAddress}`}>
              <a target="_blank">
                <ContentTooltip title={collectionName}>
                  <span className="text-xs text-primary-90">
                    {shortenNameNoti(collectionName || 'Unknown', 22)}
                  </span>
                </ContentTooltip>
              </a>
            </Link>
            <Link href={typeof window !== 'undefined' ? window.location.href : ''}>
              <a target="_blank">
                <OverflowTooltip
                  style={{ cursor: 'pointer' }}
                  title={nftName}
                  arrow
                  className="max-w-[100px] text-primary-90"
                >
                  <span className="font-bold text-base text-primary-90">
                    {nftName ?? 'Unknown'}
                  </span>
                </OverflowTooltip>
              </a>
            </Link>
            {supply && <p className="text-xs	font-normal">Supply: {formatNumber(supply)}</p>}
            {isErc1155 && <div className="text-xs">Quantity: {formatNumber(quantity)}</div>}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <ContentTooltip title={`${price} ${currency}`}>
            <div className="text-base font-bold">
              <TokenPrice
                price={addCommaToNumberHasApproximately(price)}
                currentPrice={price}
                isUnit={true}
                currencyToken={currency}
                customClass="!text--title-medium"
              />{' '}
            </div>
          </ContentTooltip>
          <div className="font-normal text-base opacity-70 text-right">
            $
            {isUMAD
              ? formatNumber(priceUmadUsd * price, 8)
              : formatNumber(priceNativeCoinUsd * price, 8)}
          </div>
        </div>
      </div>
    </div>
  );
};

NftItem.defaultProps = {};

export default NftItem;
