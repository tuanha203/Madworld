import { Box, Button, Menu, MenuItem } from '@mui/material';
import { IconShare } from 'components/common/iconography/IconBundle';
import ImageBase from 'components/common/ImageBase';
import { ImageProfile } from 'components/common/modal';
import { EthPrice } from 'components/common/price';
import CardCommon from 'components/modules/cards/CardCommon';
import { LoadingListBase } from 'components/modules/Loading';
import { Avatar, AvatarOwned } from 'components/modules/thumbnail';
import { TYPE_LIKES } from 'constants/app';
import _ from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import ShowMoreText from 'react-show-more-text';
import searchCollectService from 'service/searchCollectionService';
import { toastError, toastSuccess } from 'store/actions/toast';
import { toastMsgActons } from 'store/constants/toastMsg';
import { EllipsisMiddle } from 'utils/func';
export default function SearchCollection() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [collectionInfo, setCollectionInfo] = useState<any>({});
  const [owner, setOwner] = useState<any>({});
  const [lazyLoad, setLazyLoad] = useState<boolean>(true);
  const [nftList, setNftList] = useState<Array<any>>([]);
  const [cursor, setCursor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowDescription, setShowDescription] = useState<boolean>(false);
  const [openCoverImg, setOpenCoverImg] = useState<any>({ img: '', open: false });
  const [shareEl, setShareEl] = useState(null);
  const isShareOpen = Boolean(shareEl);
  const scroll = useRef<number>(0);
  let shareLink = '';
  if (typeof window !== 'undefined') {
    shareLink = window?.location?.href || '';
  }
  const shareClose = () => {
    setShareEl(null);
  };

  const shareOpen = (event: any) => {
    setShareEl(event.currentTarget);
  };

  useEffect(() => {
    if (id) {
      getCollection();
      getNft();
    }
  }, [id]);

  const clickCopy = () => {
    setShareEl(null);
    dispatch(toastSuccess('Link copied!'));
    setTimeout(() => {
      dispatch({ type: toastMsgActons.CLOSE });
    }, 3000);
  };

  async function getCollection() {
    const [response, error] = await searchCollectService.getCollection(id);
    if (error) return dispatch(toastError('Something went wrong'));
    const data = _.get(response, 'data', {});

    const accountInfo: any = {};
    for (const key in response?.accountInfo) {
      if (response?.accountInfo[key]) accountInfo[key] = response?.accountInfo[key];
    }

    setOwner(accountInfo);
    setCollectionInfo(data);
  }

  async function getNft(sum?: boolean) {
    if (sum) {
      setLoading(true);
    } else setLazyLoad(true);
    const [response, error] = await searchCollectService.getNft(
      id,
      12,
      cursor ? cursor : undefined,
    );
    if (error) return dispatch(toastError('Something went wrong'));

    const data = _.get(response, 'result', {});
    const cursorTemp = _.get(response, 'cursor', {});
    setCursor(cursorTemp);
    if (sum) {
      const totalData = nftList.concat(data);
      setNftList(totalData);
    } else {
      setNftList(data);
    }
    if (sum) {
      setLoading(false);
    } else setLazyLoad(false);
  }

  async function loadMoreNft() {
    const { scrollY } = window;
    if (scroll.current < scrollY) {
      getNft(true);
      scroll.current = scrollY;
    }
  }

  return (
    <div className="main-collection-search ">
      <div className="header min-h-[403px] bg-[#010B19]">
        <div
          className={`relative w-full  h-[154px] max-w-[1440px] m-auto ${
            collectionInfo?.banner_image ? 'cursor-pointer' : ''
          }`}
          onClick={() =>
            collectionInfo?.banner_image
              ? setOpenCoverImg({ img: collectionInfo?.banner_image || '', open: true })
              : () => {}
          }
        >
          {collectionInfo?.banner_image && (
            <ImageBase
              width="100%"
              className="max-h-[160px] h-[100%] object-cover"
              layout="fill"
              url={collectionInfo?.banner_image}
              errorImg="Banner"
              type="HtmlImage"
            />
          )}
        </div>
        <div className="layout mx-auto px-[16px] lg:px-[unset]">
          <Avatar
            customClass="w-[64px] h-[64px] lg:w-[113px] lg:h-[113px] border-[3px] lg:border-[6px] rounded-full border-primary-dark cursor-pointer mt-[-35px] lg:mt-[-50px] relative"
            rounded
            size="64px"
            src={collectionInfo?.image}
            onClick={() =>
              setOpenCoverImg({
                img: collectionInfo?.image || '',
                open: true,
              })
            }
          />
          <div className="lg:ml-[120px] pb-[20px] lg:pb-[70px] mt-[12px]">
            <div className="flex justify-between">
              <p className="font-Chakra text-2xl font-bold truncate">{collectionInfo?.name}</p>
              <div className="text--label-medium">
                <Button
                  id="basic-button"
                  aria-controls={isShareOpen ? 'basic-option-share' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isShareOpen ? 'true' : undefined}
                  onClick={shareOpen}
                >
                  <IconShare />
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
                        <img className="w-[30px] mr-[13px]" src="/social/twitter-icon.svg" alt="" />
                        Share to Twitter
                      </MenuItem>
                    </TwitterShareButton>
                  </div>
                </Menu>
              </div>
            </div>
            <Link href={`https://etherscan.io/address/${id}`}>
              <a target="_blank" className="inline-block">
                <EthPrice
                  eth={id ? EllipsisMiddle(id?.toString()) : ''}
                  customClass="mt-5"
                  isShowSymbol={false}
                />
              </a>
            </Link>
            <div className="my-5">
              <a
                href={
                  collectionInfo?.external_link?.includes('http')
                    ? collectionInfo?.external_link
                    : `https://${collectionInfo?.external_link}`
                }
                target="_blank"
                className="text-secondary-60 font-bold text-sm cursor-pointer break-words"
              >
                {collectionInfo?.external_link}
              </a>
            </div>
            <ShowMoreText
              lines={2}
              more={<div className="text-primary-dark font-normal	text-base">Show more</div>}
              less={<div className="text-primary-dark font-normal	text-base">Show less</div>}
              onClick={() => setShowDescription(!isShowDescription)}
              expanded={isShowDescription}
              className="description-text lg:w-[400px] w-[100%]"
            >
              {collectionInfo?.description}
            </ShowMoreText>
            <div className="flex my-5  mt-[20px] lg:mt-[53px]">
              <div className="mr-14">
                {!owner?.id ? (
                  <AvatarOwned artist={owner?.walletAddress?.slice(0, 6)} position="Creator" />
                ) : (
                  <AvatarOwned
                    artist={owner?.username}
                    position="Creator"
                    srcAvatar={owner?.avatarImg}
                    customTooltip={owner?.walletAddress}
                    verified={owner?.isVerify}
                    link={`/artist/${owner?.walletAddress}`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="asset-body lg:px-[unset] px-[16px]">
        <div className="layout mx-auto pb-[114px]">
          <h1 className="font-extrabold text-[36px] mt-[40px]">Assets</h1>

          {lazyLoad ? (
            <LoadingListBase loading={true} items={12} />
          ) : (
            <>
              <InfiniteScroll
                dataLength={nftList?.length}
                next={loadMoreNft}
                hasMore={!!cursor}
                loader={<LoadingListBase loading={true} items={4} />}
                className="!overflow-hidden"
              >
                <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 m-auto mx-0 mb-2 lg:mt-10 sm:mt-0">
                  {nftList?.length > 0 &&
                    nftList.map((NFTItem: any, index: number) => {
                      let data = {
                        title: NFTItem?.metadata?.name,
                        nftImagePreview: NFTItem?.metadata?.image,
                        id: NFTItem?.token_id,
                        nftUrl: NFTItem?.metadata?.animation_url,
                        collection: {
                          address: NFTItem?.token_address,
                          name: collectionInfo?.name,
                          type: NFTItem?.contract_type,
                          thumbnailUrl: collectionInfo?.image,
                        },
                      } as any;
                      if (NFTItem?.ownerNft && NFTItem?.ownerNft?.length > 0) {
                        const owner = NFTItem?.ownerNft[0]?.ownerOfNft || {};
                        data.owners = [{ ...owner }];
                      }
                      const dateNow = Math.floor(Date.now() / 1000);
                      return (
                        <div>
                          <CardCommon
                            key={NFTItem.id}
                            dateNow={dateNow}
                            dataNFT={{ ...data }}
                            type={TYPE_LIKES.NFT}
                            hidenRefresh
                            hidenLike
                            hidenBtn
                            linkRedirect={`/search-asset/${NFTItem?.token_address}/${NFTItem?.token_id}`}
                            callbackFetchList={() => getNft()}
                          />
                        </div>
                      );
                    })}
                </div>
              </InfiniteScroll>

              {!loading && nftList?.length === 0 && (
                <Box className="no-data">
                  <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
                  <label>No results</label>
                </Box>
              )}
            </>
          )}
          {/* {cursor && (
            <FilledButton
              loading={loading}
              text="View More"
              customClass="!text--label-large mt-7 lg:w-[150px] sm:w-full"
              onClick={loadMoreNft}
            />
          )} */}
        </div>
      </div>
      <ImageProfile
        open={openCoverImg.open}
        imageUrl={openCoverImg.img}
        onTriggerClose={() => setOpenCoverImg({ img: '', open: false })}
      />
    </div>
  );
}
