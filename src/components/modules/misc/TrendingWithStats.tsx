import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import React, { FC } from 'react';

interface TrendingWithStatsProps {
  percentage?: any;
  className?:string;
  style?:any;
}

const TrendingWithStats: FC<TrendingWithStatsProps> = ({ percentage, className, style }) => {

  return (
    <div className={` ${className} text--label-medium flex items-center justify-center gap-2 w-[33.33%] text-[14px]`}>
      {percentage === '-' || (percentage && percentage.includes('+')) ? (
        <TrendingUpIcon style={style}  sx={{ color: '#f4b1a3' }} />
      ) : (
        <TrendingDown style={style}  sx={{ color: '#f4b1a3' }} />
      )}
      <span>{`${percentage}${percentage === '-' ? '' : ' %'}`}</span>
    </div>
  );
};

TrendingWithStats.defaultProps = {
  percentage: '0',
};

export default TrendingWithStats;
