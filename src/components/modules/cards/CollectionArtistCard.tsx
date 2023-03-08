import { Box } from '@mui/material';
import ImageBase from 'components/common/ImageBase';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import Link from 'next/link';
import { FC } from 'react';
import { Avatar } from '../thumbnail';

interface ICollectionArtistCardProps {
  artist: string;
  heightImage?: number;
  address?: string;
  avatar?: string;
  coverImg?: string;
  isVerify?: boolean;
  nameToolTip: string;
}

export const CollectionArtistCard: FC<ICollectionArtistCardProps> = (props) => {
  const { artist, heightImage, address, coverImg, avatar, isVerify = false, nameToolTip } = props;
  return (
    <div className="artist-collection-card flex flex-col bg-background-dark-600 hover:bg-background-dark-400 shadow-elevation-dark-1 hover:shadow-elevation-dark-5 overflow-hidden">
      <Link href={`/artist/${address}`}>
        <a className=" flex flex-col overflow-hidden">
          <Box
            sx={{
              '> span': { height: '100% !important' },
              height: heightImage ? heightImage + 'px' : 'initial',
              position: 'relative',
            }}
          >
            <ImageBase
              type="HtmlImage"
              url={coverImg}
              errorImg={'Default'}
              alt="collection"
              layout="fill"
              className={`object-cover !w-full !h-full`}
            />
            <div className="card-corner bg-background-variant-dark"></div>
          </Box>
          <div className="flex flex-col justify-center items-center">
            <div className=" translate-y-[-50%]">
              <Avatar mode="larger" verified={isVerify} src={avatar} border="true" size="large" />
            </div>
            <ContentTooltip title={nameToolTip} arrow>
              <h3 className="xl:text--subtitle text--title-medium -mt-8 pt-3 pb-6 max-w-[200px] w-full text-center xl:px-0 px-3 truncate">
                {artist}
              </h3>
            </ContentTooltip>
          </div>
        </a>
      </Link>
    </div>
  );
};

CollectionArtistCard.defaultProps = {
  artist: 'default Name',
};
