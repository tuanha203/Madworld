import { FC, useState } from 'react';
import { FullScreenDialog } from 'components/modules/dialogs';
import { BigButtonWithText } from 'components/common/buttons/BigButtons';
import { useWeb3React } from '@web3-react/core';
import { ASSET_TYPE, CURRENCY_SELECT, SELL_TYPE } from 'constants/app';
import FixedPriceForm from './FixedPriceForm';
import AuctionForm from './AuctionForm';
import PreviewAsset from './PreviewAsset';
import ModalFollowStepSell from './ModalFollowStepSell';
import {
  checkUserHasProxy,
  handleUserApproveERC20,
  handleUserApproveForAllERC721,
  isUserApprovedERC20,
  isUserApprovedERC721,
  signPutDataOnSale,
  userAllowanceERC20,
} from 'blockchain/utils';
import { useRouter } from 'next/router';
import saleNftService from 'service/saleNftService';
import { MARKET_RAW_FEE_BUY_TOKEN, NFT_SALE_TYPES } from 'constants/index';
import { NFT_SALE_ACTIONS } from 'constants/index';
import { useDispatch, useSelector } from 'react-redux';
import { toastError } from 'store/actions/toast';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { delay } from 'utils/utils';
import { forceUpdateInternalSale } from 'store/actions/forceUpdating';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { signPutDataOnSaleCreated } from 'blockchain/utils-created';
import { IUserInitState } from 'store/reducers/user';
import { WarningSvg } from 'components/common/iconography/iconsComponentSVG';

interface ISellAssetDialogProps {
  open: boolean;
  onClose: () => void;
  nftType?: string;
  id?: any;
  assetDataDetail?: any;
  getAssetDetail?: () => void;
  showModalSuccess: () => void;
  bestNftSale: any;
  isERC721: boolean;
}
const defaultPreviewConfig = {
  currencyToken: 'UMAD',
  price: 0,
};

export interface ITxHashFlow {
  initWallet: string;
  approveUMAD: string;
  approveCollection: string;
}

