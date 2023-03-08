import { Box } from '@mui/material';
import BigNumber from 'bignumber.js';
import ImageBase from 'components/common/ImageBase';
import NoChartData from 'components/common/no-chart-data/no-chart-data';
import CircularProgressIndicator from 'components/common/progress-indicator';
import SelectBasic from 'components/common/select-type/SelectBasic';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import nftHistoryService from 'service/nftHistoryService';
import { formatNumber } from 'utils/formatNumber';
import { abbreviateNumber } from 'utils/func';
export interface ISelect {
  name: string;
  value: string;
}

export const options: Array<ISelect> = [
  { name: 'Last 7 days', value: 'LAST7DAYS' },
  { name: 'Last 14 days', value: 'LAST14DAYS' },
  { name: 'Last 30 days', value: 'LAST30DAYS' },
  { name: 'Last 60 days', value: 'LAST60DAYS' },
  { name: 'Last 90 days', value: 'LAST90DAYS' },
  { name: 'Last Year', value: 'LASTYEARS' },
  { name: 'All time', value: 'ALLTIME' },
];

const PriceHistory = ({ assetDataDetail }: any) => {
  const [dataPriceHistory, setDataPriceHistory] = useState<any>([]);
  const { text } = useSelector((state:any) => state.theme);

  const [selected, setSelected] = useState<ISelect>(options[0]);
  const [avgPrice, setAvgPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const { forceUpdateData } = useSelector((state: any) => ({
    forceUpdateData: state?.forceUpdating?.internalSale,
  }));

  const getPriceHistory = async (period: string) => {
    try {
      if (typeof assetDataDetail?.id !== 'number') return;
      setLoading(true);
      const [data] = await nftHistoryService.getChartPrice({
        period,
        nft_id: assetDataDetail?.id,
      });
      if (data) {
        const { chartData = [], totalAvgPrice = 0 } = data || {};
        setAvgPrice(totalAvgPrice);
        const dataShow = chartData?.map((item: any) => {
          const [dd, mm] = item?.date?.split('-');
          return {
            price: Number(item?.avgPrice) || 0,
            date: `${mm}/${dd}`,
          };
        });
        setDataPriceHistory(dataShow);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPriceHistory(selected?.value);
  }, [assetDataDetail?.id, selected?.value, forceUpdateData]);

  const onChange = (option: ISelect) => {
    setSelected(option);
  };

  const renderTooltip = (item: any) => {
    if (item && item.payload[0]) {
      return (
        <div
          style={{
            padding: '12px 16px',
            background: '#3E3F4D',
            color: '#ffffff',
            fontSize: '12px',
            lineHeight: '20px',
          }}
        >
          <div>Date: {item.payload[0]?.payload?.date}</div>
          <div>Avg.Price: {new BigNumber(item.payload[0]?.payload?.price).toFormat()} UMAD</div>
        </div>
      );
    }
    return <div />;
  };

  const formatter: any = (value: any) => abbreviateNumber(value);
  if (_.isEmpty(assetDataDetail)) {
    return (
      <Box className="no-data">
        <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
        <label>No results</label>
      </Box>
    );
  }
  return (
    <div className="h-[310px] lg:h-[430px]">
      <div className="flex gap-x-4 ml-[40px]">
        <SelectBasic
          selected={selected}
          setSelected={onChange}
          nameTypes={options}
          className="mb-7 "
        />
        <div className="font-Chakra font-bold text-sm	">
          <div>{selected?.name} Avg.Price</div>

          <div>Ξ{formatNumber(avgPrice, 2)} UMAD</div>
        </div>
      </div>
      {loading ? (
        <div className="flex ">
          <span>Loading </span> &nbsp;
          <CircularProgressIndicator size={20} />
        </div>
      ) : dataPriceHistory.length ? (
        <div className="-translate-x-6 over text-light-on-primary overflow-hidden price-history-chart">
          <ResponsiveContainer height={250}>
            <ComposedChart
              data={dataPriceHistory}
              margin={{ bottom: 20, top: 20, right: 5, left: 5 }}
            >
              <defs>
                <linearGradient id="strokeColor" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={text?.color || "#F4B1A3"} stopOpacity={0} />
                  <stop offset="10%" stopColor={text?.color || "#F4B1A3"} stopOpacity={1} />
                  <stop offset="90%" stopColor={text?.color || "#F4B1A3"} stopOpacity={1} />
                  <stop offset="100%" stopColor={text?.color || "#F4B1A3"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#949398" />
              <XAxis dataKey="date" tickMargin={18} stroke="#fff" />
              <YAxis
                dataKey="price"
                width={85}
                tickFormatter={formatter}
                stroke="#fff"
              />
              <Tooltip content={renderTooltip} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={text?.color || "#F4B1A3"}
                strokeWidth={3}
                fillOpacity={0}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <NoChartData />
      )}
    </div>
  );
};

export default PriceHistory;
