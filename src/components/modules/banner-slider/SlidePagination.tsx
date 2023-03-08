import Stack from '@mui/material/Stack';
import { FC, useEffect, useState } from 'react';

interface ISlidePaginationProps {
  total: number;
  limit: number;
  currentPage: number;
  onPaginationChange: (page: number) => void;
}

const SlidePagination: FC<ISlidePaginationProps> = (props) => {
  const { total, limit, onPaginationChange, currentPage } = props;

  const [page, setPage] = useState<number>(1);

  const totalPages = Math.ceil(total / limit);

  const isSelectedPage = (selectedPage: number) => {
    return selectedPage === page ? 'bg-primary-dark-2' : 'bg-white';
  };

  const handleClick = (selectedPage: number) => {
    if (selectedPage !== page) {
      setPage(selectedPage);
      onPaginationChange(selectedPage);
    }
  };

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  if (totalPages <= 1) return null;

  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      {[...new Array(totalPages)].map((_, index) => (
        <div
          key={totalPages + index}
          className={`cursor-pointer w-[106px] h-[8px] rounded-lg ${isSelectedPage(index + 1)}`}
          onClick={() => handleClick(index + 1)}
        />
      ))}
    </Stack>
  );
};

export default SlidePagination;
