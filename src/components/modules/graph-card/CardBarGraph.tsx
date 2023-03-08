import { Box } from '@mui/material';
import React, { FC } from 'react';
import { abbreviateNumber } from 'utils/func';
import { RechartGraphBarCard, RechartGraphCard } from '../graph-elements/RechartGraph';

const graphData = [
  {
    name: 'Page A',
    uv: 1000,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 3390,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 1490,
    amt: 2100,
  },
];

interface CardGraphProps {
  selected: boolean;
  label?: string;
  amount?: string;
  date?: string;
  data?: any;
  text?: any;
}
// graphData
const CardBarGraph: FC<CardGraphProps> = ({
  selected,
  label = 'Owner',
  amount = '133k',
  text = {},
  data,
}) => {
  const amountLabel = amount === '0' ? '-' : abbreviateNumber(amount);
  return (
    <Box
      sx={{
        '.card-graph:hover, .selected': {
          border: `1px solid ${text?.color || '#f4b1a3'}`,
        },
      }}
    >
      <div className={`card-visualization card-graph relative ${selected ? 'selected' : ''} `}>
        <div className="flex items-start justify-between p-4">
          <div className="z-30">
            <h2 className="text--title-large text-white text-[22px]">{amountLabel}</h2>
            <p style={{ color: text?.color }} className="owner text--label-small text-secondary-70">
              {label}
            </p>
          </div>
          <div className="text--title-small mr-2 text-white z-10">All time</div>
        </div>
        {data && data.length > 0 ? (
          <div className="graph-overlay absolute bottom-0 left-0 w-full h-full flex flex-col items-center  justify-end">
            <RechartGraphBarCard data={data} text={text} />
          </div>
        ) : (
          <div className="flex justify-center">
            <img src="/icons/not-found-chart.svg" alt="not-found" />
          </div>
        )}
      </div>
    </Box>
  );
};

CardBarGraph.defaultProps = {
  selected: false,
};

export default CardBarGraph;
