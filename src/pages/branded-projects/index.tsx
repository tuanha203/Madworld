import React, { useCallback, useEffect, useState } from 'react';
import BannerBrandedProjects from 'components/templates/branded-projects';
import { DropListing } from 'components/templates/leader-board';
import Stack from '@mui/material/Stack';
import { LeaderBoardList } from 'components/common/leader-board';
import { FilledButton } from 'components/common';
import { ILeaderBoardColumn } from 'components/common/leader-board/List';
import artistService from 'service/artist';
import { ISelect } from 'components/templates/assets/charts/price-history';
import SelectBasic from 'components/common/select-type/SelectBasic';
import { IconMadOutlined } from 'components/common/iconography/IconBundle';
import { useRouter } from 'next/router';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import { getValue, getVolumeChangedValue } from 'utils/utils-leaderboard';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { formatNumber } from 'utils/formatNumber';

export interface LeaderBoardRecord {
  walletAddress: string;
  id: number;
  nftCount: number;
  avatarImg: null | string;
  username: null | string;
  volumnTraded: string;
  volumnTradedChange: string;
  volumnTradedLastDay: string;
  volumnTradedToday: string;
  thumbnailUrl?: string | null;
}

export const options: Array<ISelect> = [
  { name: 'Today', value: 'TODAY' },
  { name: 'Last 7 days', value: 'LAST7DAYS' },
  { name: 'Last 30 days', value: 'LAST30DAYS' },
];

const BrandedProjects = () => {
  const router = useRouter();
  const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoardRecord[]>([]);
  const [timeSelected, setTimeSelected] = useState<ISelect>(options[1]);
  const [loading, setLoading] = useState(false);

  const COLUMNS: ILeaderBoardColumn<LeaderBoardRecord>[] = [
    {
      name: 'brand',
      label: 'Hot Brands',
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
            <Stack className='flex items-center' spacing={1} direction="row" alignItems="center">
              <IconMadOutlined size={'w-4 xl:w-6 h-4 xl:h-6 flex items-center'} />
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
              text="View Brand"
              customClass="font-bold mx-[auto] !bg-primary-dark-2"
              onClick={() => {
                router.push(`/artist/${record.walletAddress}`);
              }}
            />
          );
        },
      },
    },
  ];

  const getLeaderBoard = useCallback(async () => {
    try {
      setLoading(true);
      const [response, error] = await artistService.getLeaderBoardBrandedProject(
        timeSelected.value,
      );
      if (error) {
        throw error;
      }
      setLeaderBoardData(response);
      setLoading(false);
    } catch (error) {
      throw error;
    }
  }, [timeSelected]);

  useEffect(() => {
    getLeaderBoard();
  }, [timeSelected]);

  return (
    <div>
      <BannerBrandedProjects className="py-[36px] pt-0" />
      <DropListing />
      <div className="bg-background-dark-800 py-14 layout mx-auto">
        <div className=" mx-3">
          <Stack direction="row" justifyContent={'space-between'} className="mb-14">
            <div className="xl:text--display-medium text--headline-medium">Leaderboard</div>
            <div>
              <SelectBasic
                key="time"
                selected={timeSelected}
                setSelected={setTimeSelected}
                nameTypes={options}
                title=""
              />
            </div>
          </Stack>
          <LeaderBoardList
            data={leaderBoardData}
            columns={COLUMNS}
            hasMore={true}
            keyProperty="id"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandedProjects;
