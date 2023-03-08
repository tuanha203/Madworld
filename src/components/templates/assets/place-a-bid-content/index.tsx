import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import moment from 'moment';
import Link from 'next/link';

import { Divider, FilledButton, OutlinedButton } from 'components/common';
import { SwitchControl } from 'components/common/selectionControls';
import { buildDataBid, isUserApprovedERC20Amount, handleUserApproveERC20 } from 'blockchain/utils';
import saleNftService from 'service/saleNftService';
import TermsAcknowledge from 'components/common/terms-acknowledge';
import SwapTextField from 'components/common/textFieldMakeOffer/SwapTextField';
import { LIST_OFFER } from 'components/modules/MakeAnOfferModal/MakeAnOffer';
import { addCommaToNumber, addCommaToNumberHasApproximately } from 'utils/currencyFormat';
import { ASSET_TYPE, CURRENCY_SELECT, MAX_PRICE } from 'constants/app';
import { toastError, toastSuccess } from 'store/actions/toast';
import ModalFollowStepBid from './ModalFollowStepBid';
import useConnectWallet from 'hooks/useConnectWallet';
import { REGEX_PRICE } from 'constants/index';
import { PLEASE_RELOAD_PAGE, SWAP_UMAD_UNISWAP, SWAP_WETH_UNISWAP } from 'constants/text';
import BigNumber from 'bignumber.js';
import { forceUpdateInternalSale } from 'store/actions/forceUpdating';
import { shortenNameNoti } from 'utils/func';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { useUpdateBalance } from 'hooks/useUpdateBalance';
import { buildDataBidCreated } from 'blockchain/utils-created';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';

const NEXT_PUBLIC_UMAD_ADDRESS = process.env.NEXT_PUBLIC_UMAD_ADDRESS!;
const NEXT_PUBLIC_WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS!;
interface PlaceABidProp {
  collectionName: string;
  artistName: string;
  artistAddress: string;
  collectionAddress: string;
  bestNftSale: any;
  handleClose: () => void;
  refeshData: () => void;
  priceShowing: any;
  setHideCloseButton: any;
  bestOfferOwner: any;
  isBid: boolean | number;
  assetDataDetail: any;
}

