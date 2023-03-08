import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay } from "swiper";


const CollectionAssetCard = () => {
    const collectionAssetsImage = [
        {
            "src": "./images/CollectionAsset2.png"
        },
        {
            "src": "./images/CollectionAsset3.png"
        },
        {
            "src": "./images/CollectionAsset4.png"
        }
    ]

    const swiperItem = collectionAssetsImage.map((item, index) => {
        return (
            <SwiperSlide key={index}>
                <img src={item.src} key={index} alt="" />
            </SwiperSlide>
        )
    })
    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<span class="' + className + " " + (index + 1) + '"> </span>';
        },
    };

    return (
        <>
            <div className="collection-asset-card md:w-[264px] sm:w-[100%] h-[234px] overflow-hidden">
                <Swiper
                    pagination={pagination}
                    modules={[Pagination, Autoplay]}
                    loop={true}
                    autoplay={{
                        delay: 1200,
                        disableOnInteraction: false
                    }}
                    speed={800}
                    className="collection-asset-card-Swiper"
                >
                    {swiperItem}
                </Swiper>
            </div>
        </>
    )
}

export default CollectionAssetCard