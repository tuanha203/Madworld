import { FC, useEffect } from 'react';

import Modal from '@mui/material/Modal';
import {
  IconFacebook,
  TelegramIcon,
  TwitterIcon,
  IconCopyLink,
} from 'components/common/iconography/SocialMediaIcon';
import { useState } from 'react';
import { FilledButton } from 'components/common/buttons';
import ImageBase from 'components/common/ImageBase';
import { SUPPORTED_FORMATS_AUDIO, SUPPORTED_FORMATS_VIDEO } from 'constants/app';
import { useRouter } from 'next/router';
import CopyToClipboard from 'react-copy-to-clipboard';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { useDispatch } from 'react-redux';
import { removeEventChangePage } from 'store/actions/forceUpdating';
import Router from 'next/router';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: '24px',
} as React.CSSProperties;

interface IModalSuccessCreateNFTProps {
  open: boolean;
  handleClose: () => void;
  values: any;
  assetDataDetail?: any;
}

const ModalSuccessCreateNFT: FC<IModalSuccessCreateNFTProps> = (props) => {
  const [location, setLocation] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { open, handleClose, values } = props;
  const { nftImagePreview, nftAudio, nftVideo } = values;
  const typeUrl = nftAudio?.type || nftVideo?.type;
  const router = useRouter();
  const { asPath } = router;
  const dispatch = useDispatch();

  useEffect(() => {
    const location = window?.location?.href.replace(asPath, '');
    setLocation(location);
    dispatch(removeEventChangePage(values.tokenId || 1));
    return () => {
      dispatch(removeEventChangePage(0));
    };
  }, []);

  const onCopy = () => {
    // copy(`${location}/asset/${values.collectionAddress}/${values.tokenId}` || '');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
    // setTooltip('Copied link');
  };

  const handleViewItem = () => {
    Router.events.off('routeChangeStart', () => {});
    window.addEventListener('beforeunload', () => {}, true);
    handleClose();
    router.push(`/asset/${values.collectionAddress}/${values.tokenId}`);
  };

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
          className="
            font-Chakra text-dark-on-surface 
            bg-background-700
            flex flex-col text-center items-center
            lg:w-[479px] lg:p-8 lg:h-[468px] lg:rounded-[28px]
            w-[90%] py-6 px-3 rounded-[14px]
            "
        >
          <ContentTooltip
            style={{ cursor: 'pointer' }}
            title={`You created ${values.title.trim()}`}
            arrow
          >
            <p className="font-bold text-lg mb-2 text-2xl truncate w-full">
              You created {values.title.trim()}
            </p>
          </ContentTooltip>

          <div className="relative">
            <ImageBase
              width="100%"
              height="100%"
              layout="fill"
              style={{
                maxWidth: '207px',
                maxHeight: '128px',
                marginTop: '27px',
                objectFit: 'contain',
              }}
              type="HtmlImage"
              errorImg="Default"
              url={URL.createObjectURL(nftImagePreview)}
            />
            <div className={`flex absolute top-[35px] justify-between right-[8px]`}>
              {SUPPORTED_FORMATS_AUDIO.includes(typeUrl) && (
                <img className="w-[16px] h-[16px] ml-auto" src="/icons/mp3_icons_card.svg" />
              )}
              {SUPPORTED_FORMATS_VIDEO.includes(typeUrl) && (
                <img className="w-[16px] h-[16px] ml-auto" src="/icons/mp4_icons_card.svg" />
              )}
            </div>
          </div>
          <div className="w-full h-[1px] bg-white opacity-[0.12] mt-8"></div>
          <p className="font-bold text-lg mb-2 mt-8">Share your listing</p>
          <div className="flex gap-3 items-center">
            <span
              className="hover:cursor-pointer hover:opacity-80"
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${location}/asset/${values.collectionAddress}/${values.tokenId}`,
                  '_blank',
                )
              }
            >
              <TwitterIcon />
            </span>
            <span
              className="hover:cursor-pointer hover:opacity-80"
              onClick={() =>
                window.open(
                  `https://telegram.me/share/url?url=${location}/asset/${values.collectionAddress}/${values.tokenId}`,
                  '_blank',
                )
              }
            >
              <TelegramIcon />
            </span>

            <span
              className="hover:cursor-pointer hover:opacity-80"
              onClick={() =>
                window.open(
                  `https://www.facebook.com/share.php?u=${location}/asset/${values.collectionAddress}/${values.tokenId}`,
                  '_blank',
                )
              }
            >
              <IconFacebook />
            </span>
            {/* <Tooltip title={tooltip}>
              <span
                className="text-primary-dark hover:cursor-pointer hover:opacity-80"
                onClick={onCopy}
              >
                <IconCopyLink />
              </span>
            </Tooltip> */}
            <CopyToClipboard
              text={`${location}/asset/${values.collectionAddress}/${values.tokenId}` as string}
              onCopy={onCopy}
            >
              <ContentTooltip title={copied ? 'Copied link' : 'Copy link'}>
                <div>
                  <IconCopyLink />
                </div>
              </ContentTooltip>
            </CopyToClipboard>
          </div>
          <FilledButton
            onClick={handleViewItem}
            text="View Item"
            customClass="!text--label-large lg:mt-[44px] mt-6 w-[147px]"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ModalSuccessCreateNFT;
