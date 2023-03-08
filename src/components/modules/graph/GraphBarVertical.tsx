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
  BarChart,
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
];

interface GraphAreaProp {
  hasLegend?: boolean;
}

export default function GraphBarVertical({ hasLegend = true }: GraphAreaProp) {
  return (
    <BarChart width={1128} height={500} data={data} layout="vertical">
      <XAxis hide axisLine={false} type="number" />
      <Bar dataKey="pv" fill="#8884d8" barSize={12} />
    </BarChart>
  );
}
