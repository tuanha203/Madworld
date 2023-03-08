import { FC } from 'react';
import { IconEvent } from '../../common/iconography/IconBundle';

interface ILiveEventSmallCardProps {
  description: string;
  time: string;
  img: string;
}

const LiveEventSmallCard: FC<ILiveEventSmallCardProps> = (props) => {
  const { description, time, img } = props;
  return (
    <div className="live-event-small-card w-[264px] bg-background-dark-600 shadow-elevation-dark-1">
      <div>
        <figure className="relative w-[264px] h-[160px] overflow-hidden">
          <img className="w-full object-cover" src={img} alt="" />
          <div className="card-corner bg-background-dark-900 "></div>
        </figure>
      </div>
      <div className="flex flex-col items-start gap-2 px-4 py-6">
        <div className="text--headline-xsmall">{description}</div>
        <div className="flex items-center gap-2 text--label-large">
          <div className="scale-75 -ml-1">
            <IconEvent />
          </div>
          {time}
        </div>
      </div>
    </div>
  );
};

LiveEventSmallCard.defaultProps = {
  description: 'AMA Event of the week for our new NFT',
  time: '21 December - 01:30 PM UTC',
  img: './images/moto.jpg',
};

export default LiveEventSmallCard;
