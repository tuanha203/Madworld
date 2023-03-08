import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import BigNumber from 'bignumber.js';
import {
  IconDotHorizontal,
  IconEye,
  IconLiked,
  IconLikes,
  IconShare,
  TrendingUp,
} from 'components/common/iconography/IconBundle';
import { TYPE_LIKES } from 'constants/app';
import _, { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import likeService from 'service/likeService';
import { toastSuccess } from 'store/actions/toast';
import { toastMsgActons } from 'store/constants/toastMsg';
import { addCommaToNumber } from 'utils/currencyFormat';
import { roundNumber } from 'utils/formatNumber';
import { abbreviateNumber } from 'utils/func';

interface ItemOverviewProp {
  setOpenReport?: (value: boolean) => void;
  pricePercent: string;
  likes: string;
  isLike: boolean;
  nftId?: number;
  getAssetDetail?: () => void;
  views?: number;
  sticky?: boolean;
  disableReport?: boolean;
}
const ItemOverview = ({
  setOpenReport,
  likes,
  pricePercent,
  isLike,
  nftId,
  views,
  sticky = false,
  disableReport,
}: ItemOverviewProp) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareEl, setShareEl] = useState(null);
  const [isLiked, setIsLike] = useState(false);
  const [isLikes, setIsLikes] = useState<any>(0);
  const [lazy, setLazy] = useState(false);
  const open = Boolean(anchorEl);
  const isShareOpen = Boolean(shareEl);
  const dispatch = useDispatch();
  const { icon } = useSelector((state:any) => state.theme);

  let shareLink = '';
  if (typeof window !== 'undefined') {
    shareLink = window?.location?.href || '';
  }

  useEffect(() => {
    if (_.isBoolean(isLike)) setIsLike(isLike);
  }, [isLike]);

  useEffect(() => {
    if (_.toNumber(likes)) setIsLikes(likes);
  }, [likes]);

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

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLike = debounce(async () => {
    try {
      setLazy(true);
      if (typeof nftId !== 'number') return;
      const [data] = await likeService.like({ targetId: nftId, type: TYPE_LIKES.NFT });
      if (data?.toString() === 'liked') {
        setIsLike(true);
        setIsLikes(isLikes + 1);
      } else {
        setIsLike(false);
        setIsLikes(isLikes - 1);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLazy(false);
    }
  }, 300);

  let showPricePercent = '-';

  if (Math.abs(parseFloat(pricePercent)) < 10e-3) {
    showPricePercent = `~0.01%`;
  } else if (Math.abs(parseFloat(pricePercent)) >= 0.01) {
    const pricePercentFormat = addCommaToNumber(pricePercent, 2);
    if (new BigNumber(pricePercentFormat).gt(0)) {
      showPricePercent = `+${addCommaToNumber(pricePercent, 2)}%`;
    } else {
      showPricePercent = `${addCommaToNumber(pricePercent, 2)}%`;
    }
  }
  if (sticky) {
    return (
      <>
        <div className="text--label-medium">
          <Button
            id="basic-button"
            aria-controls={isShareOpen ? 'basic-option-share' : undefined}
            aria-haspopup="true"
            aria-expanded={isShareOpen ? 'true' : undefined}
            onClick={shareOpen}
          >
            <IconShare style={icon} />
            <span className="ml-2 text-white text--label-medium">{!sticky ? 'Share' : ''}</span>
          </Button>

          <Menu
            className="stat-share"
            id="basic-option-share"
            anchorEl={shareEl}
            open={isShareOpen}
            onClose={shareClose}
            // TransitionComponent={Fade}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <CopyToClipboard text={shareLink as string} onCopy={clickCopy}>
              <MenuItem className="flex items-center item-share">
                <img className="w-[30px] mr-[13px]" src="/social/copy-link-icon.svg" alt="" />
                Copy Link
              </MenuItem>
            </CopyToClipboard>
            <div>
              <FacebookShareButton url={shareLink} className="w-[100%]">
                <MenuItem className="flex items-center item-share" onClick={shareClose}>
                  <img className="w-[30px] mr-[13px]" src="/social/facebook-icon.svg" alt="" />
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
                  <img className="w-[30px] mr-[13px]" src="/social/twitter-icon.svg" alt="" />
                  Share to Twitter
                </MenuItem>
              </TwitterShareButton>
            </div>
          </Menu>
        </div>
        <div className="stat-report">
          <Tooltip title={'More'} arrow placement="top">
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-option-report' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <IconDotHorizontal style={icon} />
            </Button>
          </Tooltip>
          <Menu
            className="stat-report-option"
            id="basic-option-report"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              className="flex items-center gap-2"
              onClick={() => {
                setOpenReport && setOpenReport(true);
                handleClose();
              }}
            >
              Report
            </MenuItem>
          </Menu>
        </div>
      </>
    );
  }

  return (
    <div className="item-overview w-full xl:py-7 xl:px-6 p-3 flex items-center justify-between bg-background-dark-600 rounded-lg  shadow-elevation-light-3 ">
      <div className="text--label-medium flex items-center gap-2 sm:grow sm:justify-center">
        <IconEye style={icon} />
        {views ? abbreviateNumber(views) : 0} views
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div
        onClick={() => !lazy && handleLike()}
        className="cursor-pointer sm:flex sm:grow sm:justify-center"
      >
        {isLiked ? (
          <IconLiked styleIcon={icon} index={roundNumber(isLikes)} />
        ) : (
          <IconLikes styleIcon={icon} index={roundNumber(isLikes)} />
        )}
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div className="text--label-medium flex items-center gap-2 sm:grow sm:justify-center">
        <span className={`${parseFloat(pricePercent) < 0 ? '-scale-y-100' : ''} `}>
          <TrendingUp style={icon} />
        </span>
        <span>{showPricePercent}</span>
      </div>
      <Divider className="hidden lg:flex" orientation="vertical" variant="middle" flexItem />
      <div className="text--label-medium hidden lg:flex cursor-pointer">
        <Button
          id="basic-button"
          aria-controls={isShareOpen ? 'basic-option-share' : undefined}
          aria-haspopup="true"
          aria-expanded={isShareOpen ? 'true' : undefined}
          onClick={shareOpen}
        >
          <IconShare style={icon} />
          <span className="ml-2 text-white text--label-medium capitalize">Share</span>
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
              <img className="w-[30px] mr-[13px]" src="/social/copy-link-icon.svg" alt="" />
              Copy Link
            </MenuItem>
          </CopyToClipboard>
          <div>
            <FacebookShareButton url={shareLink} className="w-[100%]">
              <MenuItem className="flex items-center item-share" onClick={shareClose}>
                <img className="w-[30px] mr-[13px]" src="/social/facebook-icon.svg" alt="" />
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
                <img className="w-[30px] mr-[13px]" src="/social/twitter-icon.svg" alt="" />
                Share to Twitter
              </MenuItem>
            </TwitterShareButton>
          </div>
        </Menu>
      </div>
      <Divider className="hidden lg:flex" orientation="vertical" variant="middle" flexItem />
      <div className="stat-report hidden lg:flex">
        <Tooltip
          title={<span className="text--body-small">{disableReport ? 'Report' : 'More'}</span>}
          arrow
          placement="top"
        >
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-option-report' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={!disableReport ? handleClick : () => {}}
          >
            <IconDotHorizontal style={icon} />
          </Button>
        </Tooltip>
        <Menu
          className="stat-report-option"
          id="basic-option-report"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem
            className="flex items-center gap-2"
            onClick={() => {
              setOpenReport && setOpenReport(true);
              handleClose();
            }}
          >
            <div className="text--subtitle">Report</div>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ItemOverview;
