import { FC, useCallback, useState, useEffect } from 'react';
import ModalCommon from 'components/common/modal';
import ModalConfirm from 'components/common/modal-confirm';
import CompleteCheckout from './CompleteCheckout';
import PurchaseProcessing from './PurchaseProcessing';
import {
  decodeEventOrdersMatched,
  handleAtomicMatch,
  handleAtomicMatchDutchAuction,
  handleOrderCanMatch,
  handleUserApproveERC20,
  userAllowanceERC20,
} from 'blockchain/utils';
import { useWeb3React } from '@web3-react/core';
import socket from 'configsocket';
import saleNftService from 'service/saleNftService';
import { ASSET_TYPE, EXTRA_TIME_DUTCH_AUCTION } from 'constants/app';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from 'store/actions/toast';
import BigNumber from 'bignumber.js';
import { forceUpdateInternalSale } from 'store/actions/forceUpdating';
import { useUpdateBalance } from 'hooks/useUpdateBalance';
import {
  handleAtomicMatchCreated,
  handleAtomicMatchDutchAuctionCreated,
  handleOrderCanMatchCreated,
} from 'blockchain/utils-created';
import { calculateDecliningPrice } from 'utils/utils';
import { EventSocket } from 'constants/text';
import { PAYMENT_TOKEN } from 'constants/index';
import moment from 'moment';

interface IModalBuyFixedPriceNFTProps {
  open: boolean;
  onClose: () => void;
  assetDataDetail?: any;
  collection?: any;
  tokenId?: any;
  nftSaleStatus?: any;
  getAssetDetail: () => void;
  bestNftSale: any;
}

const STEPS = {
  COMPLETE_CHECKOUT: 'COMPLETE_CHECKOUT',
  PROCESSING: 'PROCESSING',
  PURCHASE_SUCCESS: 'PURCHASE_SUCCESS',
};

