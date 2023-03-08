import { Box } from '@mui/material';
import ImageBase from 'components/common/ImageBase';
import React from 'react';
import { Tooltip } from '@mui/material';
import { shortenName } from 'utils/func';

interface IOverviewSectionCardProps {
  img: string;
  artworkTitle: string;
  width?: number;
}

const OverviewSectionCard = ({ img, artworkTitle, width }: IOverviewSectionCardProps) => {
  return (
    <div className="overview-section-card shadow-elevation-dark-1 cursor-pointer">
      <figure
        style={width ? { width: width + 'px' } : {}}
        className="relative w-[138px] h-[188px]  lg:w-[264px] lg:h-[264px] overflow-hidden relative"
      >
        <Box
          sx={{
            '> span': {
              width: '100% !important',
            },
            width: '100%',
            height: '100%',
          }}
        >
          <ImageBase
            url={img}
            errorImg={'Default'}
            layout="fill"
            alt="collection"
            type="HtmlImage"
            className={`object-cover !w-full !h-full`}
          />
        </Box>

        <div className="card-corner bg-background-black-pearl"></div>
        <div className="absolute  overlay-text flex flex-col justify-end top-0 bottom-0 w-full text--title-medium text-[16px] text-primary-dark z-50">
          <div className="text-secondary-60  pl-6  pb-4 absolute top-2">
            <Tooltip title={artworkTitle} arrow>
              <span className="text-[white]">
                {artworkTitle && artworkTitle.length > 20
                  ? shortenName(artworkTitle, 22)
                  : artworkTitle || 'Unknown'}
              </span>
            </Tooltip>
          </div>
        </div>
      </figure>
    </div>
  );
};
OverviewSectionCard.defaultProps = {
  img: './images/test.jpg',
  artworkTitle: 'artwork title',
};
export default OverviewSectionCard;
