import { FC, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import get from 'lodash/get';
import { ComposedChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';

import saleNftService from 'service/saleNftService';
import { data } from './data';
import ModalCommon from 'components/common/modal';
import AcceptThisOffer from './accept-offer-confirm';
import AcceptOfferProcessing from './accept-offer-processing';
import { ASSET_TYPE, OFFER_SALE_NFT_ACTION } from 'constants/app';
import Seller1155Card from 'components/modules/seller-1155-card';
import PriceHistory from './price-history';
import ActivityTab from './activity-tab';
import AssetOfferingList from './offering-list';
import { handleCancelBid } from 'blockchain/utils';
import { toastError, toastSuccess } from 'store/actions/toast';
import { IModalState } from 'store/reducers/modal';
import { toggleModal } from 'store/actions/modal';
import { MODAL_TYPE } from 'store/constants/modal';
import ModalConfirm from 'components/common/modal-confirm';
import { PLEASE_RELOAD_PAGE } from 'constants/text';
import useUpdateEffect from 'hooks/useUpdateEffect';
import BigNumber from 'bignumber.js';
import { handleCancelBidCreated } from 'blockchain/utils-created';
import _ from 'lodash';

interface TabPanelProp {
  children: any;
  value: number | string;
  index: number;
  dir: any;
}

function TabPanel({ children, value, index, dir, ...other }: TabPanelProp) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TABS: { label: string; value: string }[] = [
  {
    value: 'owner',
    label: 'owner',
  },
  {
    value: 'priceHistory',
    label: 'Price History',
  },
  {
    value: 'assetOfferingList',
    label: 'Asset Offering List',
  },
  {
    value: 'assetActivity',
    label: 'Asset Activity',
  },
];

interface IOfferRecords {
  items: any[];
  hasMore: boolean;
  totalPages: number;
  nextPage: number;
}

const DEFAULT_RECORDS: IOfferRecords = {
  items: [],
  hasMore: false,
  totalPages: 0,
  nextPage: 0,
};

interface IChartActivitiesProps {
  assetDataDetail: any;
  getAssetDetail: any;
  nfts: any;
  refeshData: () => void;
  totalNftOfOwner?: number;
  isSearchAsset?: boolean;
}

export const ChartActivities: FC<IChartActivitiesProps> = (props) => {
  const {
    assetDataDetail,
    nfts = [],
    getAssetDetail,
    refeshData,
    totalNftOfOwner = 0,
    isSearchAsset,
  } = props;

  const isERC1155 = assetDataDetail?.collection?.type === ASSET_TYPE.ERC1155;
  const dispatch = useDispatch();
  const theme = useTheme();
  const toggleModalAcceptOffer = useSelector(
    (state: { modal: IModalState }) => state.modal.toggleModalAcceptOffer,
  );
  const offersDataRef = useRef<any[]>([]);
  const [tabHistory, setTabHistory] = useState<number>(isSearchAsset ? 0 : isERC1155 ? 0 : 1);
  const [offerId, setOfferId] = useState<number>(0);
  const [offerLoading, setOfferLoading] = useState<boolean>(false);
  const [offerPagination, setOfferPagination] = useState({
    limit: 20,
    page: 1,
  });
  const [offerRecords, setOfferRecords] = useState<IOfferRecords>(DEFAULT_RECORDS);
  const [cancelOfferLoadingId, setCancelOfferLoadingId] = useState(0);
  const [isShowAcceptOfferProcessingModal, setIsShowAcceptOfferProcessingModal] = useState(false);
  const [resOfferDetail, setResOfferDetail] = useState<any>(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const toggleModalProcessingMakeOffer = useSelector(
    (state: { modal: IModalState }) => state.modal.toggleModalProcessingMakeOffer,
  );

  const { forceUpdateData } = useSelector((state: any) => ({
    forceUpdateData: state?.forceUpdating?.internalSale,
  }));

  const handleToggleModal = (status: boolean) => {
    dispatch(toggleModal({ type: MODAL_TYPE.ACCEPT_OFFER, status }));
  };

  const getOffersListing = useCallback(async () => {
    if (typeof assetDataDetail?.id !== 'number') return;
    setOfferLoading(true);
    const [data] = await saleNftService.getOffersByNftId(
      assetDataDetail?.id,
      offerPagination,
      `?priceType=DESC`,
    );

    if (data) {
      setOfferLoading(false);
      const totalPages = get(data, 'meta.totalPages', 0);
      const currentPage = get(data, 'meta.currentPage', 1);
      const temptItems = get(data, 'items', []);

      const nextOffers = offersDataRef.current.concat(temptItems);
      offersDataRef.current = nextOffers;
      const nextPage = currentPage < totalPages ? currentPage + 1 : currentPage;

      setOfferRecords({
        items: nextOffers,
        hasMore: currentPage < totalPages,
        totalPages: 1,
        nextPage,
      });
    } else {
    }
  }, [assetDataDetail?.id]);

  const handleAccept = async (offerId: number) => {
    const [offerDetail, err] = await saleNftService.getOfferDetailById(offerId);
    if (offerDetail?.type !== OFFER_SALE_NFT_ACTION.NOT_ACCEPT) {
      return dispatch(toastError(PLEASE_RELOAD_PAGE));
    }
    handleToggleModal(true);
    setOfferId(offerId);
  };

  const handleCancel = async (offerId: number) => {
    setCancelOfferLoadingId(offerId);
    try {
      const [orderDetail] = await saleNftService.getOfferDetailById(offerId);
      if (orderDetail?.type !== OFFER_SALE_NFT_ACTION.NOT_ACCEPT) {
        dispatch(toastError(PLEASE_RELOAD_PAGE));
        offersDataRef.current = [];
        return getOffersListing();
      }

      if (orderDetail) {
        let transaction;
        let error;
        if (orderDetail?.nft?.collection?.isImport) {
          [transaction, error] = await handleCancelBid({
            feeRecipient: orderDetail?.signatureSale?.feeRecipient,
            listingTime: orderDetail?.signatureSale?.listingTime,
            maker: orderDetail?.signatureSale?.maker,
            taker: orderDetail?.signatureSale?.taker,
            expirationTime: orderDetail?.signatureSale?.expirationTime,
            makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
            salt: orderDetail?.signatureSale?.salt,
            takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
            tokenType: orderDetail?.currencyToken,
            r: orderDetail?.signatureSale?.r,
            s: orderDetail?.signatureSale?.s,
            v: orderDetail?.signatureSale?.v,
            quantity: orderDetail?.quantity,
            price: new BigNumber(orderDetail?.price).toString(),
            tokenId: assetDataDetail?.tokenId,
            collectionAddress: assetDataDetail.collection.address,
            nftType: assetDataDetail.collection.type,
          });
        } else {
          [transaction, error] = await handleCancelBidCreated({
            calldata: orderDetail?.signatureSale?.calldata,
            feeRecipient: orderDetail?.signatureSale?.feeRecipient,
            listingTime: orderDetail?.signatureSale?.listingTime,
            maker: orderDetail?.signatureSale?.maker,
            taker: orderDetail?.signatureSale?.taker,
            expirationTime: orderDetail?.signatureSale?.expirationTime,
            makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
            salt: orderDetail?.signatureSale?.salt,
            takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
            tokenType: orderDetail?.currencyToken,
            r: orderDetail?.signatureSale?.r,
            s: orderDetail?.signatureSale?.s,
            v: orderDetail?.signatureSale?.v,
            quantity: orderDetail?.quantity,
            price: new BigNumber(orderDetail?.price).toString(),
            tokenId: assetDataDetail?.tokenId,
            collectionAddress: assetDataDetail.collection.address,
            nftType: assetDataDetail.collection.type,
            replacementPattern: orderDetail?.replacementPattern,
          });
        }

        if (error) {
          throw error;
        }
        await transaction.wait(1);

        await saleNftService.cancelOfferSuccess(offerId);
        offersDataRef.current = [];
        dispatch(toastSuccess('Cancel this offer successfully!'));
        getOffersListing();
        refeshData();
      }
    } catch (error: any) {
      if (
        error?.code === 4001 ||
        String(error)?.includes('User rejected') ||
        String(error)?.includes('User denied')
      ) {
        dispatch(toastError('You declined the action in your wallet.'));
      } else {
        dispatch(toastError('Something went wrong.'));
      }
    }
    setCancelOfferLoadingId(0);
  };

  const tabsDisplay = useMemo(() => {
    if (isERC1155) return TABS;
    return TABS.slice(1);
  }, [isERC1155]);

  useEffect(() => {
    getOffersListing();
    return () => {
      offersDataRef.current = [];
    };
  }, [assetDataDetail.id]);

  const refetchData = useCallback(() => {
    offersDataRef.current = [];
    getOffersListing();
    refeshData();
  }, [assetDataDetail?.id, offerPagination]);

  useUpdateEffect(() => {
    const offerIndex = tabsDisplay.findIndex((tab) => tab.value === 'assetOfferingList');

    if (tabHistory === offerIndex) {
      offersDataRef.current = [];
      setOfferRecords(DEFAULT_RECORDS);
      getOffersListing();
    }
  }, [tabHistory, toggleModalProcessingMakeOffer]);

  const renderTab = (tab: string) => {
    switch (tab) {
      case 'owner':
        return (
          <div className="h-[430px]">
            {nfts.map((nft: any) => {
              return (
                <Seller1155Card
                  key={`${nft?.id}`}
                  assetDataDetail={assetDataDetail}
                  nft={nft}
                  getAssetDetail={getAssetDetail}
                />
              );
            })}
          </div>
        );
      case 'priceHistory':
        return <PriceHistory assetDataDetail={assetDataDetail} />;
      case 'assetOfferingList':
        return (
          <AssetOfferingList
            assetDataDetail={assetDataDetail}
            loading={offerLoading}
            records={offerRecords}
            onAccept={handleAccept}
            onCancel={handleCancel}
            cancelOfferLoadingId={cancelOfferLoadingId}
            onLoadMore={() =>
              setOfferPagination({ ...offerPagination, page: offerRecords.nextPage })
            }
            isERC1155={isERC1155}
          />
        );
      case 'assetActivity':
        return <ActivityTab assetDataDetail={assetDataDetail} />;

      default:
        break;
    }
  };

  const openAcceptOfferProcessingModal = async () => {
    const [res] = await saleNftService.getOfferDetailById(offerId);
    setResOfferDetail(res);
    setIsShowAcceptOfferProcessingModal(true);
  };

  useUpdateEffect(() => {
    const refreshData = async () => {
      setOfferLoading(true);

      const [data] = await saleNftService.getOffersByNftId(
        assetDataDetail?.id,
        offerPagination,
        `?priceType=DESC`,
      );
      if (data) {
        setOfferLoading(false);
        const temptItems = get(data, 'items', []);
        setOfferRecords({
          ...offerRecords,
          items: temptItems,
        });
      }
    };
    refreshData();
  }, [forceUpdateData]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.off(EventSocket.CANCEL_INTERNAL_SALE).on(EventSocket.CANCEL_INTERNAL_SALE, (res) => {
  //       if (res?.data?.fromAddress === walletAddress) {
  //         offersDataRef.current = [];
  //         dispatch(toastSuccess('Cancel this offer successfully!'))
  //         getOffersListing();
  //         if (indexCancel === 0) {
  //           refeshData();
  //         }
  //       }
  //     });
  //   }
  // },[walletAddress, indexCancel])
  const { text } = useSelector((state:any) => state.theme);
  return (
    <div className="flex justify-center ">
      <Box className="mt-10 w-full">
        <AppBar position="static">
          <Tabs
            value={tabHistory}
            onChange={(
              event: React.SyntheticEvent<Element, Event>,
              newValue: React.SetStateAction<number>,
            ) => {
              setTabHistory(newValue);
            }}
            indicatorColor="primary"
            TabIndicatorProps={{ style: { background: text?.color || '#B794F6' } }}
            textColor="inherit"
            variant="scrollable"
            scrollButtons
            aria-label="scrollable auto tabs"
            className="tab-asset"
          >
            {tabsDisplay.map((tab, index) => (
              <Tab sx={{
                '&.Mui-selected': { color: `${text?.color} !important` },
                '&:active': { color: `${text?.color} !important` }
              }} className="!capitalize" key={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabHistory}
          onChangeIndex={(v) => setTabHistory(v)}
          className="tab-asset-detail"
        >
          {tabsDisplay.map((tab, index) => (
            <TabPanel key={index} value={tabHistory} index={index} dir={theme.direction}>
              {renderTab(tab.value)}
            </TabPanel>
          ))}
        </SwipeableViews>
      </Box>

      {toggleModalAcceptOffer && (
        <ModalCommon
          title="Accept this offer"
          open={toggleModalAcceptOffer as boolean}
          handleClose={() => setOpenConfirmModal(true)}
          wrapperClassName="sm:pb-8"
        >
          <AcceptThisOffer
            isERC1155={isERC1155}
            assetDataDetail={assetDataDetail}
            offerId={offerId}
            handleClose={() => handleToggleModal(false)}
            handleAccept={openAcceptOfferProcessingModal}
            totalNftOfOwner={totalNftOfOwner}
          />
        </ModalCommon>
      )}

      <ModalConfirm
        open={openConfirmModal}
        onConfirm={() => {
          handleToggleModal(false);
          setOpenConfirmModal(false);
        }}
        onClose={() => setOpenConfirmModal(false)}
      />

      {isShowAcceptOfferProcessingModal && (
        <AcceptOfferProcessing
          assetDataDetail={assetDataDetail}
          handleClose={() => {
            setIsShowAcceptOfferProcessingModal(false);
          }}
          refetch={refetchData}
          resOfferDetail={resOfferDetail}
        />
      )}
    </div>
  );
};

export const ChartFollowShare = ({ nftId }: { nftId: number }) => {
  const [tabFollowAndShare, setTabFollowAndShare] = useState<number>(0);
  const theme = useTheme();
  return (
    <>
      <Box className="mt-10">
        <AppBar position="static">
          <Tabs
            value={tabFollowAndShare}
            onChange={(
              event: React.SyntheticEvent<Element, Event>,
              newValue: React.SetStateAction<number>,
            ) => setTabFollowAndShare(newValue)}
            TabIndicatorProps={{ style: { background: '#1EFCF1' } }}
            textColor="inherit"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {['Followers', 'Share'].map((category, index) => (
              <Tab className="!capitalize" key={index} label={category} />
            ))}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabFollowAndShare}
          onChangeIndex={(v) => setTabFollowAndShare(v)}
        >
          <TabPanel value={tabFollowAndShare} index={0} dir={theme.direction}>
            <ComposedChart
              width={560}
              height={200}
              data={data}
              margin={{
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1EFCF1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#000" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#3F4947" />
              <XAxis dataKey="name" />
              <YAxis />
              <Area
                type="monotone"
                dataKey="amt"
                stroke="#1EFCF1"
                strokeWidth={3}
                fillOpacity={0}
              />
            </ComposedChart>
          </TabPanel>
          <TabPanel value={tabFollowAndShare} index={1} dir={theme.direction}>
            <ComposedChart
              width={560}
              height={200}
              data={data}
              margin={{
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1EFCF1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#000" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#3F4947" />
              <XAxis dataKey="name" />
              <YAxis />
              <Area
                type="monotone"
                dataKey="amt"
                stroke="#1EFCF1"
                strokeWidth={3}
                fillOpacity={0}
              />
            </ComposedChart>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </>
  );
};
