import ModalCommon from 'components/common/modal';
import { useEffect, useState } from 'react';
import ItemFollowingModal from './ItemFollowingModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgressIndicator from 'components/common/progress-indicator';
import followService from 'service/followService';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isEmpty, uniqBy } from 'lodash';
import ImageBase from 'components/common/ImageBase';

const PAGE_SIZE = 10;
const FIRST_PAGE = 1;

const ModalListFollowing = (props: any) => {
  const router = useRouter();
  const artistAddress = router.query.id as string;

  const { walletAddress } = useSelector((state) => (state as any)?.user?.data || '');

  const [data, setData] = useState<Array<any>>([]);
  const [currentPage, setCurrentPage] = useState<number>(FIRST_PAGE);
  const [totalItems, setTotalItems] = useState<number>(0);

  const [isCalled, setIsCalled] = useState<boolean>(false);

  useEffect(() => {
    fetchMoreData();
  }, []);

  const fetchMoreData = async () => {
    if (!artistAddress || data?.length > totalItems) return;
    const [res, error] = await followService.getListFollower(
      artistAddress,
      walletAddress,
      currentPage,
      PAGE_SIZE,
    );
    if (!isCalled) {
      setIsCalled(true);
    }
    if (error) return;
    setCurrentPage(currentPage + 1);
    const newData = uniqBy([...data, ...res?.items], 'followerId');
    setData(newData);
    setTotalItems(res?.meta?.totalItem);
  };

  const updateFollower = async () => {
    if (!artistAddress || data?.length > totalItems) return;

    const [res, error] = await followService.getListFollower(
      artistAddress,
      walletAddress,
      FIRST_PAGE,
      data.length,
    );

    if (error) return;
    setData(res?.items);
  };

  return (
    <ModalCommon {...props}>
      <div className="mt-6 w-full">
        <InfiniteScroll
          dataLength={data.length}
          next={fetchMoreData}
          hasMore={data?.length < totalItems}
          height="60vh"
          loader={
            <div className="flex ">
              <span>Loading </span> &nbsp;
              <CircularProgressIndicator size={20} />
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          {!isEmpty(data)
            ? data.map((elm: any) => (
                <ItemFollowingModal
                  key={`${elm?.followerId}_${elm?.followers}`}
                  follower={elm || {}}
                  updateFollower={updateFollower}
                  getUserInfo={props?.getUserInfo}
                />
              ))
            : isCalled && (
                <div className="w-[200px] m-auto mt-[30px]">
                  <ImageBase alt="No Data" errorImg="NoData" />
                </div>
              )}
        </InfiniteScroll>
      </div>
    </ModalCommon>
  );
};

export default ModalListFollowing;
