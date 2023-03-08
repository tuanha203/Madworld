import FavoriteIcon from '@mui/icons-material/Favorite';
import Divider from 'components/common/divider';
import { HeartIcon } from 'components/common/iconography/IconBundle';
import ImageBase from 'components/common/ImageBase';
import { TokenPrice } from 'components/common/price';
import SaleEndTime from 'components/common/saleEndTime';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import LoadingBase from 'components/modules/Loading';
import { ASSET_TYPE, TYPE_DURATION, TYPE_IMAGE, TYPE_LIKES, TYPE_SALE } from 'constants/app';
import _, { debounce, get } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import likeService from 'service/likeService';
import nftService from 'service/nftService';
import { toastError, toastSuccess } from 'store/actions/toast';
import { abbreviateNumber, checkOwner, checkTypeMedia, EllipsisDisplayName } from 'utils/func';
import { calculateDecliningPrice, setIntervalImmediately } from 'utils/utils';
import ArtistMultiAvatar from '../artist-multi-avatar/ArtistMultiAvatar';
interface ICardCommon {
  dataNFT: any;
  styles?: any;
  type: TYPE_LIKES;
  loading?: boolean;
  className?: string;
  dateNow?: any;
  smallItem?: boolean;
  hidenRefresh?: boolean;
  hidenLike?: boolean;
  hidenBtn?: boolean;
  linkRedirect?: string;
  callbackFetchList: any;
}

