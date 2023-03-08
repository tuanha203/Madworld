import { Box } from '@mui/material';
import React from 'react';
import { abbreviateNumber } from 'utils/func';
import { RechartGraphPieCard } from '../graph-elements/RechartGraph';

interface IRecordChart {
  name: string;
  value: number;
}
interface CardGraphProps {
  selected: boolean;
  label?: string;
  amount?: string;
  date?: string;
  data: IRecordChart[];
  text: any;
}

const CardPieGraph = ({
  selected,
  label = '-',
  amount = '-',
  date = '-',
  data,
  text = {},
}: CardGraphProps) => {
  const listCategory = data?.map((elm: IRecordChart) => elm?.name || '-') || [];
  const amountLabel = amount === '0' ? '-' : abbreviateNumber(amount);
  return (
    <Box
      sx={{
        '.graph-hover:hover, .selected': {
          border: `1px solid ${text?.color || '#f4b1a3'}`,
        },
      }}
    >
      <div className="card-pie card-visualization graph-hover flex flex-col justify-between relative p-4 ">
        <div className="flex items-start justify-between">
          <div className="z-30">
            <h2 className="text--title-large text-white text-[22px]">{amountLabel}</h2>
            <p style={{ color: text?.color }} className="owner text--label-small text-secondary-70">
              {label}
            </p>
          </div>
          <div className="text--title-small mr-2 text-white z-10">All time</div>
        </div>
        {data && data.length > 0 ? (
          <div className="flex w-full h-full items-center justify-between">
            <div className="flex flex-col leading-[20px] text-[11px]">
              {listCategory.map((name: string) => (
                <div key={name}>{name}</div>
              ))}
            </div>
            <div className="pie-wrapper">
              <RechartGraphPieCard dataPie={data} text={text} />
            </div>
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

export default CardPieGraph;
