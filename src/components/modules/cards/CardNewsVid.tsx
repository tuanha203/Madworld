import React from 'react'
import { ClockIcon, HeartIcon, IconPlay } from 'components/common/iconography/IconBundle';

interface ICardNewsVidProps{
    title: string
    img: any
}

const CardNewsVid = ({ title, img } : ICardNewsVidProps) => {
    return (
        <div className="card-news-vid nft-card w-[264px] bg-background-dark-600 hover:bg-background-dark-400 shadow-elevation-dark-1 hover:shadow-elevation-light-5 cursor-pointer">
            <div className='relative'>
                <figure className='relative w-[264px] h-[234px] overflow-hidden'>
                    <img className='w-full object-cover' src={img} alt="" />
                    <div className="card-corner bg-background-dark-900 "></div>
                    <div className='absolute button-play w-full flex flex-col justify-center items-center top-0 bottom-0 left-0 right-0 z-50 '>
                        <IconPlay />
                    </div>
                </figure>
            </div>
            <div className='flex flex-col items-start gap-3 p-4 '>
                <div className='text--title-medium mb-12'>
                    {title}
                </div>
                {/* <div className="w-full flex justify-between items-center">
                    <div className='flex items-center gap-2'>
                        <ClockIcon />
                        <span className='text--label-medium'>Posted 8h ago</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <HeartIcon />
                        <span className='text--label-medium'>90k</span>
                    </div>
                </div> */}
            </div>
        </div>
    )
}
CardNewsVid.defaultProps = {
    title: "Coming Soon In The Future",
    img: "./images/Girlfirendphoto2.png"
}
export default CardNewsVid