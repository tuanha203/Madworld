import React from 'react';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FlagIcon from '@mui/icons-material/Flag';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalGroceryStoreOutlinedIcon from '@mui/icons-material/LocalGroceryStoreOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Verified from '../Verified';
import { WalletSvg } from './iconsComponentSVG';
interface props {
  className?: string;
  customClass?: string;
  style?: any;
}

export const ErrorIcon = () => {
  return (
    <figure>
      <ErrorOutlineIcon className=" text-error-60" />
    </figure>
  );
};

export const OpenNewIcon = ({ customClass }: props) => {
  return (
    <figure>
      <OpenInNewIcon className={`text-secondary-60 ${customClass}`} />
    </figure>
  );
};

export const HeartIcon = ({ style }: any) => {
  return (
    <figure>
      <FavoriteBorderOutlinedIcon className="text-secondary-60" style={style} />
    </figure>
  );
};

export const HeartIconFilled = ({ style }: any) => {
  return (
    <figure>
      <FavoriteIcon className="text-secondary-60" style={style} />
    </figure>
  );
};

export const ClockIcon = () => {
  return (
    <figure>
      <AccessTimeOutlinedIcon className="text-secondary-60" />
    </figure>
  );
};

export const RightArrow = () => {
  return (
    <figure>
      <ArrowForwardOutlinedIcon className="text-secondary-60" />
    </figure>
  );
};

export const TrendingDown = () => (
  <figure>
    <TrendingDownIcon className="text-secondary-60" />
  </figure>
);

export const TrendingUp = ({ style }: any) => {
  return (
    <figure>
      <TrendingUpIcon className="text-secondary-60" style={style} />
    </figure>
  );
};
export const IconEye = ({ style }: any) => {
  return (
    <figure>
      <VisibilityIcon className="text-secondary-60" style={style} />
    </figure>
  );
};

export const IconDotHorizontal = ({ style }: props) => {
  return (
    <figure>
      <MoreHorizIcon className="text-secondary-60" style={style} />
    </figure>
  );
};

export const IconShare = ({ className, style }: props) => {
  return (
    <figure className={className}>
      <ShareOutlinedIcon className="text-secondary-60" style={style} />
    </figure>
  );
};

export const IconReport = () => {
  return (
    <figure>
      <FlagIcon className="text-secondary-60" />
    </figure>
  );
};

export const IconVolume = () => {
  return (
    <figure>
      <VolumeUpOutlinedIcon className="text-secondary-60" />
    </figure>
  );
};

export const IconTag = () => {
  return (
    <figure>
      <LocalOfferIcon className="text-secondary-60" />
    </figure>
  );
};
export const IconTagOutlined = () => {
  return (
    <figure>
      <LocalOfferOutlinedIcon className="text-secondary-60" />
    </figure>
  );
};
export const IconDiamond = () => {
  return (
    <figure>
      <DiamondOutlinedIcon className="text-secondary-60" />
    </figure>
  );
};

export const IconCopy = ({ fontSize, style }: { fontSize?: 'small' | 'inherit' | 'large' | 'medium', style:any }) => {
  return (
    <figure>
      <ContentCopyIcon className="text-secondary-60" fontSize={fontSize} style={style} />
    </figure>
  );
};

export const IconEmbed = () => {
  return (
    <figure className="">
      <img src="/icons/doubleArrow.svg" alt="" />
    </figure>
  );
};

export const IconWallet = ({ color }: any) => {
  return (
    <figure className="w-[18px] h-[18px]">
      <WalletSvg color={color} className="w-[18px] h-[18px]" />
    </figure>
  );
};

export const MADOutline = () => {
  return (
    <figure>
      <img className=" w-4 " src="/icons/mad_icon_outlined.svg" alt="" />
    </figure>
  );
};

export const IconVerified = ({ customClass, style, small = false }: any) => {
  return (
    <figure>
      <div className={`w-4 ${customClass}`}>
        {small ? <VerifiedSmall color={style?.color} /> :  <Verified color={style?.color} />}
      </div>
    </figure>
  );
};

