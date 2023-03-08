import React from 'react';
import { Avatar } from 'components/modules/thumbnail';
import { useRouter } from 'next/router';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import Link from 'next/link';
import { boolean } from 'yup';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

interface IArtistMultiAvatarProps {
  artistName: string;
  addressArtist: number;
  addressCollection: number;
  srcAvatarCollection?: string;
  srcAvatarCreator?: string;
  nameCollection?: string;
  isPreview?: boolean;
  verified?: boolean;
  fullArtistName?: string;
  disableLinkArtist?: boolean;
  disableLinkCollection?: boolean;
  modeVerified?: boolean;
}

const ArtistMultiAvatar = ({
  srcAvatarCollection,
  srcAvatarCreator,
  artistName,
  addressArtist,
  addressCollection,
  nameCollection = 'name collection',
  isPreview,
  verified,
  fullArtistName,
  disableLinkArtist = false,
  disableLinkCollection = false,
  modeVerified,
}: IArtistMultiAvatarProps) => {

  const { icon } = useSelector((state:any) => state.theme);

  const LinkCommon = (props: any) => {
    const { disableLink, href } = props;
    if (disableLink) return <Box>{props.children}</Box>;
    return <Link href={href}>{props.children}</Link>;
  };

  return (
    <div className="cursor-pointer multi-avatar flex items-center gap-2 max-w-[70%] ">
      <div className="flex flex-row">
        <LinkCommon disableLink={disableLinkCollection} href={`/collection/${addressCollection}`}>
          <a>
            <ContentTooltip
              arrow
              className="tooltip-custom"
              title={`Collection: ${nameCollection}`}
            >
              <div>
                <Avatar src={srcAvatarCollection} size="small" />
              </div>
            </ContentTooltip>
          </a>
        </LinkCommon>
        <LinkCommon disableLink={disableLinkArtist} href={`/artist/${addressArtist}`}>
          <a>
            <div>
              <Avatar
                verified={verified}
                positionIconVerify="bottomRight"
                src={srcAvatarCreator}
                size="small"
                border="true"
                customClass="-ml-3"
                modeVerified={modeVerified}
                styleVerified={icon}
              />
            </div>
          </a>
        </LinkCommon>
      </div>
      <div className="max-w-[inherit]">
        <LinkCommon href={`/artist/${addressArtist}`}>
          <a>
            <ContentTooltip title={`Artist: ${fullArtistName}`}>
              <div className="text--label-large text-white truncate mr-[20px] text-sm">
                {artistName}
              </div>
            </ContentTooltip>
          </a>
        </LinkCommon>
      </div>
    </div>
  );
};

ArtistMultiAvatar.defaultProps = {
  artistName: 'artist Name',
  addressArtist: 2,
  addressCollection: 2,
  nameCollection: '',
  verified: false,
};

export default ArtistMultiAvatar;
