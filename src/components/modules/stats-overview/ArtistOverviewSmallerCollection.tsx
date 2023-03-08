import React, { FC, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconLikes } from 'components/common/iconography/IconBundle';
import TrendingWithStats from '../misc/TrendingWithStats';
import { SummaryCollection, SummaryCollectionIcon } from '../whitelist-elements/SummaryCollection';
import MADOutline from 'components/common/mad-out-line';
import { TYPE_LIKES } from 'constants/app';
import _ from 'lodash';
import likeService from 'service/likeService';
import { useSelector } from 'react-redux';
interface ArtistOverviewSmallerCollectionProps {
  collectionValue?: string;
  assetsValue?: string | number;
  ownersValue?: string | number;
  volumeTraded?: string | number;
  floorPrice?: string | number;
  highestSale?: string | number;
  trendingValue?: string | number;
  likesValue?: string | number;
  className?: string;
  liked: boolean;
  type?: TYPE_LIKES;
  id?: number | string;
  color?: number | string;
}

const ArtistOverviewSmallerCollection: FC<ArtistOverviewSmallerCollectionProps> = ({
  assetsValue,
  ownersValue,
  volumeTraded,
  floorPrice,
  highestSale,
  trendingValue,
  likesValue,
  className,
  liked,
  type,
  id,
  color,
}) => {
  const [likedNft, setLikedNft] = useState<boolean>(false);
  const [countLike, setCountLike] = useState<number>(0);
  const [disableLike, setDisableLike] = useState(false);
  const { icon } = useSelector((state:any) => state.theme);

  useEffect(() => {
    if (likesValue) setCountLike(_.toNumber(likesValue));
    setLikedNft(liked);
  }, [likesValue, liked]);

  async function onLike() {
    setDisableLike(true);
    //@ts-ignore
    const [res, error] = await likeService.like({ targetId: id, type });
    if (res === 'liked') {
      setLikedNft(true);
      setCountLike(countLike + 1);
    }
    if (res === 'unliked') {
      setLikedNft(false);
      setCountLike(countLike - 1);
    }
    setDisableLike(false);
  }

  return (
    <div
      className={`artist-overview-smaller lg:w-[380px] flex flex-col px-4 pt-4 pb-5 bg-background-dark-600 ${className}`}
    >
      <div className="flex justify-around">
        <SummaryCollection color={color} className='w-[33.33%]' index={assetsValue} description="Assets" />
        <SummaryCollection color={color} className='w-[33.33%]' index={ownersValue} description="Owners" />
        <SummaryCollectionIcon
          color={color}
          icon={<MADOutline />}
          index={volumeTraded}
          description="Volume Traded"
        />
      </div>
      <Divider />
      <div className="flex justify-around">
        <SummaryCollectionIcon 
          color={color} 
          icon={<MADOutline />} 
          index={floorPrice} 
          description="Floor Price" 
          />
        <SummaryCollectionIcon
          color={color}
          icon={<MADOutline />}
          index={highestSale}
          description="Highest sale"
        />
        <SummaryCollectionIcon
          color={color}
          icon={<MADOutline />}
          index={highestSale}
          description="Highest sale"
          className=" invisible"
        />
      </div>
      <Divider />
      <div className="flex justify-center mt-1">
        <TrendingWithStats style={icon} color={color} className={`${color}`} percentage={trendingValue} />
        <div
          className="cursor-pointer w-[33.33%] flex justify-center"
          onClick={() => !disableLike && onLike()}
        >
          {likedNft ? (
            <div className="flex">
              <FavoriteIcon sx={color ? {color:color} : { color: '#f4b1a3' }} />
            <div className="ml-[5px] text--title-medium text-white">{countLike}</div>
          </div>
          ) : (
            <div className="flex">
              <IconLikes styleIcon={color} />
              <div className="text--title-medium text-white">{countLike}</div>
            </div>
          )}
        </div>
        <div className="invisible w-[33.33%]">
          <IconLikes index={countLike} />
        </div>
      </div>
    </div>
  );
};

ArtistOverviewSmallerCollection.defaultProps = {
  collectionValue: '13',
  assetsValue: '10k',
  ownersValue: '9k',
  volumeTraded: '4',
  floorPrice: '0.51',
  highestSale: '0.51',
  trendingValue: '20.65',
  likesValue: '200',
};
export default ArtistOverviewSmallerCollection;
