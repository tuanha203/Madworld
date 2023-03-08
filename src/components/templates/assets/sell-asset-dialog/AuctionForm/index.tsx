import { useState, FC, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { TrendingUp, TrendingDown } from 'components/common/iconography/IconBundle';
import SelectCustom from 'components/common/select-type/SelectCustom';
import DecliningPriceForm from './DecliningPriceForm';
import HighestBuyerForm from './HighestBuyerForm';
import ModalFollowStepSell from '../ModalFollowStepSell';
import ModalFollowStepAuction from './ModalFollowStepAuction';
import { useWeb3React } from '@web3-react/core';
import {
  checkUserHasProxy,
  handleUserApproveERC20,
  handleUserApproveForAllERC721,
  isUserApprovedERC20,
  isUserApprovedERC721,
  signPutDataOnSaleAuction,
  signPutDataOnSaleDutchAuction,
} from 'blockchain/utils';
import { useDispatch, useSelector } from 'react-redux';
import { toastError } from 'store/actions/toast';
import { ASSET_TYPE, CURRENCY_SELECT, NFT_SALE_ACTIONS, TIME } from 'constants/app';
import { useRouter } from 'next/router';
import saleNftService from 'service/saleNftService';
import { NFT_SALE_TYPES } from 'constants/index';
import { delay } from 'utils/utils';
import moment from 'moment';
import { ITxHashFlow } from '..';
import BigNumber from 'bignumber.js';
import {
  signPutDataOnSaleAuctionCreated,
  signPutDataOnSaleDutchAuctionCreated,
} from 'blockchain/utils-created';
import ModalFollowStepDutchAuction from './ModalFollowStepDutchAuction';
import { IUserInitState } from 'store/reducers/user';

interface IAuctionFormProps {
  getAssetDetail?: () => void;
  onCloseDialog: () => any;
  nftId?: any;
  assetDataDetail: any;
  updatePreviewConfig?: any;
  setDurationAuction?: any;
  changeSellType?: (typeSale: string) => void;
}

const initialTime = {
  [TIME.HOURS]: moment().hours().toString(),
  [TIME.MINUTES]: moment().minutes().toString(),
  [TIME.SECONDS]: moment().seconds().toString(),
};

const currentTimeInPopup = moment(
  new Date().setHours(
    Number(initialTime[TIME.HOURS]),
    Number(initialTime[TIME.MINUTES]),
    Number(initialTime[TIME.SECONDS]),
  ),
).unix();

const METHOD_OPTIONS = [
  {
    label: (
      <>
        <TrendingUp /> Sell to highest bidder
      </>
    ),
    value: '2',
  },
  {
    label: (
      <>
        <TrendingDown /> Sell with declining price
      </>
    ),
    value: '1',
  },
];
const NEXT_PUBLIC_UMAD_ADDRESS = process.env.NEXT_PUBLIC_UMAD_ADDRESS!;
const NEXT_PUBLIC_WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS!;

const AuctionForm: FC<IAuctionFormProps> = ({
  getAssetDetail,
  onCloseDialog,
  assetDataDetail,
  nftId,
  updatePreviewConfig,
  setDurationAuction,
  changeSellType,
}) => {
  const [methodType, setMethodType] = useState<string>(METHOD_OPTIONS[0].value);
  const [txHashFlow, setTxhashFlow] = useState<ITxHashFlow>({
    initWallet: '',
    approveUMAD: '',
    approveCollection: '',
  });
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const router = useRouter();
  const { tokenId, address } = router.query;

  const [isOpenFollowStep, setOpenFollowStep] = useState(false);
  const [isOpenFollowStepDutchAuction, setOpenFollowStepDutchAuction] = useState(false);

  const [values, setValues] = useState({});

  const [isUserRegisteredProxy, setIsUserRegisteredProxy] = useState(false);
  const [isApproveERC20, setIsApproveERC20] = useState(false);
  const [isApproveCollection, setIsApproveCollection] = useState(false);
  const [isWaitingForSign, setIsWaitingForSign] = useState(false);
  const storedWalletAddress = useSelector(
    (state: { user: IUserInitState }) => state.user.data.walletAddress,
  );
  const isDutchAuction = methodType === '1';
  useEffect(() => {
    if (typeof changeSellType === 'function' && isDutchAuction) {
      changeSellType(NFT_SALE_TYPES.DUTCH_AUCTION);
    } else if (typeof changeSellType === 'function' && !isDutchAuction) {
      changeSellType(NFT_SALE_TYPES.ENGLISH_AUCTION);
    }
  }, [isDutchAuction]);

  const processing = async (data: any) => {
    if (!account && !storedWalletAddress) {
      console.error('No account');
      return;
    }
    const [checkUserHasProxyRes, err, hasRegistered] = (await checkUserHasProxy(
      account || storedWalletAddress,
    )) as any;

    if (err) {
      if (
        err?.code === 4001 ||
        String(err)?.includes('User rejected') ||
        String(err)?.includes('User denied')
      ) {
        dispatch(toastError('You declined the action in your wallet.'));
      } else {
        dispatch(toastError('Something went wrong.'));
      }
      return handleCloseFollowStep();
    }
    let walletAddress;
    if (checkUserHasProxyRes?.hash) {
      setTxhashFlow({
        ...txHashFlow,
        initWallet:checkUserHasProxyRes?.hash || '',
      });
      walletAddress = await checkUserHasProxyRes.wait(1);
    }
    setIsUserRegisteredProxy(true);
    // if (!hasRegistered) {
    //   setTxhashFlow({
    //     ...txHashFlow,
    //     initWallet: walletAddress?.transactionHash || '',
    //   });
    // }

    if (data?.currency === CURRENCY_SELECT.UMAD) {
      const isApproveErc20 = await isUserApprovedERC20(NEXT_PUBLIC_UMAD_ADDRESS, account as any);
      if (!isApproveErc20) {
        const [resApprove, handleUserApproveERC20Err] = await handleUserApproveERC20(
          NEXT_PUBLIC_UMAD_ADDRESS,
        );
        if (handleUserApproveERC20Err) {
          handleCloseFollowStep();
          return dispatch(toastError('You declined the action in your wallet.'));
        } else {
          setTxhashFlow({
            ...txHashFlow,
            approveUMAD: resApprove?.hash,
          });
          await resApprove.wait(1);
          setIsApproveERC20(true);
          // setTxhashFlow({
          //   ...txHashFlow,
          //   approveUMAD: data?.transactionHash,
          // });
        }
      } else {
        await delay(1500);
        setIsApproveERC20(true);
      }
    } else if (data?.currency === CURRENCY_SELECT.WETH) {
      const isApproveErc20 = await isUserApprovedERC20(NEXT_PUBLIC_WETH_ADDRESS, account as any);
      if (!isApproveErc20) {
        const [resApprove, handleUserApproveERC20Err] = await handleUserApproveERC20(
          NEXT_PUBLIC_WETH_ADDRESS,
        );
        if (handleUserApproveERC20Err) {
          handleCloseFollowStep();
          return dispatch(toastError('You declined the action in your wallet.'));
        } else {
          setTxhashFlow({
            ...txHashFlow,
            approveUMAD: resApprove?.hash,
          });
          await resApprove.wait(1);
          setIsApproveERC20(true);
          // setTxhashFlow({
          //   ...txHashFlow,
          //   approveUMAD: data?.transactionHash,
          // });
        }
      } else {
        await delay(1500);
        setIsApproveERC20(true);
      }
    }

    const isApproveForAllERC721 = await isUserApprovedERC721(address, account as any);
    await delay(1500);
    if (isApproveForAllERC721) {
      setIsApproveCollection(true);
    } else {
      const [resApproveForAll, errorApproveALl] = await handleUserApproveForAllERC721(
        address,
        account,
      );
      if (resApproveForAll) {
        const approveCollection = await resApproveForAll.wait(1);
        setIsApproveCollection(true);
        setTxhashFlow({
          ...txHashFlow,
          approveCollection: approveCollection?.transactionHash,
        });
      } else {
        handleCloseFollowStep();
        return dispatch(toastError('You declined the action in your wallet.'));
      }
    }

    const isImport = assetDataDetail?.collection?.isImport;

    let saleMetadata;
    let errPutOnSale;

    if (isImport && !isDutchAuction) {
      [saleMetadata, errPutOnSale] = await signPutDataOnSaleAuction({
        collectionAddress: address as string,
        tokenType: data?.currency === CURRENCY_SELECT.UMAD ? 'umad' : 'weth',
        tokenId: tokenId as string,
        quantity: 1,
        price: new BigNumber(data?.amount).toString(),
        nftType: ASSET_TYPE.ERC721,
      });
    } else if (!isImport && !isDutchAuction) {
      [saleMetadata, errPutOnSale] = await signPutDataOnSaleAuctionCreated({
        collectionAddress: address as string,
        tokenType: data?.currency === CURRENCY_SELECT.UMAD ? 'umad' : 'weth',
        tokenId: tokenId as string,
        quantity: 1,
        price: new BigNumber(data?.amount).toString(),
        nftType: ASSET_TYPE.ERC721,
        cidIPFS: assetDataDetail?.cid,
      });
    } else if (isDutchAuction && !isImport) {
      [saleMetadata, errPutOnSale] = await signPutDataOnSaleDutchAuctionCreated({
        collectionAddress: address as string,
        tokenType: data?.currency?.toLowerCase(),
        tokenId: tokenId as string,
        quantity: 1,
        staringPrice: new BigNumber(data?.staringPrice).toString(),
        endingPrice: new BigNumber(data?.endingPrice).toString(),
        nftType: ASSET_TYPE.ERC721,
        cidIPFS: assetDataDetail?.cid,
        expireTime: data?.duration?.endDate,
        startTime: data?.duration?.startDate,
      });
    } else if (isDutchAuction && isImport) {
      [saleMetadata, errPutOnSale] = await signPutDataOnSaleDutchAuction({
        collectionAddress: address as string,
        tokenType: data?.currency?.toLowerCase(),
        tokenId: tokenId as string,
        quantity: 1,
        staringPrice: new BigNumber(data?.staringPrice).toString(),
        endingPrice: new BigNumber(data?.endingPrice).toString(),
        nftType: ASSET_TYPE.ERC721,
        expireTime: data?.duration?.endDate,
        startTime: data?.duration?.startDate,
      });
    }

    if (errPutOnSale) {
      handleCloseFollowStep();
      return dispatch(toastError('You declined the action in your wallet.'));
    }
    setIsWaitingForSign(true);

    await saleNftService.putDataOnSale({
      startDate: data?.duration?.startDate || 0,
      expireDate: data?.duration?.endDate || 0,
      price: new BigNumber(data?.amount || data?.staringPrice).toString(),
      quantity: 1,
      type: isDutchAuction ? NFT_SALE_TYPES.DUTCH_AUCTION : NFT_SALE_TYPES.ENGLISH_AUCTION,
      action: NFT_SALE_ACTIONS.LIST,
      nftId: parseInt(nftId),
      metadata: saleMetadata,
      currencyToken: data?.currency?.toLowerCase(),
      reservePrice: data?.reversePrice ? parseFloat(data?.reserve) || 0 : 0,
      sellHash: (saleMetadata as any)?.sellHash,
      replacementPattern: (saleMetadata as any)?.replacementPattern,
      startPrice: new BigNumber(data?.staringPrice).toNumber(),
      endPrice: new BigNumber(data?.endingPrice).toNumber(),
    });
    // await saleNftService.updateNftSaleCreated(assetDataDetail?.id, {
    //   replacementPattern: (saleMetadata as any)?.replacementPattern,
    //   cid: assetDataDetail?.cid
    // })
    if (typeof getAssetDetail === 'function') {
      await getAssetDetail();
    }
    onCloseDialog();
  };

  const handleMethodChange = (event: SelectChangeEvent<unknown>, _: any) => {
    setMethodType(event.target.value as string);
    updatePreviewConfig({ price: 0, currencyToken: 'UMAD' });
  };
  const putDataAuction = (values = {}) => {
    if (isDutchAuction) {
      setOpenFollowStepDutchAuction(true);
    } else {
      setOpenFollowStep(true);
    }
    setValues(values);
    if (values) {
      processing(values);
    }
  };

  const handleCloseFollowStep = () => {
    setOpenFollowStepDutchAuction(false);
    setOpenFollowStep(false);
    setIsApproveERC20(false);
    setIsUserRegisteredProxy(false);
    setIsApproveCollection(false);
    setIsWaitingForSign(false);
  };

  return (
    <>
      <div className="my-5">
        <SelectCustom
          label={'Method'}
          className="mb-3"
          optionClassName="flex gap-2 text--body-large font-Chakra"
          options={METHOD_OPTIONS}
          value={methodType}
          onChange={handleMethodChange}
        />
        {isDutchAuction ? (
          <DecliningPriceForm
            formik={{}}
            putDataAuction={putDataAuction}
            assetDataDetail={assetDataDetail}
            updatePreviewConfig={updatePreviewConfig}
            setDurationAuction={setDurationAuction}
          />
        ) : (
          <HighestBuyerForm
            formik={{}}
            putDataAuction={putDataAuction}
            assetDataDetail={assetDataDetail}
            updatePreviewConfig={updatePreviewConfig}
            setDurationAuction={setDurationAuction}
          />
        )}
      </div>
      {isOpenFollowStep && (
        <ModalFollowStepAuction
          open={isOpenFollowStep}
          textHeader="Complete your listing"
          handleClose={handleCloseFollowStep}
          data={values}
          isUserRegisteredProxy={isUserRegisteredProxy}
          isApproveERC20={isApproveERC20}
          isApproveCollection={isApproveCollection}
          assetDataDetail={assetDataDetail}
          isWaitingForSign={isWaitingForSign}
          txHashFlow={txHashFlow}
        />
      )}
      {isOpenFollowStepDutchAuction && (
        <ModalFollowStepDutchAuction
          open={isOpenFollowStepDutchAuction}
          textHeader="Complete your listing"
          handleClose={handleCloseFollowStep}
          data={values}
          isUserRegisteredProxy={isUserRegisteredProxy}
          isApproveERC20={isApproveERC20}
          isApproveCollection={isApproveCollection}
          assetDataDetail={assetDataDetail}
          isWaitingForSign={isWaitingForSign}
          txHashFlow={txHashFlow}
        />
      )}
    </>
  );
};

export default AuctionForm;
