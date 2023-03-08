import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Tooltip } from '@mui/material';
import IconLocal from 'components/common/iconography/IconLocal';
import SelectBasic from 'components/common/select-type/SelectBasic';
import CardCommon from 'components/modules/cards/CardCommon';
import { LoadingListBase } from 'components/modules/Loading';
import ModalFilterMarket from 'components/modules/modal-filter-market';
import DrawerExplore from 'components/templates/explore/drawer';
import ExploreHeader, { DefaultSelectedTab } from 'components/templates/explore/header';
import { TYPE_LIKES, WINDOW_MODE } from 'constants/app';
import { NftSortOptions } from 'constants/dropdown';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import useUpdateEffect from 'hooks/useUpdateEffect';
import _ from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import nftService from 'service/nftService';
import { removeEventChangePage } from 'store/actions/forceUpdating';
import { toastError } from 'store/actions/toast';
import { beautifulObject } from 'utils/func';
let limitExplore = 12;
const NUMSITEMINROWLARGE = 4;
const NUMSITEMINROWSMALL = 6;

interface SkeletonConfig {
  mode: 'normal' | 'small';
  items: number;
}

const Marketplace = () => {
  const router = useRouter();
  const [sales, setSales] = useState<any>([]);
  const [status, setStatus] = useState<any>([]);
  const [sort, setSort] = useState<any>(null);
  const [metaNft, setMetaNft] = useState<any>({});
  const [nftList, setNftList] = useState<any[]>([]);
  const [openDrawer, setOpenDrawer] = useState(true);
  const [collections, setCollections] = useState<any>([]);
  const [category, setCategory] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [lazyLoad, setLazyLoad] = useState<boolean>(true);
  const [smallItem, setSmallItem] = useState<boolean>(true);
  const [skeletonConfig, setSkeletonConfig] = useState<SkeletonConfig>({
    mode: 'normal',
    items: NUMSITEMINROWLARGE,
  });
  const [activeMore, setActiveMore] = useState<boolean>(false);
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const { walletAddress } = useSelector((state: any) => (state as any)?.user?.data);
  const dispatch = useDispatch();
  const windowMode = useDetectWindowMode();

  const rootParams = useRef<any>();
  const page = useRef<number>(1);

  useEffect(() => {
    rootParams.current = { categoryId: DefaultSelectedTab.id };
    dispatch(removeEventChangePage(0));
  }, []);

  useEffect(() => {
    if (!_.isEmpty(metaNft)) {
      if (page.current === metaNft?.totalPages) {
        setActiveMore(false);
      } else {
        setActiveMore(true);
      }
    }
  }, [metaNft]);

  useUpdateEffect(() => {
    getListNFT();
  }, [walletAddress]);

  useEffect(() => {
    rootParams.current = { ...rootParams.current, ...router.query };
    debounceLoadData({ ...rootParams.current });
    window.scrollTo(0, 0);
    page.current = 1;
    setActiveMore(false);
  }, [router]);

  const debounceLoadData = useCallback(
    _.debounce(async (params) => {

      if (!rootParams.current.loadMore) {
        setLazyLoad(true);
      } else setLoading(true);

      //--------------- binding data sort----------//
      if (params.sortField) {
        const sort = NftSortOptions.find((x) => x.value === params.sortField);
        if (sort) {
          setSort(sort);
        } else setSort(null);
      } else setSort(null);

      //---------- binding data sale type---------//
      if (params.saleType) {
        if (_.isArray(params.saleType)) {
          setStatus([...params.saleType]);
        } else {
          params.saleType = [params.saleType];
          setStatus([...params.saleType]);
        }
      } else setStatus([]);

      //----------- binding data price type-------//
      if (params.priceType) {
        if (_.isArray(params.priceType)) {
          setSales([...params.priceType]);
        } else {
          if (params.priceType.includes('-')) {
            params.priceType = params.priceType.split('-');
          } else {
            params.priceType = [params.priceType];
          }
          setSales([...params.priceType]);
        }
        if (!_.isString(params.priceType)) params.priceType = params.priceType.join('-');
      } else setSales([]);

      //----- binding data collection type------//
      if (params.collectionIds) {
        if (_.isArray(params.collectionIds)) {
          setCollections([...params.collectionIds]);
        } else {
          if (params.collectionIds.includes('-')) {
            params.collectionIds = params.collectionIds.split('-');
          } else {
            params.collectionIds = [params.collectionIds];
          }
          setCollections([...params.collectionIds]);
        }
        if (!_.isString(params.collectionIds))
          params.collectionIds = params.collectionIds.join('-');
      } else setCollections([]);
      //----- binding data category type------//
      if (params.categoryId) {
        setCategory(params.categoryId);
      }
      rootParams.current = beautifulObject(params);
      await getListNFT();
    }, 150),
    [],
  );

  const getListNFT = async () => {
    try {
      setLoading(true);
      if (['null', 'undefined'].includes(rootParams.current.categoryId)) {
        rootParams.current.categoryId = undefined;
      }
      if (rootParams.current.categoryId !== undefined) {
        rootParams.current.categoryId = rootParams.current.categoryId;
      }
      const [result, error] = (await nftService.getListNFT({
        ...rootParams.current,
        limit: limitExplore,
      })) as any;
      if (error) return console.log('errr : ', error);
      setMetaNft(result?.meta || {});
      setNftList(result?.items || []);
      if (result?.items.length === 0) {
        setActiveMore(false);
      }
    } catch (error) {
      dispatch(toastError('Something went wrong'));
    } finally {
      setLoading(false);
      setLazyLoad(false);
      delete rootParams?.current?.loadMore;
    }
  };

  const onPushRouter = (params: any) => {
    if (['null', 'undefined'].includes(rootParams.current.categoryId)) {
      delete rootParams.current.categoryId;
    }
    const url = { pathname: '/marketplace', query: params || rootParams.current };
    const options = { scroll: false };
    router.push(url, undefined, options);
  };

  const onLoadMoreNft = async () => {
    limitExplore += 12;
    await getListNFT();
  };

  const onChangeSort = (data: any) => {
    rootParams.current.sortField = data.value;
    onPushRouter(null);
  };

  const onChangeStatus = (value: any) => {
    rootParams.current.saleType = value;
    onPushRouter(null);
  };

  const onChangeSales = (value: any) => {
    rootParams.current.priceType = value;
    onPushRouter(null);
  };

  const onChangeCollections = (value: any) => {
    rootParams.current.collectionIds = value;
    onPushRouter(null);
  };

  const handleChangeTab = (value: any) => {
    rootParams.current.categoryId = value.id;
    if (value.id === undefined) delete rootParams.current.categoryId;
    onPushRouter(null);
  };

  const handleResetFilter = () => {
    for (const key in rootParams.current) {
      if (key !== 'categoryId') delete rootParams.current[key];
    }
    onPushRouter(null);
  };

  const activeReset = useCallback(() => {
    if (sales.length > 0 || status.length > 0 || collections.length > 0 || sort) return true;
    return false;
  }, [sales.length > 0, status.length > 0, collections.length > 0, sort]);

  const lazyItem =
    windowMode === WINDOW_MODE.SM
      ? 2
      : windowMode === WINDOW_MODE.MD
        ? 3
        : windowMode === WINDOW_MODE.XL
          ? 12
          : 8;

  return (
    <div className="bg-background-700 container w-full mx-auto  items-center min-h-[80vh] max-w-[1440px]">
      <div
        className={
          'xl:flex xl:sticky top-[104px] bg-background-asset-detail min-h-[52px] py-[20px] z-10 max-w-[1440px] overflow-auto no-scrollbar'
        }
      >
        <ExploreHeader key="ExploreHeader" activeValue={category} onChangeTab={handleChangeTab} />
      </div>
      <div className="flex">
        {[WINDOW_MODE['XL'], WINDOW_MODE['2XL']].includes(windowMode) ? (
          <div
            className={`${openDrawer ? 'xl:w-[285px]' : ''
              } xl:flex hidden sticky top-[180px] h-[100px]`}
          >
            <DrawerExplore
              filter={{
                sales,
                status,
                collections,
                setSales: onChangeSales,
                setStatus: onChangeStatus,
                setCollections: onChangeCollections,
              }}
              reset={_.isEmpty(router.query)}
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
            />
          </div>
        ) : (
          <ModalFilterMarket
            filter={{
              sort,
              sales,
              status,
              collections,
            }}
            rootParams={rootParams}
            onPushRouter={onPushRouter}
            open={openModalFilter}
            setOpen={setOpenModalFilter}
          />
        )}

        <div
          className={`bg-[aqua] w-[100%] ${openDrawer ? '2xl:w-[1176px]' : '2xl:w-[1385px]'
            } bg-[aqua] flex`}
        >
          <div className="w-[100%] min-h-[100vh] bg-background-dark-1000">
            <div className="px-5 py-7 flex w-full flex-col 2xl m-auto bg-background-dark-1000 md:w-[100%]">
              <div className="hidden xl:flex items-center justify-between">
                <div className="gap-7 hidden xl:flex">
                  {[WINDOW_MODE['XL'], WINDOW_MODE['2XL']].includes(windowMode) && (
                    <SelectBasic
                      selected={sort}
                      setSelected={onChangeSort}
                      nameTypes={NftSortOptions}
                      title="Sort By"
                    />
                  )}

                  {activeReset() && [WINDOW_MODE['XL'], WINDOW_MODE['2XL']].includes(windowMode) && (
                    <p
                      onClick={handleResetFilter}
                      className="font-bold text-primary-90 leading-[30px] cursor-pointer text-[14px]"
                    >
                      Reset
                    </p>
                  )}
                </div>

                <div className="hiden xl:flex">
                  <div className="cursor-pointer" onClick={() => {
                    if (!smallItem) {
                      setSmallItem(true)
                      setSkeletonConfig({
                        items: NUMSITEMINROWLARGE,
                        mode: 'normal',
                      })
                    }
                  }}>
                    <Tooltip title={'Large display'} arrow>
                      <div>
                        {smallItem ? (
                          <IconLocal
                            src="/icons/large-display-active.svg"
                            customSize="w-[43px] h-[37px]"
                          />
                        ) : (
                          <IconLocal
                            src="/icons/large-display.svg"
                            customSize="w-[43px] h-[37px]"
                          />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                  <div className="cursor-pointer" onClick={() => {
                    if (smallItem) {
                      setSmallItem(false)
                      setSkeletonConfig({
                        items: NUMSITEMINROWSMALL,
                        mode: 'small',
                      })
                    }
                  }}>
                    <Tooltip title={'Small display'} arrow>
                      <div>
                        {smallItem ? (
                          <IconLocal
                            src="/icons/small-display.svg"
                            customSize="w-[44px] h-[37px]"
                          />
                        ) : (
                          <IconLocal
                            src="/icons/small-display-active.svg"
                            customSize="w-[44px] h-[37px]"
                          />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="flex xl:hidden justify-between">
                <div onClick={() => setOpenModalFilter(true)} className="flex gap-2 items-center">
                  <FilterListIcon className="text-primary-60" />
                  <p className="text-sm font-bold text-primary-60">Filter</p>
                </div>
              </div>
              <InfiniteScroll
                dataLength={nftList?.length}
                next={onLoadMoreNft}
                hasMore={activeMore}
                loader={<LoadingListBase loading={true} items={skeletonConfig.items} mode={skeletonConfig.mode} />}
                className="!overflow-hidden"
              >
                <>
                  {lazyLoad ? (
                    <LoadingListBase loading={true} items={lazyItem} hasMore={loading} />
                  ) : (
                    <div
                      className={`grid ${smallItem
                        ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
                        : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6'
                        } m-auto mx-0 mt-10`}
                    >
                      {nftList?.length === 0 ? (
                        <Box className={`no-data ${smallItem ? 'col-span-4' : 'col-span-6'}`}>
                          <Image
                            src={require('../../assets/images/noData.png')}
                            alt="No Data"
                            width={175}
                            height={160}
                          />
                          <label className="!text-[24px] !text-[#B0B8C7]">No results</label>
                        </Box>
                      ) : (
                        nftList?.map((NFTItem: any) => {
                          const dateNow = Math.floor(Date.now() / 1000);
                          return (
                            <div key={NFTItem?.collection?.address + NFTItem.id}>
                              <CardCommon
                                type={TYPE_LIKES.NFT}
                                dataNFT={NFTItem}
                                dateNow={dateNow}
                                smallItem={!smallItem}
                                callbackFetchList={() => getListNFT()}
                              />
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </>
              </InfiniteScroll>
              {/* <div>
                {activeMore && (
                  <FilledButton
                    onClick={onLoadMoreNft}
                    loading={loading}
                    text={'View more'}
                    customClass="!text--label-large mt-7 w-full xl:w-auto"
                  />
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
