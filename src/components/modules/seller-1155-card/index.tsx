import BuyNow from 'components/templates/assets/buyNow';
import { useSelector } from 'react-redux';
import { IUserInitState } from 'store/reducers/user';
import { AvatarOwned } from '../thumbnail';
import { shortenNameNoti, shortenNameNotiHasAddress } from 'utils/func';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import Link from 'next/link';
import { formatNumber } from 'utils/formatNumber';
import { cloneDeep, get } from 'lodash';

const Seller1155Card = ({ nft, assetDataDetail, getAssetDetail }: any) => {
  const { nftSale, remainAmount, offSaleAmount, user } = nft;
  const isSale: boolean = !!nftSale;
  const { quantity, currencyToken, price, reserveBuyer } = nftSale || {};
  const { collection, tokenId } = assetDataDetail || {};
  const { username = 'Unknown', walletAddress: sellerAddress } = user || {};
  const { icon, button } = useSelector((state:any) => state.theme);
  const storedWalletAddress = useSelector(
    (state: { user: IUserInitState }) => state.user?.data?.walletAddress,
  );

  const hasReserveBuyer = get(nftSale, 'reserveBuyer.walletAddress');

  const isUserReserveBuyer = hasReserveBuyer === storedWalletAddress;

  const isOwnerSeller = storedWalletAddress === sellerAddress;

  const showButtonBuy = !hasReserveBuyer ? !isOwnerSeller && isSale : isUserReserveBuyer;

  return (
    <div className="flex justify-between items-center font-Chakra mb-7">
      <div className="flex items-center gap-13 gap-x-3.5">
        <AvatarOwned
          position=""
          verified={user?.isVerify}
          link={`/artist/${sellerAddress}`}
          srcAvatar={user?.avatarImg}
          ownerAsset
          iconStyle={icon}
        />
        <div>
          <Link href={`/artist/${sellerAddress}`}>
            <a>
              <ContentTooltip
                title={username || sellerAddress}
                placement="bottom-start"
                arrow
                disableHoverListener={username?.length <= 20 || sellerAddress.length <= 9}
              >
                <div className=" font-bold text-base leading-6">
                  {(username && shortenNameNoti(username, 20)) ||
                    shortenNameNotiHasAddress(sellerAddress, 9)}
                </div>
              </ContentTooltip>
            </a>
          </Link>
          <div className="opacity-60 text-xs">
            {!isSale
              ? `${formatNumber(offSaleAmount)}/${formatNumber(remainAmount)} not for sale`
              : `${formatNumber(quantity)}/${formatNumber(remainAmount)} on sale for`}
          </div>
          {isSale && (
            <div className="opacity-60 text-xs">
              {formatNumber(price)} {currencyToken?.toUpperCase()} {isSale && 'each'}
            </div>
          )}
        </div>
      </div>
      {showButtonBuy && (
        <div className="h-[42px]">
          <BuyNow
            assetDataDetail={assetDataDetail}
            collection={collection}
            tokenId={tokenId}
            nftSaleStatus={[{ ...cloneDeep(nftSale), nft: assetDataDetail }]}
            getAssetDetail={getAssetDetail}
            bestNftSale={{ ...cloneDeep(nftSale), nft: assetDataDetail }}
            style={button?.default}
          />
        </div>
      )}
    </div>
  );
};

export default Seller1155Card;
