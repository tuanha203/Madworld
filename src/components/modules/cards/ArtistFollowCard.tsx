// import { HeartIcon, TrendingUp } from '../../atoms/iconography/IconBundle';
// import { Avatar } from '../../atoms/thumbnail/AvatarBundle';
// import { MadVolume } from '../../atoms/price/Price';

import { HeartIcon, TrendingUp } from "components/common/iconography/IconBundle"
import { MadVolume } from "components/common/price"
import { Avatar } from "../thumbnail"

interface IArtistFollowCardProps{
    artistName: string
    img: string
}

const ArtistFollowCard = ({ artistName, img }: IArtistFollowCardProps) => {
    return (
        <div className='sm:scroll-snap-align md:mx-3 first:ml-0 last:mr-0 artist-follow-card w-[100%] max-w-[360px] bg-background-dark-600 hover:bg-background-dark-400 shadow-elevation-dark-1 hover:shadow-elevation-dark-5 cursor-pointer'>
            <figure className='relative overflow-hidden max-w-[360px]'>
                <img className='max-w-[360px] w-[100%] h-[260px] object-cover' src={img} alt="" />
                <div className="card-corner bg-background-dark-800"></div>
            </figure>
            <div className='w-full flex justify-center translate-y-[-50%]'>
                <Avatar border="true" size="large" />
            </div>
            <div className='flex flex-col justify-center items-center gap-2 -mt-4 mb-7'>
                <h2 className='text--title-large capitalize'>{artistName}</h2>
            </div>
            <div className="drop-footer flex justify-between items-center -mt-2 pb-5 px-4">
                <div className='flex items-center gap-2'>
                    <HeartIcon />
                    <span className='text--label-medium'>90k</span>
                </div>
                <div className='flex items-center gap-2'>
                    <MadVolume index="60.90k" />
                </div>
                <div className='flex items-center gap-2'>
                    <TrendingUp />
                    <span className='text--label-medium'>+60.90%</span>
                </div>
            </div>
        </div>
    )
}

ArtistFollowCard.defaultProps = {
    artistName: "default Name",
    img: "./images/test.jpg"
}


export default ArtistFollowCard

