import { Box, Input } from '@mui/material';
import { FilledButton } from 'components/common';
import { ClosingIcon } from 'components/common/iconography/IconBundle';
import ImageBase from 'components/common/ImageBase';
import DropdownCheckBox from 'components/common/select-type/DropdownCheckBox';
import SelectBasic from 'components/common/select-type/SelectBasic';
import CardCommon from 'components/modules/cards/CardCommon';
import CollectionProfileCard from 'components/modules/cards/CollectionProfileCard';
import FilterIncludesSearch from 'components/modules/filter-includes-search';
import { LoadingListBase } from 'components/modules/Loading';
import FullWidthTabs from 'components/modules/tab';
import { IPriceRangeType } from 'components/templates/collection/asset';
import { ARTIST_SUBTAB, LIST_SALE_TYPE, TYPE_LIKES, WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import useUpdateEffect from 'hooks/useUpdateEffect';
import _, { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useSelector } from 'react-redux';
import artistService from 'service/artist';
import propertiesService from 'service/properties';
import { formatProperties } from 'utils/func';
import { STORAGE_KEYS } from 'utils/storage';
import FilterListIcon from '@mui/icons-material/FilterList';
import ModalFilterArtistAsset from 'components/modules/modal-filter-artist/asset';
import { ADDRESS_TYPE_NFT } from 'constants/nft.enum';
import { NftSortOptions } from 'constants/dropdown';
import DropdownSelectInput, {
  DEFAULT_CURRENCY_PRICE_RANGE,
} from 'components/common/select-type/DropdownSelectInput';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchIcon from '@mui/icons-material/Search';
import FlagshipCard from 'components/modules/cards/FlagshipCard';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 625 },
    items: 3,
  },
  bigMobile: {
    breakpoint: { max: 625, min: 375 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 375, min: 0 },
    items: 2,
  },
};

let paramsN: any;

let paramsC: any;

const initValuePriceRange = {
  min: '',
  max: '',
  currency: DEFAULT_CURRENCY_PRICE_RANGE,
};

let firstly = 0;
let currentab: any = 'CREATED';
let _walletLocal: string = '';

const initValueSelectedSort = {
  name: '',
  value: '',
};

