import React, { useEffect, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Properties from 'components/modules/properties';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { WINDOW_MODE } from 'constants/app';
import { useSelector } from 'react-redux';
const PropertiesAsset = ({ properties, normal }: any) => {
  const [isShowProperties, setIsShowProperties] = useState<boolean>(true);
  const windowMode = useDetectWindowMode();
  const { box, icon } = useSelector((state:any) => state.theme);
  useEffect(() => {
    if ([WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode)) {
      setIsShowProperties(false);
    }
  }, [windowMode]);

  return (
    <div className="xl:mt-10 mt-[30px] ">
      <div className="text--headline-small flex justify-between  bg-[#373D4A] xl:bg-[#171a2800] m-[-15px] xl:m-[unset] p-[16px] xl:p-[unset] border-[#eeeeee3b] border-b-[1px] xl:border-b-[0px] mb-[-16px]">
        <div className="lg:text-[28px] text-[14px]">Properties</div>
        {properties?.length ? (
          <div
            onClick={() => {
              setIsShowProperties(!isShowProperties);
            }}
          >
            {isShowProperties ? (
              <KeyboardArrowUpIcon style={icon} className="text-secondary-60 cursor-pointer translate-x-[5px]" />
            ) : (
              <KeyboardArrowDownIcon style={icon} className="text-secondary-60 cursor-pointer translate-x-[5px]" />
            )}
          </div>
        ) : null}
      </div>
      <div
        className={`xl:gap-5 mt-4 ${
          !isShowProperties ? 'collapse-close-properties' : 'collapse-open-properties'
        }`}
      >
        <div
          className={`mt-[20px] pb-[40px] flex flex-wrap xl:justify-start justify-center gap-4 max-h-[310px] overflow-auto`}
        >
          {properties?.map((item: any) => (
            <Properties
              normal={normal}
              key={item?.name}
              rarityValue={item?.rarity}
              item={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertiesAsset;