export const VerifiedSmall = (props:any) => (
  <svg
    width={12}
    height={12}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#a)" fill={props?.color || "#F4B1A3"}>
      <path d="M11.5 5.995 10.28 4.6l.17-1.845-1.805-.41L7.7.75 6 1.48 4.3.75l-.945 1.595-1.805.405.17 1.85L.5 5.995 1.72 7.39l-.17 1.85 1.805.41.945 1.6 1.7-.735 1.7.73.945-1.595 1.805-.41-.17-1.845 1.22-1.4Zm-1.975.74-.28.325.04.425.09.975-.95.215-.42.095-.22.37-.495.84-.89-.385-.4-.17-.395.17-.89.385-.495-.835-.22-.37-.42-.095-.95-.215.09-.98.04-.425-.28-.325L1.835 6l.645-.74.28-.325-.045-.43-.09-.97.95-.215.42-.095.22-.37.495-.84.89.385.4.17.395-.17.89-.385.495.84.22.37.42.095.95.215-.09.975-.04.425.28.325.645.735-.64.74Z" />
      <path d="M5.045 6.875 3.885 5.71l-.74.745 1.9 1.905 3.67-3.68-.74-.745-2.93 2.94Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const IconVerifiedFullFill = () => {
  return (
    <figure>
      <img className="w-4 " src="/icons/verifield_fullfill.svg" alt="" />
    </figure>
  );
};

export const IconEvent = () => {
  return (
    <figure>
      <EventOutlinedIcon className="text-secondary-60" />
    </figure>
  );
};

export const IconRock = () => {
  return (
    <figure>
      <img className=" w-4 " src="/icons/rock_red.svg" alt="" />
    </figure>
  );
};

export const ArrowDropDown = ({ className }: { className: string }) => {
  return (
    <figure>
      <ArrowDropDownIcon className={className} />
    </figure>
  );
};

export const ArrowDownFullIcon = () => {
  return (
    <figure className="  h-4 w-4">
      <ArrowDownwardIcon className=" text-secondary-60 bg-[#2E2E2D] rounded-full h-4 w-4 mx-auto object-contain" />
    </figure>
  );
};

export const ArrowDownIcon = () => {
  return (
    <figure>
      <ArrowDownwardIcon className=" text-secondary-60" />
    </figure>
  );
};

export const SettingIcon = () => {
  return (
    <figure>
      <SettingsIcon className="text-secondary-60" />
    </figure>
  );
};

export const ClosingIcon = ({ onClick, className, style }: any) => {
  return (
    <figure onClick={onClick}>
      <CloseIcon className={`text-secondary-60 ${className || ''}`} style={style} />
    </figure>
  );
};

export const IconZoom = () => {
  return (
    <figure>
      <img className=" w-3 h-3 " src="/icons/zoom.svg" alt="" />
    </figure>
  );
};

export const InfoIcon = ({ iconSize }: any) => {
  return (
    <figure>
      <InfoOutlinedIcon className={`text-secondary-60 ${iconSize}`} />
    </figure>
  );
};

export const RefreshIcon = () => {
  return (
    <figure>
      <CachedOutlinedIcon className="text-secondary-60" />
    </figure>
  );
};

export const IconLikes = ({ index, styleIcon }: any) => {
  return (
    <div className="text--label-medium flex items-center gap-2">
      <HeartIcon style={styleIcon} />
      <span>{index}</span>
    </div>
  );
};

export const IconLiked = ({ index, styleIcon }: any) => {
  return (
    <div className="text--label-medium flex items-center gap-2">
      <HeartIconFilled style={styleIcon} />
      <span>{index}</span>
    </div>
  );
};

export const IconViewGraph = () => {
  return (
    <figure className="w-6 h-6 ">
      <img className=" w-full object-cover" src="/icons/viewGraph.svg" alt="view graph" />
    </figure>
  );
};

export const IconDoc = () => {
  return (
    <figure className="w-6 h-6 ">
      <img className="w-full object-cover" src="/icons/doc.svg" alt="icon doc" />
    </figure>
  );
};
export const IconMobileCheck = () => {
  return (
    <figure className="w-6 h-6 ">
      <img className="w-full object-cover" src="/icons/mobile-check.svg" alt="icon doc" />
    </figure>
  );
};

