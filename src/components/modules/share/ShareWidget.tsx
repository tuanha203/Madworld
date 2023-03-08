import { FC, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { IconCopy, IconEmbed, IconShare } from '../../common/iconography/IconBundle';
import {
  DiscordOriginal,
  FacebookOriginal,
  GoogleOriginal,
  InstagramOriginal,
} from '../../common/iconography/SocialMediaIcon';

export const ShareWidgetBanner = () => {
  return (
    <div className="share-widget-banner max-content-width p-5 flex flex-col items-center bg-background-dark-800 rounded-lg  shadow-elevation-dark-1 ">
      <div>
        <div className="text--title-small flex items-center mb-2">Share On:</div>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex items-center">
          <FacebookOriginal />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="flex items-center">
          <GoogleOriginal />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="flex items-center">
          <DiscordOriginal />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="flex items-center">
          <InstagramOriginal />
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="flex justify-center items-center text--body-small  gap-2 cursor-pointer hover:scale-105 transition-all">
          <IconCopy /> Copy Link
        </div>
        <Divider orientation="vertical" variant="middle" flexItem />
        <div className="flex justify-center items-center text--body-small gap-2 cursor-pointer hover:scale-105 transition-all">
          <IconEmbed /> Embed Asset
        </div>
      </div>
    </div>
  );
};

export const ShareWidgetLong = () => {
  return (
    <div className="share-widget-long max-content-width p-5 flex items-center justify-between bg-background-dark-800 rounded-lg  shadow-elevation-dark-1 ">
      <div className="text--title-small flex items-center mr-4">Share On:</div>
      <div className="flex items-center">
        <FacebookOriginal />
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div className="flex items-center">
        <GoogleOriginal />
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div className="flex items-center">
        <DiscordOriginal />
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div className="flex items-center">
        <InstagramOriginal />
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div className="flex justify-center items-center text--body-small  gap-2 cursor-pointer hover:scale-105 transition-all">
        <IconCopy /> Copy Link
      </div>
      <Divider orientation="vertical" variant="middle" flexItem />
      <div className="flex justify-center items-center text--body-small gap-2 cursor-pointer hover:scale-105 transition-all">
        <IconEmbed /> Embed Asset
      </div>
    </div>
  );
};

interface ShareWidgetBlock {
  isLabel?: boolean;
}

export const ShareWidgetBlock: FC<ShareWidgetBlock> = ({ isLabel = true }) => {
  const [shareEl, setShareEl] = useState(null);
  const isShareOpen = Boolean(shareEl);
  const shareOpen = (event: any) => {
    setShareEl(event.currentTarget);
  };
  const shareClose = () => {
    setShareEl(null);
  };

  return (
    <>
      <button
        id="basic-button"
        aria-controls={isShareOpen ? 'basic-option-share' : undefined}
        aria-haspopup="true"
        aria-expanded={isShareOpen ? 'true' : undefined}
        onClick={shareOpen}
      >
        <IconShare />
        {isLabel ? <span className="ml-2 text-white text--label-medium">Share</span> : null}
      </button>
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
        {/* <MenuItem className='flex items-center gap-2' onClick={shareClose}>
                    <FacebookOriginal /> Facebook
                </MenuItem> */}
        <MenuItem className="flex items-center gap-2" onClick={shareClose}>
          <GoogleOriginal /> Google +
        </MenuItem>
        <MenuItem className="flex items-center gap-2" onClick={shareClose}>
          <DiscordOriginal /> Discord
        </MenuItem>
        <MenuItem className="flex items-center gap-2" onClick={shareClose}>
          <InstagramOriginal /> Instagram
        </MenuItem>
        <MenuItem className="flex items-center gap-2" onClick={shareClose}>
          <IconCopy /> Copy Link
        </MenuItem>
        <MenuItem className="flex items-center gap-2" onClick={shareClose}>
          <IconEmbed /> Embed <br /> Asset
        </MenuItem>
      </Menu>
    </>
  );
};
