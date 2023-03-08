import FilterListIcon from '@mui/icons-material/FilterList';
import { Box, Button } from '@mui/material';
import ImageBase from 'components/common/ImageBase';
import DropdownCheckBox from 'components/common/select-type/DropdownCheckBox';
import DropdownSelectInput, {
  DEFAULT_CURRENCY_PRICE_RANGE
} from 'components/common/select-type/DropdownSelectInput';
import SelectBasic from 'components/common/select-type/SelectBasic';
import CardCommon from 'components/modules/cards/CardCommon';
import FlagshipCard from 'components/modules/cards/FlagshipCard';
import { LoadingListBase } from 'components/modules/Loading';
import ModalFilterCollection from 'components/modules/modal-filter-collection';
import { LIMIT_NFT_LIST, LIST_SALE_TYPE, TYPE_LIKES, WINDOW_MODE } from 'constants/app';
import { NftSortOptions } from 'constants/dropdown';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import collectionService from 'service/collectionService';
import { toastError } from 'store/actions/toast';
import { formatProperties } from 'utils/func';
import FilterIncludesSearch from '../../../modules/filter-includes-search';

interface AssetProps {
  isOwner: boolean;
  typeCollection: string;
  addressCollection: string;
  shortUrl?: string;
  nameCollection?: string | null;
  thumbnailCollection?: string | null;
}

interface IParamsType {
  address?: string;
  page?: number;
  keyword?: string;
  sortField?: string;
  sortDirection?: string;
  nftId?: string;
  startPrice?: any;
  endPrice?: any;
  priceType?: string;
  properties?: any;
  saleType: any;
}

export interface IPriceRangeType {
  min: number | string;
  max: number | string;
  currency: string;
}

export interface ISelectedSortType {
  name: string;
  value: string;
}

const initValuePriceRange = {
  min: '',
  max: '',
  currency: DEFAULT_CURRENCY_PRICE_RANGE,
};

const initValueSelectedSort = {
  name: '',
  value: '',
};

