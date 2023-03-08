import { useCallback, useEffect, useRef, useState } from 'react';
// import OverviewSectionCard from 'components/modules/cards/OverviewSectionCard';
import CollectionProfileCard from 'components/modules/cards/CollectionProfileCard';

import Link from 'next/link';
import get from 'lodash/get';
import BannerSlider from 'components/modules/banner-slider';
import homePageService from 'service/homePageService';
import { TYPE_LIKES } from 'constants/app';
import leaderBoardService, { LeaderBoardCategory } from 'service/leaderBoardService';

interface RecordsLeaderBoard {
  items: { address: string; thumbnail_url: string; name: string }[];
  total: number;
}

const BannerLeaderBoard = () => {
  const [records, setRecords] = useState<RecordsLeaderBoard>({
    items: [],
    total: 0,
  });

  const getListHotItems = useCallback(async () => {
    const params = {
      type: 'TODAY' as LeaderBoardCategory,
      isHot: 1 as const,
    };
    const [data, error] = await leaderBoardService.getLeaderBoardCollection(params);
    if (error) {
      console.log(error);
      return;
    }
    const items = data.slice(0, 22);
    const total = items?.length ;

    setRecords({
      items,
      total: total + 2,
    });
  }, []);

  useEffect(() => {
    getListHotItems();
  }, []);

  return (
    <BannerSlider
      title={
        <div className="font-Hanson">
          What's Hot?
          <div className="text-primary-60"> Today...</div>
        </div>
      }
      limit={8}
      records={records}
      renderer={(item, index: number) => {
        const cardProps = {
          banner: get(item, 'bannerUrl'),
          collectionTitle: get(item, 'title', '') || get(item, 'name', 'Unknown'),
          type: TYPE_LIKES.COLLECTION,
          likes: get(item, 'like'),
          image: get(item, 'thumbnailUrl'),
          address: get(item, 'address'),
          creator: get(item, 'creator'),
          liked: get(item, 'liked'),
          id: get(item, 'id'),
          madVolume: get(item, 'volumnTraded'),
        };
        return (
          <div key={index} className="card-scroll !w-[264px]">
            <CollectionProfileCard {...cardProps} />
          </div>
        );
      }}
    />
  );
};
export default BannerLeaderBoard;
