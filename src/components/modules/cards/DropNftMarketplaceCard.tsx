import { FC } from 'react';
import { FilledButton } from '../../common/buttons';
import { ClockIcon, HeartIcon } from '../../common/iconography/IconBundle';
import TimerChip from '../../common/chips/TimerChip';
import { Avatar } from '../thumbnail';

interface IDropNftMarketplaceCardProps {
  img: string;
  dropTitle: string;
  artist: string;
}

const DropNftMarketplaceCard: FC<IDropNftMarketplaceCardProps> = (props) => {
  const { img, dropTitle, artist } = props;
  return (
    <div className="drop-nft-marketplace-card w-[264px] bg-background-dark-600">
      <figure className="relative overflow-hidden  w-[264px] h-[260px]">
        <img className="w-full object-cover" src={img} alt="" />
        <div className="card-corner bg-background-dark-900"></div>
        <img className="absolute w-7 z-30 top-5 right-5" src="./icons/Fire.svg" alt="" />
        <div className="absolute z-30 top-5 left-5">
          <TimerChip />
        </div>
      </figure>
      <div className="w-full flex justify-center translate-y-[-50%]">
        <Avatar border="true" size="large" />
      </div>
      <div className=" px-4 pb-6">
        <div className="flex flex-col justify-center items-center gap-2 -mt-4 mb-7">
          <h2 className="text--title-large capitalize">{dropTitle}</h2>
          <p className="text--label-small">
            created by <span className="text-primary-dark capitalize cursor-pointer">{artist}</span>
          </p>
          <div className="mt-4">
            <FilledButton text="Add to Whitelist" />
          </div>
        </div>
        <div className="drop-footer flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HeartIcon />
            <span className="text--label-medium">90k</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon />
            <span className="text--label-medium">Posted 8h ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

DropNftMarketplaceCard.defaultProps = {
  img: './images/drop.jpg',
  dropTitle: 'Drop Title',
  artist: 'default lee',
};

export default DropNftMarketplaceCard;