const Asset: FC<AssetProps> = ({
  isOwner,
  addressCollection,
  shortUrl,
  nameCollection,
  thumbnailCollection,
}) => {
  const windowMode = useDetectWindowMode();
  const isMobileInSmMd = [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode);
  const router = useRouter();
  const dispatch = useDispatch();
  const [propertiesOption, setPropertiesOption] = useState<Array<any>>([]);
  const [saleType, setSaleType] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<IPriceRangeType>(initValuePriceRange);
  const [selectedSort, setSelectedSort] = useState<ISelectedSortType>(initValueSelectedSort);
  const [totalNft, setTotalNft] = useState<number>(0);
  const [listNFTOfCollection, setListNFTOfCollection] = useState([]);
  const [isShowButtonReset, setShowButtonReset] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [filterProperties, setFilterProperties] = useState<Array<string>>([]);
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [paramsRequest, setParamRequest] = useState({});
  const rootParams = useRef<any>({});
  const scroll = useRef<number>(0);
  const paramLoad = useRef<any>({});

  const { text, icon } = useSelector((state:any) => state.theme);

  const onPushRouter = (params: any) => {
    const paramsRouter = { ...rootParams.current };
    delete paramsRouter.cid;
    const url = {
      pathname: `/collection/${shortUrl ? shortUrl : addressCollection}`,
      query: params || paramsRouter,
    };
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
    if (addressCollection) {
      debounceLoadData({ ...rootParams.current }, addressCollection);
    }
  }, [router, addressCollection, nameCollection, thumbnailCollection]);

  const debounceLoadData = useCallback(
    _.debounce(async (params, address: string) => {
      if (params.sortField) {
        const sort = NftSortOptions.find((x) => x.value === params.sortField);
        if (sort) {
          setSelectedSort(sort);
        } else setSelectedSort(initValueSelectedSort);
      } else setSelectedSort(initValueSelectedSort);

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
          setFilterProperties(params.properties);
        } else {
          setFilterProperties([params.properties]);
        }
      } else setFilterProperties([]);
      if (address) {
        const paramsRequest: any = {
          startPrice: params.startPrice || null,
          endPrice: params.endPrice || null,
          priceType: params.priceType || null,
          sortField: params.sortField || null,
          properties: rootParams.current.properties
            ? _.isArray(rootParams.current.properties)
              ? rootParams.current.properties.join(',')
              : rootParams.current.properties
            : null,
          limit: LIMIT_NFT_LIST,
          walletAddress,
          page: 1,
        };

        if (rootParams.current.saleType) {
          paramsRequest.saleType = _.isArray(rootParams.current.saleType)
            ? JSON.stringify(rootParams.current.saleType)
            : `["${rootParams.current.saleType}"]`;
        }
        paramLoad.current = paramsRequest;
        scroll.current = 0;
        setParamRequest(paramsRequest);
        await getListNFTOfCollection(address, paramsRequest);
      }
    }, 150),
    [],
  );

  const getPropertiesCollection = async () => {
    const result = (await collectionService.getPropertiesCollection(addressCollection)) as any;
    const data = _.get(result, 'data', []);
    let ops = data.sort(function (a: any, b: any) {
      const nameA = a.name?.toUpperCase();
      const nameB = b.name?.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
    ops.forEach((e: any, index: number) => {
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
    let properties = null;
    if (rootParams.current.properties) {
      if (_.isArray(rootParams.current.properties)) {
        properties = formatProperties(ops, rootParams.current.properties);
      } else {
        properties = formatProperties(ops, [rootParams.current.properties]);
      }
    } else {
      properties = formatProperties(ops);
    }

    setPropertiesOption([...properties]);
  };

  useEffect(() => {
    if (addressCollection) {
      getPropertiesCollection();
    }
  }, [addressCollection]);

  useEffect(() => {
    if (
      !_.isEmpty(filterProperties) ||
      rootParams.current.startPrice ||
      rootParams.current.endPrice ||
      !_.isEmpty(saleType) ||
      selectedSort?.value
    ) {
      setShowButtonReset(true);
    } else {
      setShowButtonReset(false);
    }
  }, [filterProperties, saleType, priceRange, selectedSort]);

  const getListNFTOfCollection = async (address: string, params: any, type?: any) => {
    try {
      setLoading(true);
      const [response, error] = await collectionService.getListNFTOfCollection(address, params);
      if (response) {
        const dataNft = _.get(response, 'data.items', []);
        const totalItem = _.get(response, 'data.meta.totalItem', 0);
        setTotalNft(totalItem);
        setListNFTOfCollection(dataNft);
      }
      if (error) {
        dispatch(toastError('Something went wrong'));
      }
    } catch (error) {
      dispatch(toastError('Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  // const callbackGetListNFTOfCollection = () => {
  //   const { min, max, currency } = priceRange;
  //   const { value } = selectedSort;
  //   const params = {
  //     limit,
  //     page: 1,
  //     startPrice: min || '',
  //     endPrice: max || '',
  //     priceType: currency,
  //     saleType: JSON.stringify(saleType),
  //     sortField: value,
  //     properties: { ...filterProperties },
  //     walletAddress,
  //   };
  //   return getListNFTOfCollection(addressCollection, params, 'refresh');
  // };
  
  const handleViewMore = useCallback(
    _.debounce(() => {
      const { scrollY } = window;
      if (scroll.current < scrollY) {
        (paramLoad.current.limit = paramLoad.current.limit + LIMIT_NFT_LIST),
          getListNFTOfCollection(addressCollection, paramLoad.current);
        scroll.current = scrollY;
      }
    }, 10 * 100),
    [],
  );

  const handleReset = () => {
    getPropertiesCollection();

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
    onPushRouter(null);
  };

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
    <div className="bg-background-asset-detail pb-10">
      <ModalFilterCollection
        open={openModalFilter}
        setOpen={setOpenModalFilter}
        filter={{
          setSort: setSelectedSort,
          sort: selectedSort,
          setPriceRange,
          priceRange,
          setSaleType,
          saleType,
          setProperties: setFilterProperties,
          properties: filterProperties,
          options: [...propertiesOption],
          onPushRouter,
          rootParams,
          handleResetMobileOptionProperty,
        }}
      />
      <div className="layout mx-auto xl:pt-10 px-[16px] xl:px-[unset]">
        {isMobileInSmMd ? (
          <div className="flex flex-row justify-between items-center">
            <h1 className="text--headline-small my-8 text-[36px]">Assets</h1>
            <div
              onClick={HandleClickFilter}
              className="flex justify-between items-center text-primary-60 text--title-small"
            >
              <FilterListIcon className="text-primary-60" style={icon} fontSize="small" />
              <span className="ml-2" style={text}>Filter</span>
            </div>
          </div>
        ) : (
          <h1 className="font-extrabold font-Chakra text-[36px] ">Assets</h1>
        )}

        <div className="mb-4 flex justify-between hidden lg:flex">
          <div className="flex gap-3">
            <FilterIncludesSearch
              title="Properties"
              options={[...propertiesOption]}
              onSelected={(value: any, value2) => onChangeProperties({ ...value }, { ...value2 })}
            />
            <DropdownCheckBox
              title="Sale Type"
              listSaleType={LIST_SALE_TYPE}
              listChecked={saleType}
              setListChecked={onChangeSaleType}
            />
            <DropdownSelectInput
              titleDefault="Price Range"
              priceRange={priceRange}
              setPriceRange={(price: IPriceRangeType) => onChangePrideRange(price)}
              isReset={isShowButtonReset}
            />
            {isShowButtonReset && (
              <Button
                className="text-primary-90 py-0 ml-14 h-auto text-button-square text-transform-inherit font-Chakra"
                style={{color: text?.color}}
                onClick={handleReset}
              >
                Reset
              </Button>
            )}
          </div>
          <div>
            <SelectBasic
              selected={selectedSort}
              setSelected={(data: any) => onChangeSort(data)}
              nameTypes={NftSortOptions}
              title="Sort By"
            />
          </div>
        </div>
        <div>
          <InfiniteScroll
            dataLength={listNFTOfCollection.length}
            next={handleViewMore}
            hasMore={totalNft > 12 && listNFTOfCollection.length < totalNft}
            loader={<LoadingListBase loading={true} items={4} />}
            className="!overflow-hidden"
          >
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
              {listNFTOfCollection.length > 0 &&
                listNFTOfCollection.map((NFTItem: any, index: number) => {
                  const dateNow = Math.floor(Date.now() / 1000);
                  return (
                    <div className="h-[420px]">
                    {text ? (
                      <FlagshipCard
                        // loading={isLoading}
                        key={`${index}_collection`}
                        type={TYPE_LIKES.NFT}
                        dataNFT={NFTItem}
                        dateNow={dateNow}
                        callbackFetchList={() =>
                          getListNFTOfCollection(addressCollection, paramsRequest)
                        }
                      />
                    ) : (
                      <CardCommon
                        // loading={isLoading}
                        key={`${index}_collection`}
                        type={TYPE_LIKES.NFT}
                        dataNFT={NFTItem}
                        dateNow={dateNow}
                        callbackFetchList={() =>
                          getListNFTOfCollection(addressCollection, paramsRequest)
                        }
                      />
                    )}
                    </div>
                  );
                })}
            </div>
          </InfiniteScroll>
        </div>
        <div>
          {listNFTOfCollection.length === 0 && (
            <Box className="no-data">
              <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
              <label>No results</label>
            </Box>
          )}
        </div>
        {/* {totalNft > 12 && listNFTOfCollection.length < totalNft && (
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
export default Asset;
