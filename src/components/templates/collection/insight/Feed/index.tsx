import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import get from 'lodash/get';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Skeleton } from '@mui/material';
import { InputChip } from 'components/common/chips/InputChip';
import ItemFeed from 'components/modules/feed-elements/ItemFeed';
import _ from 'lodash';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import collectionService from 'service/collectionService';
import { toastError } from 'store/actions/toast';
import { IFeedData } from './typings';

const bidIcon = '/icons/asset-detail/activity-bid.svg';
const mintedIcon = '/icons/asset-detail/activity-minted.svg';
const saleIcon = '/icons/asset-detail/activity-sale.svg';
const tagIcon = '/icons/asset-detail/activity-tag.svg';
const transferIcon = '/icons/asset-detail/activity-transfer.svg';
const offerIcon = '/icons/asset-detail/activity-offer.svg';

import ListIcon from '@mui/icons-material/List';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { BidIconSVG, TransferIconSVG } from 'components/common/iconography/iconsComponentSVG';

interface IInsightFeedProps {
  collectionAddress?: string;
  shortUrl?: string;
}

interface IFilter {
  label: string;
  value: string;
  icon: any;
}

const FILTER_LABELS: IFilter[] = [
  {
    label: 'Sale',
    value: 'sale',
    icon: LocalGroceryStoreIcon,
  },
  {
    label: 'Bid',
    value: 'bid',
    icon: BidIconSVG,
  },
  {
    label: 'List',
    value: 'list',
    icon: LocalOfferIcon,
  },
  {
    label: 'Transfer',
    value: 'transfer',
    icon: TransferIconSVG,
  },
  {
    label: 'Offer',
    value: 'offer',
    icon: ListIcon,
  },
];

const defaultFeedData = {
  items: [],
  meta: {
    currentPage: 1,
    totalItem: 0,
    totalPages: 0,
    itemCount: 0,
    itemsPerPage: 0,
  },
};

const limitDefault = 10;

const defaultFilterLabels = FILTER_LABELS.map((label) => label.value).concat(['mint']);

