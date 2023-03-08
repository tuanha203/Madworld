import { Box, Tooltip } from '@mui/material';
import ImageBase from 'components/common/ImageBase';
import Link from 'next/link';
import React from 'react';
// import required modules
import { Autoplay, Pagination, Parallax } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
const OverviewSectionFeaturedCard = ({ data }: { data: any[] }) => {
  const swiperItem = data.map((item: any, index: number) => {
    return (
      <SwiperSlide key={index}>
        <figure className="w-full h-full relative overflow-hidden">
          <Link href={`/collection/${item?.address}`}>
            <a>
              <div className="card-corner bg-background-dark-900 scale-150 z-50"></div>
              <Box
                sx={{
                  '> span': {
                    height: '100% !important',
                  },
                  height: '100%',
                }}
              >
                <ImageBase
                  type="HtmlImage"
                  url={item.thumbnail_url}
                  errorImg={'Default'}
                  alt="collection"
                  layout="fill"
                  className={`object-cover !w-full !h-full`}
                />
              </Box>
              <div className="overlay-text absolute w-full h-full flex items-start text-white top-0 left-0 z-30">
                <h1 data-swiper-parallax="-250" className="text--display-medium pl-6 text-[28px]">
                  <Tooltip title={item.name} arrow>
                    <span>
                      {item.name}
                    </span>
                  </Tooltip>

                </h1>
              </div>
            </a>
          </Link>
        </figure>
      </SwiperSlide>
    );
  });
  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + ' ' + (index + 1) + '"> </span>';
    },
  };

  return (
    <>
      <div className="overview-featured-card w-[292px] h-[402px] lg:w-[552px] lg:h-[552px] overflow-hidden cursor-pointer">
        <Swiper
          pagination={pagination}
          modules={[Pagination, Autoplay, Parallax]}
          loop={true}
          parallax={true}
          autoplay={{
            delay: 1200,
            disableOnInteraction: false,
          }}
          speed={850}
          className="overview-featured-card-Swiper"
        >
          {swiperItem}
        </Swiper>
      </div>
    </>
  );
};

OverviewSectionFeaturedCard.defaultProps = {
  data: [],
};

export default OverviewSectionFeaturedCard;
