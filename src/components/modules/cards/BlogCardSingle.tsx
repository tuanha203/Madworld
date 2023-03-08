import { FC } from 'react';
import { FilledButton } from '../../common/buttons';
import { DiscordIcon } from 'components/common/iconography/SocialMediaIcon';
import { IconEvent } from 'components/common/iconography/IconBundle';

interface IBlogCardSingleProps {
  title: string;
  description: string;
  link: string;
  date: string;
  img: string;
}

const BlogCardSingle: FC<IBlogCardSingleProps> = (props) => {
  const { title, description, link, date, img } = props;
  return (
    <div className="blog-card min-w-[280px] w-[550px] flex flex-col bg-background-dark-600 overflow-hidden">
      <figure
        style={{
          backgroundImage: `url(${img})`,
        }}
        className="relative w-full h-[400px] bg-cover bg-center"
      >
        <div className="card-corner bg-background-dark-900 "></div>
      </figure>
      <div className="flex flex-col justify-center items-start py-8 px-6">
        <div className="mb-4">
          <h3 className="text--headline-medium mb-2">{title}</h3>
          <p className="text--label-large">{description}</p>
        </div>
        <div className="flex w-full h-[60px] justify-between items-end text--label-medium mb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <div className="scale-75">
                <DiscordIcon />
              </div>
              <span>{link}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="scale-75">
                <IconEvent />
              </div>
              <span>{date}</span>
            </div>
          </div>
          <div className="mt-4 capitalize  ">
            <FilledButton
              customClass="!text-background-dark-600 !text--label-large"
              text="join our discord"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

BlogCardSingle.defaultProps = {
  title: 'AMA with Pat Lee',
  description:
    'AMA with Pat Lee, artist behind the creation of the MADminds series. Sit down with MC Salty Eggs to talk about the start of the MADminds...',
  link: 'discord.gg/madworldnft',
  date: '21 December - 01:30 PM UTC',
  img: './images/test.jpg',
};

export default BlogCardSingle;
