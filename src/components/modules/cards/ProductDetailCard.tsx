import { TextButtonSquare } from 'components/common/buttons';
import Divider from 'components/common/divider';
import { HeartIcon } from 'components/common/iconography/IconBundle';
import ImageBase from 'components/common/ImageBase';
import { TokenPrice } from 'components/common/price';
import { DEFAULT_IMAGE, NFT_SALE_ACTIONS, TYPE_MEDIA, TYPE_SALE } from 'constants/app';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import images from 'themes/images';
import { abbreviateNumber, EllipsisDisplayName } from 'utils/func';
import ArtistMultiAvatar from '../artist-multi-avatar/ArtistMultiAvatar';

function secondsToTime(duration: number) {
  const dateNow = Math.floor(Date.now());
  let seconds: number | string = Math.floor(duration - dateNow / 1000);
  let minutes: number | string = Math.floor(seconds / 60);
  let hours: number | string = Math.floor(minutes / 60);
  let days: number | string = hours / 24;

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : Math.floor((minutes / 60) % 60);
  seconds = seconds < 10 ? '0' + seconds : Math.floor(seconds % 60);
  if (days >= 1) return `${Math.ceil(days)} days`;
  return `${hours}h ${minutes}m ${seconds}s`;
}

interface dataNFT {
  img?: string;
  type?: TYPE_MEDIA;
  artworkTitle: string;
  option: boolean;
  nftType: string;
  anyoneOffered: boolean;
  isOwner: boolean;
  isListing: boolean;
  typeSale: TYPE_SALE;
  likes: number;
  slideCover: boolean;
  millisecondsRemain: number;
}

interface IProductDetailCardProps {
  dataNFT?: any;
  isOwner?: boolean;
  isPreview?: boolean;
  styles?: {
    container: any;
    image: any;
  };
}

