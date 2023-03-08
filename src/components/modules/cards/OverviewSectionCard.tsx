import { Box } from '@mui/material';
import ImageBase from 'components/common/ImageBase';
import React from 'react';
import { Tooltip } from '@mui/material';

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
        className="relative flex w-[138px] h-[188px] lg:w-[264px] lg:h-[264px] overflow-hidden"
      >
        <Box
          sx={{
            '> span': {
              width: '100% !important',
            },
            width: '100%',
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

        <div className="card-corner bg-background-dark-900"></div>
        <div className="absolute overlay-text flex flex-col justify-end top-0 bottom-0 w-full xl:text--subtitle text--title-medium text-primary-dark z-50">

          <div className="text-secondary-60 pl-6 pb-4">
            <Tooltip title={artworkTitle} arrow>
              <span>
                {artworkTitle}
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
