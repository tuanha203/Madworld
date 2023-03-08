import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  GameSvg,
  GovernanceSvg,
  StakingSvg,
  VRSvg,
} from 'components/common/iconography/iconsComponentSVG';
import { WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatUrl } from 'utils/utils';

const Utility = ({ collection = {} }: any) => {
  const { stakingUrl, vrUrl, gameUrl, governanceUrl } = collection;
  const [isShow, setIsShow] = useState<boolean>(true);
  const windowMode = useDetectWindowMode();
  const { icon } = useSelector((state:any) => state.theme);
  useEffect(() => {
    if ([WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode)) {
      setIsShow(false);
    }
  }, [windowMode]);
  return (
    <div className="xl:mt-10 mt-[30px]">
      <div className="flex justify-between text--headline-small text-[28px] bg-[#373D4A] xl:bg-[#171a2800] m-[-15px] xl:m-[unset] p-[16px] xl:p-[unset] border-[#eeeeee3b] border-b-[1px] xl:border-b-[0px]">
        <div className="lg:text-[28px] text-[14px]">Utility</div>
        <div
          onClick={() => {
            setIsShow(!isShow);
          }}
        >
          {isShow ? (
            <KeyboardArrowUpIcon className="text-secondary-60 cursor-pointer translate-x-[5px]" style={icon} />
          ) : (
            <KeyboardArrowDownIcon className="text-secondary-60 cursor-pointer translate-x-[5px]" style={icon} />
          )}
        </div>
      </div>
      <div className={`${!isShow ? 'collapse-close-utility' : 'collapse-open-utility'}`}>
        <div className="xl:mt-3 mt-[40px]">
          Asset is associated to the following set of utilities
        </div>
        <div className="flex gap-4 mt-7 ">
          {stakingUrl && (
            <a href={formatUrl(stakingUrl)} target="_blank">
              <StakingSvg className="w-16 h-16" color={icon?.color} />
            </a>
          )}
          {gameUrl && (
            <a href={formatUrl(gameUrl)} target="_blank">
              <GameSvg className="w-16 h-16" color={icon?.color} />
            </a>
          )}
          {governanceUrl && (
            <a href={formatUrl(governanceUrl)} target="_blank">
              <GovernanceSvg className="w-16 h-16" color={icon?.color} />
            </a>
          )}
          {vrUrl && (
            <a href={formatUrl(vrUrl)} target="_blank">
              <VRSvg sName="w-16 h-16" color={icon?.color} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Utility;
