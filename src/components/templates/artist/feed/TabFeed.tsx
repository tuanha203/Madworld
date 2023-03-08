import { CircularProgress, Skeleton } from '@mui/material';
import Stack from '@mui/material/Stack';
import { InputChip } from 'components/common/chips/InputChip';
import ItemFeed from 'components/modules/feed-elements/ItemFeed';
import _ from 'lodash';
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import artistService from 'service/artist';
import { toastError } from 'store/actions/toast';
import { IFeedData, IFeedItem } from './typings';

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

interface ITabFeedProps {
  walletAddress: string;
}

const mockData = {
  activityType: 'list',
  blockTimestamp: 1655451703,
  currencyToken: 'UMAD',
  fromUser: {
    walletAddress: '0x12321321321',
    username: 'test',
  },
  toUser: {
    walletAddress: '0x12321321321',
    username: 'test',
  },
  transactionHash: '0x123k9123dj123123',
  quantity: 2, // TODO
  price: 2,
  fromAddress: '0x128923jd92',
  toAddress: '0x9812321k3j',
};
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

const defaultFilters = {
  page: 1,
  limit: 10,
  selected: [],
};

const defaultFilterLabels = FILTER_LABELS.map((label) => label.value).concat(['mint']);

export default function TabFeed(props: ITabFeedProps) {
  const { walletAddress } = props;
  const dispatch = useDispatch();
  const { query, replace } = useRouter();

  const { id, type, tabActive } = query;

  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<{ page: number; limit: number; selected: string[] }>(
    defaultFilters,
  );
  const [feedData, setFeedData] = useState<IFeedData>(defaultFeedData);
  const temporaryFeedDataRef = useRef<IFeedItem[]>([]);

  const feedRecordsLength = feedData.items.length;
  const { icon, button } = useSelector((state:any) => state.theme);
  const isEmpty = !feedRecordsLength;

  const selected = useMemo(() => {
    if (!filters.selected.length && type) {
      if (_.isArray(type)) {
        return type;
      }
      return [type];
    }
    return filters.selected;
  }, [filters.selected, type]);

  const onCachingQueryString = (params: any) => {
    replace(
      {
        pathname: `/artist/${id}`,
        query: params.type ? { tabActive, ...params } : { tabActive },
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  const onSelect = (value: string) => {
    let nextSelected: string[] = [...selected];
    if (nextSelected.includes(value)) {
      nextSelected = nextSelected.filter((e: string) => e !== value);
    } else {
      nextSelected = [...nextSelected, value];
    }
    onCachingQueryString({ type: nextSelected });
    setFilters({
      ...filters,
      page: 1,
      selected: nextSelected,
    });
  };

  const getArtistFeed = async (params: { selected: any; page: any; limit: any }) => {
    try {
      /**
       * * Avoid unnecessary subscription
       */
      if (!walletAddress || !params) return;
      let filterTypes = !params.selected.length
        ? defaultFilterLabels.toString()
        : params.selected.toString();

      setLoading(true);

      const [response, error] = await artistService.getArtistFeed({
        address: walletAddress,
        params: {
          page: params.page,
          limit: params.limit,
          types: filterTypes,
        },
      });
      if (error) throw error;
      if (response) {
        setLoading(false);
        const items = get(response, 'data.items', []);
        const meta = get(response, 'data.meta');

        const nextItems =
          params.page === 1 ? items : temporaryFeedDataRef.current.concat([...items]);
        temporaryFeedDataRef.current = nextItems;

        setFeedData({
          items: nextItems,
          meta,
        });
      }
    } catch (error) {
      setLoading(false);
      dispatch(toastError('Something went wrong'));
    }
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
  const handleLoadMore = () => {
    setFilters({
      ...filters,
      page: filters.page + 1,
    });
  };

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

  const renderContent = () => {
    if (isEmpty) {
      /**
       * * Render empty content here
       */
      return (
        <div className="py-4">
          <Stack spacing={2} alignItems="center" justifyContent="center" className="pt-6 mb-14">
            <img src="/images/empty_content.png" />
            <div className="text--total--price text-third-gray">No results</div>
          </Stack>
        </div>
      );
    }

    return (
      <InfiniteScroll
        dataLength={feedData.items?.length}
        next={handleLoadMore}
        hasMore={hasMore}
        loader={loader()}
        className="!overflow-hidden"
      >
        <div className="relative flex flex-col items-center gap-y-6">
          {feedData.items.map((feed, index) => (
            <ItemFeed data={{ ...feed, title: feed.nft?.title }} key={feed.id} />
          ))}
        </div>
      </InfiniteScroll>
    );
  };

  useEffect(() => {
    if (walletAddress) {
      /**
       * * If walletAddress is valid -> call api
       */
      console.log(selected);
      getArtistFeed({ ...filters, selected });
    }
  }, [selected, filters.page, walletAddress]);

  useEffect(() => {
    /**
     * * Clean up previous data when walletAddress change
     */
    if (walletAddress) {
      setFilters(defaultFilters);
      temporaryFeedDataRef.current = [];
    }
    return () => {

      /**
       * * Remove caching data when component unmount avoid duplicate keys
       */
      temporaryFeedDataRef.current = [];
    };
  }, [walletAddress]);

  const hasMore = filters && (filters.page as number) < feedData.meta.totalPages;

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
        {/* {hasMore && (
          <div className="sm:w-full md:w-[750px]">
            <FilledButton
              text="View More"
              loading={loading}
              customClass="font-bold"
              onClick={handleLoadMore}
            />
          </div>
        )} */}
      </div>
    </section>
  );
}
