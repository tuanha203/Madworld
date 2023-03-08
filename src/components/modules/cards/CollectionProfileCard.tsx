import FavoriteIcon from '@mui/icons-material/Favorite';
import { Tooltip } from '@mui/material';
import { HeartIcon } from 'components/common/iconography/IconBundle';
import ImageBase from 'components/common/ImageBase';
import { MadVolume } from 'components/common/price';
import { Avatar } from 'components/modules/thumbnail';
import { TYPE_LIKES } from 'constants/app';
import _ from 'lodash';
import Link from 'next/link';
import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import likeService from 'service/likeService';
import { abbreviateNumber } from 'utils/func';

interface ICollectionProfileCardProps {
  collectionTitle: string;
  creator: any;
  banner?: string;
  likes?: number;
  madVolume?: string | number;
  image?: any;
  address: string;
  type: TYPE_LIKES;
  id: string | number;
  liked?: boolean;
}

const CollectionProfileCard = (props: ICollectionProfileCardProps) => {
  const { collectionTitle, creator, banner, likes, madVolume, image, address, id, type, liked } =
    props;
  const [likedNft, setLiked] = useState<boolean>(false);
  const [countLike, setCountLike] = useState<number>(0);
  const [disableLike, setDisableLike] = useState(false);
  const { text, avatar, box, icon } = useSelector((state:any) => state.theme);

  useEffect(() => {
    if (likes !== undefined || likes !== null) setCountLike(_.toNumber(likes));
    if (_.isBoolean(liked)) setLiked(liked);
  }, [likes, liked]);

  const onLike = async () => {
    setDisableLike(true);
    //@ts-ignore
    const [res, error] = await likeService.like({ targetId: id, type });
    if (res === 'liked') {
      setLiked(true);
      setCountLike(countLike + 1);
    }
    if (res === 'unliked') {
      setLiked(false);
      setCountLike(countLike - 1);
    }
    setDisableLike(false);
  };

  const creatorUsername = creator?.username
    ? creator?.username?.trim().length > 9
      ? creator?.username?.substring(0, 9) + '...'
      : creator?.username
    : creator?.walletAddress?.substring(0, 6);

  return (
    <div
      className={`collection-profile-card ${
        !box?.outline ? 'nft-card' : ''
      }  w-[100%] min-h-[264px] bg-background-dark-600 overflow-hidden`}
      style={box?.outline}
    >
      <figure className="relative overflow-hidden w-[100%] h-[130px] mx-auto">
        <Link href={`/collection/${address}`}>
          <a>
            <ImageBase
              className="w-full h-[100%] object-cover"
              url={banner}
              type="HtmlImage"
              alt="cover"
            />
          </a>
        </Link>
        {!box?.outline && <div className="card-corner bg-background-dark-900" />}
      </figure>
      <div className="flex justify-center translate-y-[-50%] mx-auto w-fit">
        <Link href={`/collection/${address}`}>
          <a>
            <Avatar styleBox={avatar?.circle} src={image} border="true" size="large" />
          </a>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center gap-1 -mt-6">
        <Link href={`/collection/${address}`}>
          <a className="w-[80%] xl:w-[unset]">
            <Tooltip title={collectionTitle}>
              <h2 className="xl:max-w-[230px] max-w-[100%] text-ellipsis overflow-hidden whitespace-nowrap text-base text--title-large text-center truncate">
                {collectionTitle}
              </h2>
            </Tooltip>
          </a>
        </Link>

        <Link href={`/artist/${creator?.walletAddress}`}>
          <a className="truncate max-w-[70%] text--label-small ">
            <Tooltip title={creator?.username || creator?.walletAddress}>
              <p>
                Created by{' '}
                <span style={text} className="text-primary-90 cursor-pointer font-['Chakra Petch']">
                  {creatorUsername}
                </span>
              </p>
            </Tooltip>
          </a>
        </Link>
      </div>
      <div className="flex justify-between items-center px-4 pb-4 pt-2">
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={() => !disableLike && onLike()}
        >
          {likedNft ? (
            <FavoriteIcon sx={icon ? icon : { color: '#f4b1a3' }} />
          ) : (
            <HeartIcon style={icon} />
          )}
          <span className="text--label-medium text-[11px]">{abbreviateNumber(countLike)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MadVolume index={madVolume ? abbreviateNumber(madVolume) : 0} />
        </div>
      </div>
    </div>
  );
};

CollectionProfileCard.defaultProps = {
  collectionTitle: 'default collection',
  artist: 'Unknown',
  img: './images/GeniusBanner.jpg',
  likes: 0,
  madVolume: 0,
};

export default memo(CollectionProfileCard);
