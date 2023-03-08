import BannerSlider from 'components/modules/banner-slider';
import ArtistBrandedProjectCard from 'components/modules/cards/ArtistBrandedProjectCard';
import get from 'lodash/get';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import artistService from 'service/artist';

interface RecordsLeaderBoard {
  items: { walletAddress: string; avatarImg: string; username: string }[];
  total: number;
}

const BannerBrandedProjects = ({ typeThumbnail, className }: any) => {
  const [records, setRecords] = useState<RecordsLeaderBoard>({
    items: [],
    total: 0,
  });

  const getListHotItems = useCallback(async () => {
    const [data, error] = await artistService.getLeaderBoard('TODAY', 1);
    if (error) return console.log(error);
    const items = get(data, 'data', []).slice(0, 22);
    const total = items.length + 2;
    setRecords({
      items,
      total,
    });
  }, []);

  useEffect(() => {
    getListHotItems();
  }, []);

  return (
    <BannerSlider
      title={
        <>
          Featured
          <div className="flex flex-column">
            <span>Brands</span>
            <span className="text-primary-60"> Today...</span>
          </div>
        </>
      }
      limit={8}
      className={className}
      typeThumbnail={typeThumbnail}
      records={records}
      renderer={(item, index: number) => (
        <Link key={`${item.walletAddress}-${index}`} href={`/artist/${item.walletAddress}`}>
          <a>
            <div key={index} className="card-scroll">
              <ArtistBrandedProjectCard
                img={item?.avatarImg}
                artworkTitle={
                  item?.username ||
                  (item?.walletAddress ? item?.walletAddress?.substring(0, 6) : '')
                }
                width={264}
              />
            </div>
          </a>
        </Link>
      )}
    />
  );
};

export default BannerBrandedProjects;
