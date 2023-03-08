import { Tooltip } from '@mui/material';
import Divider from 'components/common/divider';
import { HeartIcon } from 'components/common/iconography/IconBundle';
import ImageBase from 'components/common/ImageBase';
import { TokenPrice } from 'components/common/price';
import SaleEndTime from 'components/common/saleEndTime';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { ASSET_TYPE, NFT_SALE_ACTIONS, TYPE_MEDIA, TYPE_SALE } from 'constants/app';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { abbreviateNumber, checkTypeMedia, EllipsisDisplayName } from 'utils/func';
import ArtistMultiAvatar from '../artist-multi-avatar/ArtistMultiAvatar';
import { createTheme } from '@mui/material/styles';

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

interface ICollectionNFTCardProps {
  dataNFT?: any;
  isOwner?: boolean;
  isPreview?: boolean;
  typeCollection?: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    background: {
      paper: '#3E3F4D;',
    }
  },
});

const CollectionNFTCard = ({ dataNFT, isOwner, isPreview, typeCollection }: ICollectionNFTCardProps) => {
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
    nftImagePreview
  } = dataNFT;
  const router = useRouter();

  const { expireDate = 0, action, type: typeNFT, price, currencyToken } = nftSale;
  const { thumbnailUrl, address, name: nameCollection } = collection;
  const { avatarImg } = creator;
  const renderDisplayName = owner.displayName || EllipsisDisplayName(owner.walletAddress);
  const isListing = !_.isEmpty({ nftSale });
  const typeMedia = checkTypeMedia(nftUrl);

  const handleViewAssetDetail = () => {
    router.push(`/asset/${dataNFT?.collection?.address}/${dataNFT?.tokenId}`);
  }

  const renderButtonWithErc721 = () => {
    return (
      <>
        {isOwner ? renderButtonViewOwnerErc721() : renderButtonViewNonOwnerErc721()} 
      </>
    )
  }
  const renderButtonWithErc1155 = () => {
    return (
      <>
        {isOwner ? renderButtonViewOwnerErc1155() : renderButtonViewNonOwnerErc1155()} 
      </>
    )
  }

  const renderButtonViewNonOwnerErc721 = () => {
    let buttonContent;
    if (isPreview) {
      buttonContent = <div className="text-sm text-primary-90 cursor-pointer font-bold">Buy Now</div>;// only view
    } else if (typeNFT === TYPE_SALE.FIXED_PRICE && action === NFT_SALE_ACTIONS.LIST) {
      buttonContent = <div className="text-sm text-primary-90 cursor-pointer font-bold" onClick={handleViewAssetDetail}>Buy Now</div>;
    } else if (
        (typeNFT === TYPE_SALE.AUCTION_ENG || typeNFT === TYPE_SALE.AUCTION_DUT) &&
        action === NFT_SALE_ACTIONS.LIST && _.isEmpty(offerSales)
      ) {
        buttonContent = <div className='text-sm text-light-on-primary'>Minimum Bid</div>;
    } else if (
      (typeNFT === TYPE_SALE.AUCTION_ENG || typeNFT === TYPE_SALE.AUCTION_DUT)
       && action === NFT_SALE_ACTIONS.LIST && !_.isEmpty(offerSales)) {
      buttonContent = <div className='text-sm text-light-on-primary'>Top Bid</div>;
    } else {
      buttonContent = <div className="text-sm text-primary-90 cursor-pointer font-bold" onClick={handleViewAssetDetail}>Make Offer</div>;
    }

    return (<>{buttonContent}</>)
  }
  
  const renderButtonViewOwnerErc721 = () => {
    let buttonContent;
    if (
        (typeNFT === TYPE_SALE.AUCTION_ENG || typeNFT === TYPE_SALE.AUCTION_DUT) &&
        action === NFT_SALE_ACTIONS.LIST && _.isEmpty(offerSales)
      ) {
        buttonContent = <div className='text-sm text-light-on-primary'>Minimum Bid</div>;
    } else if (
      (typeNFT === TYPE_SALE.AUCTION_ENG || typeNFT === TYPE_SALE.AUCTION_DUT)
       && action === NFT_SALE_ACTIONS.LIST && !_.isEmpty(offerSales)) {
      buttonContent = <div className='text-sm text-light-on-primary'>Top Bid</div>;
    }  else if (!_.isEmpty(offerSales)) {
      buttonContent = <div className='text-sm text-light-on-primary'>Best Offer</div>;
    }
    
    return (<>{buttonContent}</>)
  }

  const renderButtonViewOwnerErc1155 = () => {
    let buttonContent;
    if (!_.isEmpty(offerSales)) {
      buttonContent = <div className='text-sm text-light-on-primary'>Best Offer</div>;
    }
    
    return (<>{buttonContent}</>)
  }
  const renderButtonViewNonOwnerErc1155 = () => {
    let buttonContent;
    if (typeNFT === TYPE_SALE.FIXED_PRICE && action === NFT_SALE_ACTIONS.LIST) {
      buttonContent = <div className="text-sm text-primary-90 cursor-pointer font-bold" onClick={handleViewAssetDetail}>Buy Now</div>;
    } else {
      buttonContent = <div className="text-sm text-primary-90 cursor-pointer font-bold" onClick={handleViewAssetDetail}>Make Offer</div>;
    }
    
    return (<>{buttonContent}</>)
  }
  
  return (
    <div className="product-detail-card md:w-[264px] sm:w-[100%] bg-background-dark-700 hover:bg-background-dark-600 shadow-elevation-dark-1 hover:shadow-elevation-dark-5 relative flex flex-col">
      <div
        className={`flex absolute ${
          selected || option ? 'top-10' : 'top-6'
        } justify-between w-[100%] px-3`}
      >
        {isListing ? <SaleEndTime millisecondsRemain={expireDate || 0} /> : null}
        {typeMedia === TYPE_MEDIA.MP3 ? (
          <img className="z-[12] ml-auto" src="/icons/mp3_icons_card.svg" />
        ) : typeMedia === TYPE_MEDIA.MP4 ? (
          <img className="z-[12] ml-auto" src="/icons/mp4_icons_card.svg" />
        ) : null}
      </div>
      <figure className="relative overflow-hidden md:w-[264px] h-[234px] sm:flex sm:w-[100%] cursor-pointer" onClick={handleViewAssetDetail}>
        <ImageBase 
          className="w-full object-contain"
          url={nftImagePreview}
          type="HtmlImage"
          // errorImg="NoData"
        />
        <div
          className={`${
            isPreview
              ? 'card-corner-preview bg-background-preview-sell'
              : 'card-corner bg-background-dark-800'
          } z-50`}
        />
      </figure>
      <div className="p-4 pb-2 mt-auto">
        <div className="flex flex-col justify-center mb-4">
          <ContentTooltip arrow theme={theme} className='tooltip-custom' title={title || ''}>
            <h2
              className="text--title-medium capitalize cursor-pointer max-w-full truncate"
              onClick={handleViewAssetDetail}
            >
              {title || ''}
            </h2>
          </ContentTooltip>
        </div>
        <div className="drop-footer flex justify-between items-center">
          <ArtistMultiAvatar
            srcAvatarCollection={thumbnailUrl}
            srcAvatarCreator={avatarImg}
            artistName={renderDisplayName}
            addressCollection={address}
            addressArtist={owner?.walletAddress}
            nameCollection={nameCollection}
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
          {typeCollection === ASSET_TYPE.ERC721 ? renderButtonWithErc721() : renderButtonWithErc1155()}
          {!_.isEmpty(nftSale) && (
            <div className="ml-auto">
              <TokenPrice
                price={abbreviateNumber(price)}
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

CollectionNFTCard.defaultProps = {
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
  likes: 0,
  slideCover: false,
  millisecondsRemain: 0,
  dataNFT: {
    nftSale: {},
    collection: {},
    creator: {},
    owner: {},
  },
};

export default CollectionNFTCard;

