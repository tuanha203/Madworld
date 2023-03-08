import React from 'react';
import { useSelector } from 'react-redux';
import { NoChartSvg } from '../iconography/iconsComponentSVG';

const NoChartData = () => {
  const { icon } = useSelector((state:any) => state.theme);
  return (
    <div className="flex justify-center items-center justify-center">
      <div className="flex justify-center items-center w-[100%] h-[150px] xl:w-[453px] xl:h-[170px] bg-background-variant-dark">
        <NoChartSvg color={icon?.color} />
      </div>
    </div>
  );
};

export default NoChartData;
