import React from 'react';
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
import { MainCustomTooltip } from '../graph-elements/CustomTooltip';
const data = [
  {
    name: '14 Dec',
    uv: 100,
    pv: 800,
    amt: 100,
    cnt: 490,
  },
  {
    name: '15 Dec',
    uv: 86,
    pv: 967,
    amt: 1506,
    cnt: 590,
  },
  {
    name: '16 Dec',
    uv: 137,
    pv: 1098,
    amt: 989,
    cnt: 350,
  },
  {
    name: '17 Dec',
    uv: 480,
    pv: 1200,
    amt: 1000,
    cnt: 480,
  },
  {
    name: '18 Dec',
    uv: 120,
    pv: 1108,
    amt: 1100,
    cnt: 460,
  },
  {
    name: '19 Dec',
    uv: 400,
    pv: 680,
    amt: 200,
    cnt: 380,
  },
  {
    name: '20 Dec',
    uv: 400,
    pv: 680,
    amt: 200,
    cnt: 380,
  },
];

interface GraphAreaProp {
  hasLegend?: boolean;
}

export default function GraphArea({ hasLegend = true }: GraphAreaProp) {
  return (
    <ComposedChart
      id="test"
      width={1128}
      height={500}
      data={data}
      margin={{
        top: 0,
        right: 0,
        bottom: 0,
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
        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="green" stopOpacity={1} />
          <stop offset="100%" stopColor="red" stopOpacity={1} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} stroke="#525252" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip content={<MainCustomTooltip />} />
      {hasLegend && <Legend />}
      <Area type="monotone" dataKey="amt" stroke="#F4B1A3" strokeWidth={3} fill="url(#colorUv)" />
    </ComposedChart>
  );
}
