import { TextButtonSquare } from 'components/common';
import { handleCancelListingOrder } from 'blockchain/utils';
import saleNftService from 'service/saleNftService';
import BigNumber from 'bignumber.js';

const ConfirmCancel = ({
  collectionAddress,
  nftType,
  saleNftId,
}: {
  collectionAddress: string;
  nftType: string;
  saleNftId: number;
}) => {
  const handleConfirmCancelOrder = async () => {
    // TODO
    const [orderDetail] = await saleNftService.getNftSaleDetailById(saleNftId);

    const [transaction, error] = await handleCancelListingOrder({
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
      collectionAddress: collectionAddress,
      nftType: nftType,
      reserveBuyer: orderDetail?.reserveBuyer?.walletAddress,
    });
    if (error) return;
    await transaction.wait(1);

    await saleNftService.cancelListing(saleNftId, { tx: transaction.hash });
  };

  return (
    <div>
      <span className="text-sm">Changes you made so far will not be saved</span>
      <div className="float-right space-x-4 mt-5">
        <TextButtonSquare customClass="!text--label-large !text-primary-dark">
          Cancel
        </TextButtonSquare>
        <TextButtonSquare
          customClass="!text--label-large !text-primary-dark"
          onClick={handleConfirmCancelOrder}
        >
          Confirm
        </TextButtonSquare>
      </div>
    </div>
  );
};
export default ConfirmCancel;
