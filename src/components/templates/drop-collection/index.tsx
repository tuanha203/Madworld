import { Box, Button, Skeleton } from '@mui/material';
// import { FilledButton } from 'components/common';
import ImageBase from 'components/common/ImageBase';
import DropdownCheckBox from 'components/common/select-type/DropdownCheckBox';
import SelectBasic from 'components/common/select-type/SelectBasic';
import DropCardSingle from 'components/modules/cards/DropCardSingle';;
import _ from 'lodash';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import dropCollectionService from 'service/dropCollectionService';
import { toastError } from 'store/actions/toast';

const LIMIT_DROPS_ITEM_LIST = 9;
interface DropsCollectionProps { }

interface IParamsType {
  limit?: number;
  page?: number;
  type?: string;
  categories?: string;
  isDisplayHomepage?: boolean;
  isDisplay?: boolean;
}

export interface ISelectedSortType {
  name: string;
  value: string;
  isDefault?: boolean;
}

export interface IListCategoryType {
  label: string;
  value: string;
}

const selectOptionsSortBy: ISelectedSortType[] = [
  { name: 'Last 7 Days', value: 'LAST7DAYS' },
  { name: 'Last 14 Days', value: 'LAST14DAYS' },
  { name: 'Last 30 Days', value: 'LAST30DAYS' },
  { name: 'Last 60 Days', value: 'LAST60DAYS' },
  { name: 'Last 90 Days', value: 'LAST90DAYS' },
  { name: 'Last Year', value: 'LASTYEARS' },
  { name: 'All Time', value: 'ALLTIME', isDefault: true },
]

const DropsCollection: FC<DropsCollectionProps> = () => {
  const dispatch = useDispatch();
  const defaultOptionSortBy = _.find(selectOptionsSortBy, 'isDefault') || selectOptionsSortBy[0];
  const [categoriesType, setCategoriesType] = useState<string[]>([]);
  const [listCategoriesType, setListCategoriesType] = useState<IListCategoryType[]>([]);
  const [selectedSort, setSelectedSort] = useState<ISelectedSortType>(defaultOptionSortBy);
  const [limit, setLimit] = useState<number>(LIMIT_DROPS_ITEM_LIST);
  const [totalDrops, setTotalDrops] = useState<number>(0);
  const [listDropsCollection, setListDropsCollection] = useState([]);
  const [isShowButtonReset, setShowButtonReset] = useState<boolean>(false);
  // const [isLoading, setLoading] = useState<boolean>(false);
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const [hasMore, setHasMore] = useState<boolean>(true);
  useEffect(() => {
    if (
      !_.isEmpty(categoriesType) ||
      (selectedSort?.value && selectedSort?.value !== defaultOptionSortBy.value)
    ) {
      setShowButtonReset(true);
    } else {
      setShowButtonReset(false);
    }
  }, [categoriesType, selectedSort]);

  useEffect(() => {
    setHasMore(totalDrops > LIMIT_DROPS_ITEM_LIST && listDropsCollection.length < totalDrops)
  }, [totalDrops, listDropsCollection]);

  const getListDropsCollection = async (params: IParamsType) => {
    try {
      // setLoading(true);
      const [response, error] = await dropCollectionService.getDropCollectionAll(params);
      if (response) {
        const dataDrops = _.get(response, 'items', []);
        const totalItem = _.get(response, 'meta.totalItem', 0);
        setTotalDrops(totalItem);
        setListDropsCollection(dataDrops);
      }
      if (error) {
        dispatch(toastError('Something went wrong'));
      }
    } catch (error) {
      dispatch(toastError('Something went wrong'));
    } finally {
      // setLoading(false);
    }
  };

  const getListDropsCollectionCategories = async () => {
    try {
      const [response, error] = await dropCollectionService.getDropCollectionCategoriesList();
      if (response) {
        const dataCategory = response.map((category: any) => {
          return { label: category, value: category };
        });
        setListCategoriesType(dataCategory);
      }
      if (error) {
        dispatch(toastError('Something went wrong'));
      }
    } catch (error) {
      dispatch(toastError('Something went wrong'));
    } finally {
      // setLoading(false);
    }
  };

  const handleViewMore = () => {
    setLimit(limit + LIMIT_DROPS_ITEM_LIST);
  };

  const handleReset = () => {
    setCategoriesType([]);
    setSelectedSort(defaultOptionSortBy);
  };

  useEffect(() => {
    getListDropsCollectionCategories();
  }, []);

  useEffect(() => {
    const params = {
      limit,
      page: 1,
      isDisplay: true,
      type: selectedSort.value,
      categories: categoriesType.join(','),
    };
    getListDropsCollection(params);
  }, [categoriesType, limit, selectedSort, walletAddress]);
  const renderLoaderSkeletons = () => {
    const Skeletons = [];
    for (let index = 0; index < 3; index++) {
      Skeletons.push(
        <div key={index}>
          <Box>
            <Skeleton
              variant="rectangular"
              width={'100%'}
              height={'473px'}
              className="bg-[#373d4a]"
              animation="wave"
            />
          </Box>
        </div>,
      );
    }
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-6">
        {Skeletons}
      </div>
    )
  }
  return (
    <div className="bg-background-asset-detail pb-10">
      <div className="layout mx-auto xl:pt-16 px-[16px] xl:px-[unset]">
        <div className="drop-header flex items-start justify-between mb-12">
          <h1 className="font-extrabold font-Chakra text-[36px] mt-0">Drops</h1>
          <div className="flex justify-between hidden lg:flex items-end">
            <div className="flex gap-3">
              <SelectBasic
                selected={selectedSort}
                setSelected={setSelectedSort}
                nameTypes={selectOptionsSortBy}
                title="Sort By"
              />
              <DropdownCheckBox
                title="Categories"
                listSaleType={listCategoriesType}
                listChecked={categoriesType}
                setListChecked={setCategoriesType}
              />
            </div>
            <div>
              {isShowButtonReset && (
                <Button
                  className="text-primary-90 py-0 mt-3 h-auto text-button-square text-transform-inherit font-Chakra"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
        <InfiniteScroll
          dataLength={listDropsCollection?.length}
          next={handleViewMore}
          hasMore={hasMore}
          loader={renderLoaderSkeletons()}
          className="!overflow-hidden"
        >
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
            {listDropsCollection.length > 0 &&
              listDropsCollection.map((DropsItem: any) => {
                return (
                  <div key={DropsItem?.address + DropsItem.id}>
                    <DropCardSingle
                      dropId={DropsItem.id}
                      collectionTitle={DropsItem.name}
                      artist={DropsItem.creatorName}
                      imgCover={DropsItem.bannerUrl}
                      imgAvatar={DropsItem.thumbnailUrl}
                      timePoster={DropsItem.postedAt}
                      expiredTime={moment(DropsItem.expiredTime).unix()}
                      externalLink={DropsItem.externalLink}
                    />
                  </div>
                );
              })}
          </div>
        </InfiniteScroll>
        <div>
          {listDropsCollection.length === 0 && (
            <Box className="no-data">
              <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
              <label>No results</label>
            </Box>
          )}
        </div>
        {/* {totalDrops > LIMIT_DROPS_ITEM_LIST && listDropsCollection.length < totalDrops && (
          <FilledButton
            loading={isLoading}
            onClick={handleViewMore}
            text="View More"
            customClass="!text--label-large mt-7 font-Chakra"
          />
        )} */}
      </div>
    </div>
  );
};
export default DropsCollection;
