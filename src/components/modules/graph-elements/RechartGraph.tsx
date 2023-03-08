import { WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { get } from 'lodash';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ComposedChart,
  Legend,
  PieChart,
  Pie,
  BarChart,
  Bar,
  ResponsiveContainer,
  Text,
} from 'recharts';
import { abbreviateNumber } from 'utils/func';
import { PopupChartAssetSoldTooltip, PopupChartCustomTooltip, PopupMostViewChartCustomTooltip } from './CustomTooltip';

interface RechartGraphCardProps {
  xAxis: false;
  yAxis: false;
  grid: false;
  area: true;
  line: false;
  strokeWidth: 1;
  text: any;
}

export const RechartGraphCard = ({
  graphData,
  xAxis,
  yAxis,
  grid,
  strokeWidth,
  text = {},
  area,
}: any) => {
  const windowMode = useDetectWindowMode();
  const isMobileInSmMd = [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode);

  return (
    <ResponsiveContainer width={isMobileInSmMd ? '100%' : 390} height={120}>
      <ComposedChart
        className={`area-graph`}
        data={graphData}
        margin={{
          top: 5,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <defs>
          <linearGradient id="colorUv1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={text?.color || "#CCA4FF"} stopOpacity={0.2} />
            <stop offset="100%" stopColor="#A4FFEF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id="strokeColor2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={text?.color || "#F4B1A3"} stopOpacity={0} />
            <stop offset="12%" stopColor={text?.color || "#F4B1A3"} stopOpacity={1} />
            <stop offset="88%" stopColor={text?.color || "#F4B1A3"} stopOpacity={1} />
            <stop offset="100%" stopColor={text?.color || "#F4B1A3"} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid && <CartesianGrid vertical={false} stroke="#DDD" />}
        {area && (
          <Area
            type="monotone"
            dataKey="value"
            // stroke="#F4B1A3"
            stroke="url(#strokeColor2)"
            strokeWidth={strokeWidth}
            fillOpacity={1}
            fill="url(#colorUv1)"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
RechartGraphCard.defaultProps = {
  xAxis: false,
  yAxis: false,
  grid: false,
  area: true,
  line: false,
  strokeWidth: 1,
};

// data pie
export const RechartGraphPieCard = ({ dataPie, text = {} }: any) => {
  return (
    <PieChart
      style={{
        background:
          `radial-gradient(50% 50% at 50% 50%, ${text?.color ? text?.color : 'rgba(74, 30, 252, 0.2)'} 0%, rgba(34, 30, 252, 0) 100%)`,
        opacity: text?.color ? "0.5" : "1",
      }}
      className="pie-chart-rechart"
      width={130}
      height={130}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#BBA2EA" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#CCA4FF" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <Pie
        data={dataPie}
        dataKey="value"
        cx={60}
        cy={60}
        stroke={text?.color ? text?.color : "#BBA2EA"}
        strokeWidth={1}
        outerRadius={60}
        fill="transparent"
      />
    </PieChart>
  );
};

export const RechartGraphBarCard = ({ data, text = {} }: any) => {
  return (
    <div className="mb-[14px] w-[90%]">
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="colorAssetSoldBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={text?.color || "#B794F6"} stopOpacity={text?.color ? 0.3 : 1} />
            <stop offset="100%" stopColor={text?.color || "#7340D3"} stopOpacity={1} />
          </linearGradient>
        </defs>
        <Bar dataKey="value" barSize={26} fill="url(#colorAssetSoldBar)" />
        <XAxis dataKey="time" hide axisLine={false} />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export const RechartGraphBarCardPopup = ({ data, text = {} }: any) => {
  const formatter: any = (value: any) => abbreviateNumber(value);
  return (
    <>
      {data && data.length > 0 ? (
        <div className="mb-[14px]">
          <ResponsiveContainer width="100%" height={290}>
            <ComposedChart
              data={data}
              margin={{
                top: 15,
                right: 0,
                bottom: 20,
                left: 0,
              }}
            >
              <defs>
                <linearGradient id="colorAssetSold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={text?.color || "#B794F6"} stopOpacity={text?.color ? 0.3 : 1} />
                  <stop offset="100%" stopColor={text?.color || "#7340D3"} stopOpacity={1} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id="colorCartesian" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#2D2D39" stopOpacity={1} />
                  <stop offset="10%" stopColor="#2D2D39" stopOpacity={0} />
                  <stop offset="90%" stopColor="#2D2D39" stopOpacity={0} />
                  <stop offset="100%" stopColor="#2D2D39" stopOpacity={1} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id="strokeColor" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F4B1A3" stopOpacity={0.2} />
                  <stop offset="12%" stopColor="#F4B1A3" stopOpacity={1} />
                  <stop offset="88%" stopColor="#F4B1A3" stopOpacity={1} />
                  <stop offset="100%" stopColor="#F4B1A3" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="#525252"
                opacity={0.5}
                fill="url(#colorCartesian)"
              />
              <Bar dataKey="sales" stackId="a" barSize={74} fill="url(#colorAssetSold)" />
              <Area
                type="monotone"
                dataKey="sales"
                strokeWidth={0}
                stroke="url(#strokeColor)"
                // stroke="#F4B1A3"
                fillOpacity={0}
              />
              <YAxis
                dataKey="sales"
                orientation="left"
                tickFormatter={formatter}
                tickSize={0}
                tickMargin={10}
                axisLine={false}
                tick={{ stroke: '#FFFFFF', fontSize: 14, strokeWidth: 0.5, opacity: 0.5 }}
              />
              <XAxis
                dataKey="time"
                tickSize={0}
                scale="point"
                padding={{ left: 37, right: 37 }}
                tickMargin={20}
                axisLine={false}
                tick={{ stroke: '#FFFFFF', fontSize: 14, strokeWidth: 0.5, opacity: 0.5 }}
              />
              <Tooltip content={<PopupChartAssetSoldTooltip />} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="ml-[60px] mt-[14px] mb-[30px] mr-[60px]">
            <div className="flex items-center text-[14px]">
              <span style={{ background: text?.color }} className="w-[24px] h-[24px] bg-[#693BCC] mr-[8px]" />
              Assets Sold
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[500px]">
          <img className="w-[175px]" src="/icons/not-found-chart.svg" alt="not-found" />
        </div>
      )}
    </>
  );
};

export const RechartGraphBarLine = ({ graphData }: any) => {
  return (
    <BarChart width={350} height={150} data={graphData}>
      <Bar dataKey="amount" fill="#8884d8" />
    </BarChart>
  );
};

export const PopupRechartGraphBarVertical = ({ graphData, text = {} }: any) => {
  const windowMode = useDetectWindowMode();

  const isMobileInSmMd = [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode);

  const CustomYAxisTick = (props: any) => {
    const { x, y, payload = '' } = props;
    let displayCollection = get(graphData, `${payload?.index}.collectionName`, '');
    let displayName = get(payload, 'value', '');

    if (typeof displayName === 'string') {
      displayName = displayName.length > 8 ? displayName.slice(0, 6) + '...' : displayName;
    }
    if (typeof displayCollection === 'string') {
      displayCollection =
        displayCollection.length > 17 ? displayCollection.slice(0, 15) + '...' : displayCollection;
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={0} textAnchor="end" fill="#FFFFFF" className="sm:text-sm lg:text-xl">
          {displayName}
        </text>
        <text x={0} y={0} dy={20} textAnchor="end" fill="#FFFFFF" className="sm:text-sm lg:text-xl">
          {displayCollection}
        </text>
      </g>
    );
  };

  return (
    <>
      <div style={{ color: text?.color }} className="text-[#F7CFC7] text-[36px] font-bold mb-[40px] px-[20px]">Most view NFTs</div>
      {graphData && graphData.length > 0 ? (
        <ResponsiveContainer width="100%" height={380}>
          <BarChart
            data={graphData}
            margin={{
              top: 0,
              right: 20,
              bottom: 0,
              left: 40,
            }}
            layout="vertical"
          >
            <XAxis hide axisLine={false} type="number" />
            <YAxis
              dataKey="title"
              type="category"
              axisLine={false}
              width={isMobileInSmMd ? 50 : 150 }
              tick={<CustomYAxisTick />}
              tickSize={0}
              tickMargin={15}
              padding={{
                top: 0,
                bottom: 0,
              }}
            />
            <Tooltip cursor={false} content={<PopupMostViewChartCustomTooltip />} />
            <Bar
              dataKey="viewNumber"
              fill="#B794F6"
              barSize={15}
              shape={({ x, y, width, height, value, background }) => {
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={text?.color ? text?.color : '#B794F6'} rx={5} />
                  </g>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex justify-center items-center h-[500px]">
          <img className="w-[175px]" src="/icons/not-found-chart.svg" alt="not-found" />
        </div>
      )}
    </>
  );
};

export const RechartGraphBarVertical = ({ graphData, text = {} }: any) => {
  return (
    <>
      {graphData && graphData.length > 0 ? (
        <BarChart width={300} height={126} data={graphData} layout="vertical">
          <XAxis hide axisLine={false} type="number" />
          <Bar
            dataKey="viewNumber"
            fill={text?.color ? text?.color : "#B794F6"}
            barSize={8}
            shape={({ x, y, width, height, value, background }) => {
              return (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill={text?.color ? text?.color : "#B794F6"} rx={5} />
                </g>
              );
            }}
          />
        </BarChart>
      ) : (
        <div className="flex justify-center items-center h-[500px]">
          <img className="w-[175px]" src="/icons/not-found-chart.svg" alt="not-found" />
        </div>
      )}
    </>
  );
};
