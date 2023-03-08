import { FilledButton } from 'components/common';
import React, { useCallback, useEffect, useState } from 'react';
import saleNftService from 'service/saleNftService';
import { handleCancelListingOrder, handleCancelListingOrderDutchAuction } from 'blockchain/utils';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from 'store/actions/toast';
import { NFT_SALE_TYPES } from 'constants/index';
import { PLEASE_RELOAD_PAGE } from 'constants/text';
import socket from 'configsocket';
import { EventSocket } from 'constants/text';
import BigNumber from 'bignumber.js';
import {
  handleCancelListingDutchAuctionCreated,
  handleCancelListingOrderCreated,
} from 'blockchain/utils-created';

const CancelListing = ({
  getAssetDetail,
  nftType,
  saleNft,
  collectionAddress,
  assetDataDetail,
}: any) => {
  const [loading, setLoading] = useState<boolean>(false);

  const isAuction = saleNft?.type === NFT_SALE_TYPES.ENGLISH_AUCTION;

  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const { button } = useSelector((state:any) => state.theme);
  const dispatch = useDispatch();

  const handleConfirmCancelOrder = async () => {
    try {
      setLoading(true);
      const saleNftId = saleNft.id;
      // if (!isAuction) {
      const [orderDetail, errorOrder] = await saleNftService.getNftSaleDetailById(saleNftId);
      if (!orderDetail) {
        dispatch(toastError(PLEASE_RELOAD_PAGE));
        return setLoading(false);
      }
      let transaction;
      let error;
      if (orderDetail?.nft?.collection?.isImport) {
        if (orderDetail?.type === 'dutch_auction') {
          [transaction, error] = await handleCancelListingOrderDutchAuction({
            calldata: orderDetail?.signatureSale?.calldata,
            feeRecipient: orderDetail?.signatureSale?.feeRecipient,
            listingTime: orderDetail?.signatureSale?.listingTime,
            maker: orderDetail?.signatureSale?.maker,
            makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
            salt: orderDetail?.signatureSale?.salt,
            takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
            tokenType: orderDetail?.currencyToken,
            r: orderDetail?.signatureSale?.r,
            s: orderDetail?.signatureSale?.s,
            v: orderDetail?.signatureSale?.v,
            quantity: orderDetail?.quantity,
            price: new BigNumber(orderDetail?.price).toString(),
            collectionAddress,
            nftType: nftType,
            reserveBuyer: orderDetail?.reserveBuyer?.walletAddress,
            // replacementPattern: orderDetail?.replacementPattern,
            extraPrice: new BigNumber(orderDetail?.endPrice || '0').toString(),
            cidIPFS: orderDetail?.nft?.cid,
            expireTime: orderDetail?.expireDate,
          });
        } else {
          [transaction, error] = await handleCancelListingOrder({
            calldata: orderDetail?.signatureSale?.calldata,
            feeRecipient: orderDetail?.signatureSale?.feeRecipient,
            listingTime: orderDetail?.signatureSale?.listingTime,
            maker: orderDetail?.signatureSale?.maker,
            makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
            salt: orderDetail?.signatureSale?.salt,
            takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
            tokenType: orderDetail?.currencyToken,
            r: orderDetail?.signatureSale?.r,
            s: orderDetail?.signatureSale?.s,
            v: orderDetail?.signatureSale?.v,
            quantity: orderDetail?.quantity,
            price: new BigNumber(orderDetail?.price).toString(),
            collectionAddress,
            nftType: nftType,
            reserveBuyer: orderDetail?.reserveBuyer?.walletAddress,
          });
        }
      } else {
        if (orderDetail?.type === 'dutch_auction') {
          [transaction, error] = await handleCancelListingDutchAuctionCreated({
            calldata: orderDetail?.signatureSale?.calldata,
            feeRecipient: orderDetail?.signatureSale?.feeRecipient,
            listingTime: orderDetail?.signatureSale?.listingTime,
            maker: orderDetail?.signatureSale?.maker,
            makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
            salt: orderDetail?.signatureSale?.salt,
            takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
            tokenType: orderDetail?.currencyToken,
            r: orderDetail?.signatureSale?.r,
            s: orderDetail?.signatureSale?.s,
            v: orderDetail?.signatureSale?.v,
            quantity: orderDetail?.quantity,
            price: new BigNumber(orderDetail?.price).toString(),
            collectionAddress,
            nftType: nftType,
            reserveBuyer: orderDetail?.reserveBuyer?.walletAddress,
            replacementPattern: orderDetail?.replacementPattern,
            extraPrice: new BigNumber(orderDetail?.endPrice || '0').toString(),
            cidIPFS: orderDetail?.nft?.cid,
            expireTime: orderDetail?.expireDate,
          });
        } else {
          [transaction, error] = await handleCancelListingOrderCreated({
            calldata: orderDetail?.signatureSale?.calldata,
            feeRecipient: orderDetail?.signatureSale?.feeRecipient,
            listingTime: orderDetail?.signatureSale?.listingTime,
            maker: orderDetail?.signatureSale?.maker,
            makerRelayerFee: orderDetail?.signatureSale?.makerRelayerFee,
            salt: orderDetail?.signatureSale?.salt,
            takerRelayerFee: orderDetail?.signatureSale?.takerRelayerFee,
            tokenType: orderDetail?.currencyToken,
            r: orderDetail?.signatureSale?.r,
            s: orderDetail?.signatureSale?.s,
            v: orderDetail?.signatureSale?.v,
            quantity: orderDetail?.quantity,
            price: new BigNumber(orderDetail?.price).toString(),
            collectionAddress,
            nftType: nftType,
            reserveBuyer: orderDetail?.reserveBuyer?.walletAddress,
            replacementPattern: orderDetail?.replacementPattern,
          });
        }
      }

      if (error) {
        if (
          error?.code === 4001 ||
          String(error)?.includes('User rejected') ||
          String(error)?.includes('User denied')
        ) {
          dispatch(toastError('You declined the action in your wallet.'));
        } else {
          console.error(error);
          dispatch(toastError('Something went wrong.'));
        }
        return setLoading(false);
      }
      await transaction.wait(1);
    } catch (error: any) {
      dispatch(toastError('Something went wrong.'));
    } finally {
      // setLoading(false);
    }
  };

  const handleCancelAuction = async () => {
    try {
      setLoading(true);
      const saleNftId = saleNft.id;
      // await saleNftService.cancelListing(saleNftId);
      await getAssetDetail();
      dispatch(toastSuccess('Cancel listing successfully'));
    } catch (error: any) {
      dispatch(toastError('Something went wrong.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAfterCancelSuccess = useCallback(async () => {
    dispatch(toastSuccess('Cancel listing successfully'));
    await getAssetDetail();
    setLoading(false);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (socket) {
      socket.on(EventSocket.CANCEL_INTERNAL_SALE, (res) => {
        if (res?.data?.userId === Number(userId) && res?.data?.nftId === assetDataDetail?.id) {
          handleAfterCancelSuccess();
        }
      });

      return () => {
        socket.off(EventSocket.CANCEL_INTERNAL_SALE);
      };
    }
  }, []);

  return (
    <div className="bg-background-variant-dark xl:px-0 px-3 py-4 flex my-auto">
      <div className="layout mx-auto w-full">
        <div className="flex">
          <FilledButton
            text="Cancel Listing"
            onClick={handleConfirmCancelOrder}
            loading={loading}
            style={button?.default}
          />
        </div>
      </div>
    </div>
  );
};

export default CancelListing;
