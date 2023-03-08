import { Button, Menu, MenuItem } from '@mui/material';
import { OutlinedButton, TonalButton } from 'components/common';
import { InputChip } from 'components/common/chips/InputChip';
import { IconShare } from 'components/common/iconography/IconBundle';
import { DiscordSvg, TeleSvg, TwitterSvg } from 'components/common/iconography/iconsComponentSVG';
import ImageBase from 'components/common/ImageBase';
import { ImageProfile } from 'components/common/modal';
import { EthPrice } from 'components/common/price';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import ArtistOverviewSmallerCollection from 'components/modules/stats-overview/ArtistOverviewSmallerCollection';
import { Avatar, AvatarOwned } from 'components/modules/thumbnail';
import { COLLECTION_TAB, TYPE_LIKES, URL_SOCIAL } from 'constants/app';
import { LINK_SCAN } from 'constants/envs';
import { memo, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import ShowMoreText from 'react-show-more-text';
import { toastSuccess } from 'store/actions/toast';
import { toastMsgActons } from 'store/constants/toastMsg';
import { IModalState } from 'store/reducers/modal';
import { abbreviateNumber, EllipsisMiddle, formatPricePercent } from 'utils/func';
import DialogEditCollection from '../asset/edit-collection';

interface CollectionHeaderProp {
  tab: COLLECTION_TAB | null;
  setTab: (value: COLLECTION_TAB) => void;
  dataCollection?: any;
  onLoadData: (params: any) => void;
  isOwner: boolean;
}

const CollectionHeader = ({
  tab,
  setTab,
  dataCollection,
  onLoadData,
  isOwner,
}: CollectionHeaderProp) => {
  const [isShowCollectionThumbnail, setShowCollectionThumbnail] = useState<boolean>(false);
  const [isShowDescription, setShowDescription] = useState<boolean>(false);
  const [openEditCollection, setToggleEditCollection] = useState(false);
  const dispatch = useDispatch();
  const [shareEl, setShareEl] = useState(null);
  const isShareOpen = Boolean(shareEl);
  const [openCoverImg, setOpenCoverImg] = useState<boolean>(false);
  const { toggleModalConnectWallet, stepConnectWallet } = useSelector(
    (state: { modal: IModalState }) => state.modal,
  );
  const { button, text, icon } = useSelector((state: any) => state.theme);
  let shareLink = '';
  if (typeof window !== 'undefined') {
    shareLink = window?.location?.href || '';
  }

  const {
    highestSale,
    address,
    amountAsset,
    amountOwner,
    bannerUrl,
    creator,
    description,
    floorPrice,
    like,
    isLike,
    volumeTraded,
    name,
    thumbnailUrl,
    pricePercent,
    externalLink,
    discordLink,
    telegramLink,
    twitterLink,
    id,
    title,
  } = dataCollection;
  const { avatarImg, username, id: userId, isVerify, walletAddress } = creator || {};
  const addressCollection = EllipsisMiddle(address);
  const handleOpenSocialLink = (event: any, link: string | null) => {
    if (!link) event.preventDefault();
  };

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

  useEffect(() => {
    if (toggleModalConnectWallet) {
      setToggleEditCollection(false);
    }
  }, [toggleModalConnectWallet]);
  return (
    <div className="bg-background-preview-sell">
      <div
        className="relative w-full lg:h-40 h-[160px] max-w-[1440px] m-auto cursor-pointer"
        onClick={() => setOpenCoverImg(true)}
      >
        <ImageBase
          width="100%"
          className="max-h-[160px] h-[100%] object-cover"
          layout="fill"
          url={bannerUrl}
          errorImg="Banner"
          type="HtmlImage"
        />
      </div>
      <ImageProfile
        open={openCoverImg}
        imageUrl={bannerUrl}
        onTriggerClose={() => setOpenCoverImg(false)}
      />
      <ImageProfile
        open={isShowCollectionThumbnail}
        imageUrl={thumbnailUrl}
        onTriggerClose={() => setShowCollectionThumbnail(false)}
      />
      <div className="relative font-Chakra flex layout m-auto items-center lg:py-9 lg:pl-36">
        <div
          className="lg:top-[-50px] left-[16px] top-[-30px] xl:left-0 mb-auto absolute"
          onClick={() => setShowCollectionThumbnail(true)}
        >
          <Avatar
            customClass="w-[64px] h-[64px] lg:w-[113px] lg:h-[113px] border-[3px] lg:border-[6px] rounded-full border-primary-dark cursor-pointer"
            rounded
            size="64px"
            src={thumbnailUrl}
            styleBox={{ borderColor: `${button?.default?.background} !important` }}
          />
        </div>
        <div className="w-full">
          <div className="lg:flex lg:mt-5 mt-[3.5rem] mx-[16px] lg:ml-[unset]">
            <div className="lg:w-1/2">
              <div className="flex items-center justify-between my-4 tooltip-content">
                <ContentTooltip
                  className="tooltip-custom "
                  arrow
                  title={title || name || 'Unnamed'}
                >
                  <p className="font-Chakra w-[60%] text-2xl font-bold mr-4 truncate" style={text}>
                    {title || name || 'Unnamed'}
                  </p>
                </ContentTooltip>
                {isOwner && (
                  <OutlinedButton
                    onClick={() => {
                      onLoadData(dataCollection?.shortUrl ?? null);
                      setToggleEditCollection(true);
                    }}
                    text="Edit Collection"
                    style={button?.outline}
                    customClass="!text--label-large block"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 font-bold">
                <div className="flex">
                  <a href={`${LINK_SCAN}/address/${address}`} target="_blank">
                    <EthPrice
                      eth={addressCollection}
                      isShowSymbol={false}
                      customClass="!text--title-medium"
                      color={icon?.color}
                    />
                  </a>
                </div>
              </div>
              <div className="mt-4 mb-5">
                <a
                  href={externalLink?.includes('http') ? externalLink : `https://${externalLink}`}
                  target="_blank"
                  className="text-secondary-60 font-bold text-sm cursor-pointer break-words"
                  style={text}
                >
                  {externalLink}
                </a>
              </div>
              <ShowMoreText
                lines={2}
                more={
                  <div className="text-primary-dark font-normal	text-base" style={text}>
                    Show more
                  </div>
                }
                less={
                  <div className="text-primary-dark font-normal	text-base" style={text}>
                    Show less
                  </div>
                }
                onClick={() => setShowDescription(!isShowDescription)}
                expanded={isShowDescription}
                className="description-text lg:w-[400px] w-[100%]"
              >
                {description}
              </ShowMoreText>
              <div className="flex mt-10">
                <div className="mr-14">
                  <AvatarOwned
                    artist={username || walletAddress?.slice(0, 6)}
                    customTooltip={username || walletAddress}
                    position="Creator"
                    srcAvatar={avatarImg}
                    verified={isVerify}
                    link={`/artist/${walletAddress}`}
                    textStyle={text}
                    iconStyle={icon}
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 pt-5">
              <div className="lg:flex flex-col lg:items-end gap-6">
                <div className="flex lg:justify-start justify-center lg:w-[380px] py-[20px] lg:py-[unset]">
                  <div className="flex items-center lg:justify-start items-center gap-8 lg:w-[100%]">
                    <a
                      href={`${URL_SOCIAL.discord}${discordLink}`}
                      target="_blank"
                      onClick={(event) => handleOpenSocialLink(event, discordLink)}
                    >
                      <InputChip
                        icon={<DiscordSvg color={icon?.color} />}
                        hover={false}
                        scheme="dark"
                        className="remove-label-basic-chip cursor-pointer"
                      />
                    </a>
                    <a
                      href={`${URL_SOCIAL.telegram}${telegramLink}`}
                      target="_blank"
                      onClick={(event) => handleOpenSocialLink(event, telegramLink)}
                    >
                      <InputChip
                        hover={false}
                        icon={<TeleSvg color={icon?.color} />}
                        scheme="dark"
                        className="remove-label-basic-chip cursor-pointer"
                      />
                    </a>
                    <a
                      href={`${URL_SOCIAL.twitter}${twitterLink}`}
                      target="_blank"
                      onClick={(event) => handleOpenSocialLink(event, twitterLink)}
                    >
                      <InputChip
                        hover={false}
                        icon={<TwitterSvg color={icon?.color} />}
                        scheme="dark"
                        className="remove-label-basic-chip cursor-pointer"
                      />
                    </a>
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
                </div>
                <div>
                  <ArtistOverviewSmallerCollection
                    assetsValue={abbreviateNumber(amountAsset)}
                    ownersValue={abbreviateNumber(amountOwner)}
                    volumeTraded={abbreviateNumber(volumeTraded)}
                    floorPrice={abbreviateNumber(floorPrice)}
                    highestSale={abbreviateNumber(highestSale)}
                    trendingValue={formatPricePercent(pricePercent)}
                    likesValue={abbreviateNumber(like)}
                    liked={isLike}
                    type={TYPE_LIKES.COLLECTION}
                    id={id}
                    color={text}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 justify-center lg:pb-10 pt-[32px] pb-[32px] lg:pt-[0px]">
        <TonalButton
          onClick={() => setTab(COLLECTION_TAB.ASSET)}
          text="Asset"
          customClass={`text--label-large`}
          isActive={tab === COLLECTION_TAB.ASSET}
          sx={tab === COLLECTION_TAB.ASSET ? { backgroundColor: `${button?.default?.background} !important` } : {}}
        />
        <TonalButton
          onClick={() => setTab(COLLECTION_TAB.INSIGHTS)}
          isActive={tab === COLLECTION_TAB.INSIGHTS}
          text="Insights"
          customClass={`text--label-large`}
          sx={tab === COLLECTION_TAB.INSIGHTS ? { backgroundColor: `${button?.default?.background} !important` } : {}}
        />
      </div>
      {openEditCollection && (
        <DialogEditCollection
          onLoadData={onLoadData}
          dataCollection={dataCollection}
          open={openEditCollection && !toggleModalConnectWallet}
          onToggle={setToggleEditCollection}
        />
      )}
    </div>
  );
};

export default memo(CollectionHeader);