const ProductDetailCard = ({
  dataNFT = {},
  isOwner,
  isPreview,
  styles,
}: IProductDetailCardProps) => {
  const {
    nftUrl,
    title,
    option,
    type,
    isNFT1155,
    anyoneOffered,
    selected,
    typeSale,
    like,
    millisecondsRemain,
    nftSale,
    owner,
    offerSales,
    collection,
    creator,
    tokenId,
    description,
  } = dataNFT || {};

  const currencyToken = nftSale?.currencyToken;
  const expireDate = nftSale?.expireDate;
  const action = nftSale?.action;
  const typeNFT = nftSale?.type;
  const price = nftSale?.price;
  const address = collection?.address;
  const thumbnailUrl = collection?.thumbnailUrl;
  const avatarImg = creator?.avatarImg;
  const renderDisplayName = owner?.displayName || EllipsisDisplayName(owner?.walletAddress);
  const isListing = !_.isEmpty({ nftSale });

  const renderButtonViewOwner = () => {
    let ButtonContent;
    if (typeNFT === TYPE_SALE.FIXED_PRICE) {
      ButtonContent = <div />;
    } else if (
      (typeNFT === TYPE_SALE.AUCTION_ENG || typeNFT === TYPE_SALE.AUCTION_DUT) &&
      _.isEmpty(offerSales)
    ) {
      ButtonContent = <TextButtonSquare>Minimum Bid</TextButtonSquare>;
    } else if (
      (typeNFT === TYPE_SALE.AUCTION_ENG || typeNFT === TYPE_SALE.AUCTION_DUT) &&
      !_.isEmpty(offerSales)
    ) {
      ButtonContent = <TextButtonSquare>Top Bid</TextButtonSquare>;
    }

    return <>{ButtonContent}</>;
  };

  const renderButtonViewNonOwner = () => {
    let ButtonContent;
    if (isPreview) {
      ButtonContent = <TextButtonSquare customClass="font-bold">Buy Now</TextButtonSquare>;
    } else if (typeNFT === TYPE_SALE.FIXED_PRICE) {
      ButtonContent = <TextButtonSquare>Buy Now</TextButtonSquare>;
    } else if (
      (typeNFT === TYPE_SALE.AUCTION_ENG || typeNFT === TYPE_SALE.AUCTION_DUT) &&
      _.isEmpty(offerSales)
    ) {
      ButtonContent = <TextButtonSquare>Minimum Bid</TextButtonSquare>;
    } else if (
      (typeNFT === TYPE_SALE.AUCTION_ENG || typeNFT === TYPE_SALE.AUCTION_DUT) &&
      !_.isEmpty(offerSales)
    ) {
      ButtonContent = <TextButtonSquare>Top Bid</TextButtonSquare>;
    } else if (action === NFT_SALE_ACTIONS.CANCEL) {
      ButtonContent = <TextButtonSquare>Make Offer</TextButtonSquare>;
    }

    return <>{ButtonContent}</>;
  };
  return (
    <div
      style={styles?.container}
      className="product-detail-card md:w-[264px] sm:w-[100%] bg-background-dark-700 hover:bg-background-dark-600 shadow-elevation-dark-1 hover:shadow-elevation-dark-5 relative flex flex-col"
    >
      <div
        className={`flex absolute ${
          selected || option ? 'top-10' : 'top-6'
        } justify-between w-[100%] px-3`}
      >
        {isListing ? <SaleEndTime millisecondsRemain={expireDate || 0} /> : null}
        {type === TYPE_MEDIA.MP3 ? (
          <img className="z-[12] ml-auto" src="/icons/mp3_icons_card.svg" />
        ) : type === TYPE_MEDIA.MP4 ? (
          <img className="z-[12] ml-auto" src="/icons/mp4_icons_card.svg" />
        ) : null}
      </div>
      <figure
        style={styles?.image}
        className="relative overflow-hidden md:w-[264px] h-[234px] sm:flex sm:w-[100%]"
      >
        <ImageBase
          className="w-full object-cover"
          alt="card"
          url={nftUrl}
        />
        <div
          className={`${
            isPreview
              ? 'card-corner-preview bg-background-preview-sell'
              : 'card-corner bg-background-dark-800'
          } z-50`}
        />
        <div className="overlay-text absolute top-0 left-0 w-full h-full rotate-180 opacity-50"></div>
        <div className="status-chip absolute bottom-0 right-0 flex items-center"></div>
      </figure>

      <div className="p-4 pb-2 mt-auto">
        <div className="flex flex-col justify-center mb-4">
          <h2 className="text--title-medium capitalize text-ellipsis">{title || ''}</h2>
        </div>

        <div className="drop-footer flex justify-between items-center">
          <ArtistMultiAvatar
            srcAvatarCollection={
              isPreview
                ? thumbnailUrl
                : images.avatar.avatarEmpty
            }
            srcAvatarCreator={
              isPreview
                ? avatarImg
                : images.avatar.avatarEmpty
            }
            artistName={renderDisplayName}
            addressCollection={address}
            addressArtist={tokenId}
          />

          {isPreview ? null : (
            <div className="flex items-center gap-2">
              <HeartIcon />
              <span className="text--label-medium">{abbreviateNumber(like)}</span>
            </div>
          )}
        </div>
        <Divider customClass="mt-3 opacity-20" />
        <div className="flex items-center justify-between h-[50px]">
          {isOwner ? renderButtonViewOwner() : renderButtonViewNonOwner()}
          {!_.isEmpty(nftSale) && (
            <div className="ml-auto">
              <TokenPrice
                price={price}
                currentPrice={price}
                isPreview={isPreview}
                currencyToken={currencyToken}
                customClass="!text--title-medium"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProductDetailCard.defaultProps = {
  nftUrl: '',
  img: '',
  title: '',
  option: false,
  type: '',
  // status
  isListing: true,
  isOwner: false,
  isNFT1155: false,
  anyoneOffered: true,
  typeSale: TYPE_SALE.AUCTION_ENG,
  likes: 90,
  slideCover: false,
  millisecondsRemain: 200000,
  dataNFT: {
    nftSale: {
      expireDate: 0,
      action: null,
      type: null,
      typeNFT: null,
      price: null,
      currencyToken: null,
    },
    collection: {},
    creator: {},
    owner: {},
  },
};

ProductDetailCard.defaultProps = {};

export default ProductDetailCard;

const SaleEndTime = ({ millisecondsRemain }: { millisecondsRemain: number }) => {
  const dateNow = Math.floor(Date.now());
  const [secCountDown, setSecCountDown] = useState(Math.floor(millisecondsRemain / 1000));
  if (dateNow > Number(millisecondsRemain)) return <div />;

  useEffect(() => {
    let intervalId = setInterval(() => {
      setSecCountDown((seconds: number) => {
        if (seconds !== 0) return seconds - 1;
        clearInterval(intervalId);
        return seconds;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
      className={` font-bold text-sm z-[10] px-[12px] py-[6px] bg-primary-dark rounded h-10 leading-7`}
    >
      {secondsToTime(secCountDown)}
    </div>
  );
};
