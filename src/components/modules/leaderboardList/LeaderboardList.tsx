import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Tooltip } from '@mui/material';
import { FilledButton } from 'components/common';
import { HeartIcon, HeartIconFilled, TrendingUp } from 'components/common/iconography/IconBundle';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import { TRENDING_TYPE, TYPE_LIKES, WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import _ from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import likeService from 'service/likeService';
import { abbreviateNumber } from 'utils/func';
import NumberCard from '../numbered-element';
import { Avatar } from '../thumbnail';

interface LeaderboardCollectionListProps {
  name: string;
  price?: string;
  index: number;
  avatarImg?: string;
  roundAvatar?: boolean;
  category: string;
  id: number;
  likes: string | number;
  liked: boolean;
  price_change?: string;
  isVerify?: boolean;
  toolTipName?: string;
}

export const LeaderboardCollectionList: FC<LeaderboardCollectionListProps> = ({
  name,
  price,
  index,
  avatarImg,
  roundAvatar = false,
  category,
  id,
  likes,
  liked,
  price_change,
  isVerify = false,
  toolTipName,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [countLike, setCountLike] = useState<number>(0);
  const [disableLike, setDisableLike] = useState(false);
  const windowMode = useDetectWindowMode();
  const isMobileInSmMd = [WINDOW_MODE['SM'], WINDOW_MODE['MD'], WINDOW_MODE['LG']].includes(
    windowMode,
  );
  let typeLike = '';
  switch (category) {
    case TRENDING_TYPE.OFFERS:
      typeLike = TYPE_LIKES.NFT;
      break;
    case TRENDING_TYPE.ARTIST:
      typeLike = TYPE_LIKES.USER;
      break;
    case TRENDING_TYPE.COLLECTION:
      typeLike = TYPE_LIKES.COLLECTION;
      break;
  }

  const toggleHeart = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disableLike) onLike();
  };

  async function onLike() {
    setDisableLike(true);
    //@ts-ignore
    const [res, error] = await likeService.like({ targetId: id, type: typeLike });
    if (res === 'liked') {
      setIsLiked(true);
      setCountLike(countLike + 1);
    }
    if (res === 'unliked') {
      setIsLiked(false);
      setCountLike(countLike - 1);
    }
    setDisableLike(false);
  }

  useEffect(() => {
    if (likes !== undefined || likes !== null) setCountLike(_.toNumber(likes));
    if (_.isBoolean(liked)) setIsLiked(liked);
  }, [likes, liked]);

  return (
    <>
      <div>
        <NumberCard index={index} />
      </div>
      <div className="tag-wrapper w-full flex justify-start items-center gap-3 md:p-6 sm:p-3 rounded-lg shadow-elevation-dark-2 bg-background-dark-600">
        <div>
          <Avatar
            verified={isVerify}
            mode="larger"
            size={!isMobileInSmMd ? '' : '28'}
            src={avatarImg}
            rounded={roundAvatar}
          />
        </div>
        <div className="lg:w-full sm:w-[180px]">
          <div className="flex justify-between items-center">
            <h2
              className={`md:text--headline-xsmall sm:text--title-medium lg:text-primary-90 sm:text-white md:w-[148px] sm:w-[120px] truncate`}
            >
              <OverflowTooltip title={toolTipName || name}>
                <span>{name}</span>
              </OverflowTooltip>
            </h2>
            {!isMobileInSmMd && (
              <>
                <div onClick={toggleHeart} className="flex items-center gap-2">
                  {isLiked ? <HeartIconFilled /> : <HeartIcon />}
                  <p>{abbreviateNumber(countLike)}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-between gap-4">
            <Tooltip title={String(price)}>
              <div className="flex text--title-medium">
                <img className={`w-full mr-2`} src="/icons/mad_icon_outlined.svg" alt="logo" />{' '}
                <span>{(price && abbreviateNumber(price)) || 0}</span>
              </div>
            </Tooltip>
            <div className="flex lg:text--label-large sm:text--label-medium items-center">
              <span className="mr-1">
                {price_change === '-' || (price_change && price_change.includes('+')) ? (
                  <TrendingUpIcon sx={{ color: '#f4b1a3' }} />
                ) : (
                  <TrendingDown sx={{ color: '#f4b1a3' }} />
                )}
              </span>
              <span>{`${price_change}${price_change === '-' ? '' : ' %'}`}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

LeaderboardCollectionList.defaultProps = {
  name: 'default name',
  price: '0',
};

interface LeaderboardArtistListProps {
  artistName: string;
  index: string | number;
}

export const LeaderboardArtistList: FC<LeaderboardArtistListProps> = ({ artistName, index }) => {
  return (
    <div className="collection-tag flex justify-start items-center gap-4">
      <div>
        <NumberCard index={index} />
      </div>
      <div className="tag-wrapper w-[310px] flex justify-between items-center gap-3 p-6 rounded-lg shadow-elevation-dark-2 bg-background-dark-600">
        <div>
          <Avatar border={true} size="medium" />
        </div>
        <div className="w-full">
          <div className=" flex flex-row justify-between items-center gap-8">
            <h2 className="text--headline-xsmall max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap inline-block capitalize text-primary-dark">
              {artistName}
            </h2>
            <div className="text--label-large gap-1 flex items-center">
              <HeartIcon />
              <span>2k</span>
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <div className="text--title-medium">
              $<span>200,000</span>
            </div>
            <div className="flex text--label-large">
              <span className="mr-1">
                <TrendingUp />
              </span>
              <span>+</span>
              <span>20.65</span>
              <span>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LeaderboardArtistList.defaultProps = {
  artistName: 'default artist',
};

interface LeaderboardTitleListProps {
  collectionName: string;
  index: string;
}

export const LeaderboardTitleList: FC<LeaderboardTitleListProps> = ({ collectionName, index }) => {
  return (
    <div className="leaderboard-title-wrapper w-full">
      <div className="leaderboard-title-list flex justify-start items-center gap-4 w-full">
        <div className=" invisible">
          <NumberCard index={index} />
        </div>
        <div className=" w-full flex justify-between items-center py-4 px-8">
          <div className="flex items-center">
            <h1 className="text--title-large">Hot Brands</h1>
          </div>
          <div className="text--title-large ml-10">Assets</div>
          <div className="text--title-large -ml-4">Volume</div>
          <div className="text--title-large">%</div>
          <div>
            <div className=" invisible">
              <FilledButton text="Buy Now" />
            </div>
          </div>
        </div>
      </div>

      <div className="leaderboard-title-list flex justify-start items-center gap-4 w-full">
        <div>
          <NumberCard index={index} />
        </div>
        <div className=" w-full flex justify-between items-center gap-3 p-6 rounded-lg shadow-elevation-dark-2 bg-background-dark-600">
          <div className="flex items-center gap-2">
            <Avatar rounded="false" />
            <h2 className="text--headline-xsmall capitalize text-primary-dark">{collectionName}</h2>
          </div>
          <div className="text--body-large">2000</div>
          <div className="text--body-large">$200,000</div>
          <div className="text--body-large">+20.65%</div>
          <div>
            <FilledButton customClass="!text--label-large" text="Buy Now" />
          </div>
        </div>
      </div>
    </div>
  );
};

LeaderboardTitleList.defaultProps = {
  collectionName: 'default name',
};
