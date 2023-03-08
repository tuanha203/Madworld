import { WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import React, { PureComponent, useCallback, useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PopupPieChartCustomTooltip } from '../graph-elements/CustomTooltip';

const COLORS = ['#FC5E44', '#F4B1A3', '#7340D3', '#BBA2EA', '#979797'];

interface GraphPieProps {
  data: any;
  text?: any;
}

const GraphPie = ({ data = [], text = {} }: GraphPieProps) => {
  const [activeIndex, setActiveIndex] = useState<any>(undefined);
  const windowMode = useDetectWindowMode();
  const onMouseOver = useCallback((_data, index) => {
    setActiveIndex(index);
  }, []);
  const onMouseLeave = useCallback((_data, index) => {
    setActiveIndex(undefined);
  }, []);
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    const sx = cx;
    const sy = cy;
    return (
      <Sector
        cx={sx}
        cy={sy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 7}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerIsExternal={false}
        stroke="#161D28"
        strokeWidth={1.5}
      />
    );
  };
  return (
    <>
      {data && data.length > 0 ? (
        <div className="flex items-center lg:flex-row sm:flex-col-reverse">
          <div className="">
            <div style={{ color: text?.color }} className="text-[36px] font-bold text-[#F7CFC7] lg:mb-[69px]">Assets Created</div>
            <div className="sm:ml-[10px] md:ml-[15px] lg:ml-[40px] sm:flex sm:flex-wrap lg:block">
              {data.map((item: any, i: number) => {
                return (
                  <div className="flex items-center sm:my-[20px] lg:my-[40px] sm:text-[14px] md:text-[28px] font-bold flex-initial w-1/2">
                    {i === 4 ? (
                      <>
                        <div className={`w-[24px] h-[24px] bg-[#979797] mr-[22px] shrink-0`} />
                        <div>{item.category}</div>
                      </>
                    ) : (
                      <>
                        <div className={`w-[24px] h-[24px] bg-[${COLORS[i]}] mr-[22px] shrink-0`} />
                        <div>{item.category}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:ml-auto sm:ml-0 lg:w-[50%] sm:w-full">
            <ResponsiveContainer width="100%" height={[WINDOW_MODE.XL, WINDOW_MODE['2XL']].includes(windowMode) ? 350 : 250}>
              <PieChart>
                <Pie
                  data={data}
                  activeIndex={activeIndex}
                  labelLine={false}
                  fill="#8884d8"
                  dataKey="value"
                  activeShape={renderActiveShape}
                  onMouseOver={onMouseOver}
                  onMouseLeave={onMouseLeave}
                >
                  {data.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#161D28"
                      strokeWidth={1.5}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PopupPieChartCustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
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

export default GraphPie;
