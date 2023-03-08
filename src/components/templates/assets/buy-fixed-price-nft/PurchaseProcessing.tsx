import CheckIcon from '@mui/icons-material/Check';
import Divider from 'components/common/divider';
import ImageBase from 'components/common/ImageBase';
import CircularProgressIndicator from 'components/common/progress-indicator';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import JustifyBetween from 'components/modules/share/JustifyBetween';
import { TYPE_IMAGE } from 'constants/app';
import { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { checkTypeMedia, shortenAddress } from 'utils/func';

interface IPurchaseProcessingProps {
  itemName: string;
  className?: string;
  walletAddress?: string | null;
  matchOrderTx?: string;
  isMatchOrderSuccess?: boolean;
  buySuccess?: boolean;
  nftUrl: string;
  nftImagePreview?: string;
}

const PurchaseProcessing: FC<IPurchaseProcessingProps> = (props) => {
  const {
    itemName = 'Unknown',
    className = '',
    matchOrderTx,
    isMatchOrderSuccess,
    buySuccess,
    nftUrl,
    nftImagePreview,
  } = props;
  const typeImage = checkTypeMedia(nftUrl);
  const { text } = useSelector((state:any) => state.theme);
  const renderMessage = () => {
    if (!isMatchOrderSuccess) {
      return (
        <div>
          Congratulations! You just purchased
          <ContentTooltip title={itemName} className="max-w-[120px] align-bottom ml-1 inline-block text-ellipsis">
            <div className="text-primary-90" style={text}>{itemName}</div>
          </ContentTooltip>
          . It should be confirmed on the blockchain shortly.
        </div>
      );
    }
    return (
      <div>
        Congratulations! You just purchased
          <ContentTooltip title={itemName} className="max-w-[120px] align-bottom ml-1 inline-block text-ellipsis">
            <div className="text-primary-90" style={text}>{itemName}</div>
          </ContentTooltip>
        . It should be confirmed on the blockchain.
      </div>
    );
  };

  const renderStatus = () => {
    let content = (
      <>
        <CircularProgressIndicator size={24} />
        <p className="text--body-medium">Processing</p>
      </>
    );

    if (buySuccess) {
      content = (
        <>
          <CheckIcon className="text-primary-60 mr-1" />
          <p className="text--body-medium">Completed</p>
        </>
      );
    }
    return <div className="flex items-center gap-2">{content}</div>;
  };

  return (
    <div className={`w-full lg:px-6 lg:py-8 sm:px-0 sm:py-4 ${className}`}>
      <p className="lg:text--body-medium sm:text--title-small lg:font-bold sm:font-normal">
        {renderMessage()}
      </p>
      <div className="w-fit mx-auto my-[20px] flex items-center justify-center">
        <div className="relative">
          <ImageBase
            className="max-w-[180px] max-h-[180px] mx-auto rounded-lg object-contain"
            type="HtmlImage"
            url={nftImagePreview || nftUrl}
            errorImg="Default"
          />
          <div className={`flex absolute top-[6px] justify-between right-[5px]`}>
            {typeImage === TYPE_IMAGE.MP3 && (
              <img className="w-[16px] h-[16px] ml-auto" src="/icons/mp3_icons_card.svg" />
            )}
            {typeImage === TYPE_IMAGE.MP4 && (
              <img className="w-[16px] h-[16px] ml-auto" src="/icons/mp4_icons_card.svg" />
            )}
          </div>
        </div>
      </div>
      <div className="w-full py-6">
        <Divider />
      </div>
      <div className="flex lg:flex-col sm:flex-row gap-1">
        <JustifyBetween
          customClass={'lg:flex-row sm:flex-col lg:items-center sm:items-start'}
          children={
            <>
              <div className="lg:text--headline-xsmall sm:text--subtitle">Status</div>
              <div className="lg:text--headline-xsmall sm:text--subtitle lg:mt-0 sm:mt-4">
                Transaction Hash
              </div>
            </>
          }
        />
        <JustifyBetween
          customClass={'lg:flex-row sm:flex-col lg:items-center sm:items-end'}
          children={
            <>
              {renderStatus()}
              {matchOrderTx?.hash && (
                <p
                  className="text--body-medium flex cursor-pointer justify-start items-center	gap-x-3 text-primary-60 lg:mt-0 sm:mt-4"
                  onClick={() =>
                    window.open(`${process.env.NEXT_PUBLIC_LINK_SCAN}tx/${matchOrderTx?.hash}`)
                  }
                  style={text}
                >
                  <span>{shortenAddress(matchOrderTx?.hash as any, 6)}</span>
                </p>
              )}
            </>
          }
        />
      </div>
    </div>
  );
};

PurchaseProcessing.defaultProps = {
  itemName: 'default item',
};

export default memo(PurchaseProcessing);
