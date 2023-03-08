import { ReactNode, useEffect, useRef, useState } from 'react';

interface InfiniteListProps {
  children: ReactNode;
  next: () => void;
  scrollable?: boolean;
  hasMore?: boolean;
  dataLength?: number;
  loader?: ReactNode;
}

export default function InfiniteList({
  hasMore = true,
  children,
  dataLength,
  loader,
  next,
}: InfiniteListProps) {
  const list = useRef<any>();
  const [loading, setLoading] = useState<any>(false);
  let timer: any = null;

  const onLoad = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      next();
    }, 1000);
  };

  useEffect(() => {
    if (dataLength) {
      window.addEventListener('scroll', () => {
        if (
          !loading &&
          window.scrollY + window.innerHeight >
            list.current?.clientHeight + list.current?.offsetTop + 104
        ) {
          onLoad();
          setLoading(true);
        }
      });
      return () => {
        window.removeEventListener('scroll', () => {});
      };
    }
  }, [dataLength]);

  return (
    <>
      <div ref={list}>{children}</div>
      {hasMore && loading && loader}
    </>
  );
}