const MODAL_TITLE = {
  [STEPS.COMPLETE_CHECKOUT]: 'Complete Checkout',
  [STEPS.PROCESSING]: 'Your purchase is processing',
  [STEPS.PURCHASE_SUCCESS]: 'Your purchase is complete',
};
const NEXT_PUBLIC_UMAD_ADDRESS = process.env.NEXT_PUBLIC_UMAD_ADDRESS!;
const ModalBuyFixedPriceNFT: FC<IModalBuyFixedPriceNFTProps> = (props) => {
  const {
    open,
    onClose,
    assetDataDetail,
    tokenId,
    collection,
    nftSaleStatus,
    getAssetDetail,
    bestNftSale,
  } = props;

  // const nftSale = collection?.type === ASSET_TYPE.ERC721 ? nftSaleStatus[0] : nftSaleStatus[0];

  const nftSale = bestNftSale;

  const [loadingCheckout, setLoadingCheckout] = useState<boolean>(false);

  const { account } = useWeb3React();
  const [isApproveUMAD, setIsApproveUMAD] = useState<boolean | undefined>(undefined);
  const [matchOrderTx, setMatchOrderTx] = useState('');
  const [sellHash, setSellHash] = useState('');
  const [isMatchOrderSuccess, setMatchOrderSuccess] = useState(false);
  const [loadingApproveUMAD, setLoadingApproveUMAD] = useState<boolean>(false);
  const [buySuccess, setBuySuccess] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [totalAllowanceUMAD, setTotalAllowanceUMAD] = useState<string>('0');

  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const totalPriceUmad = nftSale?.currencyToken === 'umad' ? nftSale?.price : 0;

  const { updateBalance } = useUpdateBalance();

  const isDutchAuction = bestNftSale?.type === 'dutch_auction';

  useEffect(() => {
    updateBalance();
  }, []);

  const checkUserApproveUMAD = async () => {
    try {
      const allowanceUMAD = await userAllowanceERC20(
        NEXT_PUBLIC_UMAD_ADDRESS,
        (walletAddress as any) || account,
      );
      setTotalAllowanceUMAD(allowanceUMAD);
      const isApproveUmad = new BigNumber(allowanceUMAD).gte(
        new BigNumber(totalPriceUmad).multipliedBy(10 ** 8),
      );

      setIsApproveUMAD(isApproveUmad);
      return isApproveUmad;
    } catch (error) {
      console.error('checkUserApproveUMAD', error);
    }
  };

  useEffect(() => {
    if (account || walletAddress) {
      checkUserApproveUMAD();
    }
  }, [account, open, walletAddress]);

  const handleBuyNft = async (quantity = 1) => {
    try {
      setBuySuccess(false);
      setLoadingCheckout(true);
      const [orderDetail, errorDetailOrder] = await saleNftService.getNftSaleDetailById(
        nftSale?.id,
      );
      setSellHash(orderDetail.sellHash);
      if (!orderDetail) {
        dispatch(toastError('There are some changes made recently, please reload the page!'));
        return handleConfirmCloseBuy();
      }

      const isApproveUmad = await checkUserApproveUMAD();

      if (!isApproveUmad) {
        setLoadingCheckout(false);
        onApproveUMAD();
      }
      setMatchOrderSuccess(true);

      let isCanMatch;
      if (orderDetail?.nft?.collection?.isImport) {
        [isCanMatch] = await handleOrderCanMatch({
          feeRecipient: orderDetail?.signatureSale?.feeRecipient,
          listingTime: orderDetail?.signatureSale?.listingTime,
          makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
          salt: orderDetail?.signatureSale?.salt,
          takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
          tokenType: orderDetail?.currencyToken,
          quantity: quantity || orderDetail?.quantity,
          price: new BigNumber(orderDetail?.price).toString(),
          collectionAddress: collection?.address,
          maker: orderDetail?.signatureSale?.maker,
          taker: orderDetail?.signatureSale?.taker,
          calldata: orderDetail?.signatureSale?.calldata,
          nftType: collection?.type,
          tokenId,
        });
      } else {
        let errorCanMatch;
        [isCanMatch, errorCanMatch] = await handleOrderCanMatchCreated({
          feeRecipient: orderDetail?.signatureSale?.feeRecipient,
          listingTime: orderDetail?.signatureSale?.listingTime,
          makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
          salt: orderDetail?.signatureSale?.salt,
          takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
          tokenType: orderDetail?.currencyToken,
          quantity: quantity || orderDetail?.quantity,
          price: new BigNumber(orderDetail?.price).toString(),
          collectionAddress: collection?.address,
          maker: orderDetail?.signatureSale?.maker,
          taker: orderDetail?.signatureSale?.taker,
          calldata: orderDetail?.signatureSale?.calldata,
          nftType: collection?.type,
          tokenId,
          replacementPatternSeller: orderDetail?.replacementPattern,
          cidIPFS: orderDetail?.nft?.cid,
        });
      }
      if (isDutchAuction) isCanMatch = true;
      if (isCanMatch) {
        let matchTx;
        let error;
        if (orderDetail?.nft?.collection?.isImport) {
          if (isDutchAuction) {
            const feeService = new BigNumber(orderDetail?.signatureSale?.makerRelayerFee)
              .dividedBy(100)
              .toString();
            const startPriceEstimate = new BigNumber(orderDetail?.startPrice)
              .multipliedBy(100 - parseFloat(feeService))
              .dividedBy(100)
              .toString();
            let priceCalculate;
            if (orderDetail?.currencyToken === PAYMENT_TOKEN.ETH) {
              priceCalculate = calculateDecliningPrice(
                {
                  startPrice: new BigNumber(startPriceEstimate).toString(),
                  endPrice: new BigNumber(orderDetail?.endPrice).toString(),
                  expireDate: orderDetail?.expireDate,
                  startDate: +orderDetail?.startDate + 0,
                },
                true,
              ) as string;
            } else {
              priceCalculate = calculateDecliningPrice(
                {
                  startPrice: new BigNumber(orderDetail?.startPrice).toString(),
                  endPrice: new BigNumber(orderDetail?.endPrice).toString(),
                  expireDate: orderDetail?.expireDate,
                  startDate: +orderDetail?.startDate + EXTRA_TIME_DUTCH_AUCTION,
                },
                true,
              ) as string;
            }
            // const priceBuyer = new BigNumber(priceCalculate).decimalPlaces(8)?.toString() as string;
            const priceBuyer = priceCalculate;

            [matchTx, error] = await handleAtomicMatchDutchAuction({
              feeRecipient: orderDetail?.signatureSale?.feeRecipient,
              listingTime: orderDetail?.signatureSale?.listingTime,
              makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
              salt: orderDetail?.signatureSale?.salt,
              takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
              tokenType: orderDetail?.currencyToken,
              quantity: quantity || orderDetail?.quantity,
              price: new BigNumber(orderDetail?.startPrice).toString(),
              priceBuyer,
              endPrice: new BigNumber(orderDetail?.endPrice).toString(),
              collectionAddress: collection?.address,
              maker: orderDetail?.signatureSale?.maker,
              taker: orderDetail?.signatureSale?.taker,
              calldata: orderDetail?.signatureSale?.calldata,
              nftType: collection?.type,
              tokenId,
              r: orderDetail?.signatureSale?.r,
              s: orderDetail?.signatureSale?.s,
              v: orderDetail?.signatureSale?.v,
              replacementPatternSeller: orderDetail?.replacementPattern,
              expireTime: orderDetail?.expireDate,
            });
            if (error) {
              return handleErrorDutchAuction(error);
            }
          } else {
            [matchTx, error] = await handleAtomicMatch({
              feeRecipient: orderDetail?.signatureSale?.feeRecipient,
              listingTime: orderDetail?.signatureSale?.listingTime,
              makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
              salt: orderDetail?.signatureSale?.salt,
              takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
              tokenType: orderDetail?.currencyToken,
              quantity: quantity || orderDetail?.quantity,
              price: new BigNumber(orderDetail?.price)?.toNumber()?.toFixed(8).toString(),
              collectionAddress: collection?.address,
              maker: orderDetail?.signatureSale?.maker,
              taker: orderDetail?.signatureSale?.taker,
              calldata: orderDetail?.signatureSale?.calldata,
              nftType: collection?.type,
              tokenId,
              r: orderDetail?.signatureSale?.r,
              s: orderDetail?.signatureSale?.s,
              v: orderDetail?.signatureSale?.v,
            });
          }
        } else {
          if (isDutchAuction) {

            const feeService = new BigNumber(orderDetail?.signatureSale?.makerRelayerFee)
              .dividedBy(100)
              .toString();
            const startPriceEstimate = new BigNumber(orderDetail?.startPrice)
              .multipliedBy(100 - parseFloat(feeService))
              .dividedBy(100)
              .toString();

            let priceCalculate;
            if (orderDetail?.currencyToken === PAYMENT_TOKEN.ETH) {
              priceCalculate = calculateDecliningPrice({
                startPrice: new BigNumber(startPriceEstimate).toString(),
                endPrice: new BigNumber(orderDetail?.endPrice).toString(),
                expireDate: orderDetail?.expireDate,
                startDate: +orderDetail?.startDate,
              }) as string;
            } else {
              priceCalculate = calculateDecliningPrice(
                {
                  startPrice: new BigNumber(orderDetail?.startPrice).toString(),
                  endPrice: new BigNumber(orderDetail?.endPrice).toString(),
                  expireDate: orderDetail?.expireDate,
                  startDate: +orderDetail?.startDate + EXTRA_TIME_DUTCH_AUCTION,
                },
                true,
              ) as string;
            }

            const priceBuyer = priceCalculate;

            [matchTx, error] = await handleAtomicMatchDutchAuctionCreated({
              feeRecipient: orderDetail?.signatureSale?.feeRecipient,
              listingTime: orderDetail?.signatureSale?.listingTime,
              makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
              salt: orderDetail?.signatureSale?.salt,
              takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
              tokenType: orderDetail?.currencyToken,
              quantity: quantity || orderDetail?.quantity,
              price: new BigNumber(orderDetail?.startPrice).toString(),
              priceBuyer,
              endPrice: new BigNumber(orderDetail?.endPrice).toString(),
              collectionAddress: collection?.address,
              maker: orderDetail?.signatureSale?.maker,
              taker: orderDetail?.signatureSale?.taker,
              calldata: orderDetail?.signatureSale?.calldata,
              nftType: collection?.type,
              tokenId,
              r: orderDetail?.signatureSale?.r,
              s: orderDetail?.signatureSale?.s,
              v: orderDetail?.signatureSale?.v,
              replacementPatternSeller: orderDetail?.replacementPattern,
              cidIPFS: orderDetail?.nft?.cid,
              expireTime: orderDetail?.expireDate,
            });
            if (error) {
              return handleErrorDutchAuction(error);
            }
          } else {
            [matchTx, error] = await handleAtomicMatchCreated({
              feeRecipient: orderDetail?.signatureSale?.feeRecipient,
              listingTime: orderDetail?.signatureSale?.listingTime,
              makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
              salt: orderDetail?.signatureSale?.salt,
              takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
              tokenType: orderDetail?.currencyToken,
              quantity: quantity || orderDetail?.quantity,
              price: new BigNumber(orderDetail?.price).toString(),
              collectionAddress: collection?.address,
              maker: orderDetail?.signatureSale?.maker,
              taker: orderDetail?.signatureSale?.taker,
              calldata: orderDetail?.signatureSale?.calldata,
              nftType: collection?.type,
              tokenId,
              r: orderDetail?.signatureSale?.r,
              s: orderDetail?.signatureSale?.s,
              v: orderDetail?.signatureSale?.v,
              replacementPatternSeller: orderDetail?.replacementPattern,
              cidIPFS: orderDetail?.nft?.cid,
            });
          }
        }

        setStep(STEPS.PROCESSING);
        setMatchOrderTx(matchTx);
        if (error) return handleError(error);
        await matchTx.wait(1);
      } else {
        handleError('No match order');
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoadingCheckout(false);
    }
  };

  const refetch = useCallback(async () => {
    setStep(STEPS.PURCHASE_SUCCESS);
    setBuySuccess(true);
    // dispatch(
    //   toastSuccess(
    //     `Congratulation! You just purchased ${
    //       assetDataDetail?.title || 'Unknown'
    //     }. It's been confirmed on the blockchain!`,
    //   ),
    // );
    setTimeout(async () => {
      if (typeof getAssetDetail === 'function') {
        await getAssetDetail();
      }
      handleConfirmCloseBuy();
    }, 3000);
  }, []);

  useEffect(() => {
    if (socket) {
      const userId = localStorage.getItem('userId');

      socket.on(EventSocket.TRANSFER_NFT_SUCCESS, (res) => {
        if (
          res?.data?.toUserId === Number(userId) &&
          res?.data?.nftId === assetDataDetail?.id &&
          res?.data?.sellHash === sellHash
        ) {
          refetch();
          dispatch(forceUpdateInternalSale());
        }
      });

      return () => {
        socket.off(EventSocket.TRANSFER_NFT_SUCCESS);
      };
    }
  }, [sellHash]);

  const [step, setStep] = useState(STEPS.COMPLETE_CHECKOUT);

  const [openConfirm, setToggleConfirm] = useState(false);

  const handleError = (error: any) => {
    if (
      error?.code === 4001 ||
      String(error)?.includes('User rejected') ||
      String(error)?.includes('User denied')
    ) {
      dispatch(toastError('You declined the action in your wallet.'));
    } else {
      dispatch(toastError('Something went wrong.'));
    }
    handleConfirmCloseBuy();
  };
  const handleErrorDutchAuction = (error: any) => {
    if (
      error?.code === 4001 ||
      String(error)?.includes('User rejected') ||
      String(error)?.includes('User denied')
    ) {
      dispatch(toastError('You declined the action in your wallet.'));
      return handleConfirmCloseBuy();
    } else {
      return dispatch(
        toastError(
          'There are some changes made recently, please click Confirm Checkout button again!',
        ),
      );
    }
  };
  const handleClose = () => {
    /**
     * * Popup confirm before close
     */
    setToggleConfirm(true);
  };

  const handleCloseConfirm = useCallback(() => {
    setToggleConfirm(false);
  }, []);

  const handleConfirmCloseBuy = useCallback(() => {
    setToggleConfirm(false);
    onClose();
    setStep(STEPS.COMPLETE_CHECKOUT);
  }, []);

  const handleConfirmCheckout = useCallback(
    (quantity?: number) => {
      handleBuyNft(quantity);
    },
    [step, nftSale?.id, walletAddress, account, bestNftSale?.type],
  );

  const onApproveUMAD = async () => {
    try {
      if (!walletAddress) throw Error('No account');
      setLoadingApproveUMAD(true);
      const [resApprove, error] = await handleUserApproveERC20(NEXT_PUBLIC_UMAD_ADDRESS);

      if (error) {
        setLoadingApproveUMAD(false);
        handleError(error);
        return;
      }

      await resApprove.wait(1);
      if (resApprove) {
        const allowanceUMAD = await userAllowanceERC20(
          NEXT_PUBLIC_UMAD_ADDRESS,
          (walletAddress as any) || account,
        );
        setTotalAllowanceUMAD(allowanceUMAD);
        const isApproveUmad = new BigNumber(allowanceUMAD).gte(
          new BigNumber(totalPriceUmad).multipliedBy(10 ** 8),
        );
        if (isApproveUmad) {
          setIsApproveUMAD(isApproveUmad);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingApproveUMAD(false);
    }
  };

  const renderSteps = () => {
    switch (step) {
      case STEPS.PURCHASE_SUCCESS:
        return (
          <PurchaseProcessing
            key={STEPS.PURCHASE_SUCCESS}
            itemName={assetDataDetail?.title || 'Unknown'}
            matchOrderTx={matchOrderTx}
            isMatchOrderSuccess={isMatchOrderSuccess}
            buySuccess={buySuccess}
            nftUrl={assetDataDetail?.nftUrl || ''}
            nftImagePreview={assetDataDetail?.nftImagePreview}
          />
        );
      case STEPS.PROCESSING:
        return (
          <PurchaseProcessing
            key={STEPS.PROCESSING}
            itemName={assetDataDetail?.title || 'Unknown'}
            matchOrderTx={matchOrderTx}
            isMatchOrderSuccess={isMatchOrderSuccess}
            buySuccess={buySuccess}
            nftUrl={assetDataDetail?.nftUrl || ''}
            nftImagePreview={assetDataDetail?.nftImagePreview}
          />
        );
      default:
        return (
          <CompleteCheckout
            itemName={assetDataDetail?.title || 'Unknown'}
            isApproveUMAD={isApproveUMAD}
            totalAllowanceUMAD={totalAllowanceUMAD}
            assetDataDetail={assetDataDetail}
            onConfirmCheckout={handleConfirmCheckout}
            onApproveUMAD={onApproveUMAD}
            nftSale={nftSale}
            loadingApproveUMAD={loadingApproveUMAD}
            isERC721={collection?.type === ASSET_TYPE.ERC721}
            loadingCheckout={loadingCheckout}
            bestNftSale={bestNftSale}
          />
        );
    }
  };

  return (
    <>
      {open && (
        <ModalCommon
          title={MODAL_TITLE[step] || ''}
          open={open}
          handleClose={handleClose}
          wrapperClassName="w-[650px]"
          isCloseIcon={!step || step === STEPS.COMPLETE_CHECKOUT}
        >
          {renderSteps()}
        </ModalCommon>
      )}

      <ModalConfirm
        title="Are you sure you want to cancel?"
        open={openConfirm}
        onConfirm={handleConfirmCloseBuy}
        onClose={handleCloseConfirm}
      />
    </>
  );
};

export default ModalBuyFixedPriceNFT;
