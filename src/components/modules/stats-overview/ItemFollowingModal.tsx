import ImageBase from 'components/common/ImageBase';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { debounce, get } from 'lodash';
import CircularProgressIndicator from 'components/common/progress-indicator';
import { abbreviateNumber, shortenNameNoti } from 'utils/func';
import followService from 'service/followService';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import useConnectWallet from 'hooks/useConnectWallet';
import { delay } from 'utils/utils';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';

const ItemFollowingModal = ({ follower, updateFollower, getUserInfo }: any) => {
  const { followers, username, walletAddress, isFollow, avatarImg = '' } = follower || {};
  const router = useRouter();
  const artistAddress = router.query.id as string;
  const { openModalConnectWallet } = useConnectWallet();

  const { walletAddress: userLogin } = useSelector((state) => (state as any)?.user?.data || '');

  const [loading, setLoading] = useState(false);
  const [isHoverFollowingBtn, setIsHoverFollowingBtn] = useState(false);

  const handleChangeFollow = debounce(async () => {
    if(!loading){
      if (!userLogin) {
        openModalConnectWallet();
        return;
      }
      setLoading(true);
      const [res, err] = await followService.toggleFollow(walletAddress);
      await delay(300);
      const status = get(res, 'data', '');
      setLoading(false);
      if (err) return;
      updateFollower();
      if (typeof getUserInfo === 'function') {
        getUserInfo();
      }
    }
  }, 200);

  const onMouseEnter = useCallback(() => {
    setIsHoverFollowingBtn(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsHoverFollowingBtn(false);
  }, []);

  const renderButton = () => {
    if (userLogin?.toLowerCase() === walletAddress?.toLowerCase()) return <div />;
    if (!isFollow) return (
      <div className="flex items-center">
        <ButtonFollow />
        {
          loading && (
            <CircularProgressIndicator size={24} />
          )
        }
      </div>
    );
    if (isHoverFollowingBtn)
      return (
        <div className="flex items-center" onMouseLeave={onMouseLeave}>
          <ButtonUnFollow />
          {
            loading && (
              <CircularProgressIndicator size={24} />
            )
          }
        </div>
      );
    return (
      <div className="flex items-center" onMouseEnter={onMouseEnter}>
        <ButtonFollowing />
        {
          loading && (
            <CircularProgressIndicator size={24} />
          )
        }
      </div>
    );
  };

  return (
    <div className="mb-6 px-6 py-4 text-light-on-primary tracking-[0.25px] bg-background-asset-detail rounded-[28px]">
      <div className="flex justify-between">
        <div className="flex bg-red">
          <Link href={`/artist/${walletAddress}`}>
            <ImageBase
              className="mr-3"
              type="HtmlImage"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                cursor: 'pointer',
                objectFit: 'cover',
              }}
              errorImg="Avatar"
              url={avatarImg}
            />
          </Link>
          <div>
            <ContentTooltip title={`${username || walletAddress}`}>
              <div>
                <Link href={`/artist/${walletAddress}`}>
                  <div className="text-base font-bold cursor-pointer">
                    {(username && shortenNameNoti(username, 15)) ||
                      walletAddress?.slice(0, 6) ||
                      'Unknown'}
                  </div>
                </Link>
              </div>
            </ContentTooltip>
            <div className="opacity-60 text-xs">
              {abbreviateNumber(followers)} {followers > 1 ? 'followers' : 'follower'}
            </div>
          </div>
        </div>
        <div className="flex items-center" onClick={handleChangeFollow}>
          {renderButton()}
        </div>
      </div>
    </div>
  );
};

const ButtonFollow = () => (
  <div className="w-[137px] h-[40px] bg-primary-dark px-6 py-2.5 rounded-[100px] cursor-pointer hover:opacity-80 flex justify-center items-center">
    <AddIcon style={{ color: '#fff', width: '20px' }} />
    <span className="ml-2 text-sm font-bold">Follow</span>
  </div>
);

const ButtonFollowing = () => (
  <div className="w-[137px] h-[40px] bg-primary-dark px-6 py-2.5 rounded-[100px] cursor-pointer hover:opacity-80 flex justify-center items-center">
    <CheckIcon style={{ color: '#fff', width: '16px' }} />
    <span className="ml-2 text-sm font-bold">Following</span>
  </div>
);
const ButtonUnFollow = () => (
  <div className="w-[137px] h-[40px] border border-secondary-60 px-6 py-2.5 rounded-[100px] cursor-pointer hover:opacity-80 flex justify-center items-center">
    <span className="ml-2 text-secondary-60 font-bold">Unfollow</span>
  </div>
);

export default ItemFollowingModal;
