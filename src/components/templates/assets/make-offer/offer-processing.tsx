import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import Modal from '@mui/material/Modal';

import CircularProgressIndicator from 'components/common/progress-indicator';
import { OutlinedButton } from 'components/common/buttons/index';
import {
  checkUserHasProxy,
  handleUserApproveERC20,
  buildDataBid,
  isUserApprovedERC20Amount,
} from 'blockchain/utils';
import {
  NULL_ADDRESS,
  STATE_STEP,
  NEXT_PUBLIC_UMAD_ADDRESS,
  NEXT_PUBLIC_WETH_ADDRESS,
} from 'constants/app';
import saleNftService from 'service/saleNftService';
import { PAYMENT_TOKEN } from 'constants/index';
import { toastError, toastSuccess } from 'store/actions/toast';
import { LINK_SCAN } from 'constants/envs';
import { toggleModal } from 'store/actions/modal';
import { MODAL_TYPE } from 'store/constants/modal';
import { buildDataBidCreated } from 'blockchain/utils-created';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: '24px',
} as React.CSSProperties;

interface IModalFollowStepProps {
  handleClose: () => void;
  assetDataDetail: any;
  offerMetaData: any;
}

const erc20: any = {
  UMAD: NEXT_PUBLIC_UMAD_ADDRESS,
  WETH: NEXT_PUBLIC_WETH_ADDRESS,
};
const initSteps = [
  {
    indexNum: 1,
    title: 'Initialize your wallet',
    des: 'To start selling for the first time on MADworld, you need to set up your wallet. This requires gas fee once only.',
    state: STATE_STEP.LOADING,
    isShowDes: true,
    link: '',
    subDes: 'Waiting for initialization...',
  },
  {
    indexNum: 2,
    title: 'Approve ',
    des: 'To start selling for the first time on MADworld, you need to allow a website to use your ',
    state: STATE_STEP.UNCHECKED,
    isShowDes: false,
    link: '',
    subDes: 'Waiting for confirmation...',
  },
  {
    indexNum: 3,
    title: 'Make an offer',
    des: 'Sign the message to make the offer',
    state: STATE_STEP.UNCHECKED,
    isShowDes: false,
    link: '',
  },
];
const ModalFollowStep = ({
  handleClose,
  assetDataDetail,
  offerMetaData,
}: IModalFollowStepProps) => {
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const [steps, setSteps] = useState(initSteps);
  const handleToggleModalProcessingMakeOffer = (status: boolean) => {
    dispatch(toggleModal({ type: MODAL_TYPE.PROCESSING_MAKE_OFFER, status }));
  };
  const toggleDescription = (i: number) => {
    const stepsTemp = steps.map((step, index) => {
      if (index === i) {
        return { ...step, isShowDes: !step.isShowDes };
      }
      return step;
    });
    setSteps(stepsTemp);
  };

  const StepComponent = ({ step: { title, des, state, indexNum, link, isShowDes, subDes } }: any) => {
    return (
      <div className="flex bg-background-asset-detail p-4 rounded-lg mb-4 cursor-pointer">
        <div className="pr-3 pl-1 w-10">
          {state === STATE_STEP.LOADING ? (
            <CircularProgressIndicator size={20} />
          ) : state === STATE_STEP.UNCHECKED ? (
            <></>
          ) : (
            <CheckIcon style={{ color: '#F4B1A3' }} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="font-bold text--headline-xsmall text-dark-on-surface">{`${indexNum}. ${title}`}</p>
            <div className="p-2">
              <img
                src="/icons/arrow-bottom.svg"
                className={`relative bottom-1 text-primary-dark ml-3 ${
                  isShowDes ? 'rotate-180' : ''
                }`}
                onClick={() => toggleDescription(indexNum - 1)}
              />
            </div>
          </div>

          {isShowDes && (
            <div className="pr-2">
              <p className="text-primary-gray text-sm my-2">{des}</p>
              {state === STATE_STEP.LOADING && subDes && <p className="text-xs text-secondary-gray mt-3 mb-3">{subDes}</p>}
              {link && (
                <a href={link} target="_blank">
                  <OutlinedButton
                    customClass="!text-secondary-60"
                    target="_blank"
                    fullWidth
                    text="View on Etherscan"
                  />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

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
    handleClose();
    setSteps(initSteps);
    handleToggleModalProcessingMakeOffer(false);
  };

  useEffect(() => {
    const processing = async () => {
      if (!account) return;

      setSteps([
        steps[0],
        {
          ...steps[1],
          title: 'Approve ' + offerMetaData.currency + ' token',
          des:
            'To start selling for the first time on MADworld, you need to allow a website to use your ' +
            offerMetaData.currency +
            '.',
        },
        steps[2],
      ]);

      const [checkUserHasProxyRes, checkProxyError] = await checkUserHasProxy(account);
      let checkUserHasProxyResHash = '';
      if (checkProxyError) {
        handleError(checkProxyError);
        return;
      }
      if (checkUserHasProxyRes?.hash) {
        checkUserHasProxyResHash = `${LINK_SCAN}tx/${checkUserHasProxyRes?.hash}`;
        setSteps([
          { ...steps[0], link: checkUserHasProxyResHash },
          {
            ...steps[1],
            title: 'Approve ' + offerMetaData?.currency + ' token',
            des:
              'To start selling for the first time on MADworld, you need to allow a website to use your ' +
              offerMetaData?.currency +
              '.',
          },
          steps[2],
        ]);
        await checkUserHasProxyRes.wait(1);
      }
      setSteps([
        {
          ...steps[0],
          state: STATE_STEP.CHECKED,
          isShowDes: true,
          link: checkUserHasProxyResHash,
        },
        {
          ...steps[1],
          state: STATE_STEP.LOADING,
          title: 'Approve ' + offerMetaData?.currency + ' token',
          des:
            'To start selling for the first time on MADworld, you need to allow a website to use your ' +
            offerMetaData?.currency +
            '.',
          isShowDes: true,
        },
        steps[2],
      ]);

      const isApproveErc20 = await isUserApprovedERC20Amount(
        erc20[offerMetaData?.currency],
        account,
        offerMetaData?.yourOffer,
        offerMetaData?.currency,
      );
      let handleUserApproveERC20ResHash = '';
      if (!isApproveErc20) {
        const [handleUserApproveERC20Res, errorApproveERC20] = await handleUserApproveERC20(
          erc20[offerMetaData?.currency],
        );
        if (errorApproveERC20) {
          handleError(errorApproveERC20);
          return;
        }
        if (handleUserApproveERC20Res.hash) {
          handleUserApproveERC20ResHash = `${LINK_SCAN}tx/${handleUserApproveERC20Res?.hash}`;
          setSteps([
            {
              ...steps[0],
              state: STATE_STEP.CHECKED,
              isShowDes: true,
              link: checkUserHasProxyResHash,
            },
            {
              ...steps[1],
              state: STATE_STEP.LOADING,
              title: 'Approve ' + offerMetaData?.currency + ' token',
              isShowDes: true,
              link: handleUserApproveERC20ResHash,
              des:
                'To start selling for the first time on MADworld, you need to allow a website to use your ' +
                offerMetaData.currency +
                '.',
            },
            steps[2],
          ]);
          await handleUserApproveERC20Res.wait(1);
        }
      }
      setSteps([
        {
          ...steps[0],
          state: STATE_STEP.CHECKED,
          isShowDes: true,
          link: checkUserHasProxyResHash,
        },
        {
          ...steps[1],
          state: STATE_STEP.CHECKED,
          title: 'Approve ' + offerMetaData?.currency + ' token',
          isShowDes: true,
          link: handleUserApproveERC20ResHash,
          des:
            'To start selling for the first time on MADworld, you need to allow a website to use your ' +
            offerMetaData?.currency +
            '.',
        },
        { ...steps[2], state: STATE_STEP.LOADING, isShowDes: true },
      ]);

      let bidData;
      let error;
      if (assetDataDetail?.collection?.isImport) {
        [bidData, error] = await buildDataBid({
          taker: NULL_ADDRESS,
          collectionAddress: assetDataDetail.collection.address,
          price: offerMetaData.yourOffer,
          expirationTime: moment(offerMetaData.date).unix(),
          nftType: assetDataDetail.collection.type,
          tokenType: PAYMENT_TOKEN[offerMetaData.currency],
          quantity: offerMetaData.quantity,
          tokenId: assetDataDetail.tokenId,
        });
      } else {
        [bidData, error] = await buildDataBidCreated({
          taker: NULL_ADDRESS,
          collectionAddress: assetDataDetail.collection.address,
          price: offerMetaData.yourOffer,
          expirationTime: moment(offerMetaData.date).unix(),
          nftType: assetDataDetail.collection.type,
          tokenType: PAYMENT_TOKEN[offerMetaData.currency],
          quantity: offerMetaData.quantity,
          tokenId: assetDataDetail.tokenId,
          cidIPFS: assetDataDetail?.cid,
        });
      }

      if (error) {
        handleError(error);
        return;
      }

      const [data, err] = await saleNftService.offerNft({
        price: Number(offerMetaData.yourOffer),
        currencyToken: PAYMENT_TOKEN[offerMetaData.currency],
        quantity: offerMetaData.quantity,
        expireDate: moment(offerMetaData.date).unix(),
        nftId: assetDataDetail.id,
        metadata: bidData,
        sellHash: (bidData as any)?.sellHash,
        replacementPattern: (bidData as any)?.replacementPattern || '',
      });

      if (data) {
        dispatch(toastSuccess('Your offer was submitted successfully'));
        handleToggleModalProcessingMakeOffer(false);
      } else {
        handleError(err);
      }
      handleClose();
    };

    processing();
  }, []);

  return (
    <Modal
      open={true}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={(e: any, reason: string) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
    >
      <div
        style={style}
        className="bg-background-700 rounded-[28px] flex flex-col sm:w-full md:w-[450px] sm:px-2 sm:py-16 md:px-16 md:pb-16 md:pt-8 "
      >
        <p className="font-bold text--headline-small text-center mb-8 text-white">Make an offer</p>
        <div className="flex-1 overflow-y-auto">
          {steps.map((step, index) => {
            return <StepComponent step={step} key={index} />;
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ModalFollowStep;
