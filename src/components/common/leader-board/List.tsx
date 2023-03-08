import { ReactNode, useEffect, useState } from 'react';

import get from 'lodash/get';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { FilledButton } from '../buttons';

import LeaderBoardItem from './Item';
import { CircularProgress, Skeleton } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

export interface ILeaderBoardColumn<T extends unknown> {
  label: string;
  name: string;
  className?: string;
  type?: 'avatar';
  options?: {
    ellipsis?: boolean;
    avatarProps?: {
      variant?: 'square' | 'circular' | 'rounded';
      label: string;
      url: string;
      address?: string;
      path?: string;
    };
    maxWidth?: string;
    cellClassName?: string;
    onRender?: (record: T) => ReactNode;
  };
}

interface ILeaderBoardListProps<T> {
  data: T[];
  columns: ILeaderBoardColumn<T>[];
  keyProperty: string;
  renderItems?: (item: T) => ReactNode;
  itemActions?: (item: T) => ReactNode;
  hasMore?: boolean;
  onLoadMore?: () => ReactNode;
  loading?: boolean;
}

const LeaderBoardList = <T extends unknown>(props: ILeaderBoardListProps<T>) => {
  const initPage = 0
  const rowsPerPage = 10
  const { data = [], columns, keyProperty = 'id', renderItems, itemActions, loading } = props;
  const [page, setPage] = useState(initPage);
  const [showingList, setShowingList] = useState<any[]>(data.slice(0, initPage * rowsPerPage + rowsPerPage));

  const totalPages = Math.floor(data.length / rowsPerPage);

  const hasMore = page < totalPages && (page + 1) * rowsPerPage < data?.length;

  const isEmpty = !data.length;

  const columnLength = columns.length;

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    setShowingList(data.slice(0, page * rowsPerPage + rowsPerPage))
  }, [page, data]);

  const renderColumns = () => {
    return (
        <ListItem className="xl:flex hidden" sx={{ px: 3, py: 0, pl: 10, pr: 4 }}>
          <ListItemText
            sx={{
              flex: 'none',
              width: '30%',
              '.MuiTypography-root': {
                fontSize: '22px',
              },
            }}
            primary={columns[0].label}
            primaryTypographyProps={{
              className: `text--total--price`,
            }}
          />
          {columns?.slice(1)?.map((c, index) => (
            <ListItemText
              sx={{
                flex: 'none',
                width: '18%',
                '.MuiTypography-root': {
                  fontSize: '22px',
                },
              }}
              key={`${c.name}-${index}`}
              className={c.className || ''}
              primary={c.label}
              primaryTypographyProps={{
                className: `text--total--price`,
              }}
            />
          ))}
        </ListItem>
    );
  };

  const loader = () => {
    return (
      <div className='mt-8 flex flex-row-reverse'>
        <Skeleton
          variant="rectangular"
          width={'95%'}
          height={120}
          className="bg-[#373d4a] rounded-md"
          animation="wave"
        />
      </div>
    )
  };

  const renderList = () => {
    if (loading) {
      return (
        <div className="flex justify-center mt-5">
          <CircularProgress
            sx={{ svg: { margin: '0px !important' }, gridColumn: '1/4', margin: 'auto' }}
            color="inherit"
            size={40}
            />
        </div>
      );
    }
    if (isEmpty) {
      /**
       * * Render empty content here
       */
      return (
        <div className="py-4">
          <Stack spacing={2} alignItems="center" justifyContent="center" className="pt-6 mb-14">
            <img src="/images/empty_content.png" />
            <div className="text--total--price text-white">No results</div>
          </Stack>
        </div>
      );
    }
    return (
      <InfiniteScroll
        dataLength={showingList?.length}
        next={handleLoadMore}
        hasMore={hasMore}
        loader={loader()}
        className="!overflow-hidden"
      >
        <Stack spacing={4}>
          {showingList.map((d, index) => {
            if (renderItems) return renderItems(d);
            return (
              <LeaderBoardItem
                key={`${get(d, keyProperty)}-${index}`}
                columns={columns}
                index={index}
                record={d}
                actions={itemActions && itemActions(d)}
                />
            );
          })}
        </Stack>
      </InfiniteScroll>
    );
  };

  if (!columnLength) {
    return <div>Please config columns</div>;
  }

  return (
    <div className="mx-auto mb-10">
      <Stack spacing={4}>
        {renderColumns()}
        {renderList()}
      </Stack>
      
      {/* {hasMore && (
        <div className="pl-[56px] mt-14">
          <FilledButton text="View More" customClass="font-bold" onClick={handleLoadMore} />
        </div>
      )} */}
    </div>
  );
};

export default LeaderBoardList;
