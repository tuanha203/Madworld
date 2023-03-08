import { FC, useEffect, useState } from 'react';
import { calculateTimeLeft } from 'utils/utils';

interface ITickerProps {
  state: 'active' | 'enabled' | 'color';
  year: string;
  month: string;
  day: string;
}

interface ITimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Ticker: FC<ITickerProps> = (props) => {
  const { state, year, month, day } = props;
  const [timeLeft, setTimeLeft] = useState<ITimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const id = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(year, month, day));
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  });

  return (
    <div className={`basic-ticker ${state}`}>
      <div>{timeLeft?.days < 10 ? `0${timeLeft?.days}` : timeLeft?.days}</div>:
      <div>{timeLeft?.hours < 10 ? `0${timeLeft?.hours}` : timeLeft?.hours}</div>:
      <div>{timeLeft?.minutes < 10 ? `0${timeLeft?.minutes}` : timeLeft?.minutes}</div>:
      <div>{timeLeft?.seconds < 10 ? `0${timeLeft?.seconds}` : timeLeft?.seconds}</div>
    </div>
  );
};

Ticker.defaultProps = {
  state: 'active',
};

export default Ticker;
