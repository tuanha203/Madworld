import { FC, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { OutlinedButton } from 'components/common';
import ModalCommon from 'components/common/modal';
import MakeAnOffer from './MakeAnOffer';
import MakeAnOfferProcessing from './offer-processing';
import { toggleModal } from 'store/actions/modal';
import { MODAL_TYPE } from 'store/constants/modal';
import { IModalState } from 'store/reducers/modal';
import useConnectWallet from 'hooks/useConnectWallet';
import ModalConfirm from 'components/common/modal-confirm';

interface IMakeOfferProps {
  assetDataDetail: any;
  walletAddressOwner?: any;
  refeshData: () => void;
  className?: string;
  style?: any;
}

const MakeOffer: FC<IMakeOfferProps> = (props) => {
  const { assetDataDetail, walletAddressOwner, refeshData, className, style } = props;

  const dispatch = useDispatch();
  const toggleModalMakeAnOffer = useSelector(
    (state: { modal: IModalState }) => state.modal.toggleModalMakeAnOffer,
  );
  const [isShowProcessing, setIsShowProcessing] = useState(false);
  const [offerMetaData, setOfferMetaData] = useState({});
  const [isSelectedCustomDate, setIsSelectedCustomDate] = useState<boolean>(false);
  const { openModalConnectWallet } = useConnectWallet();
  const { walletAddress } = useSelector((state: any) => ({
    walletAddress: state.user.data.walletAddress,
  }));
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    return () => {
      if (toggleModalMakeAnOffer) {
        dispatch(
          toggleModal({
            type: MODAL_TYPE.MAKE_AN_OFFER,
            status: false,
          }),
        );
      }
    };
  }, [toggleModalMakeAnOffer]);

  const handleClose = () => {
    setConfirmClose(false);
    handleToggleModal(true);
  };

  const handleConfirm = () => {
    setConfirmClose(false);
    handleToggleModal(false);
  };

  const handleToggleModal = (status: boolean) => {
    dispatch(toggleModal({ type: MODAL_TYPE.MAKE_AN_OFFER, status }));
  };

  const handleToggleModalProcessingMakeOffer = (status: boolean) => {
    dispatch(toggleModal({ type: MODAL_TYPE.PROCESSING_MAKE_OFFER, status }));
  };

  const handleMakeOffer = () => {
    if (!walletAddress) {
      openModalConnectWallet();
    } else {
      handleToggleModal(true);
    }
  };

  const handleMakeOfferSuccess = async () => {
    setIsShowProcessing(false);
    refeshData();
  };

  return (
    <div>
      <OutlinedButton
        text="Make Offer"
        customClass={`!text--label-large ${!style ? '!text-secondary-60' : ''} ${className}`}
        onClick={handleMakeOffer}
        style={style}
      />
      {toggleModalMakeAnOffer && (
        <ModalCommon
          title="Make an Offer"
          open={toggleModalMakeAnOffer as boolean}
          wrapperClassName={`!sm:w-full sm:pb-4 ${
            isSelectedCustomDate ? 'min-h-[726px] w-[501px]' : 'w-[501px]'
          }`}
          handleClose={() => {
            // handleToggleModal(false);
            setConfirmClose(true);
          }}
          headerClassName="text--headline-small"
        >
          <MakeAnOffer
            assetDataDetail={assetDataDetail}
            handleSetOfferMetaData={(e) => {
              setOfferMetaData(e);
              setIsShowProcessing(true);
              handleToggleModal(false);
              handleToggleModalProcessingMakeOffer(true);
            }}
            isSelectedCustomDate={isSelectedCustomDate}
            setIsSelectedCustomDate={setIsSelectedCustomDate}
          />
        </ModalCommon>
      )}

      <ModalConfirm
        title="Are you sure you want to cancel?"
        open={confirmClose}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />

      {isShowProcessing && (
        <MakeAnOfferProcessing
          handleClose={handleMakeOfferSuccess}
          assetDataDetail={assetDataDetail}
          offerMetaData={offerMetaData}
        />
      )}
    </div>
  );
};

export default MakeOffer;
