import { Box } from '@mui/material';
import React, { FC } from 'react';
import {
  RechartGraphBarVertical,
} from '../graph-elements/RechartGraph';

interface CardGraphVerticalProps {
  selected: boolean;
  date?: string;
  data?: any;
  text?: any;
}
// graphData
const CardBarGraphVertical: FC<CardGraphVerticalProps> = ({ selected, data, text = {} }: any) => {
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
            <p style={{ color: text?.color }} className="owner text--label-small text-secondary-70">
              Most view NFTs
            </p>
          </div>
          <div className="text--title-small mr-2 text-white z-10">All time</div>
        </div>
        {data && data.length > 0 ? (
          <div className="graph-overlay absolute bottom-0 left-0 w-full h-full flex flex-col items-center justify-end pb-[19px]">
            <RechartGraphBarVertical graphData={data} text={text} />
          </div>
        ) : (
          <div className="flex justify-center mt-[27px]">
            <img src="/icons/not-found-chart.svg" alt="not-found" />
          </div>
        )}
      </div>
    </Box>
  );
};

CardBarGraphVertical.defaultProps = {
  selected: false,
};

export default CardBarGraphVertical;
