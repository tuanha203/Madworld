//@ts-nocheck
import { Box } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import { WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { capitalizeWordsInString } from 'utils/capitalizeWords';
import { addCommaToNumber } from 'utils/currencyFormat';
const Level = ({ properties, isLevel = false, className }: any) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const windowMode = useDetectWindowMode();
  const { icon, box, background } = useSelector((state: any) => state.theme);
  useEffect(() => {
    if ([WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode)) {
      setIsShow(false);
    }
  }, [windowMode]);
  return (
    <div className="xl:mt-10">
      <div className="text--headline-small flex justify-between  bg-[#373D4A] xl:bg-[#171a2800] mx-[-15px] xl:m-[unset] p-[16px] xl:p-[unset] border-[#eeeeee3b] border-b-[1px] xl:border-b-[0px]">
        <div className="lg:text-[28px] text-[14px]">{isLevel ? 'Levels' : 'Stats'}</div>
        {properties?.length ? (
          <div
            onClick={() => {
              setIsShow(!isShow);
            }}
          >
            {isShow ? (
              <KeyboardArrowUpIcon
                style={icon}
                className="text-secondary-60 cursor-pointer translate-x-[5px]"
              />
            ) : (
              <KeyboardArrowDownIcon
                style={icon}
                className="text-secondary-60 cursor-pointer translate-x-[5px]"
              />
            )}
          </div>
        ) : null}
      </div>
      <div
        className={`${!isShow ? 'collapse-close-properties' : 'collapse-open-properties'} ${
          properties.length > 3 ? 'overflow-auto' : ''
        }`}
      >
        <div className={`gap-5 my-[10px] overflow-auto ${className} pr-[2px]`}>
          {properties?.map((item: any) => {
            const value = item?.value ? item?.value : 0;
            const maxValue = item?.maxValue ? item?.maxValue : 0;
            const percent = maxValue ? (value * 100) / maxValue : 0;

            return (
              <div
                className="text-white gap-2 p-4 max-content-width border-primary-dark border rounded-2xl w-[100%] mb-3"
                style={box?.outline}
              >
                <div className="flex justify-between items-center mb-2">
                  <OverflowTooltip
                    title={capitalizeWordsInString(item?.name)}
                    className="text-base font-normal text-center capitalize xl:max-w-[50%] max-w-[70%]"
                  >
                    {item?.name}
                  </OverflowTooltip>
                  <div className="text-[12px] w-[80px] text-right font-normal">
                    {addCommaToNumber(item?.value)} of {addCommaToNumber(item?.maxValue)}
                  </div>
                </div>
                {isLevel && (
                  <Box
                    className="level-progress w-full"
                    sx={
                      background
                        ? {
                            '& .MuiLinearProgress-bar': {
                              background: background?.backgroundGradientColor,
                            },
                            boxShadow:
                              '-2px -2px 4px rgba(68, 108, 108, 0.28), 2px 2px 4px rgba(0, 0, 0, 0.56)',
                          }
                        : {
                            boxShadow:
                              '-2px -2px 4px rgba(68, 108, 108, 0.28), 2px 2px 4px rgba(0, 0, 0, 0.56)',
                          }
                    }
                  >
                    <LinearProgress
                      className="rarity-small w-full"
                      variant="determinate"
                      value={percent}
                    />
                  </Box>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Level;