function InsightFeed({ collectionAddress, shortUrl }: IInsightFeedProps) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({ page: 1, limit: limitDefault });
  const [selected, setSelected] = useState<string[]>([]);
  const [feedData, setFeedData] = useState<IFeedData>(defaultFeedData);
  const [activeMore, setActiveMore] = useState<boolean>(false);
  const { icon, button } = useSelector((state:any) => state.theme);

  const feedRecordsLength = feedData.items.length;

  const isEmpty = !feedRecordsLength;

  const router = useRouter();

  const { type, limitFeed } = router.query;

  const rootParams = useRef<any>({});

  const onPushRouter = (params: any) => {
    const paramsRouter = { ...rootParams.current };
    delete paramsRouter.cid;
    const url = {
      pathname: `/collection/${shortUrl ? shortUrl : collectionAddress}`,
      query: params || paramsRouter,
    };
    const options = { scroll: false };
    router.push(url, undefined, options);
  };

  useEffect(() => {
    rootParams.current = { ...rootParams.current, ...router.query };
    if (collectionAddress) {
      debounceLoadData({ ...rootParams.current }, collectionAddress);
    }
    return () => {
      rootParams.current = {};
    };
  }, [router, collectionAddress]);

  const debounceLoadData = useCallback(
    _.debounce(async (params, address: string) => {
      if (params.type) {
        if (_.isArray(params.type)) {
          setSelected(params.type);
        } else {
          setSelected([params.type]);
        }
      } else {
        setSelected([]);
      }

      if (params.limitFeed) {
        setFilters({
          page: 1,
          limit: parseInt(params.limitFeed),
        });
      }
    }, 50),
    [],
  );

  const typeJoin = _.isArray(type) ? type.join('') : type;

  useEffect(() => {
    getCollectionFeed();
  }, [typeJoin, limitFeed]);

  useEffect(() => {
    if (!_.isEmpty(feedData.meta)) {
      if (feedData.meta.totalPages > 1) {
        setActiveMore(true);
      } else {
        setActiveMore(false);
      }
    }
  }, [feedData]);

  const onSelect = (value: string) => {
    setFeedData(defaultFeedData);
    if (selected.includes(value)) {
      rootParams.current.type = selected.filter((e: string) => e !== value);
    } else {
      rootParams.current.type = [...selected, value];
    }
    onPushRouter(null);
  };

  const handleLoadMore = () => {
    rootParams.current.limitFeed = filters.limit + limitDefault;
    onPushRouter(null);
  };

  const getCollectionFeed = useCallback(async () => {
    try {
      setLoading(true);
      const [response, error]: any[] = await collectionService.getCollectionFeed({
        address: collectionAddress as string,
        params: {
          page: 1,
          limit: rootParams.current.limitFeed || limitDefault,
          type:
            rootParams.current.type && rootParams.current.type.length > 0
              ? rootParams.current.type.toString()
              : defaultFilterLabels.toString(),
        },
      });
      if (error) throw error;
      if (response.status === 200) {
        setLoading(false);
        const items = get(response, 'data.items', []);
        const meta = get(response, 'data.meta');
        setFeedData({
          items,
          meta,
        });
      }
    } catch (error) {
      setLoading(false);
      dispatch(toastError('Something went wrong'));
    }
  }, [filters, selected]);

  const renderFilterLabels = () => {
    return (
      <div className="flex sm:flex-wrap md:flex-nowrap justify-center gap-x-6 mb-9">
        {FILTER_LABELS.map((item: IFilter) => {
          return (
            <InputChip
              hover={!button?.tonal?.active}
              className={`${
                selected.includes(item.value) && !button?.tonal?.active ? '!bg-primary-dark' : ''
              } min-w-[100px] mb-9 ${!button?.tonal?.active ? 'hover:!bg-primary-dark' : ''}  `}
              key={`${item.value}`}
              label={<span className=" text-archive-Neutral-Variant80">{item.label}</span>}
              onClick={() => onSelect(item.value)}
              color={'dark onSurface'}
              icon={
                <item.icon
                  style={
                    icon
                      ? selected.includes(item.value)
                        ? { ...icon, color: '#c9c5c5' }
                        : { ...icon }
                      : {}
                  }
                />
              }
              style={selected.includes(item.value) ? button?.tonal?.active : {}}
            />
          );
        })}
      </div>
    );
  };
  const loader = () => {
    return (
      <div className="mt-6">
        <Skeleton
          variant="rectangular"
          width={'100%'}
          height={90}
          className="bg-[#373d4a] rounded-xl"
          animation="wave"
        />
      </div>
    );
  };
  const renderContent = () => {
    if (isEmpty) {
      /**
       * * Render empty content here
       */
      return (
        <div className="py-4">
          <Stack spacing={2} alignItems="center" justifyContent="center" className="pt-6 mb-14">
            <img src="/images/empty_content.png" />
            <div className="text--headline-small text-secondary-gray">No results</div>
          </Stack>
        </div>
      );
    }
    return (
      <InfiniteScroll
        dataLength={feedData.items?.length}
        next={handleLoadMore}
        hasMore={activeMore}
        loader={loader()}
        className="!overflow-hidden"
      >
        <div className="relative flex flex-col items-center gap-y-6">
          {feedData.items.map((feed) => (
            <ItemFeed data={feed} key={feed.id} />
          ))}
        </div>
      </InfiniteScroll>
    );
  };

  return (
    <section className="mt-9 mb-9">
      {renderFilterLabels()}
      <div className="relative flex flex-col items-center gap-y-6">
        {loading && (
          <Stack
            spacing={2}
            alignItems={'center'}
            justifyContent={'center'}
            className="absolute top-0 left-0 z-10 w-full h-full"
          >
            <CircularProgress className="text-primary-60" />
          </Stack>
        )}
        {renderContent()}
        {/* {feedData.meta.totalPages > 1 && (
          <div className="sm:w-full md:w-[750px]">
            <FilledButton text="View More" loading={loading} customClass="font-bold" onClick={handleLoadMore} />
          </div>
        )} */}
      </div>
    </section>
  );
}

export default InsightFeed;
