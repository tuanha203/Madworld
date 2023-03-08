import { Box, Divider, Tooltip } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { FilledButton } from 'components/common';
import { ClockSvg } from 'components/common/iconography/iconsComponentSVG';
import ImageBase from 'components/common/ImageBase';
import ModalCommon from 'components/common/modal';
import ModalConfirm from 'components/common/modal-confirm';
import RarityIndex from 'components/common/progressBar';
import RefreshBtn from 'components/common/RefreshBtn';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import ConfirmCancel from 'components/modules/buyNow/ConfirmCancel';
import CardCommon from 'components/modules/cards/CardCommon';
import FlagshipCard from 'components/modules/cards/FlagshipCard';
import ItemOverview from 'components/modules/stats-overview/ItemOverview';
import { AvatarOwned } from 'components/modules/thumbnail';
import BannerReserveBuyer from 'components/templates/assets/banner-reserve-buyer/banner-reserve-buyer';
import BuyNow from 'components/templates/assets/buyNow';
import CancelListing from 'components/templates/assets/cancel-listing/CancelListing';
import { ChartActivities } from 'components/templates/assets/charts';
import DetailContract from 'components/templates/assets/detail-contract/DetailContract';
import EditPriceListing from 'components/templates/assets/edit-price-listing/edit-price-listing';
import EditAndSellAsset from 'components/templates/assets/edit-sell-asset/EditAndSellAsset';
import Level from 'components/templates/assets/level/Level';
import MakeOffer from 'components/templates/assets/make-offer';
import ModalReport from 'components/templates/assets/modal-report';
import ModalSuccessItemSale from 'components/templates/assets/modal-success-item-sale/ModalSuccessItemSale';
import NftContent from 'components/templates/assets/nft-content/NftContent';
import PlaceABid from 'components/templates/assets/place-a-bid-content';
import PriceAssetDetail from 'components/templates/assets/PriceAssetDetail';
import PropertiesAsset from 'components/templates/assets/properties/PropertiesAsset';
import Utility from 'components/templates/assets/utility/Utility';
import { ASSET_TYPE, TYPE_LIKES, WINDOW_MODE } from 'constants/app';
import { NETWORK_CHAIN_ID } from 'constants/envs';
import { NFT_SALE_TYPES } from 'constants/index';
import useConnectWallet from 'hooks/useConnectWallet';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import useUpdateEffect from 'hooks/useUpdateEffect';
import _, { debounce, get, isEmpty } from 'lodash';
import moment from 'moment';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import assetService from 'service/assetService';
import nftService from 'service/nftService';
import saleNftService from 'service/saleNftService';
import { forceUpdateInternalSale } from 'store/actions/forceUpdating';
import { toggleModal } from 'store/actions/modal';
import { toastError, toastSuccess } from 'store/actions/toast';
import { modalActions, MODAL_TYPE } from 'store/constants/modal';
import { themeActions } from 'store/constants/theme';
import { IModalState } from 'store/reducers/modal';
import { initialStateTheme } from 'store/reducers/theme';
import { formatNumber } from 'utils/formatNumber';
import { DISPLAY_TYPE_PROPERTY } from 'utils/formFields';
import { roundNumber, shortenNameNoti, shortenNameNotiHasAddress } from 'utils/func';
import { convertUrlImage } from 'utils/image';
import { STORAGE_KEYS } from 'utils/storage';
import { formatUrl } from 'utils/utils';

const LIMIT_PAGE = 20;

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 2,
  },
};

var PAGE = 1;
const LIMIT = 5;
let _walletAddress: string = '';

interface IProps {
  assetData?: any;
  theme: any;
}

