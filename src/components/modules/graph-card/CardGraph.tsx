import { Box } from '@mui/material';
import React, { FC } from 'react';
import { abbreviateNumber } from 'utils/func';
import { RechartGraphCard } from '../graph-elements/RechartGraph';

interface CardGraphProps {
  selected: boolean;
  label?: string;
  amount?: string;
  date?: string;
  graphData?: any;
  text?: any;
}

const CardGraph: FC<CardGraphProps> = ({
  selected,
  label = 'Owner',
  amount = '133k',
  date = '20 Dec, 2021',
  graphData,
  text = {},
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
      <div
        className={`card-visualization card-graph relative cursor-pointer ${
          selected ? 'selected' : ''
        } `}
      >
        <div className="flex items-start justify-between p-4">
          <div className="z-30">
            <h2 className="text--title-large text-white text-[22px]">{amountLabel}</h2>
            <p style={{ color: text?.color }} className="owner text--label-small text-secondary-70">
              {label}
            </p>
          </div>
          <div className="text--title-small mr-2 text-white z-10">{date}</div>
        </div>
        {graphData && graphData.length > 0 ? (
          <div className="graph-overlay absolute bottom-0 left-0 w-full h-full flex flex-col items-center justify-end">
            <RechartGraphCard graphData={graphData} text={text} />
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

CardGraph.defaultProps = {
  selected: false,
};

export default CardGraph;
