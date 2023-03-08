import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { HeartIcon } from 'components/common/iconography/IconBundle';
import { MadVolume } from 'components/common/price';
import { AvatarOwned } from 'components/modules';
import BannerSlider from 'components/modules/banner-slider';
import CollectionProfileCard from 'components/modules/cards/CollectionProfileCard';

import { TYPE_LIKES } from 'constants/app';
import _ from 'lodash';
import get from 'lodash/get';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import collectionService from 'service/collectionService';
import likeService from 'service/likeService';
import { abbreviateNumber } from 'utils/func';

interface RecordsLeaderBoard {
  item: any;
  items: { walletAddress: string; avatarImg: string; username: string }[];
  total: number;
}

const BannerBrandedColleciton = ({ typeThumbnail, className }: any) => {
  const [likedNft, setLiked] = useState<boolean>(false);
  const [countLike, setCountLike] = useState<number>(0);
  const [disableLike, setDisableLike] = useState(false);
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const [records, setRecords] = useState<RecordsLeaderBoard>({
    item: {},
    items: [],
    total: 0,
  });
  const type = TYPE_LIKES.COLLECTION;

  const getListCollecitonItem = useCallback(async () => {
    const [data, error] = await collectionService.getCollecitonBranded();
    if (error) return console.log(error);
    const list = get(data, 'data', []);
    const items = list.splice(0, 21);
    const firtItem = items.splice(0, 1);
    const item = firtItem.length > 0 ? firtItem[0] : {};
    const total = items.length + 4;
    setRecords({
      item,
      items,
      total,
    });
  }, []);

  useEffect(() => {
    getListCollecitonItem();
  }, [walletAddress]);

  useEffect(() => {
    if (records?.item?.like !== undefined || records?.item?.like !== null)
      setCountLike(_.toNumber(records?.item?.like));
    if (_.isBoolean(records?.item?.liked)) setLiked(records?.item?.liked);
  }, [records?.item?.like, records?.item?.liked]);

  const onLike = async () => {
    setDisableLike(true);
    const [res, error] = await likeService.like({ targetId: records?.item?.id, type });
    if (error) return;
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

  if (records.items.length === 0) return null;

  return (
    <BannerSlider
      className={className}
      typeThumbnail={typeThumbnail}
      records={records}
      imgThumbnail={records.item?.bannerUrl}
      linkRedirect={`/collection/${records.item?.address}`}
      nextBtn={false}
      prevBtn={false}
      limit={8}
      title={
        <>
          Featured
          <div className="flex flex-column">
            <span>Brands</span>
            <span className="text-primary-60"> Today...</span>
          </div>
        </>
      }
      renderer={(item, index: number) => {
        const cardProps = {
          banner: get(item, 'bannerUrl'),
          collectionTitle: get(item, 'name', 'Unknown'),
          type: TYPE_LIKES.COLLECTION,
          likes: get(item, 'like', 0),
          image: get(item, 'thumbnailUrl'),
          address: get(item, 'address'),
          creator: {
            username: get(item, 'creatorName'),
            walletAddress: get(item, 'creatorAddress'),
          },
          liked: get(item, 'liked', false),
          id: get(item, 'id'),
          madVolume: get(item, 'totalVolumn'),
        };
        return (
          <div key={index} className="card-scroll !w-[164px] lg:!w-[264px] lg:!h-[264px]">
            <CollectionProfileCard {...cardProps} />
          </div>
        );
      }}
      renderHeader={
        <div className="flex justify-between px-[16px] lg:px-0">
          <div className={`flex flex-row justify-left items-center gap-2 `}>
            <figure className="xl:w-12 w-6">
              <img className="w-full object-cover mx-auto mb-3" src="./icons/AirDrop.svg" alt="" />
            </figure>
            <h1
              className={`text--display-large capitaliz m-0 lg:!font-Hanson text-[24px] lg:text-[45px]`}
            >
              Branded Collections
            </h1>
          </div>
          <div className="flex items-center gap-2  cursor-pointer">
            <div className="hidden lg:flex text--label-large text-primary-dark">
              <Link href="/branded-projects">View Brand</Link>
            </div>
            <figure className="cursor-pointer">
              <Link href="/branded-projects">
                <ArrowForwardOutlinedIcon className="text-primary-dark" />
              </Link>
            </figure>
          </div>
        </div>
      }
      renderFooterImg={
        <div>
          <div className="flex h-[48px] justify-between items-center">
            <AvatarOwned
              link={`/artist/${records?.item?.creatorAddress}`}
              artist={records?.item?.creatorName}
              customTooltip={records?.item?.creatorName}
              srcAvatar={records?.item?.creatorAvatar}
              artistClassName="text-[18px] !text-[#FFFFFF]"
            />
          </div>
          <ul className="flex mt-[35px] items-center justify-left">
            <li className="w-[100px]">
              <div className="flex cursor-pointer" onClick={() => !disableLike && onLike()}>
                {likedNft ? <FavoriteIcon sx={{ color: '#f4b1a3' }} /> : <HeartIcon />}
                <div className="ml-[5px] text--title-medium text-white">
                  {abbreviateNumber(countLike)}
                </div>
              </div>
            </li>
            <li className="w-[100px]">
              <MadVolume
                index={
                  records?.item?.totalVolumn ? abbreviateNumber(records?.item?.totalVolumn) : 0
                }
                customClass="text-sm"
              />
            </li>
          </ul>
        </div>
      }
    />
  );
};

export default BannerBrandedColleciton;