const Nft: NextPage<IProps> = (props) => {
  const { assetData = {}, theme = {} } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const toggleModalSuccessItemSale = useSelector(
    (state: { modal: IModalState }) => state.modal.toggleModalSuccessItemSale,
  );

  const { account, chainId } = useWeb3React();

  const { openModalConnectWallet } = useConnectWallet();

  const { tokenId, address } = router.query;
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
  const [confirmBeforeClose, setConfirmBeforeClose] = useState(false);
  const [hideCloseButton, setHideCloseButton] = useState(false);
  const [unlockableContent, setUnlockableContent] = useState('');
  const [openPlaceABid, setOpenPlaceABid] = useState(false);
  const [showLess, setShowLess] = useState(true);
  const [nftSaleStatus, setNftSaleStatus] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [properties, setProperties] = useState<Array<any>>([]);
  const [level, setLevel] = useState<Array<any>>([]);
  const [stats, setStats] = useState<Array<any>>([]);
  const [nftNotSale, setNftNotSale] = useState([]);
  const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false);
  const [collectionList, setCollectionList] = useState<Array<any>>([]);
  const [openReport, setOpenReport] = useState(false);
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);

  const [bestOfferOwner, setBestOfferOwner] = useState<any>({});
  const [openUnlockContent, setOpenUnlockContent] = useState<boolean>(false);

  const [bestNftSale, setBestNftSale] = useState<any>({});

  const [priceShowing, setPriceShowing] = useState<any>();

  const [assetDataDetail, setAssetDataDetail] = useState<any>({});
  const [rarityAssetDetail, setRarityAssetDetail] = useState<any>({});

  const [isLoadingButtonSell, setLoadingButtonSell] = useState<boolean>(false);

  const { collection, ownerNft, title, description, id, externalLink } = assetDataDetail as any;
  const isERC1155 = collection?.type === ASSET_TYPE.ERC1155;
  const isERC721 = collection?.type === ASSET_TYPE.ERC721;
  let isOwnerNft = false;
  const addressOwnerNft = ownerNft && ownerNft[0]?.user?.walletAddress;
  const ownerAvatar = get(ownerNft, '[0].user.avatarImg', '');
  const ownerVerify = get(ownerNft, '[0].user.isVerify', false);

  const windowMode = useDetectWindowMode();

  const { forceUpdateData } = useSelector((state: any) => ({
    forceUpdateData: state?.forceUpdating?.internalSale,
  }));

  let totalNftOfOwner = 0;

  useEffect(() => {
    dispatch({
      type: themeActions.TOGGLE_THEME,
      payload: {
        ...theme,
      },
    });
    return () => {
      dispatch({
        type: themeActions.TOGGLE_THEME,
        payload: {
          ...initialStateTheme,
        },
      });
    };
  }, []);

  const isBid =
    isERC721 &&
    !!nftSaleStatus.length &&
    get(nftSaleStatus, '0.type') === NFT_SALE_TYPES.ENGLISH_AUCTION;
  // get ve trang thai cua nft: 1 mang de xem nft dang sale voi price nao
  const getNftSaleByNftId = useCallback(
    async (nftId: number, limit: number, page: number, nftType: string, assetData: any) => {
      try {
        const [data, err] = await saleNftService.getNftSaleDetailNftId(nftId, LIMIT_PAGE, page);
        if (err) {
          console.error(err);
          return;
        }
        setNfts(data?.items || []);

        //**  change struct from new api to old api for reduce update code */
        const newData = get(data, 'items', []).map((elm: any) => {
          return {
            ...elm,
            ...get(elm, 'nftSale', {}),
            nft: assetData,
          };
        });
        const listNftSale = newData.filter((elm: any) => elm?.nftSale);
        const listNftNotSale = newData.filter((elm: any) => !elm?.nftSale);
        setNftSaleStatus(listNftSale);
        setNftNotSale(listNftNotSale);
        if (data?.minNftSale?.nftSale) {
          setBestNftSale({
            ...get(data, 'minNftSale', {}),
            ...get(data, 'minNftSale.nftSale', {}),
            nft: assetData,
          });
        } else {
          setBestNftSale({});
        }
      } catch (err: any) {
        console.error(err);
      }
    },
    [walletAddress],
  );

  //get detail nft
  const getAssetDetail = useCallback(async () => {
    const walletAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS) as any;
    const [assetData, error] = await assetService.getAssetDetail({
      collectionAddress: address,
      tokenId,
      walletAddress: walletAddress || '',
    });
    if (error) {
      if (get(error, 'response.status') === 404) {
        router.push('/404');
      }
      return [null, error];
    }

    setAssetDataDetail(assetData);

    getNftSaleByNftId(assetData?.id, 10, 1, assetData?.collection?.type, assetData);

    return [assetData, null];
  }, [address, walletAddress, tokenId]);

  // get rarity
  const getRarityAssetDetail = useCallback(async () => {
    const [assetData, error] = await assetService.getRarityAssetDetail({
      collectionAddress: address,
      tokenId,
    });
    if (error) {
      if (get(error, 'response.status') === 404) router.push('/404');
      return [null, error];
    }

    setRarityAssetDetail(assetData);
  }, [address, tokenId]);

  // get properties
  const getPropertiesAssetDetail = useCallback(async () => {
    const [res, error] = await assetService.getPropertiesAssetDetail({
      collectionAddress: address,
      tokenId,
    });
    if (error) {
      if (get(error, 'response.status') === 404) router.push('/404');
      return [null, error];
    }

    if (res) {
      let newProperties = [];
      let newLevel = [];
      let newStats = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i]?.displayType === DISPLAY_TYPE_PROPERTY.PROPERTY) {
          newProperties.push(res[i]);
        } else if (res[i]?.displayType === DISPLAY_TYPE_PROPERTY.LEVEL) {
          newLevel.push(res[i]);
        } else {
          newStats.push(res[i]);
        }
      }
      setProperties(newProperties);
      setLevel(newLevel);
      setStats(newStats);
    }
  }, [address, tokenId]);

  useEffect(() => {
    if (chainId?.toString() !== NETWORK_CHAIN_ID) {
      setOpenPlaceABid(false);
    }
  }, [chainId]);

  useEffect(() => {
    if (address && tokenId) {
      getAssetDetail();
      getRarityAssetDetail();
      getPropertiesAssetDetail();
    }
  }, [address, tokenId, forceUpdateData]);

  useEffect(() => {
    if (tokenId && address) {
      setCollectionList([]);
    }
  }, [tokenId, address]);

  useEffect(() => {
    if (id) {
      initDataColection();
    }
  }, [assetDataDetail.id]);

  //get best offer
  const getBestOfferOfNft = useCallback(async (nftId: number) => {
    try {
      const [data, err] = await saleNftService.getBestOfferByOwner(nftId, {
        limit: 1,
        page: 1,
        priceType: 'DESC',
        walletAddress: '',
      });
      const dataOffer = get(data, 'items.0');

      setBestOfferOwner(dataOffer);
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (isERC721 && !isEmpty(assetDataDetail?.id)) {
      getBestOfferOfNft(assetDataDetail?.id);
    }
  }, [isBid, isERC721, assetDataDetail?.id, walletAddress]);

  // refesh data when action success
  const refreshData = useCallback(() => {
    getAssetDetail();
    if (isERC721) {
      getBestOfferOfNft(assetDataDetail?.id);
    }
    dispatch(forceUpdateInternalSale());
  }, [isBid, isERC721, assetDataDetail?.id, walletAddress]);

  const handleToggleModal = (status: boolean) => {
    dispatch(toggleModal({ type: MODAL_TYPE.SUCCESS_ITEM_SALE, status }));
  };

  const handleConfirmClose = () => {
    setConfirmBeforeClose(true);
  };
  const handleOpenUnlockableContent = async () => {
    if (!unlockableContent && isOwnerNft) {
      const [result, error] = await assetService.getUnlockableContent(
        assetDataDetail?.id as number,
      );
      if (result && result.unlockableContent) {
        setUnlockableContent(result.unlockableContent);
      }
    }
    setOpenUnlockContent(true);
  };

  //refesh nft metadata
  const refreshNftMetaData = debounce(async () => {
    try {
      setLoadingRefresh(true);
      const [result, error] = await nftService.refreshNFtMetaData({
        tokenId,
        collectionAddress: address,
      });
      if (result) {
        const [data] = await getAssetDetail();
        if (data) {
          dispatch(toastSuccess('Refresh successfully!'));
          return;
        }
      }
      dispatch(toastError('Something went wrong'));
    } catch (err: any) {
      console.error(err);
      dispatch(toastError('Something went wrong'));
    } finally {
      setLoadingRefresh(false);
    }
  }, 300);

  const renderArtist = useCallback(() => {
    if (isEmpty(assetDataDetail) || !ownerNft?.length) return '';
    if (isERC1155) {
      return String(assetDataDetail?.ownerNft?.length);
    }

    let artistAddress = ownerNft[0]?.user?.walletAddress;
    let userName = ownerNft[0]?.user?.username;
    if (!userName) {
      if (artistAddress) {
        userName = artistAddress;
      } else {
        userName = 'Unknown';
      }
    }
    return userName.trim();
  }, [walletAddress, assetDataDetail, isERC1155]);

  async function initDataColection(type?: string) {
    PAGE = 1;
    const walletAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS) as any;
    let params: any = {
      address,
      id: assetDataDetail.id,
      limit: LIMIT,
      page: PAGE,
    };
    if (walletAddress) {
      params.walletAddress = walletAddress;
      _walletAddress = walletAddress;
    }
    await fetchNft(params, false, type);
  }

  async function handleLoadMore(e: number) {
    if (e === collectionList.length - 4) {
      PAGE += 1;
      let params: any = {
        address,
        id: assetDataDetail.id,
        limit: LIMIT,
        page: PAGE,
      };
      if (_walletAddress) params.walletAddress = _walletAddress;
      await fetchNft(params, true);
    }
  }

  async function fetchNft(params: any, more?: boolean, type?: string) {
    try {
      const [response, error] = await assetService.getListNft(params);
      if (error) {
        return [];
      }
      const collections = (await _.get(response, 'items')) || [];
      if (more) {
        const list = [...collectionList, ...collections];
        setCollectionList(list);
      } else {
        setCollectionList(collections);
      }
    } catch (error) {
    } finally {
    }
  }

  const showModalSuccess = () => {
    handleToggleModal(true);
  };

  const handleToggleDialogSell = async () => {
    try {
      setLoadingButtonSell(true);
      const [data] = await getAssetDetail();
      dispatch({
        type: modalActions.MODAL_TOGGLE_MODAL,
        payload: {
          type: MODAL_TYPE.SELL_ASSET,
          status: true,
        },
      });
      setLoadingButtonSell(false);
    } catch (error) {
      dispatch(toastError('Something went wrong'));
    }
  };

  const expireDateMs = get(bestNftSale, 'expireDate', 0) * 1000;
  const startDateMs = get(bestNftSale, 'startDate', 0) * 1000;
  const isDutchAuction = bestNftSale?.type === 'dutch_auction';

  const nft1155ofUserOwner = nftSaleStatus.find(
    (item: any) => item?.user?.walletAddress?.toUpperCase() === walletAddress?.toUpperCase(),
  ) || { remainAmount: 0, quantity: 0 };

  const nft1155ofUserOwnerNotSale = nftNotSale.find(
    (item: any) => item?.user?.walletAddress?.toUpperCase() === walletAddress?.toUpperCase(),
  );

  const hasReserveBuyer = get(bestNftSale, 'reserveBuyer.walletAddress');

  const isUserReserveBuyer = get(bestNftSale, 'reserveBuyer.walletAddress') === walletAddress;

  const isOwnerOfBestNftSale =
    get(bestNftSale, 'user.walletAddress', '').toLowerCase() === walletAddress?.toLowerCase();

  const showCancelListingBanner =
    (isERC1155 &&
      nft1155ofUserOwner?.remainAmount >= nft1155ofUserOwner?.quantity &&
      nft1155ofUserOwner?.remainAmount !== 0) ||
    (isERC721 && isOwnerNft && nftSaleStatus.length > 0);

  const showEditAndSellBanner =
    !showCancelListingBanner &&
    ((isOwnerNft && isERC721 && nftSaleStatus.length === 0) ||
      (isERC1155 && nft1155ofUserOwnerNotSale));

  const showButtonBuyNow = !hasReserveBuyer
    ? (isERC721 &&
        !isOwnerNft &&
        nftSaleStatus.length &&
        moment(+get(bestNftSale, 'startDate', 0)).isBefore(moment().unix())) ||
      (isERC1155 && !isEmpty(bestNftSale) && !isOwnerNft) ||
      (isERC1155 && isOwnerNft && !isOwnerOfBestNftSale)
    : isUserReserveBuyer;

  const showButtonMakeOffer =
    !isBid &&
    (!isOwnerNft ||
      (isERC1155 && isOwnerNft && parseInt(get(assetDataDetail, 'ownerNft.length', 1)) > 1));

  const showBannerReserveBuyer =
    (isUserReserveBuyer || isOwnerNft) && !isEmpty(bestNftSale?.reserveBuyer);

  const placeBidStarted = get(bestNftSale, 'startDate')
    ? moment().diff(get(bestNftSale, 'startDate', 0) * 1000) > 0
    : false;

  const handleOpenPlaceABid = () => {
    if (walletAddress) {
      setOpenPlaceABid(true);
    } else {
      openModalConnectWallet();
    }
  };

  useUpdateEffect(() => {
    setOpenPlaceABid(false);
  }, [account]);

  const creatorName =
    assetDataDetail?.creator?.username || assetDataDetail?.creator?.walletAddress || 'Unknown';

  const handleReportNft = async (reasonValue: string, originalCollection?: number) => {
    const [responseData, error] = await assetService.reportNft({
      nftId: assetDataDetail.id,
      reason: reasonValue,
      originalCollectionId: originalCollection,
    });
    if (error) return;
    setOpenReport(false);
    dispatch(toastSuccess('This item has been reported'));
  };

  const Title = ({ isERC1155, quantity }: { isERC1155: any; quantity: any }) => {
    return (
      <>
        <div>
          <OverflowTooltip className="max-w-[300px]" title={title || 'Unknown'} arrow>
            <span>{title || 'Unknown'}</span>
          </OverflowTooltip>
          {isERC1155 ? (
            <div className="text-xs color-white opacity-60">{formatNumber(quantity)} available</div>
          ) : null}
        </div>
        <ContentTooltip title="Refresh Metadata">
          <div
            className="border border-[#6f7978] p-3 rounded-lg h-fit cursor-pointer"
            onClick={loadingRefresh ? () => {} : refreshNftMetaData}
            style={{ border: '1px solid #6f7978' }}
          >
            <div className={`${loadingRefresh ? 'refreshBtn' : ''}`}>
              <RefreshBtn color={theme?.icon?.color} />
            </div>
          </div>
        </ContentTooltip>
      </>
    );
  };

  const AvtCollection = () => {
    const NAME_LENGTH = 9;
    return (
      <AvatarOwned
        link={`/collection/${collection?.address}`}
        artist={shortenNameNotiHasAddress(collection?.title || collection?.name, NAME_LENGTH)}
        customTooltip={collection?.title || collection?.name}
        srcAvatar={collection?.thumbnailUrl || undefined}
        position="Collection"
        artistClassName={'w-[100px]'}
        isDisableToolTip={collection?.title?.length <= NAME_LENGTH}
        textStyle={theme?.text}
        iconStyle={theme?.icon}
      />
    );
  };

  const AvtOwned = () => {
    const NAME_LENGTH = 9;
    return (
      <div>
        <AvatarOwned
          type={assetDataDetail?.collection?.type}
          position="Owned"
          link={isERC721 ? `/artist/${addressOwnerNft}` : router.asPath}
          artist={shortenNameNotiHasAddress(renderArtist(), NAME_LENGTH)}
          customTooltip={renderArtist()}
          srcAvatar={isERC721 ? ownerAvatar : null}
          verified={ownerVerify}
          isDisableToolTip={renderArtist()?.length <= NAME_LENGTH}
          ownerAsset
          textStyle={theme?.text}
          iconStyle={theme?.icon}
        />
      </div>
    );
  };

  const Overview = ({ sticky }: any) => (
    <div className={` ${sticky ? 'absolute flex right-0 top-0 m-0' : 'my-10'}`}>
      <ItemOverview
        nftId={assetDataDetail?.id}
        isLike={assetDataDetail?.liked}
        likes={assetDataDetail?.likes}
        pricePercent={assetDataDetail?.pricePercent}
        getAssetDetail={getAssetDetail}
        setOpenReport={setOpenReport}
        views={assetDataDetail?.viewNumber}
        sticky={sticky}
      />
    </div>
  );

  const SaleTime = () => (
    <>
      {startDateMs > 0 && !placeBidStarted && (
        <div className="flex font-bold text-base pt-6 pb-1 items-center">
          <ClockSvg color={theme?.icon?.color} style={{ width: '20px', height: '20px' }} />
          <span className="ml-2.5">
            Sale starts {moment(startDateMs).format('ll')} at{' '}
            {String(moment(startDateMs).format('hh:mma'))}
            {moment().format('Z').slice(0, 3)}
          </span>
          {isBid && (
            <Tooltip
              title={
                'Extending Auction a new highest bid placed under 10 minutes remaining will extend the auction by an additional 10 minutes.'
              }
            >
              <img
                src="/icons/icon-help.png"
                className="w-[16px] h-[16px] ml-[5px] cursor-pointer"
                alt="help"
              />
            </Tooltip>
          )}
        </div>
      )}
      {placeBidStarted && expireDateMs > 0 && (
        <div className="flex font-bold text-base pt-6 pb-1 items-center">
          <ClockSvg color={theme?.icon?.color} style={{ width: '20px', height: '20px' }} />
          <span className="ml-2.5">
            Sale ends {moment(expireDateMs).format('ll')} at{' '}
            {String(moment(expireDateMs).format('hh:mma'))} {moment().format('Z').slice(0, 3)}
            {isDutchAuction
              ? ` at ${roundNumber(
                  bestNftSale?.endPrice,
                  8,
                )} ${bestNftSale?.currencyToken?.toUpperCase()}`
              : ''}
          </span>
          {isBid && (
            <Tooltip
              title={
                'Extending Auction a new highest bid placed under 10 minutes remaining will extend the auction by an additional 10 minutes.'
              }
            >
              <img
                src="/icons/icon-help.png"
                className="w-[16px] h-[16px] ml-[5px] cursor-pointer"
                alt="help"
              />
            </Tooltip>
          )}
        </div>
      )}
    </>
  );

  const Description = () => (
    <>
      <div className="text--headline-xsmall mt-10 flex">
        <div className="mr-2">Description</div>
        {externalLink && (
          <Link href={formatUrl(externalLink)} passHref>
            <a target="_blank" className="my-auto">
              <ContentTooltip arrow title={`View external link to learn more`}>
                <div className="my-auto cursor-pointer">
                  <img src="/icons/icon-hypelink.svg" alt="" />
                </div>
              </ContentTooltip>
            </a>
          </Link>
        )}
      </div>
      <div className="mt-2 " style={{ wordWrap: 'break-word' }}>
        <p className="whitespace-pre-wrap leading-[22px]">
          {showLess ? description && shortenNameNoti(description, 200) : description}
        </p>
        {description && description.length > 200 && (
          <div
            onClick={() => setShowLess(!showLess)}
            className="text-primary-90 mt-2 cursor-pointer"
            style={theme.text}
          >
            {!showLess ? 'Show less' : 'Show more'}
          </div>
        )}
      </div>
    </>
  );

  const mobileView = [WINDOW_MODE.SM, WINDOW_MODE.MD, WINDOW_MODE.LG].includes(windowMode);
  return (
    <>
      <Head>
        <title>{assetData.title}</title>
        <meta property="og:title" content={assetData.title} key="title" />
        <meta name="description" content={assetData.description} key="description" />
        <meta
          property="og:image"
          content={convertUrlImage(assetData.nftImagePreview)}
          key="image"
        />
        <meta property="og:image:alt" content="NFT" key="imgAlt" />
      </Head>
      <div key={`${address}_${tokenId}`}>
        <div className="hidden xl:block">
          {showEditAndSellBanner && (
            <EditAndSellAsset
              assetDataDetail={assetDataDetail}
              collection={collection}
              getAssetDetail={refreshData}
              showModalSuccess={showModalSuccess}
              bestNftSale={bestNftSale}
              isLoadingButtonSell={isLoadingButtonSell}
              handleToggleDialogSell={handleToggleDialogSell}
              isERC721={isERC721}
            />
          )}
          {showCancelListingBanner && (
            <CancelListing
              assetDataDetail={assetDataDetail}
              getAssetDetail={refreshData}
              nftType={collection?.type}
              saleNft={isERC721 ? bestNftSale : nft1155ofUserOwner}
              collectionAddress={collection?.address}
            />
          )}
          {showBannerReserveBuyer && (
            <BannerReserveBuyer
              isOwnerNft={isOwnerNft}
              isUserReserveBuyer={isUserReserveBuyer}
              reserveBuyer={bestNftSale?.reserveBuyer}
            />
          )}
        </div>
        <div className="bg-background-asset-detail">
          <div className="xl:mt-[20px] mb-[60px] mx-auto xl:flex gap-10 layout">
            <div className="xl:nft-left xl:w-1/2">
              <div className="image-nft flex justify-center">
                <NftContent
                  nftUrl={assetDataDetail?.nftUrl || ''}
                  nftImagePreview={assetDataDetail?.nftImagePreview || ''}
                />
                <div className="xl:hidden flex">
                  <Overview sticky={true} />
                </div>
              </div>
              <div className="xl:hidden block">
                {showEditAndSellBanner && (
                  <EditAndSellAsset
                    assetDataDetail={assetDataDetail}
                    collection={collection}
                    getAssetDetail={refreshData}
                    showModalSuccess={showModalSuccess}
                    bestNftSale={bestNftSale}
                    isLoadingButtonSell={isLoadingButtonSell}
                    handleToggleDialogSell={handleToggleDialogSell}
                    isERC721={isERC721}
                  />
                )}
                {showCancelListingBanner && (
                  <CancelListing
                    assetDataDetail={assetDataDetail}
                    getAssetDetail={refreshData}
                    nftType={collection?.type}
                    saleNft={isERC721 ? bestNftSale : nft1155ofUserOwner}
                    collectionAddress={collection.address}
                  />
                )}
                {showBannerReserveBuyer && (
                  <BannerReserveBuyer
                    isOwnerNft={isOwnerNft}
                    isUserReserveBuyer={isUserReserveBuyer}
                    reserveBuyer={bestNftSale?.reserveBuyer}
                  />
                )}
              </div>
              <div className="px-3 xl:px-[unset]">
                {mobileView && (
                  <div className="text--headline-small flex justify-between pt-[25px]">
                    <Title isERC1155={isERC1155} quantity={assetDataDetail?.maxQuantity} />
                  </div>
                )}

                <div className="flex mt-[36px] justify-between">
                  <AvatarOwned
                    link={
                      // isERC721 && assetDataDetail?.creator?.walletAddress
                      assetDataDetail?.creator?.walletAddress
                        ? `/artist/${assetDataDetail?.creator?.walletAddress}`
                        : router.asPath
                    }
                    position="creator"
                    artist={shortenNameNotiHasAddress(creatorName.trim(), 9)}
                    customTooltip={creatorName}
                    verified={get(assetDataDetail, 'creator.isVerify', false)}
                    srcAvatar={assetDataDetail?.creator?.avatarImg}
                    isDisableToolTip={creatorName?.trim().length <= 9}
                    textStyle={theme?.text}
                    iconStyle={theme?.icon}
                  />
                  <div>{mobileView && <AvtCollection />}</div>
                </div>

                {mobileView && (
                  <>
                    <div className="flex justify-between mt-5">
                      <AvtOwned />
                    </div>
                    <Overview />
                    {assetDataDetail && assetDataDetail.isUnlockableContent && (
                      <Box
                        onClick={handleOpenUnlockableContent}
                        className="bg-[#7340D3] text-[14px] w-[100%] cursor-pointer h-[50px] font-bold mb-[31px] flex items-center justify-center rounded-[100px]"
                        sx={{
                          background: `${theme?.button?.default?.background || '#7340D3'} !important`,
                        }}
                      >
                        {isOwnerNft ? 'Reveal unlockable content' : 'Includes unlockable content'}
                      </Box>
                    )}
                  </>
                )}

                <RarityIndex rarityAssetDetail={rarityAssetDetail} />

                <div className="lg:hidden mt-5">
                  <Divider />
                </div>

                {mobileView && (
                  <>
                    <SaleTime />
                    <div
                      className={`${
                        showCancelListingBanner ? '' : 'flex'
                      } justify-between items-center`}
                    >
                      <PriceAssetDetail
                        key={forceUpdateData}
                        assetDataDetail={assetDataDetail}
                        bestNftSale={bestNftSale}
                        isBid={isBid}
                        bestOfferOwner={bestOfferOwner}
                        setPriceBidSuggest={setPriceShowing}
                      />
                      {showCancelListingBanner && (
                        <EditPriceListing
                          bestNftSale={bestNftSale}
                          nftSaleStatus={nftSaleStatus}
                          nftType={collection?.type}
                          refreshData={refreshData}
                          floorPrice={assetDataDetail?.floorPrice || 0}
                          isCollectionImport={collection?.isImport}
                        />
                      )}
                    </div>
                    <div className="flex mt-5">
                      {!isBid && showButtonBuyNow && (
                        <BuyNow
                          key={walletAddress}
                          assetDataDetail={assetDataDetail}
                          collection={collection}
                          tokenId={tokenId}
                          nftSaleStatus={nftSaleStatus}
                          getAssetDetail={getAssetDetail}
                          bestNftSale={bestNftSale}
                          style={theme?.button?.default}
                        />
                      )}
                      {showButtonMakeOffer && (
                        <MakeOffer
                          className={!isBid && showButtonBuyNow ? 'ml-3' : ''}
                          assetDataDetail={assetDataDetail}
                          refeshData={refreshData}
                          style={theme?.button?.outline}
                        />
                      )}
                      {!!isBid && !isOwnerNft && (
                        <FilledButton
                          icon={true}
                          text="Place a bid"
                          onClick={handleOpenPlaceABid}
                          disabled={!placeBidStarted}
                          style={theme?.button?.outline}
                        />
                      )}
                    </div>
                    {(mobileView && !isBid && showButtonBuyNow) ||
                    (mobileView && showButtonMakeOffer) ||
                    (mobileView && !!isBid && !isOwnerNft) ? (
                      <Divider className="mt-5" />
                    ) : null}
                    <Description />
                    <ChartActivities
                      assetDataDetail={assetDataDetail}
                      nfts={nfts}
                      getAssetDetail={getAssetDetail}
                      refeshData={refreshData}
                      totalNftOfOwner={totalNftOfOwner}
                    />
                  </>
                )}
                <DetailContract tokenId={tokenId} style={theme.icon} collection={collection} />

                {(collection?.stakingUrl ||
                  collection?.vrUrl ||
                  collection?.gameUrl ||
                  collection?.governanceUrl) && <Utility collection={collection} />}

                {properties.length > 0 && <PropertiesAsset style={theme} properties={properties} />}
                {level.length > 0 && (
                  <Level isLevel style={theme} className="max-h-[255px]" properties={level} />
                )}
                {stats.length > 0 && (
                  <Level style={theme} className="max-h-[235px]" properties={stats} />
                )}
              </div>
            </div>
            <div className="xl:nft-right xl:w-1/2 px-[16px] xl:px-[unset]">
              {[WINDOW_MODE.XL, WINDOW_MODE['2XL']].includes(windowMode) && (
                <>
                  <div className="text--headline-small flex justify-between">
                    <Title isERC1155={isERC1155} quantity={assetDataDetail?.maxQuantity} />
                  </div>
                  <div className="flex justify-between mt-5">
                    <AvtOwned />
                    <div>
                      <AvtCollection />
                    </div>
                  </div>
                  <Description />
                  <Overview />
                  {assetDataDetail && assetDataDetail.isUnlockableContent && (
                    <Box
                      onClick={handleOpenUnlockableContent}
                      className="bg-[#7340D3] text-[14px] w-[100%] cursor-pointer h-[50px] font-bold mb-[31px] flex items-center justify-center rounded-[8px]"
                      sx={{
                        background: `${theme?.button?.default?.background || '#7340D3'} !important`,
                      }}
                    >
                      {isOwnerNft ? 'Reveal unlockable content' : 'Includes unlockable content'}
                    </Box>
                  )}
                  <Divider />
                  <SaleTime />
                  <div className="flex justify-between items-start max-w-[544px]">
                    <div className={`price ${showCancelListingBanner ? 'w-[75%]' : 'w-[100%]'}`}>
                      <PriceAssetDetail
                        key={forceUpdateData}
                        assetDataDetail={assetDataDetail}
                        bestNftSale={bestNftSale}
                        isBid={isBid}
                        bestOfferOwner={bestOfferOwner}
                        setPriceBidSuggest={setPriceShowing}
                        shortView={showCancelListingBanner}
                      />
                    </div>

                    {showCancelListingBanner && (
                      <div className="edit w-[25%] flex justify-end mt-[25px]">
                        <EditPriceListing
                          bestNftSale={bestNftSale}
                          nftSaleStatus={nftSaleStatus}
                          nftType={collection?.type}
                          refreshData={refreshData}
                          floorPrice={assetDataDetail?.floorPrice || 0}
                          isCollectionImport={collection?.isImport}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex mt-5">
                    {!isBid && showButtonBuyNow && (
                      <BuyNow
                        key={walletAddress}
                        assetDataDetail={assetDataDetail}
                        collection={collection}
                        tokenId={tokenId}
                        nftSaleStatus={nftSaleStatus}
                        getAssetDetail={getAssetDetail}
                        bestNftSale={bestNftSale}
                        style={theme?.button?.default}
                      />
                    )}
                    {showButtonMakeOffer && (
                      <MakeOffer
                        className={!isBid && showButtonBuyNow ? 'ml-3' : ''}
                        assetDataDetail={assetDataDetail}
                        refeshData={refreshData}
                        style={theme?.button?.outline}
                      />
                    )}
                    {!!isBid && !isOwnerNft && (
                      <FilledButton
                        icon={true}
                        text="Place a bid"
                        onClick={handleOpenPlaceABid}
                        disabled={!placeBidStarted}
                        style={theme?.button?.outline}
                      />
                    )}
                  </div>
                  <ChartActivities
                    assetDataDetail={assetDataDetail}
                    getAssetDetail={getAssetDetail}
                    nfts={nfts}
                    refeshData={refreshData}
                    totalNftOfOwner={totalNftOfOwner}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <ModalCommon
          title="Are you sure you want to cancel?"
          open={openConfirmCancel}
          handleClose={() => setOpenConfirmCancel(false)}
        >
          <ConfirmCancel
            nftType={collection?.type}
            saleNftId={12} // TODO MOCK
            collectionAddress={collection?.address}
          />
        </ModalCommon>
        {openPlaceABid && (
          <ModalCommon
            title="Place a bid"
            open={openPlaceABid}
            isCloseIcon={!hideCloseButton}
            handleClose={handleConfirmClose}
            wrapperClassName={`sm:pb-4`}
          >
            <PlaceABid
              collectionName={collection?.title || 'Unknown'}
              artistName={renderArtist()}
              artistAddress={ownerNft && ownerNft[0]?.user?.walletAddress}
              collectionAddress={collection?.address}
              bestNftSale={bestNftSale}
              handleClose={() => {
                setOpenPlaceABid(false);
                setHideCloseButton(false);
              }}
              refeshData={refreshData}
              priceShowing={priceShowing}
              bestOfferOwner={priceShowing}
              setHideCloseButton={(isCloseIcon: boolean) => setHideCloseButton(isCloseIcon)}
              isBid={isBid}
              assetDataDetail={assetDataDetail}
            />
          </ModalCommon>
        )}

        <ModalConfirm
          title="Are you sure you want to cancel?"
          open={confirmBeforeClose}
          onConfirm={() => {
            setConfirmBeforeClose(false);
            setOpenPlaceABid(false);
          }}
          onClose={() => {
            setConfirmBeforeClose(false);
          }}
        />
        <ModalCommon
          title="Report This Item"
          open={openReport}
          handleClose={() => setOpenReport(false)}
          wrapperClassName={'overflow-visible'}
          isCloseIcon={false}
        >
          <ModalReport
            handleClose={() => setOpenReport(false)}
            reportNft={(reasonValue, originalCollection) =>
              handleReportNft(reasonValue, originalCollection)
            }
          />
        </ModalCommon>
        {assetDataDetail && assetDataDetail.isUnlockableContent && (
          <ModalCommon
            title="Unlockable Content"
            isCloseIcon={false}
            open={openUnlockContent}
            handleClose={() => setOpenUnlockContent(false)}
            wrapperClassName={'overflow-visible'}
          >
            <div className="w-[100%] text-[14px]">
              <div className="w-[100%] bg-[#444B56] overflow-hidden rounded-[8px] mt-[19px] h-[155px] flex">
                <div className="w-[90%] m-[auto] h-[70%] overflow-auto whitespace-pre-wrap leading-[20px]">
                  {isOwnerNft ? unlockableContent : ''}
                </div>
              </div>
              {!isOwnerNft && (
                <div className="my-[19px] text-center opacity-[60%]">
                  This content can only be unlocked and revealed by the owner of this item.
                </div>
              )}
              <div
                onClick={() => setOpenUnlockContent(false)}
                className="bg-[#7340D3] w-[100%] cursor-pointer h-[50px] font-bold mt-[34px] xl:mb-[34px] flex items-center justify-center rounded-[100px]"
              >
                Close
              </div>
            </div>
          </ModalCommon>
        )}
        <Box className="collection-view xl:bg-[#252d3a] xl:py-[64px] pt-0 xl:pt-[30px] xl:px-[156px] w-[100%] min-h-[100%] py-[30px] bg-[red]">
          <div className="layout mx-auto">
            <label className="asset-title text-[24px] px-3 lg:text-[45px]">
              More from this collection
            </label>
            <Box className="carousel-wrape max-w-[100vw] lg:max-w-[unset]">
              {collectionList.length === 0 ? (
                <Box className="no-data">
                  <ImageBase alt="No Data" errorImg="NoData" width={175} height={160} />
                  <label>No other item in this collection yet</label>
                </Box>
              ) : (
                <Box
                  className="carousel-wrape__carousel"
                  sx={{
                    '.react-multiple-carousel__arrow': {
                      backgroundColor: `${
                        theme?.button?.default?.background || '#f4b1a3  !important'
                      }`,
                    },
                  }}
                >
                  <Carousel
                    responsive={responsive}
                    sliderClass="carousel-wrape--view"
                    itemClass="carousel-item"
                    autoPlay={false}
                    autoPlaySpeed={1000 * 1000}
                    slidesToSlide={1}
                    beforeChange={handleLoadMore}
                    className="grid grid-cols-4 xl:gap-6 gap-3 p-0 m-0"
                  >
                    {collectionList.map((NFTItem: any, index: number) => {
                      const dateNow = Math.floor(Date.now() / 1000);
                      return (
                        <div className="carousel-card-wrapper">
                          {theme?.text ? (
                            <FlagshipCard
                              type={TYPE_LIKES.NFT}
                              key={index}
                              dataNFT={NFTItem}
                              dateNow={dateNow}
                              callbackFetchList={() => {
                                initDataColection();
                                dispatch(forceUpdateInternalSale());
                              }}
                            />
                          ) : (
                            <CardCommon
                              type={TYPE_LIKES.NFT}
                              key={index}
                              dataNFT={NFTItem}
                              dateNow={dateNow}
                              callbackFetchList={() => {
                                initDataColection();
                                dispatch(forceUpdateInternalSale());
                              }}
                              // loading={true}
                            />
                          )}
                        </div>
                      );
                    })}
                  </Carousel>
                </Box>
              )}
            </Box>
          </div>
        </Box>
        <ModalSuccessItemSale
          open={toggleModalSuccessItemSale as boolean}
          handleClose={() => handleToggleModal(false)}
          assetDataDetail={assetDataDetail}
        />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  try {
    const { address, tokenId } = params as any;
    const result: any = await assetService.fetchSEOAssetDetails({
      collectionAddress: address,
      tokenId,
    });
    const response = await result.json();
    if (response) {
      // const theme = response?.creator?.flagshipStore?.theme || {};
      return { props: { assetData: response, theme } };
    }
    return { props: {} };
  } catch {
    return { props: {} };
  }
};

export default Nft;

export const theme = {
  box: {
    outline: {
      borderWidth: '1px',
      borderColor: '#F47C06',
    },
  },
  text: {
    color: '#F47C06',
    fontFamily: 'system-ui',
    fontWeight: '900',
  },
  input: {
    placeholder: {
      color: '#000000',
    },
    text: {
      color: '#000000',
      fontWeight: '900',
    },
    background: {
      backgroundColor: '#fffafa',
    },
  },
  icon: {
    color: '#F47C06',
  },
  button: {
    tonal: {
      active: {
        backgroundColor: '#F47C06',
      },
      nonActive: {
        color: '#F47C06',
      },
    },
    outline: {
      borderColor: '#F47C06 !important',
      color: '#F47C06 !important',
      border: '1px solid #F47C06',
    },
    default: {
      background: '#F47C06',
      color: '#fff',
    },
    filled: {
      background: '#F47C06',
      color: '#F47C06',
    },
  },
  avatar: {
    circle: {
      borderWidth: '3px',
      borderColor: '#F47C06',
    },
  },
  background: {
    backgroundColor: 'black',
    backgroundGradientColor: 'linear-gradient(270deg, #F47C06 0%, #9EF67E 67.71%) !important',
  },
  media: {
    logos: [
      {
        index: 1,
        url: 'https://i.ibb.co/zH6zR9m/RAX-Logo2-3.png',
        description:
          'Without a ripple there is no styling for :focus-visible by default. Be sure to highlight the element by applying separate styles with the',
        style: {
          width: '95px',
        },
      },
      {
        index: 2,
        url: 'https://i.ibb.co/LQHrmfc/RAX-Logo-16.png',
        description:
          'Without a ripple there is no styling for :focus-visible by default. Be sure to highlight the element by applying separate styles with the',
        style: {
          width: '95px',
        },
      },
    ],
    links: [
      {
        index: 1,
        url: 'https://mui.com/material-ui/api/tab/',
        name: 'MADworQAAld',
        description: '',
      },
      {
        index: 2,
        url: 'https://mui.com/material-ui/api/tab/',
        name: 'About Madworld',
        description: '',
      },
      {
        index: 3,
        url: 'https://mui.com/material-ui/api/tab/',
        name: 'UMAD',
        description: '',
      },
    ],
  },
};