export default function TabAsset() {
  const windowMode = useDetectWindowMode();
  const isMobileInSmMd = [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode);
  // SORT - FILTER
  const [properties, setProperties] = useState<Array<string>>([]);
  const [saleType, setSaleType] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<any>(initValuePriceRange);
  const [sort, setSort] = useState<{ name?: string; value?: string }>(initValueSelectedSort);
  // LIST AND OPTIONS
  const [propertiesOption, setPropertiesOption] = useState<Array<any>>([]);

  const [nftList, setNftList] = useState<Array<any>>([]);
  const [collectionList, setCollectionList] = useState<Array<any>>([]);
  // STATUS RESET
  const [activeReset, setActiveReset] = useState<boolean>(false);
  // LOADING
  const [loading, setLoading] = useState<boolean>(false);
  const [lazy, setLazy] = useState<boolean>(false);
  const [lazyLoad, setLazyLoad] = useState<boolean>(true);
  // CHANGE TAB
  const [tabSellected, setSubTabSelected] = useState<ARTIST_SUBTAB>(ARTIST_SUBTAB.CREATE);
  // LOADMORE NFT
  const [metaN, setMetaN] = useState<any>({});
  const [activeMoreN, setActiveMoreN] = useState<boolean>(true);
  const [metaC, setMetaC] = useState<any>({});
  const [activeMoreC, setActiveMoreC] = useState<boolean>(true);
  // COUNT TAB
  const [countTab, setCountTab] = useState<any>({});

  const [isShow, setIsShow] = useState<boolean>(true);
  // refresh meta data
  const [refreshed, setRefreshed] = useState<any>(null);
  //ORTHER
  const router = useRouter();
  const { id, subTabActive } = router.query;
  // WALLET ADDRESS
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  // INIT PAGE

  const [openModalFilter, setOpenModalFilter] = useState(false);
  const rootParams = useRef<any>({});
  const scroll = useRef<number>(0);
  const { input, icon, text = {}, button } = useSelector((state:any) => state.theme);

  const onPushRouter = (params: any) => {
    const paramsRouter = { ...rootParams.current };
    delete paramsRouter.id;
    const url = { pathname: `/artist/${id}`, query: params || paramsRouter };
    const options = { scroll: false };
    router.push(url, undefined, options);
  };

  const onChangeSort = (data: any) => {
    rootParams.current.sortField = data.value;
    onPushRouter(null);
  };

  const onChangeSaleType = (data: any) => {
    rootParams.current.saleType = data;
    onPushRouter(null);
  };

  const onChangePrideRange = (data: any) => {
    rootParams.current.startPrice = data.min;
    rootParams.current.endPrice = data.max;
    rootParams.current.priceType = data.currency;
    onPushRouter(null);
  };

  const onChangeProperties = (data: any, dataOriginal: any) => {
    const properties: any = [];
    for (const property in dataOriginal) {
      dataOriginal[property].child.forEach((child: any) => {
        if (child.checked) {
          properties.push(...child.value.ids);
        }
      });
    }
    rootParams.current.properties = properties;
    onPushRouter(null);
  };

  useEffect(() => {
    rootParams.current = { ...router.query };
    setIsShow(false);
    debounceLoadData({ ...rootParams.current });
  }, [router]);

  const debounceLoadData = useCallback(
    _.debounce(async (params) => {
      setIsShow(true);
      paramsC.page = 1;
      if (params.sortField) {
        const sort = NftSortOptions.find((x) => x.value === params.sortField);
        if (sort) {
          setSort(sort);
        } else setSort(initValueSelectedSort);
      } else {
        setSort(initValueSelectedSort);
      }

      if (params.saleType) {
        if (_.isArray(params.saleType)) {
          setSaleType([...params.saleType]);
        } else {
          params.saleType = [params.saleType];
          setSaleType([...params.saleType]);
        }
      } else setSaleType([]);

      if (params.startPrice || params.endPrice || params.priceType) {
        setPriceRange({
          min: params.startPrice,
          max: params.endPrice,
          currency: params.priceType,
        });
      } else setPriceRange(initValuePriceRange);

      if (params.properties) {
        if (_.isArray(params.properties)) {
          setProperties(params.properties);
        } else {
          setProperties([params.properties]);
        }
      } else setProperties([]);

      if (params.searchValue) {
        setSearchValue(params.searchValue);
      } else setSearchValue('');

      //reset limit
      paramsN.limit = rootParams.current.subTabActive == ARTIST_SUBTAB.OWNED ? 12 : 8;

      changeFilter();
    }, 150),
    [],
  );

  useEffect(() => {
    paramsN = { ...paramsN, page: 1, limit: 8, addressType: ADDRESS_TYPE_NFT.CREATOR, keyword: '' };
    paramsC = { ...paramsC, page: 1, limit: 5, type: ADDRESS_TYPE_NFT.CREATOR, keyword: '' };
    return () => {
      paramsN = { page: 1, limit: 8, addressType: ADDRESS_TYPE_NFT.CREATOR, keyword: '' };
      paramsC = { page: 1, limit: 5, type: ADDRESS_TYPE_NFT.CREATOR, keyword: '' };
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useUpdateEffect(() => {
    handleInitDataPage();
    onPushRouter(null);
  }, [walletAddress]);

  // INIT PAGE WITH ID
  useEffect(() => {
    if (id) {
      handleInitDataPage();
      if (subTabActive) {
        getP(parseInt(subTabActive as string));
      } else {
        getP(ARTIST_SUBTAB.CREATE);
      }
    }
  }, [id, subTabActive]);

  // CHANGE FILTER HANDLE CALL API
  const changeFilter = useCallback(() => {
    // sort
    setLazy(true);
    setLoading(true);
    if (rootParams.current.sortField) paramsN.sortField = rootParams.current.sortField;
    // filter price
    if (rootParams.current.priceType) {
      paramsN.priceType = rootParams.current.priceType;
    } else {
      delete paramsN.priceType;
    }

    if (rootParams.current.startPrice) {
      paramsN.startPrice = rootParams.current.startPrice;
    } else {
      delete paramsN.startPrice;
    }

    if (rootParams.current.endPrice) {
      paramsN.endPrice = rootParams.current.endPrice;
    } else {
      delete paramsN.endPrice;
    }
    // filter sale type
    if (rootParams.current.saleType) {
      paramsN.saleType = _.isArray(rootParams.current.saleType)
        ? rootParams.current.saleType
        : [rootParams.current.saleType];
    } else {
      delete paramsN.saleType;
    }

    // filter properties
    if (rootParams.current.properties) {
      paramsN.properties = _.isArray(rootParams.current.properties)
        ? rootParams.current.properties.join(',')
        : rootParams.current.properties;
    } else {
      delete paramsN.properties;
    }

    // filter sub tab
    if (rootParams.current.subTabActive) {
      setSubTabSelected(parseInt(rootParams.current.subTabActive));
    } else {
      setSubTabSelected(ARTIST_SUBTAB.CREATE);
    }
    // remove key empty1
    for (const key in paramsN) {
      if (Object.prototype.hasOwnProperty.call(paramsN, key)) {
        const element = paramsN[key];
        if (_.isString(element) && element === '') delete paramsN[key];
        if (_.isObject(element) && _.isEmpty(element)) delete paramsN[key];
        if (_.isArray(element) && element.length === 0) delete paramsN[key];
        if (_.isUndefined(element)) delete paramsN[key];
        if (_.isNaN(element)) paramsN[key] = 0;
      }
    }
    // Check view reset button
    let pr: any = {
      page: 1,
      limit: 8,
      addressType: currentab,
      address: id,
    };
    // reset number page
    paramsN.page = 1;
    if (_walletLocal) pr.walletAddress = _walletLocal;

    // if (tabSellected === ARTIST_SUBTAB.OWNED) {
    //   pr = {
    //    ...pr,
    //    limit: 12,
    //   };
    // }
    //  Refetch NFT
    fetchN({
      ...paramsN,
      addressType: rootParams.current.subTabActive
        ? getType(parseInt(rootParams.current.subTabActive))
        : ADDRESS_TYPE_NFT.CREATOR,
      title: rootParams.current.searchValue || '',
    });
    if (
      !rootParams.current.subTabActive ||
      parseInt(rootParams.current.subTabActive) === ARTIST_SUBTAB.CREATE ||
      parseInt(rootParams.current.subTabActive) === ARTIST_SUBTAB.FAVORITE
    ) {
      fetchC({
        ...paramsC,
        type: rootParams.current.subTabActive
          ? getType(parseInt(rootParams.current.subTabActive))
          : ADDRESS_TYPE_NFT.CREATOR,
        keyword: rootParams.current.searchValue || '',
      });
    }
  }, []);

  useEffect(() => {
    fetchCountDebounce(id, searchValue);
  }, [searchValue, id]);
  //
  // const fetchCollectionDebounce = useCallback(
  //   debounce((params: any) => {
  //     fetchC(params);
  //   }, 300),
  //   [],
  // );
  //
  const fetchCountDebounce = useCallback(
    debounce((id: any, searchValue: string) => {
      fetchCount(id, searchValue);
    }, 300),
    [],
  );

  // CHECK LOADMORE PAGE
  useEffect(() => {
    if (metaN?.itemCount < metaN?.itemsPerPage || nftList?.length === metaN?.totalItem) {
      setActiveMoreN(false);
    } else {
      setActiveMoreN(true);
    }
    if (metaC?.itemCount < metaC?.itemsPerPage || collectionList?.length === metaC?.totalItem) {
      setActiveMoreC(false);
    } else {
      setActiveMoreC(true);
    }
  }, [metaN, metaC]);

  async function handleInitDataPage() {
    paramsN.walletAddress = id; // artist address
    paramsC.address = id; // collection address
    paramsN.page = 1;
    paramsC.page = 1;
  }

  /**
   * Thay doi tab ?
   * @param e number tab
   */
  function handleChangeTab(e: number) {
    paramsC.page = 1;
    for (const key in rootParams.current) {
      if (
        key === 'saleType' ||
        key === 'startPrice' ||
        key === 'endPrice' ||
        key === 'priceType' ||
        key === 'sortField' ||
        key === 'properties'
      )
        delete rootParams.current[key];
    }
    rootParams.current.subTabActive = e;

    onPushRouter(null);
    // const type = getType(e);
    // paramsC = {
    //   page: 1,
    //   limit: 5,
    //   type,
    //   address: id,
    // };
    // paramsN = {
    //   page: 1,
    //   limit: 8,
    //   addressType: type,
    //   address: id,
    // };
    // if (_walletLocal) {
    //   paramsC.walletAddress = _walletLocal;
    //   paramsN.walletAddress = _walletLocal;
    // }
    // currentab = type?.toString();
    // if (currentab === 'OWNED') paramsN.limit = 12;
    // setSubTabSelected(e);
    // handleResetFilter(e);
    // fetchCount(id, searchValue);
    // if (ARTIST_SUBTAB.CREATE === e || ARTIST_SUBTAB.FAVORITE === e)
    //   fetchC({ ...paramsC, keyword: searchValue });
  }

  useEffect(() => {
    if (
      (properties.length > 0 && properties) ||
      priceRange.min !== '' ||
      priceRange.max !== '' ||
      !_.isEmpty(saleType) ||
      sort?.value
    ) {
      setActiveReset(true);
    } else {
      setActiveReset(false);
    }
  }, [properties, saleType, priceRange, sort]);

  /**
   * Reset lai filter treb tab ?
   * @param tab
   */
  function handleResetFilter(tab: number) {
    for (const key in rootParams.current) {
      if (
        key === 'saleType' ||
        key === 'startPrice' ||
        key === 'endPrice' ||
        key === 'priceType' ||
        key === 'sortField' ||
        key === 'properties'
      )
        delete rootParams.current[key];
    }
    paramsN = {
      page: 1,
      limit: 8,
      addressType: ADDRESS_TYPE_NFT.CREATOR,
    };
    handleInitDataPage();
    onPushRouter(null);

    setActiveReset(false);
    getP(tab);
    //reset url
  }
  /**
   * Load them item list collection
   * @param item check item cuoi cung de load more
   */
  function handleLoadMoreCollection(item: number) {
    if (item === collectionList.length - 4) {
      paramsC.page += 1;
      fetchC({ ...paramsC, keyword: searchValue }, true);
    }
  }
  /**
   * Load theem item list NFT
   */
  const handleLoadMoreNtf = () => {
    setLoading(true);
    if (paramsN.limit) {
      paramsN.limit =
        paramsN.limit + (rootParams.current.subTabActive == ARTIST_SUBTAB.OWNED ? 12 : 8);
    } else {
      paramsN.limit = rootParams.current.subTabActive == ARTIST_SUBTAB.OWNED ? 24 : 16;
    }
    changeFilter();
    scroll.current = scrollY;
  };

  /**
   * Lay lai properties tren tab ?
   * @param tab
   */
  async function getP(tab: number) {
    const type: string = getType(tab) as any;
    const params = {
      type,
      search: undefined,
      address: paramsC.address,
    };
    const [propertys, error] = (await propertiesService.getPropertiesArtris(params)) as any;
    let data = null;
    let ops = propertys?.sort(function (a: any, b: any) {
      const nameA = a.name?.toUpperCase();
      const nameB = b.name?.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    ops?.forEach((e: any, index: number) => {
      if (e?.values.length > 0) {
        const arr = e?.values || [];
        ops[index].values = arr.sort(function (a: any, b: any) {
          const nameA = a.name?.toUpperCase();
          const nameB = b.name?.toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      }
    });
    if (rootParams.current.properties) {
      if (_.isArray(rootParams.current.properties)) {
        data = formatProperties(ops, rootParams.current.properties);
      } else {
        data = formatProperties(ops, [rootParams.current.properties]);
      }
    } else {
      data = formatProperties(ops);
    }
    if (error) setPropertiesOption([]);
    setPropertiesOption(data ? [...data] : []);
  }
  /**
   * Get tab string
   * @param tab
   * @returns
   */
  function getType(tab: number) {
    switch (tab) {
      case ARTIST_SUBTAB.CREATE:
        return ADDRESS_TYPE_NFT.CREATOR;
      case ARTIST_SUBTAB.OWNED:
        return ADDRESS_TYPE_NFT.OWNER;
      case ARTIST_SUBTAB.FAVORITE:
        return ADDRESS_TYPE_NFT.FAVORITE;
    }
  }
  /**
   * Goi API lay NFT
   * @param params
   * @param nextData check load more
   * @param type check type = refresh
   * true => cong them data cua page truoc
   */
  async function fetchN(params: any, nextData = false, type?: any) {
    try {
      const limit = paramsN.limit;
      const [dataNft, meta, error] = (await fetchNftArtist({
        ...params,
        limit,
      })) as any;
      if (error && type === 'refresh') setRefreshed(false);
      if (dataNft && type === 'refresh') setRefreshed(true);
      if (!nextData) {
        setNftList(dataNft);
      } else {
        setNftList([...nftList, ...dataNft]);
      }
      setMetaN(meta);
      setLoading(false);
      setLazy(false);
    } catch (error) {
    } finally {
      setRefreshed(null);
      setLazyLoad(false);
    }
  }
  /**
   * Goi API lay colections
   * @param params
   * @param nextData check load more
   * true => cong them data cua page truoc
   */
  async function fetchC(params: any, nextData = false) {
    const [dataCollections, meta] = (await fetchCollections({
      ...params,
    })) as any;

    if (!nextData) {
      setCollectionList(dataCollections);
    } else {
      setCollectionList([...collectionList, ...dataCollections]);
    }
    setMetaC(meta);
  }
  /**
   * Lay so count tab
   * @param address dia chi artist
   * @returns
   */
  async function fetchCount(address: any, keyword?: string) {
    const [result, err] = (await artistService.getCount(address, keyword || '')) as any;
    if (err) return null;
    setCountTab(result);
  }

  const handleChange = (data: any) => {
    setSearchValue(data);
    rootParams.current.searchValue = data;
    handleRouterChange();
  };

  const clearSearchValue = () => {
    setSearchValue('');
    rootParams.current.searchValue = '';
    handleRouterChange();
  };

  const handleRouterChange = useCallback(
    _.debounce(() => onPushRouter(null), 350),
    [],
  );

  const HandleClickFilter = () => {
    setOpenModalFilter(true);
  };

  const handleResetMobileOptionProperty = () => {
    setPropertiesOption(
      propertiesOption.map((item: any) => {
        return {
          ...item,
          checked: false,
          child: item.child?.map((itemChild: any) => ({ ...itemChild, checked: false })),
        };
      }),
    );
  };

  return (
    <div className="py-6 flex flex-col md:px-0 sm:px-6">
      {openModalFilter && (
        <ModalFilterArtistAsset
          open={openModalFilter}
          setOpen={setOpenModalFilter}
          filter={{
            setSort,
            sort,
            setPriceRange,
            priceRange,
            setSaleType,
            saleType,
            setProperties,
            properties,
            options: [...propertiesOption],
            onPushRouter,
            rootParams,
            handleResetMobileOptionProperty,
          }}
        />
      )}
      <Input
        value={searchValue}
        onChange={(event: any) => {
          handleChange((event as any)?.target.value);
        }}
        className="!w-3/4 font-Chakra mb-6 self-center"
        placeholder="Search Collection or items..."
        sx={{
          backgroundColor: '#444B56',
          border: '1px solid #585858',
          letterSpacing: '0.25px',
          borderRadius: '4px',
          color: '#E3EBFB',
          '&::after, &::before': {
            display: 'none',
          },
          fontSize: '14px',
          '& .MuiInputLabel-root': {},
          'input::placeholder': {
            color: '#E3EBFB',
            opacity: 1,
            letterSpacing: '0.25px',
            ...input?.placeholder
          },
        }}
        style={{ ...input?.text, ...input?.background }}
        endAdornment={
          <>
            {!!searchValue && (
              <div onClick={clearSearchValue} className="mx-3 cursor-pointer">
                <ClosingIcon />
              </div>
            )}
          </>
        }
        startAdornment={
          <SearchIcon style={icon} className=" w-3 h-3 mx-[18px] text-primary-60" />
        }
      />
      <div className="flex justify-center">
        <FullWidthTabs
          tabs={[
            `Created (${countTab?.nftByCreated | 0})`,
            `Owned (${countTab?.nftByOwned | 0})`,
            `Favorite (${countTab?.nftByLike | 0})`,
          ]}
          onCallBack={handleChangeTab}
          activeTab={rootParams.current.subTabActive | ARTIST_SUBTAB.CREATE}
        />
      </div>
      {(tabSellected === ARTIST_SUBTAB.CREATE || tabSellected === ARTIST_SUBTAB.FAVORITE) && (
        <>
          <h1 className="font-extrabold text-[36px]">Collections</h1>
          {collectionList?.length > 0 && isShow ? (
            <div className="artist-carousel mx-[-10px]">
              <Box sx={{
                ".react-multiple-carousel__arrow, .react-multiple-carousel__arrow:hover":{
                  backgroundColor: `${button?.default?.background || "#f4b1a3 !important"}`  
                }
              }}>
                <Carousel
                  responsive={responsive}
                  sliderClass="carousel-wrape--view__low"
                  itemClass="carousel-item"
                  autoPlay={false}
                  autoPlaySpeed={1000 * 1000}
                  slidesToSlide={1}
                  beforeChange={(e) => activeMoreC && handleLoadMoreCollection(e)}
                >
                  {collectionList.concat(collectionList).concat(collectionList)?.map(
                    (
                      {
                        name,
                        thumbnailUrl,
                        likes,
                        bannerUrl,
                        address,
                        creator,
                        id,
                        liked,
                        volumeTraded,
                        title,
                      }: any,
                      i: number,
                    ) => {
                      const _props = {
                        banner: bannerUrl,
                        collectionTitle: title || name || 'Unknown',
                        type: TYPE_LIKES.COLLECTION,
                        likes,
                        image: thumbnailUrl,
                        address,
                        creator: creator,
                        liked,
                        id,
                        madVolume: volumeTraded,
                      };
                      return (
                        <div className="px-[10px]">
                          <CollectionProfileCard key={i + '_collection'} {..._props} />
                        </div>
                      );
                    },
                  )}
                </Carousel>
              </Box>
            </div>
          ) : (
            <Box className="no-data">
              <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
              <label>No results</label>
            </Box>
          )}
        </>
      )}
      {isMobileInSmMd ? (
        <div className="flex flex-row justify-between items-center">
          <h1 className="text--headline-small my-8 text-[34px]">Assets</h1>
          <div
            onClick={HandleClickFilter}
            style={{ color: text?.color }}
            className="flex justify-between items-center text-primary-60 text--title-small lg:hidden"
          >
            <FilterListIcon fontSize="small" style={icon} />
            <span className="ml-2" style={text}>Filter</span>
          </div>
        </div>
      ) : (
        <>
          <h1 className="font-extrabold text-[36px]">Assets</h1>
          <div className="mb-4 flex justify-between">
            <div className="flex">
              <FilterIncludesSearch
                title={'Properties'}
                options={[...propertiesOption]}
                reset={_.isEmpty(properties)}
                onSelected={(value: any, value2: any) =>
                  onChangeProperties({ ...value }, { ...value2 })
                }
              />
              <div>
                <DropdownCheckBox
                  title="Sale Type"
                  className="ml-5"
                  listSaleType={LIST_SALE_TYPE}
                  listChecked={saleType}
                  setListChecked={onChangeSaleType}
                />
              </div>
              <div className="ml-5">
                <DropdownSelectInput
                  titleDefault="Price Range"
                  priceRange={priceRange}
                  isReset={activeReset}
                  setPriceRange={(price: IPriceRangeType) => onChangePrideRange(price)}
                />
              </div>
              {activeReset && (
                <div className="ml-10">
                  <p
                    className="cursor-pointer font-bold text-sm text-primary-90 mt-1"
                    onClick={() => handleResetFilter(tabSellected)}
                    style={{ color: text?.color }}
                  >
                    Reset
                  </p>
                </div>
              )}
            </div>
            <SelectBasic
              selected={sort}
              setSelected={onChangeSort}
              nameTypes={NftSortOptions}
              title="Sort By"
            />
          </div>
        </>
      )}
      {lazyLoad ? (
        <LoadingListBase loading={true} items={8} />
      ) : (
        <>
          <InfiniteScroll
            dataLength={nftList?.length}
            next={handleLoadMoreNtf}
            hasMore={metaN.totalItem > 8 && nftList.length < metaN.totalItem}
            loader={<LoadingListBase loading={true} items={4} />}
            className="!overflow-hidden"
          >
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 m-auto mx-0 mb-2 lg:mt-10 sm:mt-0">
              {nftList?.length > 0 &&
                nftList.map((NFTItem: any, index: number) => {
                  const dateNow = Math.floor(Date.now() / 1000);
                  return (
                    <div>
                    {text?.color ? (
                      <FlagshipCard
                        key={NFTItem.id}
                        // loading={lazy}
                        dateNow={dateNow}
                        dataNFT={{ ...NFTItem }}
                        type={TYPE_LIKES.NFT}
                        callbackFetchList={() =>
                          fetchN({
                            ...paramsN,
                            addressType: rootParams.current.subTabActive
                              ? getType(parseInt(rootParams.current.subTabActive))
                              : ADDRESS_TYPE_NFT.CREATOR,
                            title: rootParams.current.searchValue || '',
                          })
                        }
                      />
                    ) : (
                      <CardCommon
                        key={NFTItem.id}
                        // loading={lazy}
                        dateNow={dateNow}
                        dataNFT={{ ...NFTItem }}
                        type={TYPE_LIKES.NFT}
                        callbackFetchList={() =>
                          fetchN({
                            ...paramsN,
                            addressType: rootParams.current.subTabActive
                              ? getType(parseInt(rootParams.current.subTabActive))
                              : ADDRESS_TYPE_NFT.CREATOR,
                            title: rootParams.current.searchValue || '',
                          })
                        }
                      />
                    )}
                    </div>
                  );
                })}
            </div>
          </InfiniteScroll>

          {!loading && nftList?.length === 0 && (
            <Box className="no-data">
              <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
              <label>No results</label>
            </Box>
          )}
        </>
      )}

      {/* {activeMoreN && (
        <FilledButton
          loading={loading}
          text="View More"
          customClass={`!text--label-large mt-7 lg:w-[120px] sm:w-full ${
            loading ? 'lg:!w-[150px]' : ''
          }`}
          onClick={handleLoadMoreNtf}
        />
      )} */}
    </div>
  );
}

export async function fetchCollections(params: any) {
  const [result, error] = (await artistService.getColections(params)) as any;
  const collections = await _.get(result, 'items');
  const meta = await _.get(result, 'meta');
  return [collections || [], meta || {}, error] || [];
}

export async function fetchNftArtist(params: any) {
  const [result, error] = (await artistService.getNtfs(params)) as any;
  const ntfs = await _.get(result, 'items');
  const meta = await _.get(result, 'meta');
  return [ntfs || [], meta || {}, error] || [];
}
