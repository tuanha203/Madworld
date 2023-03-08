import ImageBase from 'components/common/ImageBase';
import CircularProgressIndicator from 'components/common/progress-indicator';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { get } from 'lodash';
import Link from 'next/link';
import { IStep } from 'pages/create/erc-721';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { removeEventChangePage } from 'store/actions/forceUpdating';
import { checkTypeMedia, shortenNameNoti } from 'utils/func';
import CheckIcon from '@mui/icons-material/Check';
import { OutlinedButton } from 'components/common';
import { STATE_STEP, TYPE_IMAGE } from 'constants/app';
import { formatNumber } from 'utils/formatNumber';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: '24px',
} as React.CSSProperties;

const ModalCreateNoListing: FC<any> = ({ steps, toggleDescription, values }) => {
  const { nftImagePreview, collectionSelected, title, supply, collectionAddress } = values;
  const collectionName = get(collectionSelected, 'title', '');
  const dispatch = useDispatch();

  const handleViewCollection = () => {
    dispatch(removeEventChangePage(1));
    setTimeout(() => {
      dispatch(removeEventChangePage(0));
    }, 500);
  };
  const typeImage = checkTypeMedia(
    values?.nftAudio?.name || values?.nftVideo?.name || values?.nftModel?.name || '',
  );

  return (
    <div
      style={style}
      className="bg-background-dark-600 flex flex-col items-center font-Chakra lg:rounded-[28px] lg:w-[562px] lg:pt-[32px] lg:px-[64px] lg:pb-[48px] w-[90%] rounded-[14px] py-6 px-1"
    >
      <p className="font-bold text-lg lg:mb-6 mb-1 text-dark-on-surface text-[24px]">
        Complete your creating
      </p>
      <div className="flex justify-between items-center w-full lg:mb-8 lg:px-0 mb-6 px-3">
        <div>
          <div className="text-lg font-bold">Item</div>
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
                  url={URL.createObjectURL(nftImagePreview)}
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
            <div className="ml-2 flex flex-col justify-between">
              <div className="lg:max-w-[300px] max-w-[200px]">
                <Link onClick={handleViewCollection} href={`/collection/${collectionAddress}`}>
                  <a target="_blank">
                    <OverflowTooltip
                      title={collectionName}
                      className="text-xs font-normal text-primary-90"
                    >
                      <span>{collectionName}</span>
                    </OverflowTooltip>
                  </a>
                </Link>
              </div>
              <div className="lg:max-w-[300px] max-w-[200px]">
                <OverflowTooltip title={title.trim()} className="font-bold">
                  <span>{title.trim()}</span>
                </OverflowTooltip>
              </div>
              <p className="text-xs	font-normal">Supply: {formatNumber(supply)}</p>
            </div>
          </div>
        </div>
        <div />
      </div>
      <div className="flex flex-col w-full lg:mb-[10px] mb-[16px]">
        <div className="flex bg-background-sell-step-popup-selected lg:py-4 lg:px-5 p-5 rounded-lg">
          {steps.map((step: IStep, index: number) => {
            const { title, des, state, indexNum, link, isShowDes, subDes } = step;
            return (
              <div className="flex bg-background-asset-detail lg:p-4 rounded-lg cursor-pointer w-full">
                <div className="pr-3 pl-1 w-10">
                  {state === STATE_STEP.LOADING ? (
                    <CircularProgressIndicator size={20} />
                  ) : state === STATE_STEP.UNCHECKED ? (
                    <CheckIcon style={{ color: '#6F7978' }} />
                  ) : (
                    <CheckIcon style={{ color: '#F4B1A3' }} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-dark-on-surface lg:text-lg text-base">{`${title}`}</p>
                    <div className="p-2">
                      <img
                        src="/icons/arrow-bottom.svg"
                        className={`relative bottom-1 text-primary-dark ml-3 ${
                          isShowDes ? 'rotate-180' : ''
                        }`}
                        onClick={() => toggleDescription(indexNum - 1)}
                      />
                    </div>
                  </div>

                  {isShowDes && (
                    <div className="pr-2">
                      <p className="text-primary-gray lg:text-sm text-xs mt-2">{des}</p>
                      {link && (
                        <a href={link} target="_blank">
                          <OutlinedButton
                            customClass="!text-secondary-60"
                            target="_blank"
                            fullWidth
                            text="View on Etherscan"
                          />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-xs lg:px-0	px-3">
        Please wait for creating NFT. This will take a while. Please don't reload the current page.
      </div>
    </div>
  );
};

export default ModalCreateNoListing;
