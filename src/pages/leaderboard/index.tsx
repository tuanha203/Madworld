import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import get from 'lodash/get';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';
import { LeaderBoardList } from 'components/common/leader-board';
import { ILeaderBoardColumn } from 'components/common/leader-board/List';
import { IconMadOutlined } from 'components/common/iconography/IconBundle';
import SelectBasic from 'components/common/select-type/SelectBasic';
import { FilledButton } from 'components/common';
import { BannerLeaderBoard } from 'components/templates/leader-board';
import leaderBoardService, {
  LeaderBoardCategory,
} from 'service/leaderBoardService';
import { toastError } from 'store/actions/toast';
import { formatNumber, roundNumber } from 'utils/formatNumber';
import { TRENDING_TYPE, WINDOW_MODE } from 'constants/app';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import { getValue, getVolumeChangedValue } from 'utils/utils-leaderboard';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
interface LeaderBoardRecord {
  walletAddress?: string;
  address: string;
  id: number;
  nftCount: number;
  thumbnailUrl: null | string;
  title: null | string;
  volumnTraded: string;
  volumnTradedChange: string;
  volumnTradedLastDay: string;
  volumnTradedToday: string;
}

const BOARD_OPTIONS = [
  { name: 'Hot Collections', value: TRENDING_TYPE.COLLECTION },
  { name: 'Hot Artist', value: TRENDING_TYPE.ARTIST },
];

const SORT_OPTIONS = [
  { name: 'Today', value: 'TODAY' },
  { name: 'Last 7 Days', value: 'LAST7DAYS' },
  { name: 'Last 30 Days', value: 'LAST30DAYS' },
];

const defaultFilters = {
  sortType: SORT_OPTIONS[0],
  boardCategory: BOARD_OPTIONS[0],
};

const LeaderBoardPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const windowMode = useDetectWindowMode();
  const isMobile = [WINDOW_MODE['SM'], WINDOW_MODE['MD'], WINDOW_MODE['LG']].includes(windowMode);

  const [filters, setFilters] = useState<any>();

  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoardRecord[]>([]);

  const [loading, setLoading] = useState(false);

  const COLLECTION_COLUMNS: ILeaderBoardColumn<LeaderBoardRecord>[] = [
    {
      name: 'collection',
      label: 'Hot Collections',
      className: 'w-[288px]',
      type: 'avatar',
      options: {
        avatarProps: {
          variant: 'circular',
          label: 'title',
          url: 'thumbnailUrl',
          address: 'address',
          path: '/collection',
        },
      },
    },
    {
      name: 'nftCount',
      label: 'Assets',
      options: {
        onRender: (record) => {
          if (record.nftCount <= 0) return 0;
          return formatNumber(record.nftCount);
        },
      },
    },
    {
      name: 'volumnTraded',
      label: 'Volume',
      options: {
        onRender: (record) => {
          return (
            <Stack spacing={1} direction="row" alignItems="center">
              <IconMadOutlined size={'w-[32px] w-6 h-[100%]'} />
              <ContentTooltip title={record.volumnTraded} arrow>
                <div>{getValue(record.volumnTraded)}</div>
              </ContentTooltip>
            </Stack>
          );
        },
      },
    },
    {
      name: 'volumnTradedChange',
      label: '24h %',
      options: {
        maxWidth: 'none',
        onRender: (record) => getVolumeChangedValue(record.volumnTradedChange),
      },
    },
    {
      name: '',
      label: '',
      options: {
        onRender: (record) => {
          return (
            <FilledButton
              text="View Collection"
              customClass="font-bold mx-[auto]"
              onClick={() => {
                router.push(`/collection/${record.address}`);
              }}
            />
          );
        },
      },
    },
  ];

  const ARTIST_COLUMNS: ILeaderBoardColumn<LeaderBoardRecord>[] = [
    {
      name: 'collection',
      label: 'Hot Artist',
      className: 'w-[288px]',
      type: 'avatar',
      options: {
        avatarProps: {
          variant: 'circular',
          label: 'username',
          url: 'avatarImg',
          address: 'walletAddress',
          path: '/artist',
        },
      },
    },
    {
      name: 'nftCount',
      label: 'Assets',
      options: {
        onRender: (record) => {
          if (record.nftCount <= 0) return 0;
          return formatNumber(record.nftCount);
        },
      },
    },
    {
      name: 'volumnTraded',
      label: 'Volume',
      options: {
        onRender: (record) => {
          return (
            <Stack spacing={1} direction="row" alignItems="center">
              <IconMadOutlined size={'w-[32px] w-6 h-[100%]'} />
              <ContentTooltip title={record.volumnTraded} arrow>
                <div>{getValue(record.volumnTraded)}</div>
              </ContentTooltip>
            </Stack>
          );
        },
      },
    },
    {
      name: 'volumnTradedChange',
      label: '24h %',
      options: {
        maxWidth: 'none',
        onRender: (record) => getVolumeChangedValue(record.volumnTradedChange),
      },
    },
    {
      name: '',
      label: '',
      options: {
        onRender: (record) => {
          return (
            <FilledButton
              text="View Artist"
              customClass="font-bold mx-[auto]"
              onClick={() => {
                router.push(`/artist/${record.walletAddress}`);
              }}
            />
          );
        },
      },
    },
  ];

  const COLUMNS: ILeaderBoardColumn<LeaderBoardRecord>[] =
    get(filters, 'boardCategory.value') === TRENDING_TYPE.COLLECTION
      ? COLLECTION_COLUMNS
      : ARTIST_COLUMNS;

  const handleSelectBoardCategory = (value: any) => {
    setFilters({ ...filters, boardCategory: value });
  };

  const handleSelectSortType = (value: any) => {
    setFilters({ ...filters, sortType: value });
  };

  const getLeaderBoardData = useCallback(
    async (params?: {
      boardCategory: { name: string; value: string };
      sortType: { name: string; value: string };
    }) => {
      if (!params) return;
      let type = params.sortType.value as LeaderBoardCategory;
      setLoading(true);
      setLeaderBoardData([]);
      const [response, error] =
        params.boardCategory.value === TRENDING_TYPE.COLLECTION
          ? await leaderBoardService.getLeaderBoardCollection({
              type,
            })
          : await leaderBoardService.getLeaderBoardAccount({
              type,
            });

      if (error) {
        router.push('/404');
        dispatch(toastError('Something went wrong'));
        return;
      }
      setLeaderBoardData(response);
      setLoading(false);
    },
    [filters],
  );

  useEffect(() => {
    getLeaderBoardData(filters);
  }, [getLeaderBoardData]);

  useEffect(() => {
    if (filters) {
      router.push(
        {
          query: {
            type: get(filters, 'boardCategory.value'),
            sort: get(filters, 'sortType.value'),
          },
        },
        undefined,
        {
          shallow: true,
        },
      );
    }
  }, [filters]);

  useEffect(() => {
    if (!filters && router.isReady) {
      if (router.query.type && router.query.sort) {
        setFilters({
          sortType: SORT_OPTIONS.find((o) => o.value === router.query.sort),
          boardCategory: BOARD_OPTIONS.find((o) => o.value === router.query.type),
        });
        return;
      }
      setFilters(defaultFilters);
    }
  }, [filters, router.isReady]);

  return (
    <div>
      <BannerLeaderBoard />
      {filters && (
        <div className="bg-background-dark-800 py-14">
          <div className="layout mx-auto ">
            <Stack direction="row" justifyContent={ isMobile ? 'flex-start' : 'space-between'} display={isMobile ? 'block' : 'flex'} className="mb-14">
              <div className="text--display-medium">Leaderboard</div>
              <Stack direction="row" spacing={2} className="sm:ml-1">
                <SelectBasic
                  selected={filters.boardCategory}
                  setSelected={handleSelectBoardCategory}
                  nameTypes={BOARD_OPTIONS}
                  title="Board"
                />
                <SelectBasic
                  selected={filters.sortType}
                  setSelected={handleSelectSortType}
                  nameTypes={SORT_OPTIONS}
                  title="Sort By"
                />
              </Stack>
            </Stack>
            <LeaderBoardList
              data={leaderBoardData}
              columns={COLUMNS}
              keyProperty="id"
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderBoardPage;