const PlaceABid = ({
  collectionName,
  artistName,
  artistAddress,
  collectionAddress,
  bestNftSale,
  handleClose,
  refeshData,
  priceShowing,
  setHideCloseButton,
  bestOfferOwner,
  isBid,
  assetDataDetail,
}: PlaceABidProp) => {
  const { account } = useWeb3React();
  const [isChecked, setIsChecked] = useState(false);
  const saleNftId = bestNftSale?.id;
  const minBid = bestNftSale?.price;
  const isBestBid = new BigNumber(priceShowing?.price || 0).isGreaterThan(minBid);
  const [bestOfferOfUser, setBestOfferOfUser] = useState<any>();

  const dispatch = useDispatch();
  const [isOpenFollowStep, setOpenFollowStep] = useState(false);
  const [isApproveUMAD, setIsApproveUMAD] = useState(false);
  const [isApproveErc20, setIsApproveErc20] = useState(false);
  const { openModalConnectWallet } = useConnectWallet();
  const { walletAddress } = useSelector((state: any) => ({
    walletAddress: state?.user?.data?.walletAddress,
  }));
  const [loading, setLoading] = useState(false);
  const [flowTxHash, setFlowTxHash] = useState({
    txApprove: '',
  });

  const { umadBalance, wethBalance } = useSelector((state: any) => ({
    umadBalance: get(state, 'user.data.umadBalance', 0),
    wethBalance: get(state, 'user.data.wethBalance', 0),
  }));

  const currency = bestNftSale?.currencyToken?.toUpperCase();
  const balance = currency === CURRENCY_SELECT.UMAD ? umadBalance : wethBalance;

  const { updateBalance } = useUpdateBalance();

  useEffect(() => {
    updateBalance();
  }, []);

  const handleSignBid = async () => {
    try {
      if (!account) {
        openModalConnectWallet();
        return;
      }
      setLoading(true);

      const [orderDetail] = await saleNftService.getNftSaleDetailById(saleNftId);
      if (!orderDetail) {
        dispatch(toastError(PLEASE_RELOAD_PAGE));
        return handleCloseFollowStep();
      }
      setOpenFollowStep(true);
      setHideCloseButton(true);
      const { expireDate, nft } = orderDetail;
      const { tokenId } = nft || {};
      if (orderDetail?.currencyToken === 'umad') {
        const isApproveUMAD = await isUserApprovedERC20Amount(
          NEXT_PUBLIC_UMAD_ADDRESS,
          account as string,
          String(formik.values.amount),
          orderDetail?.currencyToken,
        );

        if (!isApproveUMAD) {
          const [resApprove, err] = await handleUserApproveERC20(NEXT_PUBLIC_UMAD_ADDRESS);
          if (err) {
            return handleError(err);
          } else {
            setFlowTxHash({
              txApprove: resApprove?.hash
            })
            await resApprove.wait(1);
            // setFlowTxHash({
            //   txApprove: data?.transactionHash,
            // });
            setIsApproveErc20(true);
          }
        } else {
          setIsApproveErc20(true);
        }
      } else {
        const isApproveWETH = await isUserApprovedERC20Amount(
          NEXT_PUBLIC_WETH_ADDRESS,
          account as string,
          String(formik.values.amount),
          orderDetail?.currencyToken,
        );
        if (!isApproveWETH) {
          const [resApprove, err] = await handleUserApproveERC20(NEXT_PUBLIC_WETH_ADDRESS);
          if (err) {
            return handleError(err);
          } else {
            setFlowTxHash({
              txApprove: resApprove?.hash
            })
            await resApprove.wait(1);
            setIsApproveErc20(true);
          }
        } else {
          setIsApproveErc20(true);
        }
      }
      let bidData;
      let err;
      if (assetDataDetail?.collection?.isImport) {
        [bidData, err] = await buildDataBid({
          taker: orderDetail?.user?.walletAddress,
          collectionAddress,
          price: new BigNumber(formik.values.amount).toString(),
          expirationTime: 0,
          nftType: ASSET_TYPE.ERC721,
          tokenType: orderDetail?.currencyToken,
          quantity: 1,
          tokenId,
        });
      } else {
        [bidData, err] = await buildDataBidCreated({
          taker: orderDetail?.user?.walletAddress,
          collectionAddress,
          price: new BigNumber(formik.values.amount).toString(),
          expirationTime: 0,
          nftType: ASSET_TYPE.ERC721,
          tokenType: orderDetail?.currencyToken,
          quantity: 1,
          tokenId,
          cidIPFS: orderDetail?.nft?.cid,
        });
      }

      if (err) {
        return handleError(err);
      }
      const [, error] = await saleNftService.bidNftSale({
        price: Number(formik.values.amount),
        currencyToken: orderDetail?.currencyToken,
        quantity: 1,
        expireDate: moment().add(3, 'days').unix(),
        nftSaleId: saleNftId,
        metadata: bidData,
        sellHash: (bidData as any)?.sellHash,
        toAddress: orderDetail?.user?.walletAddress,
        replacementPattern: (bidData as any)?.replacementPattern,
      });
      if (error) {
        handleError(error);
      } else {
        dispatch(forceUpdateInternalSale());
        await refeshData();
        dispatch(toastSuccess(`Your bid was submitted successfully!`));
        return handleCloseFollowStep();
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setOpenFollowStep(false);
    }
  };

  const handleError = (error: any) => {
    handleCloseFollowStep();

    if (
      error?.code === 4001 ||
      String(error)?.includes('User rejected') ||
      String(error)?.includes('User denied')
    ) {
      dispatch(toastError('You declined the action in your wallet.'));
    } else {
      dispatch(toastError('Something went wrong.'));
    }
  };

  const handleChangeYourOffer = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    let regex = /^([0-9]+\.?([0-9]{0,18}$)*)$/;
    if (REGEX_PRICE.test(value)) {
      formik.setFieldValue('amount', value);
    } else if (!value) {
      formik.setFieldValue('amount', '');
    }
  };

  const validationSchema = yup.object({
    amount: yup
      .number()
      .positive(`Your bid must be greater than 0`)
      .min(
        parseFloat(bestOfferOfUser?.price) || parseFloat(minBid) || 0,
        !!parseFloat(bestOfferOfUser?.price)
          ? `You must place a bid greater than or equal to the your current highest bid`
          : `Offer must be at least the minimum price per unit of ${minBid} ${currency}`,
      )
      .required('Your bid is not allowed to be empty')
      .test({
        name: 'amount',
        exclusive: false,
        params: {},
        test: function (value: any, { createError }: any) {
          if (!value) return false;

          if ((value && Number(value) > balance) || balance === 0) {
            return createError({
              message: `Insufficient ${this.parent.currency} balance`,
              path: 'amount',
            });
          }

          if (+value > MAX_PRICE) {
            return createError({
              message: `The amount cannot exceed 10,000,000,000,000`,
              path: 'amount',
            });
          }
          return true;
        },
      }),
  });

  const formik = useFormik({
    initialValues: {
      amount: new BigNumber(priceShowing?.price || bestNftSale?.price || 0).toString(),
      currency,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSignBid();
    },
  });

  const { errors, handleSubmit, isValid } = formik;

  const handleCloseFollowStep = () => {
    setIsApproveUMAD(false);
    setOpenFollowStep(false);
    setLoading(false);
    handleClose();
  };

  useEffect(() => {
    const getBestOfferOfNft = async (nftId: any) => {
      try {
        const [data] = await saleNftService.getTopOffersByNftId(nftId, {
          priceType: 'DESC',
          walletAddress,
        });

        setBestOfferOfUser(get(data, 'items.0'));
      } catch (err: any) {
        console.error(err);
      }
    };

    if (typeof assetDataDetail?.id === 'number' && walletAddress) {
      getBestOfferOfNft(assetDataDetail?.id);
    }
  }, [assetDataDetail?.id, walletAddress]);

  if (isOpenFollowStep) {
    return (
      <ModalFollowStepBid
        open={isOpenFollowStep}
        handleClose={handleCloseFollowStep}
        isApproveErc20={isApproveErc20}
        isUMAD={currency === 'UMAD'}
        currency={currency}
        flowTxHash={flowTxHash}
      />
    );
  }

  const isShowButtonBuyMore =
    new BigNumber(balance).lte(minBid) || new BigNumber(balance).lt(formik.values.amount);

  return (
    <div className="sm:w-full md:w-auo">
      <div className="text-center">
        <div className="text-sm flex flex-wrap">
          <span className="shrink-0">You are about to place a bid for&nbsp;</span>
          <div className="max-w-[90px]">
            <Link href={typeof window !== "undefined" ? window.location.href : ""}>
              <a target="_blank">
                <OverflowTooltip title={get(bestNftSale, 'nft.title', 'Unknown')} className="text-[#7340D3] text-[14px]" arrow>
                  <span className="font-black cursor-pointer text-primary-90">{get(bestNftSale, 'nft.title', 'Unknown')}</span>
                </OverflowTooltip>
              </a>
            </Link>
          </div>
          <span className="shrink-0">&nbsp; by&nbsp;</span>
          <div className="max-w-[80px]">
            <Link href={`/artist/${artistAddress}`}>
              <a target="_blank">
                <OverflowTooltip title={artistName} arrow className="">
                  <span className="font-black cursor-pointer text-primary-90">{artistName}</span>
                </OverflowTooltip>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <h2 className="font-bold text-lg mt-5 mb-3">Your Bid</h2>
      <form onSubmit={handleSubmit}>
        <SwapTextField
          helperText={errors.amount}
          amount={formik.values.amount}
          valueSelect={bestNftSale?.currencyToken?.toUpperCase()}
          listCurrency={LIST_OFFER.filter(({ value }: any) => value === currency)}
          handleChangeAmount={handleChangeYourOffer}
          handleSelectionCurrency={() => {}}
          amountLabel="Enter price"
          typeInput="text"
          nameInput="amount"
          bgTextFieldDynamic='swap-current-textField-input-custom-1'
        />
        <Divider customClass="my-4" />
        <div className="flex justify-between font-normal text-sm">
          <span>Balance</span>
          <span>
            {addCommaToNumberHasApproximately(balance, 8)} {formik.values.currency}
          </span>
        </div>

        <div className="flex justify-between font-normal text-sm">
          <span>Total Payable</span>
          <span>
            {addCommaToNumber(formik.values.amount, 8)} {formik.values.currency}
          </span>
        </div>
        <div>
          <TermsAcknowledge
            onChange={(_, checked: boolean) => setIsChecked(checked)}
            value={isChecked}
            className="my-6"
          />
        </div>
        <div className="flex gap-5 justify-end">
          {isShowButtonBuyMore && (
            <a
              href={currency === CURRENCY_SELECT.UMAD ? SWAP_UMAD_UNISWAP : SWAP_WETH_UNISWAP}
              target="_blank"
            >
              <OutlinedButton
                text={`BUY ${currency}`}
                customClass="!text--label-large !text-secondary-60"
              />
            </a>
          )}

          <FilledButton
            disabled={!isChecked || !isValid}
            type="submit"
            customClass="!text--label-large"
            text="Place a bid"
            onClick={handleSubmit}
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default PlaceABid;
