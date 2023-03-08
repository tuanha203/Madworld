import { FilledButton } from 'components/common';
import MadStepper from 'components/modules/stepper/MADStepper';
import UploadMedia from 'components/modules/uploadMedia/UploadMedia';
import {
  ASSET_TYPE,
  CREATE_ASSET_TYPE,
  CURRENCY_SELECT,
  NEXT_PUBLIC_UMAD_ADDRESS,
  SELL_TYPE,
  STEP_CREATE_ASSET,
  TYPE_COLLECTION,
  NFT_SALE_ACTIONS,
  METHOD_SELL_AUCTION,
  NEXT_PUBLIC_WETH_ADDRESS,
  initStepNoListYourAsset,
} from 'constants/app';
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import nftService from 'service/nftService';
import collectionService from 'service/collectionService';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from 'store/actions/toast';
import _, { get } from 'lodash';
import {
  genTokenIdForMainStore,
  signPutDataOnSaleAuctionCreated,
  signPutDataOnSaleCreated,
  signPutDataOnSaleDutchAuctionCreated,
} from 'blockchain/utils-created';
import { Modal } from '@mui/material';
import FormCreate from 'components/templates/create-nft/ERC721';
import ModalCreateNoListing from 'components/templates/create-nft/modalCompleteCreating/ModalCreateNoListing';
import {
  checkUserHasProxy,
  handleUserApproveERC20,
  handleUserApproveForAllERC721,
  isUserApprovedERC20,
  isUserApprovedERC721,
  userAllowanceERC20,
} from 'blockchain/utils';
import { delay } from 'utils/utils';
import saleNftService from 'service/saleNftService';
import BigNumber from 'bignumber.js';
import { uploadToIPFS, uploadVideoAudioToIPFS } from 'blockchain/ipfs';
import ModalSuccessCreateNFT from 'components/templates/create-nft/modalCompleteCreating/ModalSuccessCreateNFT';
import { MARKET_RAW_FEE_BUY_TOKEN, NFT_SALE_TYPES } from 'constants/index';
import moment from 'moment';
import ModalSellCreatedNFT from 'components/templates/create-nft/modalCompleteCreating/ModalSellCreatedNFT';
import { TrendingDown, TrendingUp } from 'components/common/iconography/IconBundle';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { NETWORK_CHAIN_ID } from 'constants/envs';
import ModalSellEnglishAuction from 'components/templates/create-nft/modalCompleteCreating/ModalSellEnglishAuction';
import ModalSellDutchAuction from 'components/templates/create-nft/modalCompleteCreating/ModalSellDutchAuction';
import {
  validationSchemaAssetDetail,
  validationSchemaAdvancedDetails,
  validationSchemaPriceDetails,
} from 'components/common/validationSchema/createNft';
import { getAttributes, getProperties } from 'utils/formFields';
import { useLeavePageConfirm } from 'hooks/useLeavePage';
import {
  changeHandlerNftPreview,
  getLevelsAndStatsValid,
  getPropertiesValid,
  handleChangeImage,
  handleUploadS3,
  handleValidateLevels,
  handleValidateProperties,
  handleValidateStats,
} from 'utils/createNft';
import { removeEventChangePage } from 'store/actions/forceUpdating';

export interface ICategory {
  createdAt: Date;
  description: string;
  id: number;
  isDisplay: boolean;
  name: string;
  isActive: boolean;
}

export interface IStep {
  indexNum: number;
  title: string;
  des: string;
  state: string;
  link: string;
  isShowDes: boolean;
  subDes: string;
}

export const METHOD_OPTIONS = [
  {
    label: (
      <>
        <TrendingUp /> Sell to highest bidder
      </>
    ),
    value: METHOD_SELL_AUCTION.SELL_TO_HIGHTEST_BIDDER,
  },
  {
    label: (
      <>
        <TrendingDown /> Sell with declining price
      </>
    ),
    value: METHOD_SELL_AUCTION.SELL_WITH_DECLINING_PRICE,
  },
];

const defaultHash = {
  initWallet: '',
  approveUMAD: '',
  approveCollection: '',
  confirmForSign: '',
};

