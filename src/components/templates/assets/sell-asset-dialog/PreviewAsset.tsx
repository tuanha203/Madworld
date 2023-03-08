import { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import NFTCardPreview from 'components/modules/cards/NFTCardPreview';

interface IPreviewAssetProps {
  assetDataDetail: any;
  isNFT1155: boolean;
  sellType: string;
  previewConfig: any;
  durationAuction?: any;
  durationFixedPrice?: any;
}

const PreviewAsset: FC<IPreviewAssetProps> = ({
  assetDataDetail,
  isNFT1155,
  sellType,
  previewConfig,
  durationAuction,
  durationFixedPrice,
}: IPreviewAssetProps) => {
  const {
    collection = {},
    nftImagePreview,
    nftUrl,
    title,
    creator,
    isUnlockableContent,
  } = assetDataDetail || {};
  const { currencyToken, price } = previewConfig || {};
  const displayName = useSelector((state: any) => state?.user?.profile?.artist?.username || 'N/A');
  const artist = useSelector((state: any) => state?.user?.profile?.artist || {});

  return (
    <div className="sm:bg-background-asset-detail md:bg-background-preview-sell pt-8 px-14 pb-16 rounded-lg">
      <div className="text-white text--headline-xsmall mb-6 text-base">Preview</div>
      <div className="xl:flex xl:justify-center text-white sm:px-6 md:px-14">
        <NFTCardPreview
          dataNFT={{
            nftUrl,
            isUnlockableContent,
            nftImagePreview,
            title,
            isNFT1155,
            millisecondsRemain: undefined,
            nftSale: {
              price,
              currencyToken,
            },
            owner: {
              ...artist,
            },
            collection,
            creator,
          }}
          sellType={sellType}
          durationAuction={durationAuction}
          durationFixedPrice={durationFixedPrice}
        />
      </div>
    </div>
  );
};

export default memo(PreviewAsset);
