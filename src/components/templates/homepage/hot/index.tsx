import { Box, CircularProgress, Tooltip } from '@mui/material';
import { FilledButton } from 'components/common';
import { EmojiFire } from 'components/common/Emojies';
import ImageBase from 'components/common/ImageBase';
import Filter from 'components/modules/filter/Filter';
import { LeaderboardCollectionList } from 'components/modules/leaderboardList/LeaderboardList';
import { TRENDING_TYPE } from 'constants/app';
import { COMING_SOON } from 'constants/text';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import homePageService from 'service/homePageService';
import { formatPricePercent, shortenAddress, shortenNameNotiHasAddress } from 'utils/func';
import { STORAGE_KEYS } from 'utils/storage';

const FIRSTVALUE = {
  DATE: 'TODAY',
  CATE: TRENDING_TYPE.COLLECTION,
};
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
const HotComponent = () => {
  const [listItemHot, setListItemHot] = useState([]);
  const [hotTimeFilter, setHotTimeFilter] = useState<string>(FIRSTVALUE.DATE);
  const [categoryFilter, setCategoryFilter] = useState<string>(FIRSTVALUE.CATE);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChangeDate = (event: any) => {
    setHotTimeFilter(event);
  };

  const handleChangeCate = (event: any) => {
    setCategoryFilter(event);
  };

  const getListItemHot = useCallback(async () => {
    let paramaterQuery: any = {
      limit: 12,
      page: 1,
      hotTimeFilter: hotTimeFilter,
      trendingType: categoryFilter,
    };
    const walletAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
    if (walletAddress) paramaterQuery.userAddress = walletAddress;
    setLoading(true);
    const [data, error] = await homePageService.getListItemHot(paramaterQuery);
    setLoading(false);
    if (error) {
      setListItemHot([]);
      console.log(error);
      return;
    }
    setListItemHot(data.items);
  }, [hotTimeFilter, categoryFilter]);

  const renderName = useCallback(
    (item: any) => {
      switch (categoryFilter) {
        case TRENDING_TYPE.COLLECTION:
          return item?.title || item?.name || 'collection';
        case TRENDING_TYPE.ARTIST:
          return item?.username || shortenNameNotiHasAddress(item?.wallet_address);
        case TRENDING_TYPE.OFFERS:
          return item?.title;
        default:
          return item?.name;
      }
    },
    [categoryFilter],
  );

  const renderTooltip = useCallback(
    (item: any) => {
      switch (categoryFilter) {
        case TRENDING_TYPE.COLLECTION:
          return item?.title || item?.name || 'collection';
        case TRENDING_TYPE.ARTIST:
          return item?.username || item?.wallet_address;
        case TRENDING_TYPE.OFFERS:
          return item?.title;
        default:
          return item?.name;
      }
    },
    [categoryFilter],
  );

  const renderImage = useCallback(
    (item) => {
      switch (categoryFilter) {
        case TRENDING_TYPE.COLLECTION:
          return item?.thumbnail_url;
        case TRENDING_TYPE.ARTIST:
          return item?.avatar_img;
        case TRENDING_TYPE.OFFERS:
          return item?.nft_image_preview;
        default:
          return item?.name;
      }
    },
    [categoryFilter],
  );

  useEffect(() => {
    getListItemHot();
  }, [hotTimeFilter, categoryFilter]);

  return (
    <div className="bg-[#1D1C29] pt-[30px] pb-[60px] px-0">
      <div className="flex flex-col m-auto layout ">
        <Filter
          dateCallback={handleChangeDate}
          categoryCallback={handleChangeCate}
          icon={<EmojiFire />}
          firstValueDate={FIRSTVALUE.DATE}
          firstValueCate={FIRSTVALUE.CATE}
        />
        <div
          className="
            mt-3 
            grid
            lg:grid-cols-3 
            lg:grid-rows-none 
            lg:grid-flow-row 
            md:grid-cols-none 
            md:grid-rows-4 
            md:grid-flow-col 
            md:scroll-snap-mandatory 
            md:scroll-snap-always
            md:overflow-x-auto
            sm:grid-cols-none 
            sm:grid-rows-4 
            sm:grid-flow-col 
            sm:scroll-snap-mandatory 
            sm:scroll-snap-always
            sm:overflow-x-auto            
            gap-4
            no-scrollbar
            ml-3
            "
        >
          {loading ? (
            <CircularProgress
              sx={{ svg: { margin: '0px !important' }, gridColumn: '1/4', margin: 'auto' }}
              color="inherit"
              size={40}
            />
          ) : listItemHot.length === 0 ? (
            <Box className="no-data col-start-2">
              <ImageBase
                alt="No Data"
                type="NextImage"
                errorImg="NoData"
                width={175}
                height={160}
              />
              <label>No results</label>
            </Box>
          ) : (
            listItemHot.map((item: any, index: number) => {
              let _link = '';
              let scroll = false;
              switch (categoryFilter) {
                case TRENDING_TYPE.COLLECTION:
                  scroll = true;
                  _link = `/collection/${item?.address}`;
                  break;
                case TRENDING_TYPE.ARTIST:
                  scroll = true;
                  _link = `/artist/${item?.wallet_address}`;
                  break;
                case TRENDING_TYPE.OFFERS:
                  _link = `/asset/${item?.address}/${item.token_id}`;
                  break;
                default:
                  scroll = false;
                  break;
              }
              
              return (
                <Link href={_link} scroll={scroll}>
                  <a>
                    <div
                      key={index + categoryFilter}
                      className="sm:scroll-snap-align collection-tag flex justify-start items-center md:gap-4 sm:gap-2 cursor-pointer"
                    >
                      <LeaderboardCollectionList
                        name={renderName(item)}
                        avatarImg={renderImage(item)}
                        price={item?.volume}
                        likes={item?.likes}
                        liked={item?.liked}
                        isVerify={item?.is_verify}
                        price_change={formatPricePercent(item?.price_change)}
                        category={categoryFilter}
                        id={item?.id}
                        index={index + 1}
                        roundAvatar={TRENDING_TYPE.ARTIST === categoryFilter}
                        toolTipName={renderTooltip(item)}
                      />
                    </div>
                  </a>
                </Link>
              );
            })
          )}
        </div>

        {listItemHot.length >= 12 && categoryFilter !== TRENDING_TYPE.OFFERS && (
          <div className="mt-8 xl:mr-0 mr-3 md:inline-block sm:flex sm:justify-end">
            <div style={{ display: 'inline-block' }}>
              <FilledButton
                text={`View ${capitalizeFirstLetter(categoryFilter)} Leaderboard`}
                customClass="!text--label-large md:float-left sm:float-right !text-white"
                onClick={() => {
                  router.push({
                    pathname: '/leaderboard',
                    query: { type: categoryFilter, sort: 'TODAY' },
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotComponent;