const CreateSingle = () => {
  const dispatch = useDispatch();
  useLeavePageConfirm(true);
  // const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const { priceNativeCoinUsd, priceUmadUsd, walletAddress } = useSelector((state: any) => ({
    priceNativeCoinUsd: state?.system?.priceNativeCoinUsd,
    priceUmadUsd: state?.system?.priceUmadUsd,
    walletAddress: state?.user?.data?.walletAddress,
  }));

  const [stepCreate, setStepCreate] = useState<number>(CREATE_ASSET_TYPE.ASSET_DETAIL);
  const [collectionOfOwner, setCollectionOfOwner] = useState<any>([]);
  const [collectionSelected, setCollectionSelected] = useState<any>({});
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [isDisable, setDisable] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [isOpenModalComplete, setOpenModalComplete] = useState<boolean>(false);
  const [isOpenModalCreateSuccess, setShowModalCreateSuccess] = useState<boolean>(false);
  const [modalFollowCreateNFT, setModalFollowCreateNFT] = useState<boolean>(false);
  const [modalSellEnglishAuction, setModalSellEnglishAuction] = useState<boolean>(false);
  const [modalSellDutchAuction, setModalSellDutchAuction] = useState<boolean>(false);

  const [isUploadIPFS, setIsUploadIPFS] = useState<boolean>(false);
  const [isUserRegisteredProxy, setIsUserRegisteredProxy] = useState<boolean>(false);
  const [isApproveUMAD, setIsApproveUMAD] = useState(false);
  const [isApproveCollection, setIsApproveCollection] = useState(false);
  const [isWaitingForSign, setIsWaitingForSign] = useState(false);
  const [txHashFlow, setTxhashFlow] = useState<any>(defaultHash);

  // condition step
  const [conditionAssetDetails, setConditionAssetDetails] = useState<boolean>(true);
  const [conditionAdvancedDetails, setConditionAdvancedDetails] = useState<boolean>(true);
  const [conditionFixedPriceDetail, setConditionFixedPriceDetail] = useState<boolean>(true);
  const [conditionEngAuction, setConditionEngAuction] = useState<boolean>(true);
  const [conditionDutchAuction, setConditionDutchAuction] = useState<boolean>(true);
  const [stepsComplete, setStepsComplete] = useState<Array<IStep>>(initStepNoListYourAsset);

  const { account, library, chainId } = useWeb3React();
  const router = useRouter();

  useEffect(() => {
    if (!walletAddress) {
      dispatch(removeEventChangePage(1));
      router.push('/marketplace');
    }
  }, [walletAddress]);

  useEffect(() => {
    if (chainId && chainId?.toString() !== NETWORK_CHAIN_ID) {
      dispatch(removeEventChangePage(1));
      router.push('/marketplace');
    }
  }, [chainId]);

  useEffect(() => {
    if (!library) return;
    const onChangeAccount = ([accountConnected]: any) => {
      if (accountConnected === account) return;
      dispatch(removeEventChangePage(1));
      router.push('/marketplace');
    };

    if (library?.provider && library?.provider?.on) {
      library.provider && library.provider.on('accountsChanged', onChangeAccount);
    }
    return () => {
      library?.provider?.removeListener('accountsChanged', onChangeAccount); // need func reference to remove correctly
    };
  }, [account, library]);

  const resetStepProcessing = () => {
    setIsUploadIPFS(false);
    setIsUserRegisteredProxy(false);
    setIsApproveUMAD(false);
    setIsApproveCollection(false);
    setIsWaitingForSign(false);
    setTxhashFlow(defaultHash);
  };

  const handleClose = () => {
    setLoading(false);
    resetStepProcessing();
    setModalFollowCreateNFT(false);
    setModalSellEnglishAuction(false);
    setModalSellDutchAuction(false);
    setShowModalCreateSuccess(false);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      categoryIds: [],
      collectionAddress: '',
      externalLink: '',
      nftImagePreview: null,
      nftVideo: null,
      nftAudio: null,
      nftModel: null,
      properties: [],
      levels: [],
      stats: [],
      isShowProperties: false,
      isShowLevels: false,
      isShowStats: false,
      isUnlockableContent: false,
      unlockableContent: '',
      isExplicitSensitiveContent: false,
      tokenId: '',
      listYourAsset: false,
      sellMethod: SELL_TYPE.FIX_PRICE,
      reserveBuyer: '',
      supply: 1,
      //fixed price
      currency: 'UMAD',
      amount: '',
      duration: {
        type: '1 week',
        startDate: moment().unix(),
        endDate: moment().add(7, 'days').unix(),
      },
      isShowReserveBuyer: false,
      // eng auction
      startingPriceEngAuction: '',
      startingEngAuctionCurrency: 'UMAD',
      reservePrice: '',
      durationEngAuction: {
        type: '1 week',
        startDate: moment().unix(),
        endDate: moment().add(7, 'days').unix(),
      },
      isShowReversePrice: false,
      //ductch auction
      staringPrice: '',
      staringCurrency: 'UMAD',
      endingPrice: '',
      durationDutchAuction: {
        type: '1 week',
        startDate: moment().unix(),
        endDate: moment().add(7, 'days').unix(),
      },
      // other
      UMadFloorPrice: 0,
      ethFloorPrice: 0,
      collectionSelected: undefined,
      methodType: METHOD_SELL_AUCTION.SELL_TO_HIGHTEST_BIDDER,
    },
    validationSchema: Yup.object().shape({
      ...validationSchemaAssetDetail,
      ...validationSchemaAdvancedDetails,
      ...validationSchemaPriceDetails,
    }),
    onSubmit: (values) => {
      if (stepCreate < CREATE_ASSET_TYPE.PRICE_DETAIL) return;
      if (isLoading) return;
      handleCreateNFT(values);
    },
  });

  const { values, errors, setFieldValue, setFieldError, handleSubmit, setFieldTouched, touched } =
    formik;

  useEffect(() => {
    const UMadFloorPrice = collectionSelected?.floorPrice;
    const ethFloorPrice = priceNativeCoinUsd
      ? (UMadFloorPrice * priceUmadUsd) / priceNativeCoinUsd
      : 0;
    setFieldValue('UMadFloorPrice', UMadFloorPrice);
    setFieldValue('ethFloorPrice', ethFloorPrice);
  }, [collectionSelected, values.collectionAddress]);

  useEffect(() => {
    const collectionSelected = collectionOfOwner.filter(
      (collection: any) => collection.address === values.collectionAddress,
    );
    setCollectionSelected(collectionSelected[0]);
    setFieldValue('collectionSelected', collectionSelected[0]);
  }, [values.collectionAddress]);

  const processing = async (params: any) => {
    // step 1: Upload to IPFS
    const attributes = getAttributes(params.properties);

    let animation_url = '';
    const blob = values?.nftVideo || values?.nftAudio || values?.nftModel || '';
    if (blob) {
      [animation_url] = await uploadVideoAudioToIPFS(blob);
    }

    const bodyIPFS = {
      image: values.nftImagePreview,
      name: params?.title,
      description: params?.description || '',
      external_url: params?.externalLink || '',
      attributes,
      animation_url: animation_url ? `ipfs://${animation_url}` : '',
    };

    const [metadata, error] = await uploadToIPFS(bodyIPFS);
    if (error) {
      handleClose();
      return;
    }
    const cidIPFS = get(metadata, 'url', '').slice(7);
    setIsUploadIPFS(true);
    const collectionAddress = values?.collectionAddress;

    // step 2:
    const [addressProxy, err, hasRegistered] = (await checkUserHasProxy(
      walletAddress as string,
    )) as any;
    // if (!hasRegistered) {
    //   setTxhashFlow({
    //     ...txHashFlow,
    //     initWallet: addressProxy,
    //   });
    // }

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
      handleClose();
      return;
    }
    let address;
    if (addressProxy?.hash) {
      setTxhashFlow({
        ...txHashFlow,
        initWallet: addressProxy?.hash,
      });
      address = await addressProxy.wait(1);
    }
    setIsUserRegisteredProxy(true);
    // if (!hasRegistered) {
    //   setTxhashFlow({
    //     ...txHashFlow,
    //     initWallet: address?.transactionHash,
    //   });
    // }

    // step 3. Approve UMAD token
    if (values?.currency.toUpperCase() === CURRENCY_SELECT.UMAD) {
      const rawFee = MARKET_RAW_FEE_BUY_TOKEN.umad;

      const systemFee = new BigNumber(rawFee).dividedBy(100).toFixed().toString();

      const feeAmount = new BigNumber(values?.amount as any)
        .multipliedBy(systemFee)
        .toFixed()
        .toString();

      const allowanceUMAD = await userAllowanceERC20(NEXT_PUBLIC_UMAD_ADDRESS, walletAddress);

      const isApproveErc20 = new BigNumber(allowanceUMAD).gte(
        new BigNumber(feeAmount).multipliedBy(10 ** 8),
      );

      // const isApproveErc20 = await isUserApprovedERC20(
      //   NEXT_PUBLIC_UMAD_ADDRESS,
      //   walletAddress as any,
      // );

      if (!isApproveErc20) {
        const [resApprove, handleUserApproveERC20Err] = await handleUserApproveERC20(
          NEXT_PUBLIC_UMAD_ADDRESS,
        );
        if (handleUserApproveERC20Err) {
          handleClose();
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

    // step 4: Approve this item for sale
    setIsApproveCollection(true);
    // const isApproveForAllERC721 = await isUserApprovedERC721(
    //   collectionAddress,
    //   walletAddress as any,
    // );
    // if (isApproveForAllERC721) {
    //   setIsApproveCollection(true);
    // } else {
    //   const [resApproveForAll, error] = await handleUserApproveForAllERC721(
    //     collectionAddress,
    //     walletAddress,
    //   );
    //   if (resApproveForAll) {
    //     const data = await resApproveForAll.wait(1);
    //     setIsApproveCollection(true);
    //     setTxhashFlow({
    //       ...txHashFlow,
    //       approveCollection: data?.transactionHash,
    //     });
    //   } else {
    //     handleClose();
    //     return dispatch(toastError('You declined the action in your wallet.'));
    //   }
    // }

    // step 5 Confirm creating
    const [saleMetadata, errPutOnSale] = await signPutDataOnSaleCreated({
      collectionAddress,
      tokenType: values.currency?.toLowerCase(),
      tokenId: params?.tokenId,
      quantity: 1,
      price: new BigNumber(values?.amount).toString(),
      nftType: ASSET_TYPE.ERC721,
      reserveBuyer: params?.reserveBuyer || '',
      cidIPFS,
    });
    if (errPutOnSale) {
      console.error('errPutOnSale', errPutOnSale);
      handleClose();
      return dispatch(toastError('You declined the action in your wallet.'));
    }
    const [response, errorCreateNFT] = await nftService.createNFT({
      ...params,
      cid: cidIPFS
    });
    if (errorCreateNFT) {
      dispatch(toastError('Something went wrong'));
      return;
    }
    const nftId = get(response, 'nft.id');
    const collectionId = get(response, 'nft.collection.id');
    const [res, errorSale] = await saleNftService.updateNftSaleCreated(nftId, {
      cid: cidIPFS,
    });
    await handleUploadS3(nftId, collectionId, formik);
    setIsWaitingForSign(true);

    await saleNftService.putDataOnSale({
      startDate: values?.duration?.startDate || 0,
      expireDate: values?.duration?.endDate || 0,
      price: new BigNumber(values?.amount).toString(),
      quantity: 1,
      type: NFT_SALE_TYPES.FIX_PRICE,
      action: NFT_SALE_ACTIONS.LIST,
      nftId,
      metadata: saleMetadata,
      currencyToken: values?.currency?.toLowerCase(),
      reserve_buyer: values?.isShowReserveBuyer ? values?.reserveBuyer.trim() : null,
      sellHash: (saleMetadata as any)?.sellHash,
      replacementPattern: (saleMetadata as any)?.replacementPattern,
    });

    if (res) {
      handleClose();
      toastSuccess('You created nft successfully');
      setShowModalCreateSuccess(true);
    } else {
    }
  };

  const processingEnglishAuction = async (params: any) => {
    // step 1: Upload to IPFS
    const attributes = getAttributes(params.properties);

    let animation_url = '';
    const blob = values?.nftVideo || values?.nftAudio || values?.nftModel || '';
    if (blob) {
      [animation_url] = await uploadVideoAudioToIPFS(blob);
    }

    const bodyIPFS = {
      image: values.nftImagePreview,
      name: params?.title,
      description: params?.description || '',
      external_url: params?.externalLink || '',
      attributes,
      animation_url: animation_url ? `ipfs://${animation_url}` : '',
    };

    const [metadata, error] = await uploadToIPFS(bodyIPFS);
    if (error) {
      handleClose();
      setLoading(false);
      return;
    }
    const cidIPFS = get(metadata, 'url', '').slice(7);
    setIsUploadIPFS(true);
    const collectionAddress = values?.collectionAddress;

    // step 2:
    const [addressProxy, err, hasRegistered] = (await checkUserHasProxy(
      walletAddress as string,
    )) as any;
    // if (!hasRegistered) {
    //   setTxhashFlow({
    //     ...txHashFlow,
    //     initWallet: addressProxy,
    //   });
    // }

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
      handleClose();
      return;
    }
    let address;
    if (addressProxy?.hash) {
      setTxhashFlow({
        ...txHashFlow,
        initWallet: addressProxy?.hash,
      });
      address = await addressProxy.wait(1);
    }
    setIsUserRegisteredProxy(true);
    // if (!hasRegistered) {
    //   setTxhashFlow({
    //     ...txHashFlow,
    //     initWallet: address?.transactionHash,
    //   });
    // }

    // step 3. Approve UMAD token
    if (values?.startingEngAuctionCurrency.toUpperCase() === CURRENCY_SELECT.UMAD) {
      const isApproveErc20 = await isUserApprovedERC20(
        NEXT_PUBLIC_UMAD_ADDRESS,
        walletAddress as any,
      );
      if (!isApproveErc20) {
        const [resApprove, handleUserApproveERC20Err] = await handleUserApproveERC20(
          NEXT_PUBLIC_UMAD_ADDRESS,
        );
        if (handleUserApproveERC20Err) {
          handleClose();
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
    } else if (values?.startingEngAuctionCurrency.toUpperCase() === CURRENCY_SELECT.WETH) {
      const isApproveErc20 = await isUserApprovedERC20(NEXT_PUBLIC_WETH_ADDRESS, account as any);
      if (!isApproveErc20) {
        const [resApprove, handleUserApproveERC20Err] = await handleUserApproveERC20(
          NEXT_PUBLIC_WETH_ADDRESS,
        );
        if (handleUserApproveERC20Err) {
          handleClose();
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
    // step 4: Approve this item for sale
    const isApproveForAllERC721 = await isUserApprovedERC721(
      collectionAddress,
      walletAddress as any,
    );
    if (isApproveForAllERC721) {
      setIsApproveCollection(true);
    } else {
      const [resApproveForAll, error] = await handleUserApproveForAllERC721(
        collectionAddress,
        walletAddress,
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
        handleClose();
        return dispatch(toastError('You declined the action in your wallet.'));
      }
    }

    // step 5 Confirm creating
    const priceListing = new BigNumber(values?.startingPriceEngAuction || '0').toString();
    const [saleMetadata, errPutOnSale] = await signPutDataOnSaleAuctionCreated({
      collectionAddress,
      tokenType: values?.startingEngAuctionCurrency?.toLowerCase(),
      tokenId: params?.tokenId as string,
      quantity: 1,
      price: priceListing,
      nftType: ASSET_TYPE.ERC721,
      cidIPFS,
    });

    if (errPutOnSale) {
      handleClose();
      return dispatch(toastError('You declined the action in your wallet.'));
    }
    const [response, errorCreateNft] = await nftService.createNFT({
      ...params,
      cid: cidIPFS
    });
    if (errorCreateNft) {
      handleClose();
      dispatch(toastError('Something went wrong'));
      return;
    }
    const nftId = get(response, 'nft.id');
    const collectionId = get(response, 'nft.collection.id');
    await handleUploadS3(nftId, collectionId, formik);
    setIsWaitingForSign(true);

    await saleNftService.putDataOnSale({
      startDate: values?.durationEngAuction?.startDate || 0,
      expireDate: values?.durationEngAuction?.endDate || 0,
      price: priceListing,
      quantity: 1,
      type: NFT_SALE_TYPES.ENGLISH_AUCTION,
      action: NFT_SALE_ACTIONS.LIST,
      nftId: parseInt(nftId),
      metadata: saleMetadata,
      currencyToken: values?.startingEngAuctionCurrency?.toLowerCase(),
      reservePrice: values?.isShowReversePrice ? parseFloat(values?.reservePrice) : 0,
      sellHash: (saleMetadata as any)?.sellHash,
      replacementPattern: (saleMetadata as any)?.replacementPattern,
    });

    const [res, errorSale] = await saleNftService.updateNftSaleCreated(nftId, {
      cid: cidIPFS,
    });
    if (res) {
      handleClose();
      toastSuccess('You created nft successfully');
      setShowModalCreateSuccess(true);
    } else {
      handleClose();
    }
  };

  const processingDutchAuction = async (params: any) => {
    // step 1: Upload to IPFS
    const attributes = getAttributes(params.properties);

    let animation_url = '';
    const blob = values?.nftVideo || values?.nftAudio || values?.nftModel || '';
    if (blob) {
      [animation_url] = await uploadVideoAudioToIPFS(blob);
    }

    const bodyIPFS = {
      image: values.nftImagePreview,
      name: params?.title,
      description: params?.description || '',
      external_url: params?.externalLink || '',
      attributes,
      animation_url: animation_url ? `ipfs://${animation_url}` : '',
    };

    const [metadata, error] = await uploadToIPFS(bodyIPFS);
    if (error) {
      handleClose();
      return;
    }
    const cidIPFS = get(metadata, 'url', '').slice(7);
    setIsUploadIPFS(true);
    const collectionAddress = values?.collectionAddress;

    // step 2:
    const [addressProxy, err, hasRegistered] = (await checkUserHasProxy(
      walletAddress as string,
    )) as any;
    // if (!hasRegistered) {
    //   setTxhashFlow({
    //     ...txHashFlow,
    //     initWallet: addressProxy,
    //   });
    // }

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
      handleClose();
      return;
    }
    let address;
    if (addressProxy?.hash) {
      setTxhashFlow({
        ...txHashFlow,
        initWallet: addressProxy?.hash,
      });
      address = await addressProxy.wait(1);
    }
    setIsUserRegisteredProxy(true);
    // if (!hasRegistered) {
    //   setTxhashFlow({
    //     ...txHashFlow,
    //     initWallet: address?.transactionHash,
    //   });
    // }

    // step 3. Approve UMAD token
    if (values?.staringCurrency.toUpperCase() === CURRENCY_SELECT.UMAD) {
      const isApproveErc20 = await isUserApprovedERC20(
        NEXT_PUBLIC_UMAD_ADDRESS,
        walletAddress as any,
      );
      if (!isApproveErc20) {
        const [resApprove, handleUserApproveERC20Err] = await handleUserApproveERC20(
          NEXT_PUBLIC_UMAD_ADDRESS,
        );
        if (handleUserApproveERC20Err) {
          handleClose();
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
    } else if (values?.staringCurrency.toUpperCase() === CURRENCY_SELECT.WETH) {
      const isApproveErc20 = await isUserApprovedERC20(NEXT_PUBLIC_WETH_ADDRESS, account as any);
      if (!isApproveErc20) {
        const [resApprove, handleUserApproveERC20Err] = await handleUserApproveERC20(
          NEXT_PUBLIC_WETH_ADDRESS,
        );
        if (handleUserApproveERC20Err) {
          handleClose();
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
    // step 4 Confirm creating

    const [saleMetadata, errPutOnSale] = await signPutDataOnSaleDutchAuctionCreated({
      collectionAddress,
      tokenType: values?.staringCurrency?.toLowerCase(),
      tokenId: params?.tokenId as string,
      quantity: 1,
      staringPrice: new BigNumber(values?.staringPrice || 0).toString(),
      endingPrice: new BigNumber(values?.endingPrice || '0').toString(),
      nftType: ASSET_TYPE.ERC721,
      cidIPFS,
      expireTime: values?.durationDutchAuction?.endDate,
      startTime: values?.durationDutchAuction?.startDate,
    });

    if (errPutOnSale) {
      handleClose();
      return dispatch(toastError('You declined the action in your wallet.'));
    }
    const [response, errorCreateNft] = await nftService.createNFT({
      ...params,
      cid: cidIPFS
    });
    if (errorCreateNft) {
      dispatch(toastError('Something went wrong'));
      handleClose();
      return;
    }
    const nftId = get(response, 'nft.id');
    const collectionId = get(response, 'nft.collection.id');
    await handleUploadS3(nftId, collectionId, formik);
    setIsWaitingForSign(true);

    await saleNftService.putDataOnSale({
      startDate: values?.durationDutchAuction?.startDate || 0,
      expireDate: values?.durationDutchAuction?.endDate || 0,
      price: new BigNumber(values?.staringPrice || '0').toString(),
      quantity: 1,
      type: NFT_SALE_TYPES.DUTCH_AUCTION,
      action: NFT_SALE_ACTIONS.LIST,
      nftId: parseInt(nftId),
      metadata: saleMetadata,
      currencyToken: values?.staringCurrency?.toLowerCase(),
      reservePrice: values?.isShowReversePrice ? parseFloat(values?.reservePrice) : 0,
      sellHash: (saleMetadata as any)?.sellHash,
      replacementPattern: (saleMetadata as any)?.replacementPattern,
      startPrice: new BigNumber(values?.staringPrice || '0').toNumber(),
      endPrice: new BigNumber(values?.endingPrice || '0').toNumber(),
    });

    const [res, errorSale] = await saleNftService.updateNftSaleCreated(nftId, {
      cid: cidIPFS,
    });
    if (res) {
      handleClose();
      toastSuccess('You created nft successfully');
      setShowModalCreateSuccess(true);
    } else {
      handleClose();
    }
  };
  
  //check disable button next
  useEffect(() => {
    const checkUploadImg =
      (errors.nftImagePreview && touched.nftImagePreview) ||
      (errors.nftAudio) ||
      (errors.nftVideo);
    
    const isDisableStepAssetDetails =
      (errors.title && touched.title) ||
      (errors.collectionAddress && touched.collectionAddress) ||
      (errors.externalLink && touched.externalLink) ||
      (errors.categoryIds && touched.categoryIds) || checkUploadImg;

    const isDisableStepAdvancedDetails =
      (errors.unlockableContent && values.isUnlockableContent && touched.unlockableContent) ||
      (!_.isEmpty(errors.properties) && !_.isEmpty(touched.properties)) ||
      (!_.isEmpty(errors.levels) && !_.isEmpty(touched.levels)) ||
      (!_.isEmpty(errors.stats) && !_.isEmpty(touched.stats)) || checkUploadImg;

    const isDisableStepFixedPriceDetail =
      (errors.amount && touched.amount) ||
      (errors.duration && touched.duration) ||
      (errors.reserveBuyer && touched.reserveBuyer && values.isShowReserveBuyer) || checkUploadImg;

    const isDisableStepEngAuction =
      (errors.startingPriceEngAuction && touched.startingPriceEngAuction) ||
      (errors.durationEngAuction && touched.durationEngAuction) ||
      (errors.reservePrice && touched.reservePrice) || checkUploadImg;

    const isDisableStepDutchAuction =
      (errors.staringPrice && touched.staringPrice) ||
      (errors.endingPrice && touched.endingPrice) ||
      (errors.durationDutchAuction && touched.durationDutchAuction) || checkUploadImg;

    if (stepCreate === CREATE_ASSET_TYPE.ASSET_DETAIL) {
      setDisable(Boolean(isDisableStepAssetDetails));
    }
    if (stepCreate === CREATE_ASSET_TYPE.ADVANCED_DETAIL) {
      setDisable(Boolean(isDisableStepAdvancedDetails));
    }
    if (stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL) {
      setDisable(Boolean(checkUploadImg));
    }
    //fixed price
    if (stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL && values.listYourAsset) {
      setDisable(Boolean(isDisableStepFixedPriceDetail));
    }
    // eng auction
    if (
      stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL &&
      values.sellMethod === SELL_TYPE.AUCTION &&
      values.methodType === METHOD_SELL_AUCTION.SELL_TO_HIGHTEST_BIDDER
    ) {
      setDisable(Boolean(isDisableStepEngAuction));
    }
    // dutch auction
    if (
      stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL &&
      values.sellMethod === SELL_TYPE.AUCTION &&
      values.methodType === METHOD_SELL_AUCTION.SELL_WITH_DECLINING_PRICE
    ) {
      setDisable(Boolean(isDisableStepDutchAuction));
    }
  }, [errors, values, touched, stepCreate, values.nftImagePreview]);


  //step Asset Details
  useEffect(() => {
    const conditionAssetDetails =
      errors.title ||
      !values.title ||
      errors.collectionAddress ||
      !values.collectionAddress ||
      errors.nftImagePreview ||
      (values.nftAudio && errors.nftAudio) ||
      (values.nftVideo && errors.nftVideo) ||
      errors.externalLink ||
      errors.categoryIds;

    setConditionAssetDetails(Boolean(conditionAssetDetails));
  }, [errors, touched, stepCreate, values.nftImagePreview]);

  //step Advanced Details
  useEffect(() => {
    const conditionAdvancedDetails =
      (errors.unlockableContent && values.isUnlockableContent) ||
      (!_.isEmpty(errors.properties) && !_.isEmpty(values.properties)) ||
      (!_.isEmpty(errors.levels) && !_.isEmpty(values.levels)) ||
      (!_.isEmpty(errors.stats) && !_.isEmpty(values.stats)) ||
      errors.nftImagePreview ||
      (values.nftAudio && errors.nftAudio) ||
      (values.nftVideo && errors.nftVideo);

    setConditionAdvancedDetails(Boolean(conditionAdvancedDetails));
  }, [errors, values, stepCreate]);

  useEffect(() => {
    if (
      (!values.isShowProperties && !_.isEmpty(errors.properties)) ||
      (!values.isShowLevels && !_.isEmpty(errors.levels)) ||
      (!values.isShowStats && !_.isEmpty(errors.stats))
    ) {
      setDisable(false);
    }

    if (_.isEmpty(values.properties) && !_.isEmpty(errors.properties)) {
      setFieldError('properties', undefined);
      setFieldTouched('properties', false);
    }

    if (_.isEmpty(values.levels) && !_.isEmpty(errors.levels)) {
      setFieldError('levels', undefined);
      setFieldTouched('levels', false);
    }

    if (_.isEmpty(values.stats) && !_.isEmpty(errors.stats)) {
      setFieldError('stats', undefined);
      setFieldTouched('stats', false);
    }
  }, [values, stepCreate]);

  //step Fixed Price Detail
  useEffect(() => {
    const conditionFixedPriceDetail =
      errors.amount || !values.amount || errors.duration || errors.reserveBuyer;
    setConditionFixedPriceDetail(Boolean(conditionFixedPriceDetail));
  }, [errors, values, stepCreate]);

  //step Condition EngAuction
  useEffect(() => {
    const conditionEngAuction =
      (errors.startingPriceEngAuction && !values.startingPriceEngAuction) ||
      errors.durationEngAuction ||
      errors.reservePrice;
    setConditionEngAuction(Boolean(conditionEngAuction));
  }, [errors, values, stepCreate]);

  //step Condition DutchAuction
  useEffect(() => {
    const conditionDutchAuction =
      errors.staringPrice ||
      !values.staringPrice ||
      errors.endingPrice ||
      !values.endingPrice ||
      errors.durationDutchAuction;
    setConditionDutchAuction(Boolean(conditionDutchAuction));
  }, [errors, values, stepCreate]);

  useEffect(() => {
    getAllCategoryCollection();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      getCollectionOfOwner();
    }
  }, [walletAddress]);

  const toggleDescription = (i: number) => {
    const stepsTemp = stepsComplete.map((step: IStep, index: number) => {
      if (index === i) {
        return { ...step, isShowDes: !step.isShowDes };
      }
      return step;
    });
    setStepsComplete(stepsTemp);
  };

  const handleValidateUpload = () => {
    if (!values.nftImagePreview) {
      setFieldError('nftImagePreview', 'NFT Content is not allowed to be empty.');
      setFieldTouched('nftImagePreview');
      setDisable(true);
      return;
    }
    if (errors.nftAudio && values.nftAudio) {
      setFieldError('nftAudio', 'NFT Content is not allowed to be empty.');
      setFieldTouched('nftAudio');
      setDisable(true);
      return;
    }
    if (values.nftVideo && values.nftVideo) {
      setFieldError('nftVideo', 'NFT Content is not allowed to be empty.');
      setFieldTouched('nftVideo');
      setDisable(true);
      return;
    }
  };

  const handleNextStep = () => {
    handleValidateUpload();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    if (stepCreate === CREATE_ASSET_TYPE.ASSET_DETAIL && conditionAssetDetails) {
      if (!values.title) {
        setFieldError('title', 'Title is not allowed to be empty.');
        setFieldTouched('title');
      }

      if (!values.collectionAddress) {
        setFieldError('collectionAddress', 'Collection is not allowed to be empty.');
        setFieldTouched('collectionAddress');
      }

      if (_.isEmpty(values.categoryIds)) {
        setFieldError('categoryIds', 'Categories of NFT are not allowed to be empty.');
        setFieldTouched('categoryIds');
      }
      setDisable(true);
      return;
    }

    if (stepCreate === CREATE_ASSET_TYPE.ADVANCED_DETAIL && conditionAdvancedDetails) {
      handleValidateProperties(formik);
      handleValidateLevels(formik);
      handleValidateStats(formik);
      if (values.isUnlockableContent && !values.unlockableContent) {
        setFieldError('unlockableContent', 'Unlockable Content is not allowed to be empty.');
        setFieldTouched('unlockableContent');
      }
      setDisable(true);
      return;
    }
    // sell with fixed price
    if (
      stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL &&
      conditionFixedPriceDetail &&
      values.sellMethod === SELL_TYPE.FIX_PRICE &&
      values.listYourAsset
    ) {
      if (!values.amount) {
        setFieldError('amount', 'amount is not allowed to be empty.');
        setFieldTouched('amount');
      }

      if (values.isShowReserveBuyer && !values.reserveBuyer) {
        setFieldError('reserveBuyer', 'Address is not allowed to be empty');
        setFieldTouched('reserveBuyer');
      }
      setDisable(true);
      return;
    }
    // sell with english auction
    if (
      stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL &&
      conditionEngAuction &&
      values.sellMethod === SELL_TYPE.AUCTION &&
      values.methodType === METHOD_SELL_AUCTION.SELL_TO_HIGHTEST_BIDDER &&
      values.listYourAsset
    ) {
      if (!values.startingPriceEngAuction) {
        setFieldError('startingPriceEngAuction', 'Starting price is not allowed to be empty');
        setFieldTouched('startingPriceEngAuction');
      }

      if (values.isShowReversePrice && !values.reservePrice) {
        setFieldError('reservePrice', 'Include reserve price is not allowed to be empty');
        setFieldTouched('reservePrice');
      }

      setDisable(true);
      return;
    }

    // sell with dutch auction
    if (
      stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL &&
      conditionDutchAuction &&
      values.sellMethod === SELL_TYPE.AUCTION &&
      values.methodType === METHOD_SELL_AUCTION.SELL_WITH_DECLINING_PRICE &&
      values.listYourAsset
    ) {
      if (!values.staringPrice) {
        setFieldError('staringPrice', 'Starting price is not allowed to be empty');
        setFieldTouched('staringPrice');
      }

      if (!values.endingPrice) {
        setFieldError('endingPrice', 'Ending price is not allowed to be empty');
        setFieldTouched('endingPrice');
      }
      setDisable(true);
      return;
    }

    if (stepCreate < CREATE_ASSET_TYPE.PRICE_DETAIL) {
      setStepCreate(stepCreate + 1);
    } else {
      handleSubmit();
    }
  };

  const handleCreateNFT = async (values: any) => {
    setLoading(true);
    const {
      title,
      properties,
      levels,
      stats,
      isUnlockableContent,
      unlockableContent,
      isExplicitSensitiveContent,
      explicitSensitiveContent,
      externalLink,
      description,
      supply,
      collectionAddress,
      categoryIds,
      listYourAsset,
      nftImagePreview,
      reserveBuyer,
      isShowReserveBuyer,
    } = values;
    const propertiesValid = getPropertiesValid(properties);
    const levelsValid = getLevelsAndStatsValid(levels);
    const statsValid = getLevelsAndStatsValid(stats);
    const tokenId = await genTokenIdForMainStore(walletAddress, supply);
    setFieldValue('tokenId', tokenId);
    const isSellWithEngAuction =
      values?.sellMethod === SELL_TYPE.AUCTION &&
      values?.methodType === METHOD_SELL_AUCTION.SELL_TO_HIGHTEST_BIDDER;
    const isSellWithDutchAuction =
      values?.sellMethod === SELL_TYPE.AUCTION &&
      values?.methodType === METHOD_SELL_AUCTION.SELL_WITH_DECLINING_PRICE;

    if (listYourAsset) setStepsComplete(initStepNoListYourAsset);
    const params = {
      title: title.trim(),
      isUnlockableContent: isUnlockableContent,
      isExplicitSensitiveContent: isExplicitSensitiveContent,
      explicitSensitiveContent: explicitSensitiveContent,
      maxQuantity: supply,
      tokenId: tokenId,
      collectionAddress: collectionAddress,
      categoryIds: categoryIds,
    } as any;
    if (description) params.description = description.trim();
    if (externalLink) params.externalLink = externalLink.trim();
    if (unlockableContent && isUnlockableContent)
      params.unlockableContent = unlockableContent.trim();
    if (isShowReserveBuyer) params.reserveBuyer = reserveBuyer.trim();
    params.properties = getProperties(propertiesValid, levelsValid, statsValid);

    if (listYourAsset) {
      if (isSellWithEngAuction) {
        setModalSellEnglishAuction(true);
        processingEnglishAuction(params);
      } else if (isSellWithDutchAuction) {
        processingDutchAuction(params);
        setModalSellDutchAuction(true);
      } else {
        //list for sale fix price
        setModalFollowCreateNFT(true);
        processing(params);
      }
    } else {
      //no list for sale
      setOpenModalComplete(true);
      const attributes = getAttributes(params.properties);

      let animation_url = '';
      const blob = values?.nftVideo || values?.nftAudio || values?.nftModel || '';
      if (blob) {
        [animation_url] = await uploadVideoAudioToIPFS(blob);
      }

      const bodyIPFS = {
        image: nftImagePreview,
        name: params?.title,
        description: params?.description || '',
        external_url: params?.externalLink || '',
        attributes,
        animation_url: animation_url ? `ipfs://${animation_url}` : '',
      };

      const [metadata, error] = await uploadToIPFS(bodyIPFS);
      if (error) {
        setOpenModalComplete(false);
        setLoading(false);
        dispatch(toastError('Something went wrong'));
        return;
      }
      const cidIPFS = get(metadata, 'url', '').slice(7);
      const [response, errorCreateNFT] = await nftService.createNFT({
        ...params,
        cid: cidIPFS
      });
      if (errorCreateNFT) {
        setLoading(false);
        setOpenModalComplete(false);
        dispatch(toastError('Something went wrong'));
        return;
      }
      const nftId = get(response, 'nft.id');
      const collectionId = get(response, 'nft.collection.id');
      await handleUploadS3(nftId, collectionId, formik);
      const [res, errorSale] = await saleNftService.updateNftSaleCreated(nftId, {
        cid: cidIPFS,
      });

      if (res) {
        setLoading(false);
        setOpenModalComplete(false);
        toastSuccess('You created nft successfully');
        setShowModalCreateSuccess(true);
      } else {
        setLoading(false);
        setOpenModalComplete(false);
        dispatch(toastError('Something went wrong'));
      }
    }
  };

  const handleUpdateCategories = (categories: Array<ICategory>) => {
    setCategories(categories);
    const categoriesSelected = _.cloneDeep(categories)
      .filter((category: ICategory) => category.isActive === true)
      .map((category: ICategory) => {
        return category.id;
      });
    setFieldValue('categoryIds', categoriesSelected);
  };

  const getAllCategoryCollection = async () => {
    const isDisplay = 1;
    const [response, error] = await collectionService.getAllCategoryCollection(isDisplay);
    if (response) {
      const { categories } = response;
      const listCategory = categories.map((category: ICategory) => {
        return { ...category, isActive: false };
      });
      setCategories(listCategory);
    }
    if (error) {
      dispatch(toastError('Something went wrong'));
    }
  };

  const getCollectionOfOwner = async () => {
    const [response, error] = await collectionService.getCollectionOfOwner(TYPE_COLLECTION.ERC721);
    if (response) {
      let collectionOfOwner = _.get(response, 'data', []);
      if (collectionOfOwner.length > 1) {
        const indexOfCollectionDefault = collectionOfOwner.findIndex(
          (collection: any, index: number) => {
            if (_.isEmpty(collection.creator)) return index;
          },
        );
        if (indexOfCollectionDefault && indexOfCollectionDefault > 0) {
          const cutOut = collectionOfOwner.splice(indexOfCollectionDefault, 1)[0];
          collectionOfOwner.splice(0, 0, cutOut);
        }
      }
      setCollectionOfOwner(collectionOfOwner);
    }
    if (error) {
      dispatch(toastError('Something went wrong'));
    }
  };

  return (
    <div className="lg:py-12 lg:px-0 py-8 px-4 max-w-[1128px] mx-auto">
      {stepCreate === CREATE_ASSET_TYPE.ASSET_DETAIL && (
        <div className="title-step">Asset Details </div>
      )}
      {stepCreate === CREATE_ASSET_TYPE.ADVANCED_DETAIL && (
        <div className="title-step">Advanced Details </div>
      )}
      {stepCreate === CREATE_ASSET_TYPE.PRICE_DETAIL && (
        <div className="title-step">Price Details</div>
      )}
      <div className="mb-8 lg:w-1/2">
        <MadStepper steps={STEP_CREATE_ASSET} activeStep={stepCreate} />
      </div>
      <div className="flex gap-x-24 flex-col-reverse lg:flex-row">
        <div className="lg:w-1/2">
          <FormikProvider value={formik}>
            <Form autoComplete="off">
              <FormCreate
                formik={formik}
                stepCreate={stepCreate}
                categories={categories}
                collectionOfOwner={collectionOfOwner}
                handleUpdateCategories={handleUpdateCategories}
                getCollectionOfOwner={getCollectionOfOwner}
                nftType={TYPE_COLLECTION.ERC721}
              />
            </Form>
          </FormikProvider>
          <div className="lg:mt-12 mt-6">
            {stepCreate === CREATE_ASSET_TYPE.ASSET_DETAIL && (
              <FilledButton
                disabled={isDisable || stepCreate === 4}
                text="Next"
                onClick={handleNextStep}
              />
            )}
            {stepCreate > CREATE_ASSET_TYPE.ASSET_DETAIL && (
              <div className="flex justify-between">
                <FilledButton
                  customClass="!border !border-solid !border-[#6F7978] !bg-transparent !text-primary-60"
                  disabled={stepCreate > 3}
                  text="Previous"
                  onClick={() => {
                    setStepCreate(stepCreate - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                <FilledButton
                  disabled={isDisable || stepCreate > 3}
                  text={stepCreate < CREATE_ASSET_TYPE.PRICE_DETAIL ? 'Next' : 'Complete'}
                  onClick={handleNextStep}
                />
              </div>
            )}
          </div>
        </div>
        <div className="lg:mt-[-87px]">
          <UploadMedia
            changeHandlerFile={(event: any) => handleChangeImage(event, formik, dispatch)}
            changeHandlerNftPreview={(event: any) =>
              changeHandlerNftPreview(event, setFieldValue, setFieldTouched)
            }
            formik={formik}
          />
        </div>
        <Modal
          open={isOpenModalComplete}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ModalCreateNoListing
            values={values}
            assetDataDetail={values}
            steps={stepsComplete}
            toggleDescription={toggleDescription}
          />
        </Modal>
        {modalFollowCreateNFT && (
          <ModalSellCreatedNFT
            open={modalFollowCreateNFT}
            handleClose={handleClose}
            values={values}
            isUploadIPFS={isUploadIPFS}
            isUserRegisteredProxy={isUserRegisteredProxy}
            isApproveUMAD={isApproveUMAD}
            isWaitingForSign={isWaitingForSign}
            isApproveCollection={isApproveCollection}
            isNFT1155={false}
            txHashFlow={txHashFlow}
            data={values}
          />
        )}
        {isOpenModalCreateSuccess && (
          <ModalSuccessCreateNFT
            open={isOpenModalCreateSuccess as boolean}
            handleClose={() => setShowModalCreateSuccess(false)}
            values={values}
          />
        )}
        {modalSellEnglishAuction && (
          <ModalSellEnglishAuction
            open={modalSellEnglishAuction}
            handleClose={handleClose}
            assetDataDetail={values}
            isUploadIPFS={isUploadIPFS}
            isUserRegisteredProxy={isUserRegisteredProxy}
            isApproveUMAD={isApproveUMAD}
            isWaitingForSign={isWaitingForSign}
            txHashFlow={txHashFlow}
            data={values}
          />
        )}
        {modalSellDutchAuction && (
          <ModalSellDutchAuction
            open={modalSellDutchAuction}
            handleClose={handleClose}
            assetDataDetail={values}
            isUploadIPFS={isUploadIPFS}
            isUserRegisteredProxy={isUserRegisteredProxy}
            isApproveUMAD={isApproveUMAD}
            isWaitingForSign={isWaitingForSign}
            txHashFlow={txHashFlow}
            data={values}
          />
        )}
      </div>
    </div>
  );
};

export default CreateSingle;
