import { useState, useEffect, useRef, useCallback } from 'react';
import get from 'lodash/get';
import moment from 'moment';
import DropdownCheckBox from 'components/common/select-type/DropdownCheckBox';
import SelectBasic from 'components/common/select-type/SelectBasic';
import GraphAreaBar from 'components/modules/graph/GraphAreaBar';
import collectionService from 'service/collectionService';
import { ISelect } from 'components/templates/assets/charts/price-history';

import InsightFeed from './Feed';
import { useRouter } from "next/router";
import _ from "lodash";
import { Button } from '@mui/material';

interface ITabInsightsProps {
  address: string;
  shortUrl: string;
}

interface ICollectionChart {
  address: string;
  period: string;
  itemsSold: string;
}

interface ICollectionChartResponse {
  assetsSold: number;
  floorPrice: number;
  avgPrice: string;
  date: string;
  totalSales: string;
}

interface DataChart {
  name: string;
  uv: number;
  pv: number;
  amt: number;
  cnt: number;
}

const dataItem = [
  { label: 'Floor Price', value: 'floor_price' },
  { label: 'Assets Sold', value: 'assets_sold' },
];

export const options: Array<ISelect> = [
  { name: 'Last 7 days', value: 'LAST7DAYS' },
  { name: 'Last 14 days', value: 'LAST14DAYS' },
  { name: 'Last 30 days', value: 'LAST30DAYS' },
  { name: 'Last 60 days', value: 'LAST60DAYS' },
  { name: 'Last 90 days', value: 'LAST90DAYS' },
  { name: 'Last year', value: 'LASTYEARS' },
  { name: 'All time', value: 'ALLTIME' },
];

interface ICollectionFeed {
  address: string;
  limit: number | null;
  page: number | null;
  type: string | null;
}

interface Feed {
  price_umad: string;
  activityType: string;
  blockTimestamp: number;
  currencyToken: string;
  fromUser: object;
  toUser: object;
  transactionHash: string;
  quantity: number;
  price: number;
  fromAddress: string;
  toAddress: string;
  nft: any;
}

const limitSize: number = 10;

const defaultFilterCollection = ['floor_price', 'assets_sold'];

const Insight = ({ address, shortUrl }: ITabInsightsProps) => {
  const [selectedSort, setSelectedSort] = useState<ISelect>(options[0]);
  const [listChecked, setListChecked] = useState<string[]>([]);
  const [isIniting, setIsIniting] = useState<boolean>(true);
  const [dataChart, setDataChart] = useState<DataChart[]>([]);
  const router = useRouter();

  const rootParams = useRef<any>({})

  const onPushRouter = (params: any) => {
    const paramsRouter = { ...rootParams.current }
    delete paramsRouter.cid
    const url = { pathname: `/collection/${shortUrl ? shortUrl : address}`, query: params || paramsRouter };
    const options = { scroll: false };
    router.push(url, undefined, options);
  };

  const onChangeChecked = (data: any) => {
    rootParams.current.itemsSold = data;
    onPushRouter(null);
  };

  const handleReset = () => {
    rootParams.current.itemsSold = defaultFilterCollection;
    rootParams.current.period = options[0].value;
    onPushRouter(null);
  }

  const onChangeSort = (data: any) => {
    rootParams.current.period = data.value;
    onPushRouter(null);
  };

  useEffect(() => {
    rootParams.current = { ...rootParams.current, ...router.query };
    if (address) {
      debounceLoadData({ ...rootParams.current });
    }
  }, [router, address]);

  const debounceLoadData = useCallback(
    _.debounce(async (params) => {
      if (!rootParams.current.itemsSold && !rootParams.current.period) {
        const params = {
          ...rootParams.current,
          itemsSold: defaultFilterCollection,
          period: options[0].value
        }
        delete params.cid
        onPushRouter(params)
      } else {
        setIsIniting(false)
      }

      if (params.period) {
        const result = options.find((item) => item.value === params.period)
        if (result) {
          setSelectedSort(result)
        } else {
          setSelectedSort(options[0])
        }
      } else setSelectedSort(options[0]);

      if (params.itemsSold) {
        if (_.isArray(params.itemsSold)) {
          setListChecked([...params.itemsSold]);
        } else {
          params.itemsSold = [params.itemsSold];
          setListChecked([...params.itemsSold]);
        }
      } else {
        setListChecked([])
      }

      const isHaveChecked = _.get(rootParams, "current.itemsSold", []);
      if (isHaveChecked.length) {
        await getChartCollection();
      } else {
        setDataChart([]);
      }

    }, 150),
    [],
  );

  const getChartCollection = async () => {
    const params = {
      address: address,
      itemsSold: _.isArray(rootParams.current.itemsSold) ? rootParams.current.itemsSold.join(',') : rootParams.current.itemsSold,
      period: rootParams.current.period
    }
    const [response, error] = await collectionService.getChartCollection(params);
    if (error) {
      return;
    }
    const data = get(response, 'data', []);
    const dataChart = data.map((item: any) => ({
      name: moment(item.date).format('DD MMM'),
      uv: Number(item.assetsSold),
      amt: Number(item.floorPrice),
      cnt: Number(item.avgPrice),
      totalSales: item.totalSales,
      date: moment(item.date).format('DD MMM YYYY'),
    }));
    setDataChart(dataChart);
  };

  const isAssetSold = listChecked?.length === 1 && listChecked[0] === dataItem[1].value;
  const isFloorPrice = listChecked?.length === 1 && listChecked[0] === dataItem[0].value;

  const isShowButtonReset = !isIniting && (listChecked.length !== 2 || selectedSort.value !== options[0].value);
  return (
    <div className=" bg-background-dark-800 pb-[64px] mt-10">
      <div className="px-[16px] xl:px-[unset]">
        <div className="flex mb-10">
          <DropdownCheckBox
            title="Items Sold"
            listSaleType={dataItem}
            listChecked={listChecked}
            setListChecked={onChangeChecked}
          />
          {isShowButtonReset && (
            <Button
              className="text-primary-dark py-0 ml-[14px] font-bold h-auto text-button-square text-transform-inherit font-Chakra"
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
          <SelectBasic
            selected={selectedSort}
            setSelected={onChangeSort}
            className="ml-auto"
            nameTypes={options}
            title="Sort By"
          />
        </div>

        <GraphAreaBar
          period={selectedSort}
          dataChart={dataChart}
          isCollection
          isAssetSold={isAssetSold}
          isFloorPrice={isFloorPrice}
        />
        <InsightFeed collectionAddress={address} />
      </div>
    </div>
  );
};

export default Insight;
