import { cloneDeep, get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import chartService from 'service/chartService';
import { POPUP_CHART_INSIGHTS } from './TabInsights';
import CardGraph from 'components/modules/graph-card/CardGraph';
import CardPieGraph from 'components/modules/graph-card/CardPieGraph';
import { RechartGraphBarCard } from 'components/modules/graph-elements/RechartGraph';
import CardBarGraph from 'components/modules/graph-card/CardBarGraph';
import ModalCommon from 'components/common/modal';
import ChartDetail from './ChartDetail';
import { useRouter } from 'next/router';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import CardBarGraphVertical from 'components/modules/graph-card/CardBarGraphVertical';
import { useSelector } from 'react-redux';

interface IRecordChart {
  name: string;
  value: string;
}

const InsightCharts = () => {
  const history = useRouter();
  const userAddress: string = get(history, 'query.id', '');
  const { text = {} } = useSelector((state) => (state as any).theme);

  const [chartSelected, setChartSelected] = useState<string>('');
  const [popupData, setPopupData] = useState<any>({});

  const [salesChart, setSalesChart] = useState({
    data: [],
    total: '0',
  });
  const [floorPrice, setFloorPrice] = useState({
    data: [],
    total: '0',
  });
  const [highestSale, setHighestSale] = useState({
    data: [],
    total: '0',
  });
  const [assetsSold, setAssetsSold] = useState({
    data: [],
    total: '0',
  });
  const [mostViewNfts, setMostViewNfts] = useState({
    data: [],
    total: '0',
  });
  const [assetsCreated, setAssetsCreated] = useState({
    data: [],
    total: '0',
  });
  const getSaleChart = async () => {
    const [data, err] = await chartService.getSalesChart(userAddress);
    if (!isEmpty(data)) {
      const chartData = get(data, 'chartData', []);
      const total = get(data, 'todayVolumneTraded', 0);
      const newData = chartData.map((item: any) => {
        return { ...item, value: Number(item.value) };
      });
      setSalesChart({
        total: total.toString(),
        data: newData,
      });
    }
  };

  const getFloorPriceChart = async () => {
    const [data, err] = await chartService.floorPriceChart(userAddress);
    if (!isEmpty(data)) {
      const chartData = get(data, 'chartData', []);
      const total = get(data, 'todayFloorPrice', 0);
      const newData = chartData.map((item: any) => {
        return { ...item, value: Number(item.value) };
      });
      setFloorPrice({
        data: newData,
        total,
      });
    }
  };

  const getHighestSaleChart = async () => {
    const [data, err] = await chartService.highestSaleChart(userAddress);
    if (!isEmpty(data)) {
      const chartData = get(data, 'chartData', []);
      const total = get(data, 'todayHightestPrice', 0);
      const newData = chartData.map((item: any) => {
        return { ...item, value: Number(item.value) };
      });
      setHighestSale({
        data: newData,
        total,
      });
    }
  };

  const getAssetSoldChart = async () => {
    const [data, err] = await chartService.assetSoldChart(userAddress);
    if (!isEmpty(data)) {
      const chartData = get(data, 'chartData', []);
      const total = get(data, 'totalAssetsSold', 0);
      const newData = chartData.map((item: any) => {
        return { ...item, value: Number(item.value), time: moment(item.name).format('DD MMM') };
      });
      setAssetsSold({
        data: newData,
        total,
      });
    }
  };

  const getAssetCreated = async () => {
    const [data, err] = await chartService.assetCreated(userAddress);
    if (!isEmpty(data)) {
      const chartData = get(data, 'chartData', []);
      const total = get(data, 'totalCreatedNft', 0);
      setAssetsCreated({
        data: chartData,
        total,
      });
    }
  };
  const getMostViewNfts = async () => {
    const [data, err] = await chartService.mostViewNftChart(userAddress);
    if (!isEmpty(data)) {
      setMostViewNfts({
        data,
        total: "",
      });
    } else {
      setMostViewNfts({
        data: [],
        total: "",
      });
    }
  };

  useEffect(() => {
    getSaleChart();
    getFloorPriceChart();
    getHighestSaleChart();
    getMostViewNfts();
    getAssetSoldChart();
    getAssetCreated();
  }, [userAddress]);

  const currentDate = moment().format('DD MMM, YYYY');
  const openChartPopup = (type: string, data: any) => {
    setChartSelected(type);
    setPopupData(data);
  }

  return (
    <section className="flex flex-wrap sm:justify-center gap-6 pt-5 pb-5 lg:px-0 sm:px-4">
      <div onClick={() => openChartPopup(POPUP_CHART_INSIGHTS.CHART_SALES, salesChart.data)}>
        <CardGraph
          key="1"
          selected={false}
          label="Sales"
          amount={`${get(salesChart, 'total', 0)}`}
          date={currentDate}
          graphData={salesChart.data}
          text={text}
        />
      </div>
      <div onClick={() => openChartPopup(POPUP_CHART_INSIGHTS.CHART_FLOOR_PRICE, floorPrice.data)}>
        <CardGraph
          key="2"
          selected={false}
          label="Floor Price"
          amount={`${get(floorPrice, 'total', 0)}`}
          date={currentDate}
          graphData={floorPrice.data}
          text={text}
        />
      </div>
      <div onClick={() => openChartPopup(POPUP_CHART_INSIGHTS.CHART_2EST_SALE, highestSale.data)}>
        <CardGraph
          key="3"
          selected={false}
          label="Highest Sale"
          amount={`${get(highestSale, 'total', 0)}`}
          date={currentDate}
          graphData={highestSale.data}
          text={text}
        />
      </div>
      <div onClick={() => openChartPopup(POPUP_CHART_INSIGHTS.CHART_OWNERS, mostViewNfts.data)}>
        <CardBarGraphVertical
          selected={false}
          date={currentDate}
          data={mostViewNfts.data}
          text={text}
        />
      </div>
      <div onClick={() => openChartPopup(POPUP_CHART_INSIGHTS.CHART_ASSETS_CREATED, assetsCreated.data)}>
        <CardPieGraph
          selected={false}
          label="Assets Created"
          amount={`${get(assetsCreated, 'total', 0)}`}
          date={currentDate}
          data={assetsCreated.data}
          text={text}
        />
      </div>
      <div onClick={() => openChartPopup(POPUP_CHART_INSIGHTS.CHART_ASSETS_SOLD, assetsSold.data)}>
        <CardBarGraph
          selected={false}
          label="Assets Sold"
          amount={`${get(assetsSold, 'total', 0)}`}
          date={currentDate}
          data={assetsSold.data}
          text={text}
        />
      </div>
      {!!chartSelected && (
        <ModalCommon
          open={!!chartSelected}
          handleClose={() => setChartSelected('')}
          title={''}
          wrapperClassName={`!w-10/12 max-w-[1082px]`}
          headerClassName="text--headline-xsmall !text-left !text-dark-on-surface"
          isCloseIcon={true}
        >
          <div className="w-full mt-8">
            <ChartDetail chartSelected={chartSelected} data={popupData} text={text} />
          </div>
        </ModalCommon>
      )}
    </section>
  );
};

export default InsightCharts;
