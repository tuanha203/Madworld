import { useEffect, useReducer } from 'react';
import nftHistoryService from 'service/nftHistoryService';
import ItemFeedActivity from 'components/modules/feed-elements/ItemFeedActivity';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import ImageBase from 'components/common/ImageBase';
import CircularProgressIndicator from 'components/common/progress-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import { isEmpty } from 'lodash';
import useUpdateEffect from 'hooks/useUpdateEffect';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { WINDOW_MODE } from 'constants/app';

interface ISelect {
  name: string;
  value: string;
}

const options: Array<ISelect> = [
  { name: 'Last 7 days', value: 'LAST7DAYS' },
  { name: 'Last 14 days', value: 'LAST14DAYS' },
  { name: 'Last 30 days', value: 'LAST30DAYS' },
  { name: 'Last 60 days', value: 'LAST60DAYS' },
  { name: 'Last 90 days', value: 'LAST90DAYS' },
  { name: 'Last Year', value: 'LASTYEARS' },
  { name: 'All time', value: 'ALLTIME' },
];

interface IMetadata {
  itemCount: number;
  totalItem: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

const defaultMetadata = {
  itemCount: 0,
  totalItem: 0,
  itemsPerPage: 0,
  totalPages: 0,
  currentPage: 0,
};
interface IInitialState {
  data: any[];
  metadata: IMetadata;
  loading: boolean;
}

const initialState: IInitialState = { data: [], metadata: defaultMetadata, loading: false };

enum TYPE_REDUCER_ACTIVITY {
  UPDATE = 'UPDATE',
  LOADING = 'LOADING',
  RESET = 'RESET',
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case TYPE_REDUCER_ACTIVITY.UPDATE:
      return { ...state, ...action.payload };

    case TYPE_REDUCER_ACTIVITY.LOADING: {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case TYPE_REDUCER_ACTIVITY.RESET: {
      return initialState;
    }
    default:
      throw new Error();
  }
}

const PAGE_SIZE = 10;
const INIT_PAGE = 1;

const ActivityTab = ({ assetDataDetail }: any) => {
  const [state, dispatchState] = useReducer(reducer, initialState);
  const { data, metadata, loading } = state;
  const windowMode = useDetectWindowMode();
  const isMobile = [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode);

  const { forceUpdateData } = useSelector((state: any) => ({
    forceUpdateData: state?.forceUpdating?.internalSale,
  }));

  const getNftHistory = async (initPage?: number) => {
    try {
      if (metadata.currentPage > metadata.totalPages) return;
      dispatchState({
        type: TYPE_REDUCER_ACTIVITY.LOADING,
        payload: true,
      });
      const nextPage: number = initPage || metadata.currentPage + 1;
      const [resp] = await nftHistoryService.getNftHistory(
        assetDataDetail?.id,
        PAGE_SIZE,
        nextPage,
      );
      dispatchState({
        type: TYPE_REDUCER_ACTIVITY.UPDATE,
        payload: {
          data: [...data, ...resp.items],
          metadata: resp.meta,
        },
      });
    } finally {
      dispatchState({
        type: TYPE_REDUCER_ACTIVITY.LOADING,
        payload: false,
      });
    }
  };

  useEffect(() => {
    if (typeof assetDataDetail?.id === 'number') {
      getNftHistory(INIT_PAGE);
    }
  }, [assetDataDetail?.id]);

  useUpdateEffect(() => {
    const updateData = async () => {
      const [resp] = await nftHistoryService.getNftHistory(
        assetDataDetail?.id,
        PAGE_SIZE,
        INIT_PAGE,
      );
      dispatchState({
        type: TYPE_REDUCER_ACTIVITY.UPDATE,
        payload: {
          data: [...resp.items],
          metadata: resp.meta,
        },
      });
    };
    updateData();
  }, [forceUpdateData]);

  return (
    <div className="lg:h-[430px]">
      {!loading && isEmpty(data) ? (
        <Box className="no-data">
          <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
          <label>No results</label>
        </Box>
      ) : (
        <InfiniteScroll
          dataLength={data.length}
          next={getNftHistory}
          hasMore={data?.length < metadata.totalItem}
          loader={null}
          scrollableTarget="scrollableDiv"
          height={isMobile ? 230 : 430} // must use for auto call api when scroll
        >
          <div className="flex flex-col items-center gap-4 overflow-x-hidden">
            {!isEmpty(data) && (
              <>
                {data.map((item: any) => {
                  return <ItemFeedActivity key={item?.id} data={item} />;
                })}
              </>
            )}
            {loading && <CircularProgressIndicator size={20} />}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default ActivityTab;
