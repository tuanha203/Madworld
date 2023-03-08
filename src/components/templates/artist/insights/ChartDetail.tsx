import { PopupRechartGraphBarVertical, RechartGraphBarCardPopup } from 'components/modules/graph-elements/RechartGraph';
import GraphAreaBarInPopup from 'components/modules/graph/GraphAreaBarInPopup';
import GraphPie from 'components/modules/graph/GraphPie';
import { get } from 'lodash';
import moment from 'moment';
import { POPUP_CHART_INSIGHTS } from './TabInsights';

interface IChartDetail {
  chartSelected: string;
  data?: any;
  text?: any;
}

const ChartDetail = (props: IChartDetail) => {
  const { chartSelected, data, text = {} } = props;
  const dataSales = data.map((item: any) => ({
    ...item,
    sales: Number(item.value),
    date: moment(item.name).format('DD MMM YYYY'),
    collectionName: get(item, "collection.title", "") || get(item, "collection.name", ""),
    time: moment(item.name).format('DD MMM'),
    name: moment(item.name).format('DD MMM'),
    category: item.name,
  }));
  return (
    <div>
      {chartSelected === POPUP_CHART_INSIGHTS.CHART_SALES && (
        <GraphAreaBarInPopup legendText={'Sales'} text={text} dataChart={dataSales} />
      )}
      {chartSelected === POPUP_CHART_INSIGHTS.CHART_FLOOR_PRICE && (
        <GraphAreaBarInPopup legendText={'Floor Price'} text={text} dataChart={dataSales} />
      )}
      {chartSelected === POPUP_CHART_INSIGHTS.CHART_2EST_SALE && (
        <GraphAreaBarInPopup legendText={'Highest Sale'} text={text} dataChart={dataSales} />
      )}
      {chartSelected === POPUP_CHART_INSIGHTS.CHART_OWNERS && <PopupRechartGraphBarVertical text={text} graphData={dataSales} />}
      {chartSelected === POPUP_CHART_INSIGHTS.CHART_ASSETS_CREATED && <GraphPie text={text} data={dataSales} />}
      {chartSelected === POPUP_CHART_INSIGHTS.CHART_ASSETS_SOLD && <RechartGraphBarCardPopup text={text} data={dataSales} />}
    </div>
  );
};

ChartDetail.propTypes = {};

export default ChartDetail;