export const IconMobileCheckDarken = () => {
  return (
    <figure className="w-6 h-6 ">
      <img className="w-full object-cover" src="/icons/mobile-check-darken.svg" alt="icon doc" />
    </figure>
  );
};

export const IconEth = ({ size }: { size?: string }) => {
  return (
    <figure className={`w-6 h-6 ${size}`}>
      <img className={`w-full h-full`} src="/icons/Eth.svg" alt="eth" />
    </figure>
  );
};

IconEth.defaultProps = {
  size: '',
};

export const IconWeth = ({ size }: { size?: string }) => {
  return (
    <figure className={`w-6 h-6 ${size}`}>
      <img className={`w-full h-full`} src="/icons/weth.svg" alt="weth" />
    </figure>
  );
};

IconWeth.defaultProps = {
  size: '',
};

export const IconMadOutlined = ({ size }: any) => {
  return (
    <figure className={`w-6 h-6 ${size}`}>
      <img className={`w-full `} src="/icons/mad_icon_outlined.svg" alt="logo" />
    </figure>
  );
};

IconMadOutlined.defaultProps = {
  size: '',
};

export const IconTick = ({ size }: any) => {
  return <img className={`${size}`} src="/icons/tick.svg" alt="ticks" />;
};

IconTick.defaultProps = {
  size: 'w-6 h-6',
};

export const IconPlay = () => {
  return (
    <figure className="!w-20 !h-20">
      <PlayCircleIcon className="!w-20 !h-20 object-cover" />
    </figure>
  );
};

// feed elements assets
export const IconSale = ({ text }: any) => {
  return (
    <div className="text--label-small flex flex-col items-center gap-1">
      <LocalGroceryStoreOutlinedIcon className="text-secondary-60" />
      <span>{text}</span>
    </div>
  );
};
export const IconTransfer = ({ text }: any) => {
  return (
    <div className="text--label-small flex flex-col items-center gap-1">
      <figure className="w-6 h-6 ">
        <img
          className=" w-full object-cover"
          src="/icons/asset-detail/activity-transfer.svg"
          alt=""
        />
      </figure>
      <span>{text}</span>
    </div>
  );
};

export const IconBid = ({ text }: any) => {
  return (
    <div className="text--label-small flex flex-col items-center gap-1">
      <GavelOutlinedIcon className="text-secondary-60" />
      <span>{text}</span>
    </div>
  );
};
export const IconTagOutlinedFeed = ({ text }: any) => {
  return (
    <div className="text--label-small flex flex-col items-center gap-1">
      <LocalOfferOutlinedIcon className="text-secondary-60" />
      <span>{text}</span>
    </div>
  );
};

export const IconNoteAdd = ({ text }: any) => {
  return (
    <div className="text--label-small flex flex-col items-center gap-1">
      <NoteAddIcon className="text-secondary-60" />
      <span>{text}</span>
    </div>
  );
};

export const IconArrowDown = ({ customClass }: any) => {
  return (
    <div className={`text--label-small flex flex-col items-center gap-1 ${customClass}`}>
      <KeyboardArrowDownIcon />
    </div>
  );
};

export const IconLock = ({ className }: any) => {
  return (
    <figure className="">
      <img className={className} src="/icons/lock.svg" alt="" />
    </figure>
  );
};

export const IconInfoOutline = ({}: any) => {
  return (
    <figure>
      <img className="" src="/icons/info-outline.svg" alt="" />
    </figure>
  );
};

export const IconDynamic = ({ className, image, onClick }: any) => {
  return (
    <figure onClick={onClick}>
      <img className={`${className}`} src={image} alt="icon" />
    </figure>
  );
};

export const IconTokenOutlined = ({ size, image, className }: any) => {
  return (
    <figure className={`w-6 h-6 ${size} ${className}`}>
      <img className={`w-full `} src={image} alt="logo" />
    </figure>
  );
};
