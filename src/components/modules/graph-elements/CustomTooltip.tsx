// import Divider from "../../atoms/divider/Divider";
import { Divider } from '@mui/material';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { abbreviateNumber } from 'utils/func';
import { SummaryCollection } from '../whitelist-elements/SummaryCollection';
interface MainCustomTooltipProps {
  active?: boolean;
  payload?: any;
  isCollection?: boolean;
  label?: string;
  legendText?: string;
}

export const MainCustomTooltip: FC<MainCustomTooltipProps> = (props) => {
  const { active, payload, isCollection } = props;
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip main-tooltip w-[135px] flex flex-col items-center">
        <div className="date text--label-small text-white/80">{payload[0]?.payload?.date}</div>
        {isCollection && (
          <SummaryCollection
            index={abbreviateNumber(payload[0]?.payload?.amt)}
            description="Floor Price"
          />
        )}
        {!isCollection && (
          <SummaryCollection
            index={abbreviateNumber(payload[0]?.payload?.amt)}
            description="Total Sales"
          />
        )}

        <SummaryCollection
          index={payload[0]?.payload?.uv}
          description={`Asset${Number(payload[0]?.payload?.uv) > 1 ? 's' : ''} Sold`}
        />
        {isCollection && (
          <SummaryCollection
            index={abbreviateNumber(payload[0]?.payload?.totalSales)}
            description="Volume"
          />
        )}
        <SummaryCollection
          index={abbreviateNumber(payload[0]?.payload?.cnt)}
          description="Avg Price"
          className="mb-[10px]"
        >
          Ξ
        </SummaryCollection>
      </div>
    );
  }

  return null;
};

MainCustomTooltip.defaultProps = {
  active: false,
  payload: {},
  label: '',
};

export const PopupChartAssetSoldTooltip: FC<MainCustomTooltipProps> = (props) => {
  const { active, payload, legendText } = props;
  if (active && payload && payload.length) {
    const numberSales = Number(payload[0]?.payload?.sales) || 0;
    return (
      <div className="custom-tooltip main-tooltip w-[135px] flex flex-col items-center">
        <div className="date text--label-small text-white/80">{payload[0]?.payload?.date}</div>
        <SummaryCollection
          index={abbreviateNumber(payload[0]?.payload?.sales)}
          description={numberSales > 1 ? 'Assets Sold' : 'Asset Sold'}
        />
      </div>
    );
  }

  return null;
};

PopupChartAssetSoldTooltip.defaultProps = {
  active: false,
  payload: {},
  label: '',
};

export const PopupChartCustomTooltip: FC<MainCustomTooltipProps> = (props) => {
  const { active, payload, legendText } = props;
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip main-tooltip w-[135px] flex flex-col items-center">
        <div className="date text--label-small text-white/80">{payload[0]?.payload?.date}</div>
        <SummaryCollection
          index={abbreviateNumber(payload[0]?.payload?.sales)}
          description={legendText || ''}
        />
      </div>
    );
  }

  return null;
};

PopupChartCustomTooltip.defaultProps = {
  active: false,
  payload: {},
  label: '',
};

export const PopupMostViewChartCustomTooltip: FC<MainCustomTooltipProps> = (props) => {
  const { active, payload } = props;
  const { text } = useSelector((state) => (state as any).theme);
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip main-tooltip w-[160px] flex flex-col items-center">
        <div className="date text--label-small text-white/80">{payload[0]?.payload?.title}</div>
        <div className="flex flex-col text-center gap-1">
          <div style={{ color: text?.color }} className="text--label-small text-secondary-70">
            {payload[0]?.payload?.collection?.name}
          </div>
        </div>
        <SummaryCollection
          index={abbreviateNumber(payload[0]?.payload?.viewNumber)}
          description="Views"
        />
      </div>
    );
  }

  return null;
};

