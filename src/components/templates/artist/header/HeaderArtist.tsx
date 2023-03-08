import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import { Button, Menu, MenuItem } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { TonalButton } from 'components/common';
import {
  DiscordIconCustomSVG,
  TelegramIconCustomSVG,
  TwitterIconCustomSVG,
} from 'components/common/iconography/iconsComponentSVG';
import ImageBase from 'components/common/ImageBase';
import { ImageProfile } from 'components/common/modal';
import CircularProgressIndicator from 'components/common/progress-indicator';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import ArtistOverviewSmaller from 'components/modules/stats-overview/ArtistOverviewSmaller';
import { ARTIST_TAB, TYPE_LIKES, URL_SOCIAL, WINDOW_MODE } from 'constants/app';
import useConnectWallet from 'hooks/useConnectWallet';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import useUpdateEffect from 'hooks/useUpdateEffect';
import _, { get } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import followService from 'service/followService';
import { toastSuccess } from 'store/actions/toast';
import { toastMsgActons } from 'store/constants/toastMsg';
import { userActions } from 'store/constants/user';
import { IModalState } from 'store/reducers/modal';
import { IUserInitState, IUserProfile } from 'store/reducers/user';
import { abbreviateNumber, formatPricePercent } from 'utils/func';
import shrinkAddress from 'utils/shrinkAddress';
import { STORAGE_KEYS } from 'utils/storage';
import { delay } from 'utils/utils';
import userService from '../../../../service/userService';
import { RootState } from '../../../../store/reducers';
import { InputChip } from '../../../common/chips/InputChip';
import { IconEth, IconShare, IconVerified } from '../../../common/iconography/IconBundle';
import { IconEthSVG } from '../../../common/iconography/iconsComponentSVG';
import ArtistCollectionCard from '../../../modules/cards/ArtistCollectionCard';
import DialogEditArtist from '../edit-artist';

interface IHeaderArtistProps {
  tabSelected: ARTIST_TAB | null;
  handleClickTab: any;
  id: any;
  isAvatarClickEdit: boolean;
}

