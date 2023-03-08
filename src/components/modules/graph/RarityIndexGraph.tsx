import { SaleLegendSvg } from 'components/common/iconography/iconsComponentSVG';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import chartService from 'service/chartService';
import { abbreviateNumber } from 'utils/func';
import { RarityIndexCustomTooltip } from '../graph-elements/CustomTooltip';

interface GraphAreaBarProp {
  userAddress: string;
  collection: any;
  period: any;
}

interface IParamsInsightArtist {
  artistAddress: string;
  period: string;
  collectionId?: string;
  isWithRarity: boolean;
}

export default function RarityIndexGraph({ userAddress, collection, period }: GraphAreaBarProp) {
  const { text = {} } = useSelector((state) => (state as any).theme);
  const [chartData, setChartData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const param = {
      artistAddress: userAddress,
      period: period?.value,
      collectionId: collection?.value === 'all_collections' ? '' : collection.value,
      isWithRarity: true,
    };
    getArtistInsight(param);
  }, [collection, userAddress, period]);

  const getArtistInsight = async (param: IParamsInsightArtist) => {
    setIsLoading(true);
    const [data, err] = await chartService.artistInsight(param);
    setIsLoading(false);
    if (!isEmpty(data)) {
      if (data && data.length > 0) {
        const convertChartData = data.map((item: any) => {
          const rarityIndex = get(item, 'rarityIndex', {});
          return {
            name: moment(item.start).format('DD MMM'),
            first: rarityIndex['0'],
            second: rarityIndex['25'],
            third: rarityIndex['50'],
            four: rarityIndex['75'],
            volumnTraded: Number(item.volumnTraded),
            avgPrice: Number(item.avgPrice),
            numberOfNft: item.numberOfNft,
            date: moment(item.start).format('DD MMM YYYY'),
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
    // <ResponsiveContainer width="100%" height="100%">
    <div>
      {chartData && chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={290}>
            <ComposedChart
              width={1128}
              height={520}
              data={chartData}
              barSize={74}
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
                <linearGradient id="colorCartesian" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#2D2D39" stopOpacity={1} />
                  <stop offset="20%" stopColor="#2D2D39" stopOpacity={0} />
                  <stop offset="80%" stopColor="#2D2D39" stopOpacity={0} />
                  <stop offset="100%" stopColor="#2D2D39" stopOpacity={1} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id="strokeColor4" x1="0" y1="0" x2="1" y2="0">
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
                scale="point"
                padding={{ left: 37, right: 37 }}
                tick={{ stroke: '#FFFFFF', fontSize: 14, strokeWidth: 0.5, opacity: 0.5 }}
              />
              <YAxis
                tickFormatter={formatter}
                tickSize={0}
                tickMargin={10}
                hide
                axisLine={false}
                orientation="right"
                tick={{ stroke: '#FFFFFF', fontSize: 14, strokeWidth: 0.5, opacity: 0.5 }}
              />
              <YAxis
                yAxisId="right"
                tickSize={0}
                tickMargin={10}
                axisLine={false}
                tick={{ stroke: '#FFFFFF', fontSize: 14, strokeWidth: 0.5, opacity: 0.5 }}
                tickFormatter={formatter}
                dataKey="volumnTraded"
              />
              <Tooltip content={<RarityIndexCustomTooltip variant={true} />} />
              <Bar dataKey="first" stackId="a" fill="#FC5E44" />
              <Bar dataKey="second" stackId="a" fill="#F4B1A3" />
              <Bar dataKey="third" stackId="a" fill="#7340D3" />
              <Bar dataKey="four" stackId="a" fill="#BBA2EA" />
              <Area
                type="monotone"
                dataKey="volumnTraded"
                stroke="url(#strokeColor4)"
                // stroke="#F4B1A3"
                strokeWidth={3}
                yAxisId="right"
                fillOpacity={0.8}
                fill="url(#colorUv)"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="ml-[60px] mt-[33px] mb-[90px] flex">
            <div className="w-[20%]">
              <div className="mb-[8px] text-[14px] font-bold">Legend</div>
              <div className="flex items-center text-[14px]">
                <SaleLegendSvg color={text?.color || "#F4B1A3"} className="w-[24px] h-[24px] mr-[8px]" />
                Sales
              </div>
            </div>
            <div className="top-0 left-0 w-[100%] flex justify-center text-[14px]">
              <div>
                <div className="flex mb-[8px] font-bold">Rarity Index</div>
                <div className="flex items-center text-[14px]">
                  <span className="w-[24px] h-[24px] bg-[#FC5E44] mr-[8px]" />
                  0%-25% RI
                  <span className="w-[24px] h-[24px] bg-[#F4B1A3] mr-[8px] ml-[33px]" />
                  25%-50% RI
                  <span className="w-[24px] h-[24px] bg-[#7340D3] mr-[8px] ml-[33px]" />
                  50%-75% RI
                  <span className="w-[24px] h-[24px] bg-[#BBA2EA] mr-[8px] ml-[33px]" />
                  75%-100% RI
                </div>
              </div>
            </div>
            <div className="w-[20%] font-bold text-right text-[14px]">Price in UMAD</div>
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
