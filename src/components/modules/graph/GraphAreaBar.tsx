import { SaleLegendSvg } from 'components/common/iconography/iconsComponentSVG';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import chartService from 'service/chartService';
import { abbreviateNumber } from 'utils/func';
import { MainCustomTooltip } from '../graph-elements/CustomTooltip';

// Explain
// amt: total sales: volumnTraded
// uv: asset sold: numberOfNft
// cnt: avgPrice: avgPrice

interface DataChart {
  name: string;
  uv: number;
  pv: number;
  amt: number;
  cnt: number;
}
interface IParamsInsightArtist {
  artistAddress: string;
  period: string;
  collectionId?: string;
  isWithRarity: boolean;
}

interface GraphAreaBarProp {
  userAddress?: string;
  period: any;
  isCollection?: boolean;
  isAssetSold?: boolean;
  isFloorPrice?: boolean;
  collection?: any;
  dataChart?: any;
}

export default function GraphAreaBar({
  userAddress,
  collection,
  period,
  isCollection,
  isAssetSold,
  isFloorPrice,
  dataChart,
}: GraphAreaBarProp) {
  const [chartData, setChartData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { text = {} } = useSelector((state) => (state as any).theme);

  useEffect(() => {
    if (isCollection) {
      setChartData(dataChart);
    }
  }, [dataChart, isCollection]);

  useEffect(() => {
    if (!isCollection && period && collection && userAddress) {
      const param = {
        artistAddress: userAddress,
        period: period?.value,
        collectionId: collection?.value === 'all_collections' ? '' : collection.value,
        isWithRarity: false,
      };
      getArtistInsight(param);
    }
  }, [userAddress, collection, period]);

  const getArtistInsight = async (param: IParamsInsightArtist) => {
    setIsLoading(true);
    const [data, err] = await chartService.artistInsight(param);
    setIsLoading(false);
    if (!isEmpty(data)) {
      if (data && data.length > 0) {
        const convertChartData = data.map((item: any) => {
          return {
            amt: Number(item.volumnTraded),
            cnt: Number(item.avgPrice),
            name: moment(item.start).format('DD MMM'),
            date: moment(item.start).format('DD MMM YYYY'),
            uv: Number(item.numberOfNft),
          };
        });
        setChartData(convertChartData);
      }
    } else {
      setChartData([]);
    }
  };
  const formatter: any = (value: any) => abbreviateNumber(value);

  return (
    <div>
      {chartData && chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={290}>
            <ComposedChart
              id="test"
              className="!w-[100%]"
              data={chartData}
              margin={{
                top: 15,
                right: 0,
                bottom: 20,
                left: 0,
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={text?.color || "#7340D3"} stopOpacity={0.34} />
                  <stop offset="100%" stopColor={text?.color || "#581EFC"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={text?.color || "#9874DD"} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={text?.color || "#9874DD"} stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id="colorCartesian" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#2D2D39" stopOpacity={1} />
                  <stop offset="15%" stopColor="#2D2D39" stopOpacity={0} />
                  <stop offset="85%" stopColor="#2D2D39" stopOpacity={0} />
                  <stop offset="100%" stopColor="#2D2D39" stopOpacity={1} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id="strokeColor3" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={text?.color || "#F4B1A3"} stopOpacity={0} />
                  <stop offset="12%" stopColor={text?.color || "#F4B1A3"} stopOpacity={1} />
                  <stop offset="88%" stopColor={text?.color || "#F4B1A3"} stopOpacity={1} />
                  <stop offset="100%" stopColor={text?.color || "#F4B1A3"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#525252" fill="url(#colorCartesian)" />
              <XAxis
                dataKey="name"
                tickSize={0}
                tickMargin={20}
                axisLine={false}
                allowDuplicatedCategory={false}
                tickCount={7}
                scale="point"
                padding={{ left: 37, right: 37 }}
                tick={{ stroke: '#FFFFFF', fontSize: 14, strokeWidth: 0.5, opacity: 0.5 }}
              />
              <YAxis
                dataKey={isAssetSold ? 'uv' : 'amt'}
                yAxisId="left"
                orientation="left"
                tickFormatter={formatter}
                tickSize={0}
                tickMargin={10}
                axisLine={false}
                tick={{ stroke: '#FFFFFF', fontSize: 14, strokeWidth: 0.5, opacity: 0.5 }}
              />
              <YAxis
                dataKey="uv"
                hide
                orientation="right"
                tickSize={0}
                tickMargin={10}
                axisLine={false}
                tick={{ stroke: '#FFFFFF', strokeWidth: 0.5, opacity: 0.5 }}
                tickFormatter={formatter}
              />
              {!isFloorPrice && (
                <Bar dataKey="uv" barSize={74} fill="url(#colorBar)" fillOpacity={1} />
              )}
              {!isAssetSold ? (
                <Area
                  type="monotone"
                  dataKey="amt"
                  yAxisId="left"
                  stroke="url(#strokeColor3)"
                  // stroke="#F4B1A3"
                  scale={'auto'}
                  strokeWidth={3}
                  fill="url(#colorUv)"
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="uv"
                  fillOpacity={0}
                  scale={'auto'}
                  strokeWidth={0}
                />
              )}
              <Tooltip content={<MainCustomTooltip isCollection={isCollection} />} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="ml-[60px] mt-[14px] mb-[90px]">
            <div className="flex mb-[8px] font-bold text-[14px]">
              Legend <span className="ml-auto">Price in UMAD</span>
            </div>
            <div className="flex items-center text-[14px]">
              <SaleLegendSvg color={text?.color || "#F4B1A3"} className="w-[24px] h-[24px] mr-[8px]" />
              {isCollection ? 'Floor Price' : 'Sales'}
              <span style={{ background: text?.color, opacity: text?.color ? "0.5" : "1" }} className="w-[24px] h-[24px] bg-[#5F518A] mr-[8px] ml-[33px]" />
              Assets Sold
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-[500px]">
          {!isLoading && (
            <img className="w-[175px]" src="/icons/not-found-chart.svg" alt="not-found" />
          )}
        </div>
      )}
    </div>
  );
}
