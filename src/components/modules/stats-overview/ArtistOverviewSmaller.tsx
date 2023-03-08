import FavoriteIcon from '@mui/icons-material/Favorite';
import { formGroupClasses } from '@mui/material';
import Divider from '@mui/material/Divider';
import { IconLikes } from 'components/common/iconography/IconBundle';
import { TYPE_LIKES } from 'constants/app';
import useUpdateEffect from 'hooks/useUpdateEffect';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import likeService from 'service/likeService';
import TrendingWithStats from '../misc/TrendingWithStats';
import { SummaryCollection, SummaryCollectionIcon } from '../whitelist-elements/SummaryCollection';
import ModalListFollowing from './ModalListFollowing';
import MADOutline from 'components/common/mad-out-line';
import { useSelector } from 'react-redux';
interface ArtistOverviewSmallerProps {
  collectionValue?: string | number;
  assetsValue?: string | number;
  ownersValue?: string | number;
  volumeTraded?: string | number;
  floorPrice?: string | number;
  highestSale?: string | number;
  trendingValue?: string | number;
  likesValue?: number | string;
  className?: string;
  liked?: boolean | any;
  type: TYPE_LIKES;
  id: any;
  follows?: number | string;
  getUserInfo?: any;
}

const ArtistOverviewSmaller: FC<ArtistOverviewSmallerProps> = ({
  collectionValue,
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
  follows,
  getUserInfo,
}) => {
  const [likedNft, setLikedNft] = useState<boolean>(false);
  const [countLike, setCountLike] = useState<number>(0);
  const [disableLike, setDisableLike] = useState(false);
  const [modalListFollowing, setModalListFollowing] = useState<boolean>(false);
  const { icon } = useSelector((state:any) => state.theme);

  const router = useRouter();
  const artistAddress = router.query.id as string;

  useEffect(() => {
    if (likesValue) setCountLike(_.toNumber(likesValue));
    setLikedNft(liked);
  }, [likesValue, liked]);

  async function onLike() {
    setDisableLike(true);
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

  const openModalFollowing = () => {
    if (follows && follows > 0) {
      setModalListFollowing(true);
    }
  };
  const closeModalFollowing = () => {
    setModalListFollowing(false);
  };

  useUpdateEffect(() => {
    setModalListFollowing(false);
  }, [artistAddress]);

  return (
    <div
      className={`artist-overview-smaller lg:w-[400px] xl:mx-0 sm:mx-auto sm:w-full flex flex-col px-4 pt-4 pb-5 bg-background-dark-600 ${className}`}
    >
      <div className="flex justify-around">
        <SummaryCollection
          className="w-[33.33%]"
          index={collectionValue || 0}
          description="collections"
        />
        <SummaryCollection className="w-[33.33%]" index={assetsValue || 0} description="Assets" />
        <SummaryCollection className="w-[33.33%]" index={ownersValue || 0} description="Owners" />
      </div>
      <Divider />
      <div className="flex justify-around">
        <SummaryCollectionIcon
          icon={<MADOutline />}
          index={volumeTraded || 0}
          description="Volume Traded"
        />
        <SummaryCollectionIcon
          icon={<MADOutline />}
          index={floorPrice || 0}
          description="Floor Price"
        />
        <SummaryCollectionIcon
          icon={<MADOutline />}
          index={highestSale || 0}
          description="Highest sale"
        />
      </div>
      <Divider />
      <div className="flex justify-center mt-1">
        <TrendingWithStats style={icon} percentage={trendingValue} />
        <div
          className="mr-4 cursor-pointer w-[33.33%] flex justify-center"
          onClick={() => !disableLike && onLike()}
        >
          {likedNft ? (
            <div className="flex">
              <FavoriteIcon style={icon || { color: '#F4B1A3' }} />
              <div className="ml-[5px] text--title-medium text-white">{countLike}</div>
            </div>
          ) : (
            <div className="flex">
              <IconLikes styleIcon={icon || { color: '#F4B1A3' }} />
              <div className="text--title-medium text-white">{countLike}</div>
            </div>
          )}
        </div>
        <div onClick={openModalFollowing} className="w-[33.33%] flex justify-center">
          <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
              stroke={icon?.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text--title-medium text-white ml-1">{follows || 0}</div>
        </div>
      </div>
      {modalListFollowing && (
        <ModalListFollowing
          open={modalListFollowing}
          title="Following"
          handleClose={closeModalFollowing}
          getUserInfo={getUserInfo}
        />
      )}
    </div>
  );
};

ArtistOverviewSmaller.defaultProps = {
  collectionValue: '0',
  assetsValue: '0',
  ownersValue: '0',
  volumeTraded: '0',
  floorPrice: '0',
  highestSale: '0',
  trendingValue: '0',
  likesValue: 0,
};
export default ArtistOverviewSmaller;
