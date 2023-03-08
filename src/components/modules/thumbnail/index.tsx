import { Box } from '@mui/material';
import ImageBase from 'components/common/ImageBase';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { WINDOW_MODE } from 'constants/app';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { IconVerified } from '../../common/iconography/IconBundle';

export const Avatar = ({
  size,
  border,
  rounded,
  src,
  customClass,
  onClick,
  style,
  verified,
  mode,
  highlight,
  styleBox,
  styleVerified,
  modeVerified,
}: any) => {

  let activeClass = '';
  let classIcon = '';
  
  switch (mode) {
    case 'larger':
      activeClass = 'flex mt-[-15px] mr-[-2px] justify-end';
      classIcon = 'w-[15px] h-[15px]';
      break;
    default:
      activeClass = ' translate-y-[-7px] translate-x-[15px]	z-10';
      classIcon = 'w-[10px] h-[10px]';
      break;
  }
  return (
    <Box
      sx={styleBox}
      className={`shrink-0 ${
        size == 'large'
          ? ' w-16 h-16'
          : size == 'medium'
            ? 'w-12 h-12'
            : size == 'small'
              ? ' w-6 h-6 !border-[1px]'
              : size == '36'
                ? 'w-9 h-9'
                : size == '28'
                  ? 'w-[28px] h-[28px]'
                  : size == '32px'
                    ? 'w-[32px] h-[32px]'
                    : size == '36px'
                      ? 'w-[36px] h-[36px]'
                      : size == '64px'
                        ? 'w-[64px] h-[64px]'
                        : 'w-12 h-12'
        }
                ${border ? 'border-[3px] border-primary-dark' : ''}
                ${!rounded ? '' : 'rounded-full'}
                shadow-elevation-dark-1 ${customClass}  
                ${!highlight && 'hover:-translate-y-1'}
         `}
      onClick={onClick}
    >
      <ImageBase
        url={src}
        style={style}
        errorImg="Avatar"
        alt="avatar"
        width="100%"
        height="100%"
        type="HtmlImage"
        className={`object-cover ${!rounded ? '' : 'rounded-full'}`}
      />
      {verified && (
        <div className={activeClass}>
          <IconVerified small={modeVerified} customClass={classIcon} style={styleVerified} />
        </div>
      )}
    </Box>
  );
};
Avatar.defaultProps = {
  size: 'medium',
  border: false,
  rounded: true,
  src: '/images/test.jpg',
  style: { width: '100%', height: '100%' },
};

interface IAvatarOwnedProps {
  artist?: any;
  position?: any;
  verified?: any;
  srcAvatar?: any;
  link?: any;
  userId?: any;
  className?: string;
  artistClassName?: string;
  ownerAsset?: boolean;
  customTooltip?: string;
  type?: string;
  isDisableToolTip?: boolean;
  textStyle?: any;
  iconStyle?: any
}

export const AvatarOwned: FC<IAvatarOwnedProps> = (props) => {
  const {
    artist,
    position,
    verified,
    srcAvatar,
    link,
    userId,
    className,
    artistClassName,
    ownerAsset,
    customTooltip,
    type,
    isDisableToolTip = false,
    textStyle,
    iconStyle,
  } = props;
  const router = useRouter();
  const windowMode = useDetectWindowMode();
  const handleRedirectArtistProfile = () => {
    if (userId) {
      return router.push(`/artist/${userId}`);
    }
  };


  const CLink = link ? Link : Box;

  return (
    <div
      className={`avatar-owned flex items-center gap-3 relative hover:-translate-y-1 ${className || ''
        }`}
    >
      <CLink href={`${link}`} passHref={true}>
        <a>
          <div className="flex items-center cursor-pointer">
            <Avatar
              src={srcAvatar}
              size={
                [WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode)
                  ? '36px'
                  : 'medium'
              }
              highlight={true}
              styleVerified={iconStyle}
            />
            <div
              className={`flex flex-col max-w-[100px] pl-2 sm:max-w-[130px] ${verified && !ownerAsset
                  ? 'border-r border-secondary-ref xl:w-[100px] w-[80px] xl:mr-[30px]'
                  : null
                } `}
            >
              <span className="text--label-small capitalize cursor-default">{position}</span>
              <ContentTooltip
                disableHoverListener={isDisableToolTip}
                title={customTooltip || artist}
                arrow
                className='text-[#B794F6]'
                style={textStyle}
              >
                {typeof artist === 'string' ? (
                  <span
                    className={`text--subtitle text-primary-90 mr-[5px] text-ellipsis max-w-full ${artistClassName || ''
                      }`}
                  >
                    {artist.trim()}
                  </span>
                ) : (
                  artist
                )}
              </ContentTooltip>
            </div>
          </div>
        </a>
      </CLink>
      {verified && (type === 'ERC721' || !type) && (
        <>
          {ownerAsset ? (
            <div
              className={`absolute bottom-0 ${[WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode)
                  ? 'left-[20px]'
                  : 'left-[32px]'
                }`}
            >
              <IconVerified style={iconStyle} />
            </div>
          ) : (
            <div className="scale-[2]">
              <IconVerified style={iconStyle} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

AvatarOwned.defaultProps = {
  artist: '',
  position: '',
  verified: false,
  ownerAsset: false,
};
