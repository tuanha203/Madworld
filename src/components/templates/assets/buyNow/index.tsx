import { FC, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { FilledButton } from 'components/common';
import { useUpdateBalance } from 'hooks/useUpdateBalance';
import { useDispatch, useSelector } from 'react-redux';
import { modalActions, MODAL_TYPE } from 'store/constants/modal';
import ModalBuyFixedPriceNFT from '../buy-fixed-price-nft';
import { toggleModal } from 'store/actions/modal';
import { IModalState } from 'store/reducers/modal';
import { IUserInitState } from 'store/reducers/user';
import moment from 'moment';
import { toastError } from 'store/actions/toast';
import { useWeb3React } from '@web3-react/core';
import { NETWORK_CHAIN_ID } from 'constants/envs';

interface IBuyNowProps {
  assetDataDetail?: any;
  collection?: any;
  tokenId?: any;
  nftSaleStatus?: any;
  getAssetDetail?: any;
  bestNftSale?: any;
  style?:any;
}

const BuyNow: FC<IBuyNowProps> = (props) => {
  const { chainId } = useWeb3React();
  const { assetDataDetail, collection, tokenId, nftSaleStatus, getAssetDetail, bestNftSale, style } =
    props;
  const dispatch = useDispatch();

  // const toggleModalCompleteCheckout = useSelector(
  //   (state: { modal: IModalState }) => state.modal.toggleModalCompleteCheckout,
  // );

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (chainId && chainId?.toString() !== NETWORK_CHAIN_ID) {
      setOpen(false);
    }
  }, [chainId]);

  const walletAddress = useSelector(
    (state: { user: IUserInitState }) => state.user.data.walletAddress,
  );
  const { updateBalance } = useUpdateBalance();

  const handleToggleModal = (status: boolean) => {
    dispatch(toggleModal({ type: MODAL_TYPE.COMPLETE_CHECKOUT, status }));
  };

  const openModalConnectWallet = () => {
    if (!walletAddress) {
      dispatch({
        type: modalActions.MODAL_TOGGLE_MODAL,
        payload: {
          type: MODAL_TYPE.CONNECT_WALLET,
          status: true,
        },
      });
    } else {
      if (moment().unix() > +bestNftSale?.expireDate && +bestNftSale?.expireDate !== 0) {
        dispatch(toastError('There are some changes made recently, please reload the page!'));
        return;
      }
      updateBalance();
      // handleToggleModal(true);
      setOpen(true);
    }
  };

  return (
    <>
      {!isEmpty(bestNftSale) ? (
        <FilledButton
          text="Buy Now"
          customClass="!text--label-large"
          onClick={openModalConnectWallet}
          style={style}
        />
      ) : null}
      <ModalBuyFixedPriceNFT
        open={open}
        onClose={() => setOpen(false)}
        assetDataDetail={assetDataDetail}
        collection={collection}
        tokenId={tokenId}
        nftSaleStatus={nftSaleStatus}
        getAssetDetail={getAssetDetail}
        bestNftSale={bestNftSale}
      />
    </>
  );
};

export default BuyNow;
