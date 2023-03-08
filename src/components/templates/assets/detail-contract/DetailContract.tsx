import React, { useEffect, useState } from 'react';
import { shortenAddress, shortenNameNoti } from 'utils/func';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { LINK_SCAN } from 'constants/envs';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { WINDOW_MODE } from 'constants/app';

interface IDetailAsset {
  tokenId: string | string[] | undefined;
  collection: any;
  style?:any
}

const DetailContract = ({ tokenId, collection, style }: IDetailAsset) => {
  const [isShowDetail, setIsShowDetail] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const windowMode = useDetectWindowMode();

  useEffect(() => {
    if ([WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode)) {
      setIsShowDetail(false);
    }
  }, [windowMode]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div>
      <div className="max-w-[100vw] lg:max-w-[unset] text--headline-small mt-5 flex justify-between bg-[#373D4A] xl:bg-[#171a2800] m-[-15px] xl:m-[unset] p-[16px] xl:p-[unset] border-[#eeeeee3b] border-b-[1px] xl:border-b-[0px] xl:mt-[20px]">
        <div className="lg:text-[28px] text-[14px]">Details</div>
        <div
          onClick={() => {
            setIsShowDetail(!isShowDetail);
          }}
        >
          {isShowDetail ? (
            <KeyboardArrowUpIcon style={style} className="text-secondary-60 cursor-pointer translate-x-[5px]" />
          ) : (
            <KeyboardArrowDownIcon  style={style} className="text-secondary-60 cursor-pointer translate-x-[5px]" />
          )}
        </div>
      </div>
      <div className={`${isShowDetail ? 'collapse-close' : 'collapse-open'}`}>
        <div className="flex justify-between xl:mt-[12px] mt-[30px]">
          <div>Contract Address</div>
          <ContentTooltip title={`${collection?.address}`}>
            <a href={`${LINK_SCAN}address/${collection?.address}`} className="cursor-pointer">
              {shortenAddress(collection?.address, 6, 4)}
            </a>
          </ContentTooltip>
        </div>
        <div className="flex justify-between mt-[22px]">
          <div className="cursor-pointer">Token ID</div>
          <CopyToClipboard text={tokenId as string} onCopy={handleCopy}>
            <ContentTooltip title={copied ? 'copied' : 'copy'}>
              <div className="cursor-pointer">{shortenNameNoti(tokenId as string, 6)}</div>
            </ContentTooltip>
          </CopyToClipboard>
        </div>
        <div className="flex justify-between mt-[22px]">
          <div>Token Standard</div>
          <div>{collection?.type?.replace('ERC', 'ERC-')}</div>
        </div>
        <div className="flex justify-between mt-[22px]">
          <div>Blockchain</div>
          <div className="capitalize">Ethereum</div>
        </div>
      </div>
    </div>
  );
};

export default DetailContract;
