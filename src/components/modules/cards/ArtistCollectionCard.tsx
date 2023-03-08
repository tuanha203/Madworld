import ImageBase from 'components/common/ImageBase';
import { DEFAULT_IMAGE } from 'constants/app';
import React, { useState } from 'react';

import { ImageProfile } from '../../common/modal';
interface IArtistCollectionCardProps {
  img: string;
  width?: number;
  height?: number | string;
  className?: string;
  isMobile?: boolean;
}

const ArtistCollectionCard = ({ img, height, width, className, isMobile }: IArtistCollectionCardProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <figure
      style={{ width: width || 264, height: height || 264, cursor: 'pointer' }}
      className={`artistCollectionCard nft-card ${ isMobile && 'nft-card-mb'} relative w-[264px] h-[296px] shadow-elevation-dark-1 overflow-hidden image-profile ${
        className ? className : ''
      }`}
    >
      <ImageBase
        className={`object-cover h-[100%]`}
        url={img || DEFAULT_IMAGE.COVER}
        alt=""
        onClick={handleOpen}
        width={width || 264}
        type="HtmlImage"
      />
      <ImageProfile open={open} imageUrl={img} onTriggerClose={handleClose} />
      {!isMobile && <div className="card-corner bg-background-dark-900"></div>}
    </figure>
  );
};
ArtistCollectionCard.defaultProps = {
  img: './images/drop.jpg',
};

export default ArtistCollectionCard;
