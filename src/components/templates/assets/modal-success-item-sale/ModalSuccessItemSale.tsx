import { FC } from 'react';

import Modal from '@mui/material/Modal';
import {
  IconFacebook,
  TelegramIcon,
  IconCopyLink,
} from 'components/common/iconography/SocialMediaIcon';
import { useState } from 'react';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { FilledButton } from 'components/common/buttons';
import ImageBase from 'components/common/ImageBase';
import copy from 'copy-to-clipboard';
import { toastSuccess } from 'store/actions/toast';
import Tooltip from '@mui/material/Tooltip';
import { TYPE_IMAGE } from 'constants/app';
import { checkTypeMedia } from 'utils/func';
import { TwitterShareButton } from 'react-share';
import TwitterIcon from '@mui/icons-material/Twitter';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: '24px',
} as React.CSSProperties;

interface IModalSuccessItemSaleProps {
  open: boolean;
  handleClose: () => void;
  assetDataDetail: any;
}

const ModalSuccessItemSale: FC<IModalSuccessItemSaleProps> = (props) => {
  const { open, handleClose, assetDataDetail } = props;
  const [tooltip, setTooltip] = useState('Copy link');
  const typeImage = checkTypeMedia(assetDataDetail?.nftUrl);

  const onCopy = () => {
    copy(window?.location?.href || '');
    setTooltip('Copied link');
  };

  const currentURL = `${process.env.NEXT_PUBLIC_HOSTNAME_USER_SITE}asset/${assetDataDetail?.collection?.address}/${assetDataDetail?.tokenId}`;
  return (
    <div>
      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={style}
          className="outline-none	font-Chakra text-dark-on-surface bg-background-700 rounded-[28px] flex flex-col text-center items-center md:w-[479px] w-[95%] md:p-[32px] p-3"
        >
          <p className="font-bold text-lg mb-2 text-2xl">Your item is now listed for sale</p>
          <div className="w-fit mx-auto rounded-lg flex items-center justify-center">
            <div className="relative">
              <ImageBase
                width="100%"
                height="100%"
                layout="fill"
                style={{
                  maxWidth: '207px',
                  maxHeight: '207px',
                  marginTop: '27px',
                  objectFit: 'contain',
                }}
                type="HtmlImage"
                url={assetDataDetail?.nftImagePreview || assetDataDetail?.nftUrl}
                errorImg="Default"
              />
              <div className={`flex absolute top-[35px] justify-between right-[8px]`}>
                {typeImage === TYPE_IMAGE.MP3 && (
                  <img className="w-[16px] h-[16px] ml-auto" src="/icons/mp3_icons_card.svg" />
                )}
                {typeImage === TYPE_IMAGE.MP4 && (
                  <img className="w-[16px] h-[16px] ml-auto" src="/icons/mp4_icons_card.svg" />
                )}
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-white opacity-[0.12] mt-8"></div>
          <p className="font-bold text-lg mb-2 mt-8">Share your listing</p>
          <div className="flex gap-3 items-center">

            <a
              className="hover:cursor-pointer hover:opacity-80"
              href={`https://twitter.com/intent/tweet?url=${currentURL}`}
              target="_blank"
            >
              <img src="/social/Icon_twitter.svg" alt="" />
            </a>

            <a
              className="hover:cursor-pointer hover:opacity-80"
              href={`https://telegram.me/share/url?url=${currentURL}`}
              target="_blank"
            >
              <img src="/social/Icon_telegram.svg" alt="" />
            </a>
            <a
              className="hover:cursor-pointer hover:opacity-80"
              href={`https://www.facebook.com/share.php?u=${currentURL}}`}
              target="_blank"
            >
              <span className="social-media-single-icon">
                <img src="/social/icon_facebook.svg" alt="" />
              </span>
            </a>
            <Tooltip title={tooltip}>
              <span
                className="text-primary-dark hover:cursor-pointer hover:opacity-80"
                onClick={onCopy}
              >
                <IconCopyLink />
              </span>
            </Tooltip>
          </div>
          <FilledButton
            onClick={handleClose}
            text="View Item"
            customClass="!text--label-large mt-[44px] w-[147px]"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ModalSuccessItemSale;
