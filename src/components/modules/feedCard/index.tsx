import { FC } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { OutlinedButton } from '../../common/buttons';
import { IconLikes } from '../../common/iconography/IconBundle';
import { ShareWidgetBlock } from '../share/ShareWidget';

interface IFeedCardProps {
  title: string;
  description: string;
  author: string;
}

export const FeedCard: FC<IFeedCardProps> = (props) => {
  const { title, description, author } = props;
  const testFunction = () => {
    console.log('click');
  };
  return (
    <div className="feed-card w-[750px] h-[240px] flex rounded-xl bg-background-dark-600 shadow-elevation-dark-2 overflow-hidden">
      <figure
        style={{
          backgroundImage: `url(./images/test.jpg)`,
        }}
        className="w-[260px] h-full bg-cover bg-center shrink-0"
      ></figure>
      <div className="flex grow-0 flex-col justify-between items-start p-6 mr-4">
        <div>
          <h3 className="text--headline-xsmall">{title}</h3>
          <div className="flex justify-between w-4/5">
            <div className="text--label-medium flex flex-row items-center capitalize">
              <AccessTimeIcon className="mr-2" />
              posted <span className="mx-1 lowercase">1 h</span>
              <span className="lowercase">ago</span>
            </div>
            <div className="text--label-medium flex flex-row items-center">
              <span className="mr-1">by</span>
              <span className="text-primary-dark">{author}</span>
            </div>
            <div className="text--label-medium flex flex-row items-center">
              <span className="mr-1">&#8226; </span>
              <span className="mr-1 ">3 min</span> read
            </div>
          </div>
          <p className="text--body-small font-normal text-white/80 w-full mt-4">{description}</p>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-10">
            <IconLikes index="100" />
            <ShareWidgetBlock />
          </div>
          <div className="capitalize">
            <OutlinedButton text="read more" func={testFunction} />
          </div>
        </div>
      </div>
    </div>
  );
};

FeedCard.defaultProps = {
  title: 'First Series of the MADmind NFTs Sold Out!',
  author: 'MadNews',
  description:
    'In other good news, the first in our MADmind NFT series sold out! 1,111 of the Virtual Genius MADmind NFTs were snapped up by our strong ...',
};

export default FeedCard;