const NEXT_PUBLIC_UMAD_ADDRESS = process.env.NEXT_PUBLIC_UMAD_ADDRESS!;
const SellAssetDialog: FC<ISellAssetDialogProps> = (props) => {
  const {
    open,
    onClose,
    nftType,
    id,
    assetDataDetail,
    getAssetDetail,
    showModalSuccess,
    bestNftSale,
    isERC721,
  } = props;
  const { account } = useWeb3React();
  const router = useRouter();
  const { tokenId, address } = router.query;
  const storedWalletAddress = useSelector(
    (state: { user: IUserInitState }) => state.user.data.walletAddress,
  );
  const [isOpenFollowStep, setOpenFollowStep] = useState(false);
  const [sellType, setSellType] = useState(NFT_SALE_TYPES.FIX_PRICE);
  const [values, setValues] = useState({});
  const { icon } = useSelector((state:any) => state.theme);
  const [isUserRegisteredProxy, setIsUserRegisteredProxy] = useState<boolean>(false);
  const [isApproveUMAD, setIsApproveUMAD] = useState(false);
  const [isApproveCollection, setIsApproveCollection] = useState(false);
  const [isWaitingForSign, setIsWaitingForSign] = useState(false);

  const [previewConfig, setPreviewConfig] = useState(defaultPreviewConfig);
  const [txHashFlow, setTxhashFlow] = useState<ITxHashFlow>({
    initWallet: '',
    approveUMAD: '',
    approveCollection: '',
  });
  const [durationAuction, setDurationAuction] = useState({
    type: '1 week',
    startDate: moment().unix(),
    endDate: moment().add(7, 'days').unix(),
  });
  const [durationFixedPrice, setDurationFixedPrice] = useState({
    type: '1 week',
    startDate: moment().unix(),
    endDate: moment().add(7, 'days').unix(),
  });
  const dispatch = useDispatch();

  const processing = async (data: any) => {
    if (!account && !storedWalletAddress) {
      console.error('No account');
      return;
    }
    const [addressProxy, err, hasRegistered] = (await checkUserHasProxy(
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
    if (addressProxy?.hash) {
      walletAddress = await addressProxy.wait(1);
    }
    setIsUserRegisteredProxy(true);
    if (!hasRegistered) {
      setTxhashFlow({
        ...txHashFlow,
        initWallet: walletAddress?.transactionHash,
      });
    }

    if (data?.currency === CURRENCY_SELECT.UMAD) {
      const rawFee = MARKET_RAW_FEE_BUY_TOKEN.umad;
      const systemFee = new BigNumber(rawFee).dividedBy(100).toFixed().toString();

      const feeAmount = new BigNumber(data?.amount as any)
        .multipliedBy(systemFee)
        .toFixed()
        .toString();

      const allowanceUMAD = await userAllowanceERC20(
        NEXT_PUBLIC_UMAD_ADDRESS,
        account || storedWalletAddress,
      );

      const isApproveErc20 = new BigNumber(allowanceUMAD).gte(
        new BigNumber(feeAmount).multipliedBy(10 ** 8),
      );

      // const isApproveErc20 = await isUserApprovedERC20(NEXT_PUBLIC_UMAD_ADDRESS, account as any);

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
          const data = await resApprove.wait(1);
          setIsApproveUMAD(true);
          // setTxhashFlow({
          //   ...txHashFlow,
          //   approveUMAD: data?.transactionHash,
          // });
        }
      } else {
        await delay(1500);
        setIsApproveUMAD(true);
      }
    }

    const isApproveForAllERC721 = await isUserApprovedERC721(
      address,
      (account as any) || storedWalletAddress,
    );
    if (isApproveForAllERC721) {
      setIsApproveCollection(true);
    } else {
      const [resApproveForAll] = await handleUserApproveForAllERC721(
        address,
        account || storedWalletAddress,
      );
      if (resApproveForAll) {
        setTxhashFlow({
          ...txHashFlow,
          approveCollection: resApproveForAll?.hash,
        });
        const data = await resApproveForAll.wait(1);
        setIsApproveCollection(true);
        // setTxhashFlow({
        //   ...txHashFlow,
        //   approveCollection: data?.transactionHash,
        // });
      } else {
        console.log(err);
        handleCloseFollowStep();
        return dispatch(toastError('You declined the action in your wallet.'));
      }
    }

    let saleMetadata;
    let errPutOnSale;

    if (assetDataDetail?.collection?.isImport) {
      [saleMetadata, errPutOnSale] = await signPutDataOnSale({
        collectionAddress: address as string,
        tokenType: data?.currency === CURRENCY_SELECT.UMAD ? 'umad' : 'eth',
        tokenId: tokenId as string,
        quantity: nftType! === ASSET_TYPE.ERC721 ? 1 : data?.quantity,
        price: new BigNumber(data?.amount).toString(),
        nftType: nftType!,
        reserveBuyer: data?.reserveBuyer,
      });
    } else {
      [saleMetadata, errPutOnSale] = await signPutDataOnSaleCreated({
        collectionAddress: address as string,
        tokenType: data?.currency === CURRENCY_SELECT.UMAD ? 'umad' : 'eth',
        tokenId: tokenId as string,
        quantity: nftType! === ASSET_TYPE.ERC721 ? 1 : data?.quantity,
        price: new BigNumber(data?.amount).toString(),
        nftType: nftType!,
        reserveBuyer: data?.reserveBuyer,
        cidIPFS: assetDataDetail?.cid,
      });
      // await saleNftService.updateNftSaleCreated(id, {
      //   cid: assetDataDetail?.cid,
      // });
    }
    if (errPutOnSale) {
      console.error(errPutOnSale);
      handleCloseFollowStep();
      return dispatch(toastError('You declined the action in your wallet.'));
    }
    setIsWaitingForSign(true);
    await saleNftService.putDataOnSale({
      startDate: data?.duration?.startDate || 0,
      expireDate: data?.duration?.endDate || 0,
      price: new BigNumber(data?.amount).toString(),
      quantity: nftType! === ASSET_TYPE.ERC721 ? 1 : data?.quantity,
      type: sellType,
      action: NFT_SALE_ACTIONS.LIST,
      nftId: parseInt(id),
      metadata: saleMetadata,
      currencyToken: data?.currency === CURRENCY_SELECT.UMAD ? 'umad' : 'eth',
      reserve_buyer: data?.reserveBuyer,
      sellHash: (saleMetadata as any)?.sellHash,
      replacementPattern: (saleMetadata as any)?.replacementPattern,
    });

    showModalSuccess();
    handleClose();
    setTimeout(() => {
      showModalSuccess();
      if (typeof getAssetDetail === 'function') {
        getAssetDetail();
        dispatch(forceUpdateInternalSale());
      }
    }, 200);
  };
  const putOnSale = async (values: any) => {
    setOpenFollowStep(true);
    setValues(values);
    if (values) {
      processing(values);
    }
  };
  const handleClose = () => {
    setSellType(NFT_SALE_TYPES.FIX_PRICE);
    onClose();
    handleCloseFollowStep();
  };
  const handleCloseFollowStep = () => {
    // if (isApproveCollection || isApproveUMAD || isUserRegisteredProxy) {
    //   return
    // }

    setOpenFollowStep(false);
    setIsWaitingForSign(false);
    setIsApproveUMAD(false);
    setIsApproveCollection(false);
    setIsUserRegisteredProxy(false);
    setTxhashFlow({
      initWallet: '',
      approveUMAD: '',
      approveCollection: '',
    });
  };
  // console.log({
  //   assetDataDetail,
  // });
  const updatePreviewConfig = (obj = {}) => {
    setPreviewConfig({
      ...previewConfig,
      ...obj,
    });
  };

  const changeSellType = (type: string) => {
    setSellType(type);
  };

  return (
    <FullScreenDialog
      open={open}
      onClose={handleClose}
      confirm4Closed={true}
      className="sm:bg-background-preview-sell md:bg-background-asset-detail"
    >
      <div className="h-full flex justify-center">
        <div className="w-full md:w-[1440px] md:px-[120px] md:pt-[91px]">
          <div className="text-white sm:text--title-large sm:px-4 sm:py-[18px] sm:bg-background-700 md:bg-transparent md:p-0 md:text--display-small mb-6">
            Sell Asset
          </div>

          <div className="flex flex-col-reverse lg:flex-row sell-asset-form md:gap-20 sm:gap-y-8 sm:w-full sm:px-4 sm:pb-8 md:px-0">
            <div className="flex-1">
              <div className="text-white flex gap-2">
                <div className="text--label-large">Select your selling method</div>
                <ContentTooltip
                  arrow
                  title={
                    isERC721
                      ? `Choose “Fixed Price” for sell at a fixed price or “Time Auction” if you want to sell to highest bidder or declining price`
                      : `Choose “Fixed Price” for sell at a fixed price`
                  }
                >
                  <div>
                    <WarningSvg color={icon?.color} />
                  </div>
                </ContentTooltip>
              </div>
              <div className="select-type-sell flex gap-3 mt-5">
                <BigButtonWithText
                  text="Fixed Price"
                  customClass={
                    sellType !== NFT_SALE_TYPES.FIX_PRICE
                      ? 'big-button-text'
                      : 'big-button-text-select'
                  }
                  description="Sell at a fixed price"
                  onClick={() => {
                    updatePreviewConfig({ price: 0, currencyToken: 'UMAD' });
                    setSellType(NFT_SALE_TYPES.FIX_PRICE);
                  }}
                />
                {nftType === ASSET_TYPE.ERC721 && (
                  <BigButtonWithText
                    text="Time Auction"
                    customClass={
                      !sellType?.includes('auction') ? 'big-button-text' : 'big-button-text-select'
                    }
                    description="Auction to highest bidder or declining price"
                    onClick={() => {
                      updatePreviewConfig({ price: 0, currencyToken: 'UMAD' });
                      setSellType(NFT_SALE_TYPES.AUCTION);
                    }}
                  />
                )}
              </div>
              {sellType === NFT_SALE_TYPES.FIX_PRICE ? (
                <FixedPriceForm
                  putOnSale={putOnSale}
                  nftType={nftType}
                  assetDataDetail={assetDataDetail}
                  updatePreviewConfig={updatePreviewConfig}
                  bestNftSale={bestNftSale}
                  setDurationFixedPrice={setDurationFixedPrice}
                />
              ) : (
                <AuctionForm
                  nftId={id}
                  assetDataDetail={assetDataDetail}
                  getAssetDetail={getAssetDetail}
                  onCloseDialog={() => {
                    handleClose();
                    showModalSuccess();
                  }}
                  updatePreviewConfig={updatePreviewConfig}
                  setDurationAuction={setDurationAuction}
                  changeSellType={changeSellType}
                />
              )}
            </div>

            <div className="md:justify-end items-start">
              <PreviewAsset
                key={sellType}
                assetDataDetail={assetDataDetail}
                isNFT1155={nftType === ASSET_TYPE.ERC1155}
                sellType={sellType}
                previewConfig={previewConfig}
                durationAuction={durationAuction}
                durationFixedPrice={durationFixedPrice}
              />
            </div>
          </div>
          {isOpenFollowStep && (
            <ModalFollowStepSell
              assetDataDetail={assetDataDetail}
              open={isOpenFollowStep}
              textHeader="Complete your listing"
              handleClose={handleCloseFollowStep}
              data={values}
              id={id}
              isUserRegisteredProxy={isUserRegisteredProxy}
              isApproveUMAD={isApproveUMAD}
              isWaitingForSign={isWaitingForSign}
              isApproveCollection={isApproveCollection}
              isNFT1155={nftType === ASSET_TYPE.ERC1155}
              txHashFlow={txHashFlow}
            />
          )}
        </div>
      </div>
    </FullScreenDialog>
  );
};

export default SellAssetDialog;
