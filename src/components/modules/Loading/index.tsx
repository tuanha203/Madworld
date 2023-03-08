import { Box, Skeleton } from '@mui/material';
import { WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import React, { memo } from 'react';
interface ILoading {
  className?: string;
  loading: boolean;
  mode?: 'normal' | 'small';
}

const LoadingBase: React.FC<ILoading | any> = (props) => {
  /**
   * LOADING WRAPPED Note ^^
   * className :@param custom class
   * Loading @param loading true or false
   */
  const { className = '', loading } = props;
  const windowMode = useDetectWindowMode();

  return (
    <div className={`${className} m-auto`}>
      {loading ? (
        <Box>
          <Skeleton
            sx={{ clipPath: 'polygon(9% 0, 100% 0, 100% 100%, 0 100%, 0 6%)' }}
            variant="rectangular"
            width={'100%'}
            height={
              [WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode) ? 226 : 420
            }
            className="bg-[#373d4a]"
            animation="wave"
          />
        </Box>
      ) : (
        props.children
      )}
    </div>
  );
};

export const LoadingListBase: React.FC<ILoading | any> = (props) => {
  /**
   * LOADING WRAPPED Note ^^
   * className :@param custom class
   * Loading @param loading true or false
   * Item @Param total item show loading : default 1
   */
  const { className, loading, items = 1, mode = 'normal' } = props;
  const Skeletons = [];
  for (let index = 0; index < items; index++) {
    Skeletons.push(
      <div key={index}>
        <LoadingBase loading={true} mode={mode} />
      </div>,
    );
  }
  const colSm = mode === 'small' ? '2' : '2';
  const colMd = mode === 'small' ? '4' : '3';
  const colXl = mode === 'small' ? '6' : '4';
  return (
    <div className={`${className} ${loading && 'w-[100%]'}`}>
      <div className={`${loading && 'hidden'}`}>{props.children}</div>
      {loading && (
        <div className={`w-[100%]`}>
          <div
            className={`grid sm:grid-cols-${colSm} md:grid-cols-${colMd} xl:grid-cols-${colXl} gap-${colXl} m-auto mx-0 mt-[1rem]`}
          >
            {Skeletons}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(LoadingBase);
