import SelectBasic from 'components/common/select-type/SelectBasic';
import GraphAreaBar from 'components/modules/graph/GraphAreaBar';
import RarityIndexGraph from 'components/modules/graph/RarityIndexGraph';
import { ISelect, options } from 'components/templates/assets/charts/price-history';
import { useCallback, useEffect, useRef, useState } from 'react';
import artistService from 'service/artist';

import { get } from 'lodash';
import { useRouter } from 'next/router';
import InsightCharts from './InsightCharts';

import FilterListIcon from '@mui/icons-material/FilterList';
import _ from 'lodash';
import 'react-multi-carousel/lib/styles.css';
import ModalFilterArtistInsight from 'components/modules/modal-filter-artist/insight';
import { useSelector } from 'react-redux';

interface ITabInsightsProps { }

const defaultCollection = {
  name: 'All Collections',
  value: 'all_collections',
};

const listItemsFilter = [
  {
    name: 'Items Sold',
    value: 'sold',
  },
  {
    name: 'Items Sold with Rarity',
    value: 'sold_rarity',
  },
];

export const POPUP_CHART_INSIGHTS = {
  CHART_SALES: 'CHART_SALES',
  CHART_FLOOR_PRICE: 'CHART_FLOOR_PRICE',
  CHART_2EST_SALE: 'CHART_2EST_SALE',
  CHART_OWNERS: 'CHART_OWNERS',
  CHART_ASSETS_CREATED: 'CHART_ASSETS_CREATED',
  CHART_ASSETS_SOLD: 'CHART_ASSETS_SOLD',
};

export default function TabInsights({ }: ITabInsightsProps) {
  const [collectionSelected, setCollectionSelected] = useState<ISelect>(defaultCollection);
  const [listCollections, setListCollections] = useState<ISelect[]>([]);

  const [itemFilterSelected, setItemFilterSelected] = useState<ISelect>(listItemsFilter[0]);
  const [timeSelected, setTimeSelected] = useState<ISelect>(options[0]);
  const { text, icon } = useSelector((state:any) => state.theme);
  const [openModalFilter, setOpenModalFilter] = useState(false);

  const resetFilter = () => {
    for (const key in rootParams.current) {
      if (key === 'collectionName' || key === 'collectionId' || key === 'itemsSoldName' || key === 'itemsSoldValue' || key === 'period')
        delete rootParams.current[key];
    }
    onPushRouter(null);
  };
  const isSelectAllCollections = collectionSelected.value === 'all_collections';
  const isRarityChart = !isSelectAllCollections && itemFilterSelected.value === 'sold_rarity';
  const history = useRouter();
  const userAddress: string = get(history, 'query.id', '');

  const router = useRouter();
  const { id } = router.query;
  const rootParams = useRef<any>({})

  const onPushRouter = (params: any) => {
    const paramsRouter = { ...rootParams.current }
    delete paramsRouter.id
    const url = { pathname: `/artist/${id}`, query: params || paramsRouter };
    const options = { scroll: false };
    router.push(url, undefined, options);
  };

  const onChangeChecked = (data: any) => {
    rootParams.current.itemsSoldName = data.name;
    rootParams.current.itemsSoldValue = data.value;
    onPushRouter(null);
  };

  const onChangeCollectionSelected = (data: any) => {
    rootParams.current.collectionId = data.value;
    rootParams.current.collectionName = data.name;
    onPushRouter(null);
  };

  const onChangeSort = (data: any) => {
    rootParams.current.period = data.value;
    onPushRouter(null);
  };

  useEffect(() => {
    rootParams.current = { ...router.query };
    debounceLoadData({ ...rootParams.current });
  }, [router]);

  const debounceLoadData = useCallback(
    _.debounce(async (params) => {
      if (params.period) {
        const result = options.find((item) => item.value === params.period)
        if (result) {
          setTimeSelected(result)
        } else {
          setTimeSelected(options[0])
        }
      } else setTimeSelected(options[0]);
      if (params.collectionName && params.collectionId) {
        setCollectionSelected({
          name: rootParams.current.collectionName,
          value: rootParams.current.collectionId
        })
      } else {
        setCollectionSelected(defaultCollection)
      }

      if (params.itemsSoldName && params.itemsSoldValue) {
        setItemFilterSelected({
          name: rootParams.current.itemsSoldName,
          value: rootParams.current.itemsSoldValue
        })
      } else setItemFilterSelected(listItemsFilter[0]);
    }, 150),
    [],
  );

  useEffect(() => {
    if(id && _.isString(id)) {
      getCollection(id);
    }
  }, [id])

  useEffect(() => {
    if (collectionSelected.value === 'all_collections') {
      setItemFilterSelected(listItemsFilter[0]);
    }
  }, [collectionSelected]);

  const getCollection = async (address: string) => {
    const [result, error] = (await artistService.getColections({
      address: address,
      type: 'CREATOR',
      limit: 100,
    })) as any;
    if (result && result.items) {
      const newListCollections = result.items.map((item: any) => ({
        name: item.title || item.name,
        value: item.id,
      }));
      const stateCollectionList: any = [...[defaultCollection], ...newListCollections];
      setListCollections(stateCollectionList);
    }
  };

  const HandleClickFilter = () => {
    setOpenModalFilter(true)
  }

  return (
    <div className="pb-[64px]">
      <ModalFilterArtistInsight open={openModalFilter} setOpen={setOpenModalFilter} filter={{collectionSelected,setCollectionSelected, listCollections, itemFilterSelected, setItemFilterSelected, timeSelected, setTimeSelected, listItemsFilter, defaultCollection }} />
      <div className="flex flex-row justify-between items-center px-4">
        <h1 className="text--headline-small my-8 text-[36px]"></h1>
        <div onClick={HandleClickFilter} className="flex justify-between items-center text-primary-60 text--title-small lg:hidden">
          <FilterListIcon className='text-primary-60' fontSize='small' style={icon} />
          <span className='ml-2' style={text}>Filter</span>
        </div>
      </div>
      <section className="flex justify-between pt-[34px] lg:pb-[100px] sm:pb-[34px] lg:px-0 sm:px-4 hidden lg:flex">
        <div className="gap-4 items-center flex">
          <SelectBasic
            key="collection"
            className="max-w-[200px]"
            selected={collectionSelected}
            setSelected={onChangeCollectionSelected}
            nameTypes={listCollections}
            title=""
          />
          <SelectBasic
            key="filter"
            selected={itemFilterSelected}
            setSelected={onChangeChecked}
            nameTypes={listItemsFilter}
            isDisabled={isSelectAllCollections}
            title=""
          />
          {(!isSelectAllCollections || timeSelected.value !== options[0].value) && (
            <span
              className="text-primary-dark font-bold cursor-pointer hover:opacity-80 ml-2 text-sm" style={text}
              onClick={resetFilter}
            >
              Reset
            </span>
          )}
        </div>
        <SelectBasic
          key="time"
          selected={timeSelected}
          setSelected={onChangeSort}
          nameTypes={options}
          title=""
        />
      </section>
      <section className="lg:px-0 sm:px-4 mt-5 lg:mt-0">
        {isRarityChart ? (
          <RarityIndexGraph
            userAddress={userAddress}
            collection={collectionSelected}
            period={timeSelected}
          />
        ) : (
          <GraphAreaBar
            userAddress={userAddress}
            period={timeSelected}
            collection={collectionSelected}
          />
        )}
      </section>
      <InsightCharts />
    </div>
  );
}
