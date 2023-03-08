import { SaleLegendSvg } from 'components/common/iconography/iconsComponentSVG';
import { WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { useMobileDetect } from 'hooks/useMobileDetect';
import useWindowSize from 'hooks/useWindowSize';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
} from 'recharts';
import chartService from 'service/chartService';
import { abbreviateNumber } from 'utils/func';
import { MainCustomTooltip, PopupChartCustomTooltip } from '../graph-elements/CustomTooltip';

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
  dataChart: any;
  text?: any;
  legendText?: string;
}

export default function GraphAreaBarInPopup({ dataChart, legendText, text = {} }: GraphAreaBarProp) {
  const [chartData, setChartData] = useState<Array<any>>(dataChart ? dataChart : []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setChartData(dataChart);
  }, [dataChart]);

  const windowMode = useDetectWindowMode();
  const mobileDetect = useMobileDetect();
  const { availWidth, width } = useWindowSize();
  const w = mobileDetect.isMobile() ? availWidth : width;
  const formatter: any = (value: any) => abbreviateNumber(value);

  return (
    <div className="mt-[30px]">
      {chartData && chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={290}>
            <ComposedChart
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
                  <stop offset="0%" stopColor="#7340D3" stopOpacity={0.34} />
                  <stop offset="100%" stopColor="#581EFC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9874DD" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#9874DD" stopOpacity={0.5} />
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
                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="green" stopOpacity={1} />
                  <stop offset="100%" stopColor="red" stopOpacity={1} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id="strokeColor1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={text?.color || "#F4B1A3"} stopOpacity={0} />
                  <stop offset="20%" stopColor={text?.color || "#F4B1A3"} stopOpacity={1} />
                  <stop offset="80%" stopColor={text?.color || "#F4B1A3"} stopOpacity={1} />
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
                tick={{ stroke: '#FFFFFF', fontSize: 14, strokeWidth: 0.5, opacity: 0.5 }}
              />
              <YAxis
                dataKey="sales"
                orientation="left"
                tickFormatter={formatter}
                tickSize={0}
                tickMargin={10}
                allowDuplicatedCategory={false}
                axisLine={false}
                tick={{ stroke: '#FFFFFF', fontSize: 14, strokeWidth: 0.5, opacity: 0.5 }}
              />
              <Tooltip content={<PopupChartCustomTooltip legendText={legendText} />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="url(#strokeColor1)"
                // stroke="#F4B1A3"
                scale={'auto'}
                strokeWidth={3}
                fill="url(#colorUv)"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="ml-[60px] mt-[14px] mb-[30px] mr-[60px]">
            <div className="flex items-center text-[14px]">
              <SaleLegendSvg color={text?.color || "#F4B1A3"} className="w-[24px] h-[24px] mr-[8px]" />
              {legendText}
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
