import Divider from 'components/common/divider';
import ImageBase from 'components/common/ImageBase';
import { TokenPrice } from 'components/common/price';
import { TYPE_DURATION, TYPE_IMAGE } from 'constants/app';
import _ from 'lodash';
import { FC } from 'react';
import { abbreviateNumber, checkTypeMedia, EllipsisDisplayName } from 'utils/func';
import ArtistMultiAvatar from '../artist-multi-avatar/ArtistMultiAvatar';
import { NFT_SALE_TYPES } from 'constants/index';
import SaleEndTime from 'components/common/saleEndTime';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
interface INFTCardPreview {
  dataNFT: any;
  sellType: string;
  durationAuction?: any;
  durationFixedPrice?: any;
}

const NFTCardPreview: FC<INFTCardPreview> = ({
  dataNFT,
  sellType,
  durationAuction,
  durationFixedPrice,
}: INFTCardPreview) => {
  const { nftUrl, title, nftSale, owner, collection, nftImagePreview, isUnlockableContent } =
    dataNFT;
  const { price: nftSalePrice, currencyToken } = nftSale;
  const {
    thumbnailUrl: collectionThumbnailUrl,
    address: collectionAddress,
    name: nameCollection,
  } = collection;
  const { avatarImg, username, walletAddress, isVerify } = owner;
  const typeMedia = checkTypeMedia(nftUrl);
  const renderDisplayName = username || EllipsisDisplayName(walletAddress);

  const dateNow = Math.floor(Date.now() / 1000);
  const typeSellDuration =
    sellType === NFT_SALE_TYPES.FIX_PRICE ? durationFixedPrice?.type : durationAuction?.type;
  const typeDuration =
    typeSellDuration === 'Unlimited' ? TYPE_DURATION.UNLIMITED : TYPE_DURATION.LIMITED;
  const expireDateNftSale = Number(
    sellType === NFT_SALE_TYPES.FIX_PRICE ? durationFixedPrice?.endDate : durationAuction?.endDate,
  );
  const millisecondsRemain = expireDateNftSale ? expireDateNftSale + 15 - dateNow : -1;
  const isNFT721 = collection?.type === 'ERC721';
  
  return (
    <div className="relative">
      {!isNFT721 && (
        <div className="flex justify-center absolute bottom-[-7px] w-[100%] h-[100%] z-[1] box-shadow-card">
          <div
            className={`p-4 !w-[94%] font-Chakra nft-card-back h-full product-detail-card bg-[#373d4a] hover:bg-secondary-ref hover:shadow-elevation-dark-5 relative flex flex-col`}
          ></div>
        </div>
      )}
      <div className="relative z-[2] box-shadow-card">
        <div className="p-4 font-Chakra nft-card-common h-full product-detail-card md:w-[264px] sm:w-[100%] bg-background-700 hover:bg-secondary-ref shadow-elevation-dark-1 hover:shadow-elevation-dark-5 relative flex flex-col">
          <div className="absolute top-7 px-4 z-50">
            <SaleEndTime
              millisecondsRemain={millisecondsRemain}
              typeDuration={typeDuration}
              isReload={false}
            />
          </div>
          <figure className="clip-path-image-nft relative overflow-hidden h-[114px] lg:h-[234px] flex items-center justify-center cursor-pointer mb-5">
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
              {isUnlockableContent && (
                <ContentTooltip title={'Includes unlockable content'} arrow>
                  <div className="absolute w-[48px] h-[32px] bg-[#373D4A] right-[0] top-3 rounded-tl-[7px] z-[2] flex items-center justify-center h-[100%] hover:bg-secondary-ref">
                    <img className="w-[16px] h-[16px]" src="/social/unlock-icon.svg" />
                  </div>
                </ContentTooltip>
              )}
            </div>
          </figure>
          <div className=" mt-auto">
            <div className="flex justify-between items-center mb-4 w-full">
              <div className="max-w-[80%] w-[inherit] cursor-pointer flex items-center">
                {typeMedia === TYPE_IMAGE.MP3 ? (
                  <img className="w-[20px] h-[20px] mr-[10px]" src="/icons/mp3_icons_card.svg" />
                ) : typeMedia === TYPE_IMAGE.MP4 ? (
                  <img className="w-[20px] h-[20px] mr-[10px]" src="/icons/mp4_icons_card.svg" />
                ) : null}
                <ContentTooltip arrow className="tooltip-custom" title={title || ''}>
                  <div className="max-w-[90%]">
                    <h2 className="text--title-medium truncate text-base">{title || ''}</h2>
                  </div>
                </ContentTooltip>
              </div>
            </div>
            <div className="drop-footer flex justify-between items-center relative">
              <ArtistMultiAvatar
                srcAvatarCollection={collectionThumbnailUrl}
                srcAvatarCreator={avatarImg}
                artistName={renderDisplayName}
                addressCollection={collectionAddress}
                addressArtist={walletAddress}
                nameCollection={nameCollection}
                isPreview={true}
                verified={isVerify}
                fullArtistName={renderDisplayName}
              />
            </div>
            <Divider customClass="mt-3 opacity-20" />
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-primary-90">
                {sellType === NFT_SALE_TYPES.FIX_PRICE || sellType === NFT_SALE_TYPES.DUTCH_AUCTION
                  ? 'Buy Now'
                  : 'Minimum bid'}
              </div>
              <div className="ml-auto">
                <TokenPrice
                  price={abbreviateNumber(nftSalePrice)}
                  currentPrice={nftSalePrice}
                  isPreview={true}
                  currencyToken={currencyToken}
                  customClass="!text--title-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

NFTCardPreview.defaultProps = {
  dataNFT: {
    nftSale: {
      // nftSaleExpireDate:
      // nftSaleAction:
      // nftSaleType:
      // nftSalePrice:
      // nftSaleCurrencyToken:
    },
    collection: {},
    creator: {},
    owner: {},
    nftUrl: '',
    title: '',
    option: '',
    selected: '',
    like: 0,
    offerSales: [],
  },
};

export default NFTCardPreview;