export default function HeaderArtist({
  isAvatarClickEdit,
  tabSelected,
  handleClickTab,
  id,
}: IHeaderArtistProps) {
  const dispatch = useDispatch();
  const windowMode = useDetectWindowMode();
  const [userInfo, setUserInfo] = useState<IUserProfile>();
  const [openEditArtist, setOpenEditArtist] = useState(false);
  const { data: DataOwner } = useSelector((state: RootState) => state.user);
  const [lessDes, setLessDes] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [lazyLoad, setLazyLoad] = useState(false);
  const [following, setFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data || '');
  const [shareEl, setShareEl] = useState(null);
  const [openCoverImg, setOpenCoverImg] = useState<boolean>(false);
  const isShareOpen = Boolean(shareEl);
  const [openViewCoverBanner, setOpenViewCoverBanner] = useState<boolean>(false);
  const { text, icon, button } = useSelector((state: any) => state.theme);

  const handleOpenViewCoverBanner = () => {
    setOpenViewCoverBanner(true);
  };
  const handleCloseViewCoverBanner = () => {
    setOpenViewCoverBanner(false);
  };

  const { toggleModalConnectWallet, stepConnectWallet } = useSelector(
    (state: { modal: IModalState }) => state.modal,
  );

  const storedWalletAddress = useSelector(
    (state: { user: IUserInitState }) => state.user?.data?.walletAddress,
  );

  const { openModalConnectWallet } = useConnectWallet();

  const getUserInfo = async () => {
    setLazyLoad(true);
    const walletAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS) as any;
    let params = {} as any;
    if (walletAddress) {
      params.address = id;
      params.walletAddress = walletAddress;
    } else {
      params.address = id;
    }

    const [dataUserInfo]: Array<IUserProfile> = await userService.getPublicUserInfo(params);

    if (dataUserInfo) {
      setUserInfo(dataUserInfo);
    }
    setLazyLoad(false);
    return dataUserInfo;
  };

  let shareLink = '';
  if (typeof window !== 'undefined') {
    shareLink = window?.location?.href || '';
  }
  const shareOpen = (event: any) => {
    setShareEl(event.currentTarget);
  };

  const shareClose = () => {
    setShareEl(null);
  };

  const clickCopy = () => {
    setShareEl(null);
    dispatch(toastSuccess('Link copied!'));
    setTimeout(() => {
      dispatch({ type: toastMsgActons.CLOSE });
    }, 3000);
  };

  const onLoadDataEditSuccess = async () => {
    const dataUserInfo = await getUserInfo();

    dispatch({
      type: userActions.USER_GET_PROFILE_SUCCESS,
      payload: dataUserInfo,
    });
  };

  const handleOpenSocialLink = (event: any, link: string | undefined) => {
    if (!link) event.preventDefault();
  };

  const checkFollow = async () => {
    const [status, err] = await followService.checkFollow(id);
    if (err) return;
    setFollowing(status);
  };

  const toggleFollow = async () => {
    if (!walletAddress) {
      openModalConnectWallet();
      return;
    }
    setLoading(true);
    const [res] = await followService.toggleFollow(id);
    await delay(300);
    setLoading(false);
    await getUserInfo();
    setFollowing(get(res, 'data', '') === 'followed');
  };

  useEffect(() => {
    if (id) {
      getUserInfo();
    }
    if (walletAddress && id) {
      checkFollow();
    }
  }, [id, walletAddress]);

  useUpdateEffect(() => {
    getUserInfo();
  }, [DataOwner.walletAddress]);

  async function handleCopy() {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 3000);
  }

  useEffect(() => {
    if (toggleModalConnectWallet) {
      setOpenEditArtist(false);
    }
  }, [toggleModalConnectWallet]);

  useEffect(() => {
    if (isAvatarClickEdit) {
      setOpenEditArtist(true);
    } else {
      setOpenEditArtist(false);
    }
  }, [isAvatarClickEdit]);

  useEffect(() => {
    if (!storedWalletAddress && openEditArtist) {
      onToggleEdit(false);
    }
  }, [storedWalletAddress, openEditArtist]);

  const onToggleEdit = (value: boolean) => {
    setOpenEditArtist(value);
    router.push({
      pathname: `/artist/${id}`,
      query: value ? { edit: value } : {},
    });
  };
  const isMobileInSmMd = [WINDOW_MODE['SM'], WINDOW_MODE['MD'], WINDOW_MODE['LG']].includes(
    windowMode,
  );
  const isArtistOwner = id === DataOwner.walletAddress;
  return (
    <div className="relative bg-[#252D3A] xl:min-h-[716px] sm:min-h-auto">
      <div className="layout mx-auto xl:grid-cols-10 xl:grid-rows-3 xl:grid ">
        <div className="col-start-1 col-end-4 row-start-1 row-end-4 xl:pr-7 sm:pt-16 xl:pb-16 sm:pb-0 relative">
          {isMobileInSmMd && (
            <div className="absolute h-[92px] w-full top-0">
              <div className="group flex-grow-[1] h-full banner">
                <ImageBase
                  className={`flex-grow-[1] h-[92px] object-cover w-full ${
                    !userInfo?.artist?.coverImg && 'img-contain'
                  }`}
                  type="HtmlImage"
                  url={userInfo?.artist?.coverImg}
                  alt=""
                  onClick={handleOpenViewCoverBanner}
                />
                <ImageProfile
                  open={openViewCoverBanner}
                  imageUrl={userInfo?.artist?.coverImg}
                  onTriggerClose={handleCloseViewCoverBanner}
                />
              </div>
            </div>
          )}
          <div className="xl:w-[265px] sm:w-full relative xl:px-0 sm:px-4">
            {isMobileInSmMd ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="relative group w-[86px] h-[86px] flex bg-[#BBA2EA]"
                      style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0 100%, 0 25%)', ...button?.default }}
                    >
                      <ArtistCollectionCard
                        isMobile={isMobileInSmMd}
                        img={userInfo?.artist?.avatarImg}
                        className={'m-auto'}
                        height={80}
                        width={80}
                      />
                    </div>
                    <div className={`border-r border-primary-99 w-fit pr-4 mt-3 ml-4`}>
                      <Tooltip title={userInfo?.artist?.username || id}>
                        <h2 className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[70px] text-lg font-bold font-Spartan">
                          {userInfo?.artist?.username || id?.slice(0, 6)}
                        </h2>
                      </Tooltip>
                    </div>
                    <div className={`ml-4 mt-3`}>
                      {userInfo?.artist?.isVerify && (
                        <div className="mr-4 w-[22px] h-[22px] flex items-center">
                          <IconVerified style={icon} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div>
                      {isArtistOwner && (
                        <InputChip
                          label={'Edit'}
                          onClick={() => onToggleEdit(true)}
                          color={'dark onSurface'}
                          icon={<EditIcon className="text-red" style={icon || { color: '#F4B1A3' }} />}
                        />
                      )}
                      {!isArtistOwner &&
                        (loading ? (
                          <div>
                            <CircularProgressIndicator size={24} />
                          </div>
                        ) : (
                          <InputChip
                            onClick={toggleFollow}
                            label={following ? 'Following' : 'Follow'}
                            color={'dark onSurface'}
                            icon={
                              following ? (
                                <DoneIcon
                                  className="text-dark-on-surface"
                                  style={icon || { color: '#F4B1A3' }}
                                />
                              ) : (
                                <AddIcon
                                  className="text-dark-on-surface"
                                  style={icon || { color: '#F4B1A3' }}
                                />
                              )
                            }
                          />
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-5 text-xs">
                  <div className="flex items-center">
                    <IconEthSVG
                      style={{
                        transform: 'scale(0.8)',
                        position: 'relative',
                        bottom: '2px',
                        color: icon?.color,
                      }}
                    />
                    <CopyToClipboard
                      text={userInfo?.artist?.walletAddress as string}
                      onCopy={handleCopy}
                    >
                      <ContentTooltip title={open ? 'Copied' : 'Copy'} className="cursor-pointer">
                        <p className="ml-1 text-xs">
                          {userInfo?.artist?.walletAddress &&
                            shrinkAddress(userInfo?.artist?.walletAddress)}
                        </p>
                      </ContentTooltip>
                    </CopyToClipboard>
                  </div>
                </div>
                {userInfo?.artist?.websiteUrl && (
                  <Link href={userInfo?.artist?.websiteUrl}>
                    <a target="_blank">
                      <p className="mt-10 text-sm text-gray-c4 text-justify w-[310px] xl:w-[360px] text-[#F4B1A3] truncate font-bold">
                        {userInfo?.artist?.websiteUrl}
                      </p>
                    </a>
                  </Link>
                )}
                <p className="mt-10 text-sm text-gray-c4 text-justify w-[310px] xl:w-[360px]">
                  {userInfo?.artist?.description &&
                  lessDes &&
                  userInfo?.artist?.description?.length > 200
                    ? userInfo?.artist?.description?.substring(0, 200) + ' . . .'
                    : userInfo?.artist?.description}
                  {userInfo?.artist?.description && userInfo?.artist?.description?.length > 200 && (
                    <a
                      className="cursor-pointer text-[#f4b1a3]"
                      onClick={() => setLessDes(!lessDes)}
                      style={text}
                    >
                      {!lessDes ? ' Show less' : ' Show more'}
                    </a>
                  )}
                </p>
              </>
            ) : (
              <>
                <div className="relative group">
                  <ArtistCollectionCard img={userInfo?.artist?.avatarImg} height={296} />
                  {isArtistOwner && (
                    <InputChip
                      className="hidden absolute right-3.5 bottom-3.5 group-hover:inline-flex"
                      label={'Edit'}
                      onClick={() => onToggleEdit(true)}
                      color={'dark onSurface'}
                      icon={<EditIcon className="text-red" style={{ color: '#F4B1A3', ...icon }} />}
                    />
                  )}
                </div>
                <div className="flex mt-4 xl:w-[310px] sm:w-full">
                  <div className={`border-r border-primary-99 w-fit pr-4`}>
                    <Tooltip title={userInfo?.artist?.username || id}>
                      <h2 className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[260px] text-4xl font-bold font-Chakra">
                        {userInfo?.artist?.username || id?.slice(0, 6)}
                      </h2>
                    </Tooltip>
                  </div>
                  <div className={`ml-4 flex items-center `}>
                    {userInfo?.artist?.isVerify && (
                      <div className="scale-[2]">
                        <VerifiedOutlinedIcon style={{ ...icon, width: '18px' }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-5 text-xs">
                  <div className="flex items-center">
                    <IconEthSVG
                      style={{
                        transform: 'scale(0.8)',
                        position: 'relative',
                        bottom: '2px',
                        color: icon?.color,
                      }}
                    />
                    <CopyToClipboard
                      text={userInfo?.artist?.walletAddress as string}
                      onCopy={handleCopy}
                    >
                      <ContentTooltip
                        title={open ? 'Copied' : 'Copy'}
                        className="cursor-pointer"
                        arrow
                      >
                        <p className="ml-1 text-xs">
                          {userInfo?.artist?.walletAddress &&
                            shrinkAddress(userInfo?.artist?.walletAddress)}
                        </p>
                      </ContentTooltip>
                    </CopyToClipboard>
                  </div>
                </div>
                {userInfo?.artist?.websiteUrl && (
                  <Link href={userInfo?.artist?.websiteUrl}>
                    <a target="_blank">
                      <p className="mt-10 text-sm text-gray-c4 text-justify w-[310px] xl:w-[360px] text-[#F4B1A3] truncate font-bold">
                        {userInfo?.artist?.websiteUrl}
                      </p>
                    </a>
                  </Link>
                )}
                <p className="mt-10 text-sm text-gray-c4 text-justify w-[310px] xl:w-[360px]">
                  {userInfo?.artist?.description &&
                  lessDes &&
                  userInfo?.artist?.description?.length > 200
                    ? userInfo?.artist?.description?.substring(0, 200) + ' . . .'
                    : userInfo?.artist?.description}
                  {userInfo?.artist?.description && userInfo?.artist?.description?.length > 200 && (
                    <a
                      className="cursor-pointer text-[#f4b1a3]"
                      onClick={() => setLessDes(!lessDes)}
                      style={text}
                    >
                      {!lessDes ? ' Show less' : ' Show more'}
                    </a>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
        {!isMobileInSmMd && (
          <div className="col-start-4 col-end-11 xl:h-[244px]">
            <div className="absolute ml-[-50px] flex xl:h-[244px] xl:w-[992px] ">
              <div
                className="group flex-grow-[1] h-full banner cursor-pointer"
                onClick={() => setOpenCoverImg(true)}
              >
                <ImageBase
                  className={`flex-grow-[1] object-cover w-full h-[244px] ${
                    !userInfo?.artist?.coverImg && 'img-contain'
                  }`}
                  type="HtmlImage"
                  url={userInfo?.artist?.coverImg}
                  alt=""
                />
                {isArtistOwner && (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onToggleEdit(true);
                    }}
                  >
                    <InputChip
                      className="hidden absolute right-[100px] bottom-[30px] group-hover:inline-flex"
                      label={'Change Cover'}
                      onClick={() => {}}
                      color={'dark onSurface'}
                      icon={<EditIcon className="text-red" style={{ color: '#F4B1A3', ...icon }} />}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="xl:ml-[150px] col-start-4 col-end-11 row-start-2 row-end-4">
          <div className="flex h-full">
            <div className="flex-1 flex-grow-[4] xl:py-8 sm:py-6">
              <div className="xl:w-fit xl:mx-0 sm:mx-4 xl:ml-auto sm:m-auto">
                <div className="flex items-center gap-8 xl:justify-start sm:justify-center">
                  <a
                    href={
                      userInfo?.artist?.discordUrl
                        ? URL_SOCIAL.discord + userInfo?.artist?.discordUrl
                        : ''
                    }
                    target="_blank"
                    onClick={(event) => handleOpenSocialLink(event, userInfo?.artist?.discordUrl)}
                  >
                    <InputChip
                      hover={false}
                      icon={
                        <DiscordIconCustomSVG
                          style={{
                            transform: 'scale(0.8)',
                            marginLeft: '4px',
                          }}
                        />
                      }
                      scheme="dark"
                      className="remove-label-basic-chip cursor-pointer"
                    />
                  </a>
                  <a
                    href={
                      userInfo?.artist?.telegramUrl
                        ? URL_SOCIAL.telegram + userInfo?.artist?.telegramUrl
                        : ''
                    }
                    target="_blank"
                    onClick={(event) => handleOpenSocialLink(event, userInfo?.artist?.telegramUrl)}
                  >
                    <InputChip
                      hover={false}
                      icon={<TelegramIconCustomSVG color={icon?.color} />}
                      scheme="dark"
                      className="remove-label-basic-chip cursor-pointer"
                    />
                  </a>
                  <a
                    href={
                      userInfo?.artist?.twitterUrl
                        ? URL_SOCIAL.twitter + userInfo?.artist?.twitterUrl
                        : ''
                    }
                    target="_blank"
                    onClick={(event) => handleOpenSocialLink(event, userInfo?.artist?.twitterUrl)}
                  >
                    <InputChip
                      hover={false}
                      icon={<TwitterIconCustomSVG color={icon?.color} />}
                      scheme="dark"
                      className="remove-label-basic-chip cursor-pointer"
                    />
                  </a>
                  {!isMobileInSmMd && (
                    <>
                      {isArtistOwner && (
                        <InputChip
                          hover={false}
                          label={'Edit Profile'}
                          onClick={() => onToggleEdit(true)}
                          color={'dark onViolet'}
                          icon={
                            <EditIcon
                              className="text-red"
                              style={_.isEmpty(icon) ? { color: '#F4B1A3' } : icon}
                            />
                          }
                        />
                      )}
                      {!isArtistOwner &&
                        (loading ? (
                          <div>
                            <CircularProgressIndicator size={24} />
                          </div>
                        ) : (
                          <InputChip
                            hover={false}
                            onClick={toggleFollow}
                            label={following ? 'Following' : 'Follow'}
                            color={'dark onViolet'}
                            icon={
                              following ? (
                                <DoneIcon
                                  className="text-dark-on-surface"
                                  style={icon || { color: '#F4B1A3' }}
                                />
                              ) : (
                                <AddIcon
                                  className="text-dark-on-surface"
                                  style={icon || { color: '#F4B1A3' }}
                                />
                              )
                            }
                          />
                        ))}
                    </>
                  )}
                  <div className="flex justify-end lg:ml-auto">
                    <Button
                      id="basic-button"
                      aria-controls={isShareOpen ? 'basic-option-share' : undefined}
                      aria-haspopup="true"
                      aria-expanded={isShareOpen ? 'true' : undefined}
                      onClick={shareOpen}
                      className="min-w-0 p-0 lg:ml-auto"
                    >
                      <IconShare style={icon} />
                    </Button>
                    <Menu
                      className="stat-share"
                      id="basic-option-share"
                      anchorEl={shareEl}
                      open={isShareOpen}
                      onClose={shareClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <CopyToClipboard text={shareLink as string} onCopy={clickCopy}>
                        <MenuItem className="flex items-center item-share">
                          <img
                            className="w-[30px] mr-[13px]"
                            src="/social/copy-link-icon.svg"
                            alt=""
                          />
                          Copy Link
                        </MenuItem>
                      </CopyToClipboard>
                      <div>
                        <FacebookShareButton url={shareLink} className="w-[100%]">
                          <MenuItem className="flex items-center item-share" onClick={shareClose}>
                            <img
                              className="w-[30px] mr-[13px]"
                              src="/social/facebook-icon.svg"
                              alt=""
                            />
                            Share on Facebook
                          </MenuItem>
                        </FacebookShareButton>
                      </div>
                      <div>
                        <TwitterShareButton url={shareLink} className="w-[100%]">
                          <MenuItem
                            className="flex items-center item-share stat-share--bottom"
                            onClick={shareClose}
                          >
                            <img
                              className="w-[30px] mr-[13px]"
                              src="/social/twitter-icon.svg"
                              alt=""
                            />
                            Share to Twitter
                          </MenuItem>
                        </TwitterShareButton>
                      </div>
                    </Menu>
                  </div>
                </div>
                <ArtistOverviewSmaller
                  collectionValue={userInfo?.collections && abbreviateNumber(userInfo?.collections)}
                  assetsValue={userInfo?.asset && abbreviateNumber(userInfo?.asset)}
                  ownersValue={userInfo?.owners && abbreviateNumber(userInfo?.owners)}
                  volumeTraded={userInfo?.volumeTraded && abbreviateNumber(userInfo?.volumeTraded)}
                  floorPrice={userInfo?.floorPrice && abbreviateNumber(userInfo?.floorPrice)}
                  highestSale={userInfo?.highestSale && abbreviateNumber(userInfo?.highestSale)}
                  trendingValue={
                    userInfo?.pricePercent && formatPricePercent(userInfo?.pricePercent)
                  }
                  likesValue={userInfo?.likes && abbreviateNumber(userInfo?.likes)}
                  className={'mt-6'}
                  liked={userInfo?.liked}
                  type={TYPE_LIKES.USER}
                  id={userInfo?.artist?.id}
                  follows={userInfo?.follows && abbreviateNumber(userInfo?.follows)}
                  getUserInfo={getUserInfo}
                />
              </div>

              <div
                className={`flex items-center gap-4 xl:absolute xl:bottom-9 xl:left-2/4 xl:-translate-x-1/2 xl:mt-0 sm:mt-6 justify-center`}
              >
                <TonalButton
                  onClick={() => handleClickTab(ARTIST_TAB.ASSET)}
                  customClass={`text--label-large `}
                  isActive={tabSelected == ARTIST_TAB.ASSET}
                  text="Asset"
                  sx={
                    tabSelected == ARTIST_TAB.ASSET
                      ? { backgroundColor: `${button?.default?.background} !important` }
                      : {}
                  }
                />
                <div>
                  <TonalButton
                    onClick={() => handleClickTab(ARTIST_TAB.INSIGHTS)}
                    customClass={`text--label-large `}
                    isActive={tabSelected == ARTIST_TAB.INSIGHTS}
                    text="Insights"
                    sx={
                      tabSelected == ARTIST_TAB.INSIGHTS
                        ? { backgroundColor: `${button?.default?.background} !important` }
                        : {}
                    }
                  />
                </div>
                <div>
                  <TonalButton
                    onClick={() => handleClickTab(ARTIST_TAB.FEED)}
                    customClass={`text--label-large`}
                    isActive={tabSelected == ARTIST_TAB.FEED}
                    text="Feed"
                    sx={
                      tabSelected == ARTIST_TAB.FEED
                        ? { backgroundColor: `${button?.default?.background} !important` }
                        : {}
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ImageProfile
          open={openCoverImg}
          imageUrl={userInfo?.artist?.coverImg}
          onTriggerClose={() => setOpenCoverImg(false)}
        />
        <DialogEditArtist
          onLoadData={onLoadDataEditSuccess}
          dataUserInfo={userInfo?.artist}
          open={openEditArtist && !toggleModalConnectWallet}
          onToggle={(e) => onToggleEdit(e)}
          lazyLoad={lazyLoad}
        />
      </div>
    </div>
  );
}
