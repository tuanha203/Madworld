import * as React from 'react';
import { useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch } from 'react-redux';
import Modal from '@mui/material/Modal';
import { useWeb3React } from '@web3-react/core';

import CircularProgressIndicator from 'components/common/progress-indicator';
import { OutlinedButton } from 'components/common/buttons/index';
import {
  checkUserHasProxy,
  handleUserApproveERC20,
  isUserApprovedERC721,
  handleUserApproveForAllERC721,
  userAllowanceERC20,
} from 'blockchain/utils';
import {
  STATE_STEP,
  NULL_ADDRESS,
  NEXT_PUBLIC_UMAD_ADDRESS,
  NEXT_PUBLIC_WETH_ADDRESS,
  CURRENCY_SELECT,
} from 'constants/app';
import saleNftService from 'service/saleNftService';
import {
  handleAtomicMatchForAcceptBid,
  handleAtomicMatchForAcceptOffer,
  isUserApprovedERC20Amount,
} from 'blockchain/utils';
import { toastError, toastSuccess } from 'store/actions/toast';
import socket from 'configsocket';
import { EventSocket } from 'constants/text';
import { LINK_SCAN } from 'constants/envs';
import { forceUpdateInternalSale } from 'store/actions/forceUpdating';
import BigNumber from 'bignumber.js';
import { MARKET_RAW_FEE_BUY_TOKEN, DECIMALS_ERC20 } from 'constants/index';
import {
  handleAtomicMatchForAcceptOfferCreated,
  handleAtomicMatchForAcceptBidCreated,
} from 'blockchain/utils-created';

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
  resOfferDetail: any;
  refetch: () => void;
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
    link: '',
    isShowDes: true,
    subDes: 'Waiting for initialization...',
  },
  {
    indexNum: 2,
    title: 'Approve this item for sale',
    des: 'To start listing for the first time on MADworld, you need to approve this item for sale. This requires gas fee once only.',
    state: STATE_STEP.UNCHECKED,
    link: '',
    isShowDes: false,
    subDes: 'Waiting for confirmation...',
  },
  {
    indexNum: 3,
    title: '',
    des: '',
    state: STATE_STEP.UNCHECKED,
    link: '',
    isShowDes: false,
    subDes: 'Waiting for confirmation...',
  },
  {
    indexNum: 4,
    title: 'Accept this offer',
    des: 'Accept this offer',
    state: STATE_STEP.UNCHECKED,
    link: '',
    isShowDes: false,
    subDes: 'Waiting for confirmation...',
  },
];
const ModalFollowStep = ({
  handleClose,
  assetDataDetail,
  refetch,
  resOfferDetail,
}: IModalFollowStepProps) => {
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const [steps, setSteps] = React.useState([
    initSteps[0],
    initSteps[1],
    {
      ...initSteps[2],
      title: `Approve ${resOfferDetail?.currencyToken?.toUpperCase()} token`,
      des:
        'To start selling for the first time on MADworld, you need to allow a website to use your ' +
        resOfferDetail?.currencyToken?.toUpperCase() +
        '.',
    },
    initSteps[3],
  ]);
  const royalty = assetDataDetail?.collection?.royalty || 0;
  const signRef = React.useRef<any>(null);
  const approveRef = React.useRef<any>(null);

  const toggleDescription = (i: number) => {
    const stepsTemp = steps.map((step, index) => {
      if (index === i) {
        return { ...step, isShowDes: !step.isShowDes };
      }
      return step;
    });
    setSteps(stepsTemp);
  };

  const StepComponent = ({
    step: { title, des, state, indexNum, link, isShowDes, subDes },
  }: any) => {
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
            <p className="font-bold text-dark-on-surface text-lg">{`${indexNum}. ${title}`}</p>
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
              <p className="text-primary-gray text-sm mt-2">{des}</p>
              {state === STATE_STEP.LOADING && (
                <p className="text-xs text-secondary-gray mt-3">{subDes}</p>
              )}
              {link && (
                <a href={link} target="_blank">
                  <OutlinedButton
                    customClass="!text-secondary-60 mt-3"
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
    setSteps(initSteps);
    handleClose();
  };

  useEffect(() => {
    const processing = async () => {
      if (!account) return;

      try {
        const [checkUserHasProxyRes, proxyError] = await checkUserHasProxy(account);
        if (proxyError) {
          handleError(proxyError);
          return;
        }
        let checkUserHasProxyResHash = '';
        if (checkUserHasProxyRes?.hash) {
          checkUserHasProxyResHash = `${LINK_SCAN}tx/${checkUserHasProxyRes?.hash}`;
          setSteps([
            { ...steps[0], link: checkUserHasProxyResHash },
            { ...steps[1], isShowDes: true },
            {
              ...steps[2],
              isShowDes: true,
            },
            steps[3],
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
          { ...steps[1], state: STATE_STEP.LOADING, isShowDes: true },
          {
            ...steps[2],
            isShowDes: false,
          },
          steps[3],
        ]);

        const isApproveCollection = await isUserApprovedERC721(
          resOfferDetail.nft.collection.address,
          account,
        );
        let handleUserApproveForAllERC721ResHash = '';
        if (!isApproveCollection) {
          const [handleUserApproveForAllERC721Res, error] = await handleUserApproveForAllERC721(
            resOfferDetail.nft.collection.address,
            account,
          );
          if (error) {
            handleError(error);
            return;
          }

          if (handleUserApproveForAllERC721Res.hash) {
            handleUserApproveForAllERC721ResHash = `${LINK_SCAN}tx/${handleUserApproveForAllERC721Res?.hash}`;
            setSteps([
              {
                ...steps[0],
                state: STATE_STEP.CHECKED,
                isShowDes: false,
                link: checkUserHasProxyResHash,
              },
              {
                ...steps[1],
                state: STATE_STEP.LOADING,
                isShowDes: true,
                link: handleUserApproveForAllERC721ResHash,
              },
              steps[2],
              steps[3],
            ]);
            await handleUserApproveForAllERC721Res.wait(1);
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
            isShowDes: true,
            link: handleUserApproveForAllERC721ResHash,
          },
          {
            ...steps[2],
            state: STATE_STEP.LOADING,
            isShowDes: true,
          },
          steps[3],
        ]);

        const rawFee =
          resOfferDetail?.currencyToken?.toUpperCase() === CURRENCY_SELECT.UMAD
            ? MARKET_RAW_FEE_BUY_TOKEN.umad
            : MARKET_RAW_FEE_BUY_TOKEN.weth;
        const systemFee = new BigNumber(rawFee).dividedBy(100).toFixed().toString();
        const royaltyFee = new BigNumber(royalty).dividedBy(100).toFixed().toString();
        const totalFee = new BigNumber(systemFee).plus(royaltyFee).toFixed().toString();

        const feeAmount = new BigNumber(resOfferDetail.price as any)
          .multipliedBy(totalFee)
          .toFixed()
          .toString();

        const allowanceERC20 = await userAllowanceERC20(
          resOfferDetail?.currencyToken?.toUpperCase() === CURRENCY_SELECT.UMAD
            ? NEXT_PUBLIC_UMAD_ADDRESS
            : NEXT_PUBLIC_WETH_ADDRESS,
          account,
        );

        const isApproveErc20 = new BigNumber(allowanceERC20).gte(
          new BigNumber(feeAmount).multipliedBy(
            10 ** DECIMALS_ERC20[resOfferDetail?.currencyToken?.toLowerCase()],
          ),
        );
        // const isApproveErc20 = await isUserApprovedERC20(
        //   erc20[res?.currencyToken?.toUpperCase()],
        //   account,
        // );
        let handleUserApproveERC20ResHash = '';
        if (!isApproveErc20) {
          const [handleUserApproveERC20Res, error] = await handleUserApproveERC20(
            erc20[resOfferDetail?.currencyToken?.toUpperCase()],
          );
          if (error) {
            handleError(error);
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
                state: STATE_STEP.CHECKED,
                isShowDes: true,
                link: handleUserApproveForAllERC721ResHash,
              },
              {
                ...steps[2],
                state: STATE_STEP.LOADING,
                isShowDes: true,
                link: handleUserApproveERC20ResHash,
              },
              steps[3],
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
            isShowDes: true,
            link: handleUserApproveForAllERC721ResHash,
          },
          {
            ...steps[2],
            state: STATE_STEP.CHECKED,
            isShowDes: true,
            link: handleUserApproveERC20ResHash,
          },
          {
            ...steps[3],
            state: STATE_STEP.LOADING,
            isShowDes: true,
          },
        ]);
        setTimeout(() => {
          approveRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);

        const isApprovedAmountUser = await isUserApprovedERC20Amount(
          erc20[resOfferDetail?.currencyToken?.toUpperCase()],
          resOfferDetail.signatureSale.maker,
          resOfferDetail.price,
          resOfferDetail?.currencyToken,
        );
        if (!isApprovedAmountUser) {
          dispatch(
            toastError(
              'This offer cannot be accepted! The offer maker does not have enough balance in their wallet.',
            ),
          );
          handleClose();
          return;
        }

        const metadata = {
          tokenId: resOfferDetail.nft.tokenId,
          quantity: resOfferDetail.quantity,
          nftType: assetDataDetail.collection.type,
          expirationTime: resOfferDetail.signatureSale.expirationTime,
          maker: resOfferDetail.signatureSale.maker,
          taker: resOfferDetail.signatureSale.taker,
          feeRecipient: resOfferDetail.signatureSale.feeRecipient,
          listingTime: resOfferDetail.signatureSale.listingTime,
          price: new BigNumber(resOfferDetail.price).toString(),
          takerRelayerFee: resOfferDetail.signatureSale.takerRelayerFee,
          makerRelayerFee: resOfferDetail.signatureSale.makerRelayerFee,
          salt: resOfferDetail.signatureSale.salt,
          collectionAddress: resOfferDetail.nft.collection.address,
          tokenType: resOfferDetail?.currencyToken,
          v: resOfferDetail.signatureSale.v,
          r: resOfferDetail.signatureSale.r,
          s: resOfferDetail.signatureSale.s,
        };

        let acceptBidError;
        let handleAtomicMatchTx;

        if (resOfferDetail.signatureSale.taker === NULL_ADDRESS) {
          if (resOfferDetail?.nft?.collection?.isImport) {
            [handleAtomicMatchTx, acceptBidError] = await handleAtomicMatchForAcceptOffer({
              ...metadata,
              calldata: resOfferDetail.signatureSale.calldata,
            });
          } else {
            [handleAtomicMatchTx, acceptBidError] = await handleAtomicMatchForAcceptOfferCreated({
              ...metadata,
              calldata: resOfferDetail.signatureSale.calldata,
              cidIPFS: resOfferDetail?.nft?.cid,
              replacementPattern: resOfferDetail.replacementPattern,
            });
          }
        } else {
          if (resOfferDetail?.nft?.collection?.isImport) {
            [handleAtomicMatchTx, acceptBidError] = await handleAtomicMatchForAcceptBid({
              ...metadata,
              expirationTime: '0',
              calldata: resOfferDetail.signatureSale.calldata,
            });
          } else {
            [handleAtomicMatchTx, acceptBidError] = await handleAtomicMatchForAcceptBidCreated({
              ...metadata,
              expirationTime: '0',
              calldata: resOfferDetail.signatureSale.calldata,
              replacementPattern: resOfferDetail.replacementPattern,
              cidIPFS: resOfferDetail?.nft?.cid,
            });
          }
        }
        if (acceptBidError) {
          handleError(acceptBidError);
          return;
        }
        setTimeout(() => {
          signRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);

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
            isShowDes: true,
            link: handleUserApproveForAllERC721ResHash,
          },
          {
            ...steps[2],
            state: STATE_STEP.CHECKED,
            isShowDes: true,
            link: handleUserApproveERC20ResHash,
          },
          {
            ...steps[3],
            state: STATE_STEP.LOADING,
            isShowDes: true,
            link: `${LINK_SCAN}tx/${handleAtomicMatchTx?.hash}`,
          },
        ]);
        await handleAtomicMatchTx.wait(1);
      } catch (error) {
        return handleError(error);
      }
    };

    processing();
  }, []);

  useEffect(() => {
    if (socket) {
      const userId = localStorage.getItem('userId');

      socket.on(EventSocket.TRANSFER_NFT_SUCCESS, (res) => {
        if (
          res?.data?.fromUserId === Number(userId) &&
          res?.data?.nftId === assetDataDetail?.id &&
          res?.data?.buyHash === resOfferDetail?.sellHash
        ) {
          refetch();
          setTimeout(() => {
            dispatch(forceUpdateInternalSale());
          }, 1000);
          handleClose();
          dispatch(toastSuccess('Accept this offer successfully!'));
        }
      });
      return () => {
        socket.off(EventSocket.TRANSFER_NFT_SUCCESS);
      };
    }
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
        className="bg-background-700 rounded-[28px] flex flex-col overflow-y-auto max-h-[600px] sm:w-full md:w-[562px] sm:px-2 sm:py-16 md:px-16 md:pb-16 md:pt-7"
      >
        <p className="font-bold text-[24px] text-center mb-8 text-dark-on-surface">
          Accept this offer
        </p>
        <div className="flex-1 overflow-y-auto">
          <StepComponent step={steps[0]} />
          <StepComponent step={steps[1]} />
          <div ref={approveRef}>
            <StepComponent step={steps[2]} />
          </div>
          <div ref={signRef}>
            <StepComponent step={steps[3]} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalFollowStep;