PopupMostViewChartCustomTooltip.defaultProps = {
  active: false,
  payload: {},
  label: '',
};

export const PopupPieChartCustomTooltip: FC<MainCustomTooltipProps> = (props) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip main-tooltip w-[200px] flex flex-col items-center">
        <div className="date text--label-small text-white/80">
          {payload[0]?.payload?.category}: {abbreviateNumber(payload[0]?.payload?.value)}{' '}
          {Number(payload[0]?.payload?.value) > 1 ? 'assets' : 'asset'}
        </div>
      </div>
    );
  }

  return null;
};

PopupPieChartCustomTooltip.defaultProps = {
  active: false,
  payload: {},
  label: '',
};

{
  /* <p className="label">{`${label} : ${payload[0].value}`}</p>
<p className="label">{`${label} : ${payload[1].value}`}</p> */
}
interface RarityIndexCustomTooltipProps {
  active?: boolean;
  payload?: any;
  label?: string;
  variant: boolean;
}

export const RarityIndexCustomTooltip: FC<RarityIndexCustomTooltipProps> = (props) => {
  const { active, payload, label, variant } = props;
  const { text } = useSelector((state) => (state as any).theme);
  if (active || payload || payload.length) {
    return (
      <div className="custom-tooltip main-tooltip max-content-width flex flex-col items-center ">
        {variant && (
          <div className="date text--label-small text-white/80">{payload[0]?.payload?.date}</div>
        )}
        <div className="flex  gap-4">
          <div className="flex flex-col items-center gap-4">
            {!variant && <div className="date text--label-small text-white/80">20 oct 2021</div>}
            <SummaryCollection
              index={abbreviateNumber(payload[0]?.payload?.volumnTraded)}
              description="Total Sales"
            />
            <SummaryCollection
              index={abbreviateNumber(payload[0]?.payload?.numberOfNft)}
              description={
                Number(payload[0]?.payload?.numberOfNft) > 1 ? 'Assets Sold' : 'Asset Sold'
              }
            />
            <SummaryCollection
              index={abbreviateNumber(payload[0]?.payload?.avgPrice)}
              description="Avg Price"
            >
              Ξ
            </SummaryCollection>
          </div>
          <div className="flex flex-col justify-end">
            <Divider
              className={`!border-secondary-30 ${variant ? '!h-[13.5rem]' : '!h-[12rem]'} `}
              orientation="vertical"
              variant="middle"
            />
          </div>
          <div className="flex flex-col items-start gap-4 mb-2">
            {!variant && <div className="date text--label-small text-white/80">Assets</div>}
            <div className="flex flex-col gap-4">
              {variant && <div className="date text--label-small text-white/80">Sales/RI</div>}
              <div className="border-l-8 border-secondary-40 text-left">
                <div className="flex flex-col ml-2">
                  <div className="text--title-small">{payload[0]?.payload?.first}</div>
                  <div style={text} className="text-secondary-70 text--label-small">0%-25%</div>
                </div>
              </div>
              <div className="border-l-8 border-primary-60 text-left">
                <div className="flex flex-col ml-2">
                  <div className="text--title-small">{payload[0]?.payload?.second}</div>
                  <div style={text} className="text-secondary-70 text--label-small">25%-50%</div>
                </div>
              </div>
              <div className="border-l-8 border-primary-dark text-left">
                <div className="flex flex-col ml-2">
                  <div className="text--title-small">{payload[0]?.payload?.third}</div>
                  <div style={text} className="text-secondary-70 text--label-small">50%-75%</div>
                </div>
              </div>
              <div className="border-l-8 border-primary-dark-2 text-left">
                <div className="flex flex-col ml-2">
                  <div className="text--title-small">{payload[0]?.payload?.four}</div>
                  <div style={text} className="text-secondary-70 text--label-small">75%-100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
RarityIndexCustomTooltip.defaultProps = {
  active: false,
  payload: {},
  label: '',
  variant: false,
};
