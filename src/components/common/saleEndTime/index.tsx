import { TYPE_DURATION } from 'constants/app';
import React, { memo, useEffect, useState } from 'react';
import { secondsToTime } from 'utils/func';

function SaleEndTime(props: any) {
  const { millisecondsRemain, typeDuration, isReload = true, callBackAfterEnd, callbackFetchList, text = {} } = props;
  const [secCountDown, setSecCountDown] = useState<number>(millisecondsRemain);

  useEffect(() => {
    setSecCountDown(millisecondsRemain);
  }, [millisecondsRemain]);

  useEffect(() => {
    let intervalId = setInterval(() => {
      setSecCountDown((seconds: number) => {
        if (seconds !== 0) return seconds - 1;
        clearInterval(intervalId);
        return seconds;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (secCountDown === 0 && isReload){
      callbackFetchList();
    }
    if (secCountDown === 0 && callBackAfterEnd) {
      callBackAfterEnd();
    }
  }, [secCountDown]);

  if (secCountDown <= 0 && typeDuration !== TYPE_DURATION.UNLIMITED) return <div />;

  return (
    <div
      style={{ textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', background: text?.color }}
      className={` font-bold text-sm z-[10] px-[12px] py-[6px] bg-primary-dark rounded h-10 leading-7`}
    >
      {typeDuration !== TYPE_DURATION.UNLIMITED ? secondsToTime(secCountDown) : 'Unlimited'}
    </div>
  );
}

export default memo(SaleEndTime);
