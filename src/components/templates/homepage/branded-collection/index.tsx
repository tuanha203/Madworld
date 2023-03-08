import React, { useRef, useState } from "react";
import { RightArrow } from 'components/common/iconography/IconBundle'
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { SharedViewAll } from "components/modules/genericShare/ShareViewAll";
import CollectionProfileCard from "components/modules/cards/CollectionProfileCard";
import FeaturedBrandedCollection from "components/modules/cards/FeaturedBrandedCollection";
// import DropCardSingle from "../cards/DropCardSingle";

const BrandedCollectionsHomepage = () => {
  const pagination = {
    clickable: true,
    renderBullet: function (index: any, className: string) {
      return '<span class="' + className + '">' + "</span>";
    },
  };

  const data = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
  ]
  // const data = new Array(10000).fill().map((value, index) => ({ id: index, title: faker.lorem.words(5), body: faker.lorem.sentences(4) }))
  return (
    <section className="branded-collections-section bg-background-dark-900 pb-8">
      <div className="branded-collections-section-wrapper container padded">
        <div className='w-full flex flex-row items-center justify-between'>
          <div className='flex flex-row justify-center items-center gap-2'>
            <figure className='w-12'>
              <img className='w-full object-cover mx-auto mb-3' src="./icons/branded.svg" alt="" />
            </figure>
            <h1 className='text--display-large capitalize'>Branded Collections</h1>
          </div>
          <SharedViewAll />
        </div>
        <div className='branded-collections-homepage'>
          <Swiper
            pagination={pagination}
            modules={[Pagination]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="collection-listing listing-first-slide w-full h-full flex justify-between gap-8">
                <div className="w-1/2">
                  <FeaturedBrandedCollection />
                </div>
                <div className="part-listing grid grid-cols-2 grid-rows-2 gap-4">
                  {data.slice(1, 5).map((card, index) => (
                    <CollectionProfileCard key={index} />
                  ))}
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="collection-listing listing-grid w-full h-full">
                {data.slice(6, 14).map((card, index) => (
                  <CollectionProfileCard key={index} />
                ))}
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="collection-listing listing-grid w-full h-full">
                {data.slice(14, 22).map((card, index) => (
                  <CollectionProfileCard key={index} />
                ))}
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export default BrandedCollectionsHomepage