const CardCommon: FC<ICardCommon> = ({
  dataNFT,
  styles,
  type,
  className,
  loading,
  dateNow,
  smallItem,
  hidenRefresh,
  hidenLike,
  hidenBtn,
  linkRedirect,
  callbackFetchList,
}: ICardCommon) => {
  const [nft, setNft] = useState<any>({});

  const {
    nftUrl,
    title,
    option,
    selected,
    likes,
    liked,
    nftSales = [],
    bestFixPrice,
    bestBidSale,
    owners = [],
    bestOfferSale = {},
    collection = {},
    nftImagePreview,
    id,
  } = nft;

  const nftSale = bestFixPrice || nftSales?.[0] || {};

  const {
    type: nftSaleType,
    price: nftSalePrice,
    currencyToken: nftSaleCurrencyToken,
    expireDate,
    startDate,
    startPrice,
    endPrice,
  } = nftSale;

  const { price: bestOfferSalePrice, currencyToken: bestOfferSaleCurrencyToken } =
    bestOfferSale || {};

  const {
    thumbnailUrl: collectionThumbnailUrl,
    address: collectionAddress,
    name: nameCollection,
    type: typeCollection,
    title: titleCollection,
  } = collection;

  const ownersSorted = owners?.sort(
    (owner1: any, owner2: any) => owner2?.remainAmount - owner1?.remainAmount,
  );

  const ownerOfCurrentNFT =
    get(bestFixPrice, 'user.walletAddress', '') ||
    get(bestBidSale, 'user.walletAddress', '') ||
    get(bestOfferSale, 'user.walletAddress', '');

  const ownerNft =
    owners.find((item: any) => item?.walletAddress === ownerOfCurrentNFT) || ownersSorted[0] || {};

  const {
    avatarImg,
    username,
    walletAddress: walletAddressOwner,
    isVerify,
    id: idOwner,
  }: any = ownerNft;

  const dispatch = useDispatch();
  const router = useRouter();
  const isListing = !_.isEmpty({ nftSale });
  const typeMedia = checkTypeMedia(nftUrl);
  const [likedNft, setLiked] = useState<boolean>(false);
  const [countLike, setCountLike] = useState<number>(0);
  const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false);
  const renderDisplayName = username || EllipsisDisplayName(walletAddressOwner);
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const [disableLike, setDisableLike] = useState(false);
  const isOwner = checkOwner(walletAddressOwner, walletAddress);
  const expireDateNftSale = Number(expireDate);
  const startDateNftSale = Number(startDate);
  const typeDuration = expireDateNftSale === 0 ? TYPE_DURATION.UNLIMITED : TYPE_DURATION.LIMITED;
  let millisecondsRemain;
  if (startDateNftSale - dateNow > 0) {
    millisecondsRemain = startDateNftSale ? startDateNftSale + 15 - dateNow : -1;
  } else {
    millisecondsRemain = expireDateNftSale ? expireDateNftSale + 15 - dateNow : -1;
  }

  const [dutchAuctionPrice, setDutchAuctionPrice] = useState<string>('');

  const isDutchAuctionCard = nftSaleType === TYPE_SALE.AUCTION_DUT;

  useEffect(() => {
    setNft({ ...dataNFT });
  }, [dataNFT]);

  useEffect(() => {
    if (likes !== undefined || likes !== null) setCountLike(likes);
    if (_.isBoolean(liked)) setLiked(liked);
  }, [likes, liked]);

  const onLike = useCallback(
    async (id) => {
      setDisableLike(true);
      const [res] = await likeService.like({ targetId: id, type });
      if (res === 'liked') {
        setLiked(true);
        setCountLike(countLike + 1);
      }
      if (res === 'unliked') {
        setLiked(false);
        setCountLike(countLike - 1);
      }
      setDisableLike(false);
    },
    [countLike],
  );

  const refreshNftMetaData = debounce(async () => {
    try {
      setLoadingRefresh(true);
      const [result, error] = await nftService.refreshNFtMetaData({
        tokenId: nft?.tokenId,
        collectionAddress: nft?.collection?.address,
      });
      if (error) return dispatch(toastError('Something went wrong'));
      const { title, description, nftImagePreview, nftUrl } = result;
      setNft({
        ...nft,
        title,
        description,
        nftImagePreview,
        nftUrl,
      });
      dispatch(toastSuccess('Refresh successfully!'));
    } catch (err: any) {
      console.error(err);
      dispatch(toastError('Something went wrong'));
    } finally {
      setLoadingRefresh(false);
    }
  }, 300);

  const handleViewAssetDetail = () => {
    router.push(`/asset/${nft?.collection?.address}/${nft?.tokenId}`);
  };

  useEffect(() => {
    let timer: any;
    if (isDutchAuctionCard) {
      timer = setIntervalImmediately(() => {
        const price: string = calculateDecliningPrice({
          startPrice: nftSale?.startPrice,
          endPrice: nftSale?.endPrice,
          expireDate: nftSale?.expireDate,
          startDate: nftSale?.startDate,
        });
        setDutchAuctionPrice(price);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isDutchAuctionCard]);

  const renderButtonViewNonOwnerErc721 = () => {
    if (nftSaleType === TYPE_SALE.FIXED_PRICE || isDutchAuctionCard) {
      return (
        <>
          <div
            className="text-sm text-primary-90 cursor-pointer font-bold truncate"
            onClick={handleViewAssetDetail}
          >
            Buy Now
          </div>
          <div className="ml-auto">
            {/* lấy price và currency trong nft sale  */}
            <TokenPrice
              price={abbreviateNumber(isDutchAuctionCard ? dutchAuctionPrice : nftSalePrice)}
              currentPrice={isDutchAuctionCard ? dutchAuctionPrice : nftSalePrice}
              currencyToken={nftSaleCurrencyToken}
              customClass="!text--title-medium"
              customClassPrice={smallItem ? 'max-w-[25px]' : ''}
            />
          </div>
        </>
      );
    } else if (nftSaleType === TYPE_SALE.AUCTION_ENG && _.isEmpty(bestBidSale)) {
      return (
        <>
          <div className="text-sm text-light-on-primary  truncate">Minimum Bid</div>
          {/* <Tooltip title="Minimum Bid">
            <div className="text-sm text-light-on-primary ml-3 truncate">Minimum Bid</div>
          </Tooltip> */}
          {/* Minimum bid ko có bestOfferSale, ko có bestOfferSale, lấy price và currency nftSale */}
          <TokenPrice
            price={abbreviateNumber(nftSalePrice)}
            currentPrice={nftSalePrice}
            currencyToken={bestOfferSaleCurrencyToken || nftSaleCurrencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[25px]' : ''}
          />
        </>
      );
    } else if (
      (nftSaleType === TYPE_SALE.AUCTION_ENG || nftSaleType === TYPE_SALE.AUCTION_DUT) &&
      !_.isEmpty(bestBidSale)
    ) {
      return (
        <>
          <div className="text-sm text-light-on-primary truncate">Top Bid</div>
          {/* Minimum bid ko có bestOfferSale, lấy price và currency bestOfferSale nếu ko có thì lấy trong nftSale */}
          <TokenPrice
            price={abbreviateNumber(bestBidSale?.price)}
            currentPrice={bestBidSale.price}
            currencyToken={bestBidSale?.currencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[25px]' : ''}
          />
        </>
      );
    } else if (!_.isEmpty(bestOfferSale)) {
      return (
        <>
          <div
            className="text-sm text-primary-90 cursor-pointer font-bold truncate"
            onClick={handleViewAssetDetail}
          >
            Make Offer
          </div>
          <TokenPrice
            price={abbreviateNumber(bestOfferSalePrice)}
            currentPrice={bestOfferSalePrice}
            currencyToken={bestOfferSaleCurrencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[25px]' : ''}
          />
        </>
      );
    } else {
      return (
        <>
          <div
            className="text-sm text-primary-90 cursor-pointer font-bold truncate"
            onClick={handleViewAssetDetail}
          >
            Make Offer
          </div>
          {bestOfferSalePrice && (
            <TokenPrice
              price={abbreviateNumber(bestOfferSalePrice)}
              currencyToken={bestOfferSaleCurrencyToken}
              customClass="!text--title-medium"
              customClassPrice={smallItem ? 'max-w-[25px]' : ''}
            />
          )}
        </>
      );
    }
  };
  const renderButtonViewOwnerErc721 = () => {
    if (nftSaleType === TYPE_SALE.FIXED_PRICE || isDutchAuctionCard) {
      return (
        <>
          <div />
          {/* view owner chỉ hiển thị giá, ko có bestOfferSale, lấy price và currency nftSale */}
          <TokenPrice
            price={abbreviateNumber(isDutchAuctionCard ? dutchAuctionPrice : nftSalePrice)}
            currentPrice={isDutchAuctionCard ? dutchAuctionPrice : nftSalePrice}
            currencyToken={nftSaleCurrencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[25px]' : ''}
          />
        </>
      );
    } else if (nftSaleType === TYPE_SALE.AUCTION_ENG && _.isEmpty(bestBidSale)) {
      return (
        <>
          <div className="text-sm text-light-on-primary truncate">Minimum Bid</div>
          {/* <Tooltip title="Minimum Bid">
            <div className="text-sm text-light-on-primary ml-3 truncate">Minimum Bid</div>
          </Tooltip> */}
          {/*view non-owner và owner hiển thị giống nhau, Minimum bid ko có bestOfferSale, lấy price và currency nftSale */}
          <TokenPrice
            price={abbreviateNumber(nftSalePrice)}
            currentPrice={nftSalePrice}
            currencyToken={bestOfferSaleCurrencyToken || nftSaleCurrencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[25px]' : ''}
          />
        </>
      );
    } else if (
      (nftSaleType === TYPE_SALE.AUCTION_ENG || nftSaleType === TYPE_SALE.AUCTION_DUT) &&
      !_.isEmpty(bestBidSale)
    ) {
      return (
        <>
          <div className="text-sm text-light-on-primary">Top Bid</div>
          {/*view non-owner và owner hiển thị giống nhau, Minimum bid ko có bestOfferSale, lấy price và currency bestOfferSale */}
          <TokenPrice
            price={abbreviateNumber(bestBidSale?.price)}
            currentPrice={bestBidSale?.price}
            currencyToken={bestBidSale?.currencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[25px]' : ''}
          />
        </>
      );
    } else if (!_.isEmpty(bestOfferSale)) {
      return (
        <>
          <div className="text-sm text-light-on-primary truncate">Best Offer</div>
          {/*view non-owner và owner hiển thị giống nhau, lấy price và currency bestOfferSale */}
          <TokenPrice
            price={abbreviateNumber(bestOfferSalePrice)}
            currentPrice={bestOfferSalePrice}
            currencyToken={bestOfferSaleCurrencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[25px]' : ''}
          />
        </>
      );
    } else {
      return <div />;
    }
  };

  const renderButtonWithErc721 = () => {
    return <>{isOwner ? renderButtonViewOwnerErc721() : renderButtonViewNonOwnerErc721()}</>;
  };

  const renderButtonViewOwnerErc1155 = () => {
    if (nftSaleType === TYPE_SALE.FIXED_PRICE) {
      return (
        <>
          <div />
          <TokenPrice
            price={abbreviateNumber(nftSalePrice)}
            currentPrice={nftSalePrice}
            currencyToken={nftSaleCurrencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[30px]' : ''}
          />
        </>
      );
    }
    if (!_.isEmpty(bestOfferSale)) {
      return (
        <>
          <div className="text-sm text-light-on-primary truncate">Best Offer</div>
          <TokenPrice
            price={abbreviateNumber(bestOfferSalePrice)}
            currentPrice={bestOfferSalePrice}
            currencyToken={bestOfferSaleCurrencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[25px]' : ''}
          />
        </>
      );
    }
  };

  const renderButtonViewNonOwnerErc1155 = () => {
    if (nftSaleType === TYPE_SALE.FIXED_PRICE) {
      return (
        <>
          <div
            className="text-sm text-primary-90 cursor-pointer font-bold truncate"
            onClick={handleViewAssetDetail}
          >
            Buy Now
          </div>
          <div className="ml-auto">
            {/* lấy price và currency trong nft sale  */}
            <TokenPrice
              price={abbreviateNumber(nftSalePrice)}
              currencyToken={nftSaleCurrencyToken}
              customClass="!text--title-medium"
              customClassPrice={smallItem ? 'max-w-[25px]' : ''}
              currentPrice={nftSalePrice}
            />
          </div>
        </>
      );
    } else if (!_.isEmpty(bestOfferSale)) {
      return (
        <>
          <div
            className="text-sm text-primary-90 cursor-pointer font-bold truncate"
            onClick={handleViewAssetDetail}
          >
            Make Offer
          </div>
          {/*view non-owner và owner hiển thị giống nhau, lấy price và currency bestOfferSale */}
          <TokenPrice
            price={abbreviateNumber(bestOfferSalePrice)}
            currentPrice={bestOfferSalePrice}
            currencyToken={bestOfferSaleCurrencyToken}
            customClass="!text--title-medium"
            customClassPrice={smallItem ? 'max-w-[25px]' : ''}
          />
        </>
      );
    } else {
      return (
        <div
          className="text-sm text-primary-90 cursor-pointer font-bold truncate"
          onClick={handleViewAssetDetail}
        >
          Make Offer
        </div>
      );
    }
  };

  const renderButtonWithErc1155 = () => {
    return <>{isOwner ? renderButtonViewOwnerErc1155() : renderButtonViewNonOwnerErc1155()}</>;
  };

  const isNFT721 = nft?.collection?.type === 'ERC721';

  return (
    <LoadingBase loading={loading}>
      <div className="relative">
        {!isNFT721 && (
          <div className="flex justify-center absolute bottom-[-7px] w-[100%] h-[100%] z-[1] box-shadow-card">
            <div
              style={styles ? styles.container : {}}
              className={`p-4 !w-[94%] font-Chakra nft-card-back h-full product-detail-card bg-[#373d4a] hover:bg-secondary-ref hover:shadow-elevation-dark-5 relative flex flex-col`}
            ></div>
          </div>
        )}
        <div className="relative z-[2] box-shadow-card">
          <div
            style={styles ? styles.container : {}}
            className={`${className} p-4 font-Chakra nft-card-common h-full product-detail-card sm:w-[100%] bg-background-700 hover:bg-secondary-ref shadow-elevation-dark-1 hover:shadow-elevation-dark-5 relative flex flex-col`}
          >
            <div className="absolute top-7 lg:px-4 z-50">
              {isListing && (
                <SaleEndTime
                  millisecondsRemain={millisecondsRemain}
                  typeDuration={typeDuration}
                  callbackFetchList={callbackFetchList}
                />
              )}
            </div>
            <Link href={linkRedirect || `/asset/${nft?.collection?.address}/${nft?.tokenId}`}>
              <a className="clip-path-image-nft">
                <figure
                  style={styles ? styles.image : {}}
                  className="relative overflow-hidden h-[114px] lg:h-[234px] flex items-center justify-center cursor-pointer mb-5"
                >
                  <div className="relative max-h-[114px] lg:max-h-[234px] border-[0]">
                    <ImageBase
                      className="w-full object-contain max-h-[114px] lg:max-h-[234px] border-[0]"
                      url={nftImagePreview || nftUrl}
                      type="HtmlImage"
                      layout="fill"
                      style={{
                        objectFit: 'contain',
                      }}
                    />
                    {nft && nft.isUnlockableContent && (
                      <ContentTooltip title={'Includes unlockable content'} arrow>
                        <div className="absolute w-[48px] h-[32px] bg-[#373D4A] right-[0] top-3 rounded-tl-[7px] flex items-center justify-center h-[100%] hover:bg-secondary-ref">
                          <img className="w-[16px] h-[16px]" src="/social/unlock-icon.svg" />
                        </div>
                      </ContentTooltip>
                    )}
                  </div>
                </figure>
              </a>
            </Link>
            <div className="pb-1 mt-auto">
              <div className="flex mb-4 w-full">
                <div className="w-full flex items-center h-[20px]">
                  <div
                    className={`title flex items-center  ${
                      !hidenRefresh ? 'max-w-[90%] w-[90%]' : 'w-full'
                    }`}
                  >
                    {typeMedia === TYPE_IMAGE.MP3 ? (
                      <img
                        className="w-[20px] h-[20px] mr-[10px]"
                        src="/icons/mp3_icons_card.svg"
                      />
                    ) : typeMedia === TYPE_IMAGE.MP4 ? (
                      <img
                        className="w-[20px] h-[20px] mr-[10px]"
                        src="/icons/mp4_icons_card.svg"
                      />
                    ) : null}
                    <Link href={`/asset/${nft?.collection?.address}/${nft?.tokenId}`}>
                      <a className="truncate">
                        <h2 className="text--title-medium  text-base">
                          <OverflowTooltip title={title || nft?.id}>
                            {title || nft?.id}
                          </OverflowTooltip>
                        </h2>
                      </a>
                    </Link>
                  </div>
                  {!hidenRefresh && (
                    <div className="flex justify-end action max-w-[20%] w-[20%]">
                      <ContentTooltip arrow title="Refresh Metadata">
                        <div
                          className="rounded-lg h-fit cursor-pointer hover:bg-cyan-blue"
                          onClick={loadingRefresh ? () => {} : refreshNftMetaData}
                        >
                          <img
                            className={`${loadingRefresh ? 'refreshBtn' : ''} w-4 h-4`}
                            src="/icons/refresh-btn.svg"
                          />
                        </div>
                      </ContentTooltip>
                    </div>
                  )}
                </div>
              </div>
              <div className="drop-footer flex justify-between items-center">
                <ArtistMultiAvatar
                  srcAvatarCollection={collectionThumbnailUrl}
                  srcAvatarCreator={avatarImg}
                  artistName={renderDisplayName}
                  fullArtistName={username || walletAddressOwner}
                  addressCollection={collectionAddress}
                  addressArtist={walletAddressOwner}
                  nameCollection={titleCollection || nameCollection}
                  verified={isVerify}
                  disableLinkArtist={!idOwner}
                  modeVerified
                />
                {!hidenLike && (
                  <div
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => !disableLike && onLike(id)}
                  >
                    {likedNft ? <FavoriteIcon sx={{ color: '#f4b1a3' }} /> : <HeartIcon />}
                    <span className="text--label-medium text-[11px]">
                      {abbreviateNumber(countLike)}
                    </span>
                  </div>
                )}
              </div>
              <Divider customClass="mt-4 opacity-20 mb-4" />
              <div className="flex items-center justify-between min-h-[24px]">
                {!hidenBtn
                  ? typeCollection === ASSET_TYPE.ERC721
                    ? renderButtonWithErc721()
                    : renderButtonWithErc1155()
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LoadingBase>
  );
};

CardCommon.defaultProps = {
  dataNFT: {
    nftSale: {},
    collection: {},
    creator: {},
    owners: [],
    nftUrl: '',
    title: '',
    option: '',
    selected: '',
    like: 0,
    bestOfferSale: [],
    nftImagePreview: '',
    smallItem: false,
  },
};

export default memo(CardCommon);
