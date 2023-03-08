import Modal from '@mui/material/Modal';
import { Switch } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';
import SwapTextField from 'components/common/textFieldMakeOffer/SwapTextField';
import {
  ASSET_TYPE,
  IdurationDate,
  EDIT_PRICE_CURRENCY,
  TYPES_DURATION_DEFAULT,
  TYPES_DURATION_DUTCH_AUCTION,
  TIME,
} from 'constants/app';
import SelectDuration from 'components/modules/select-duration';
import { useFormik } from 'formik';
import { FilledButton } from 'components/common';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
  buildDataPutAuction,
  signPutDataOnSale,
  signPutDataOnSaleAuction,
  signPutDataOnSaleDutchAuction,
} from 'blockchain/utils';
import moment from 'moment';
import saleNftService from 'service/saleNftService';
import { toastError, toastSuccess } from 'store/actions/toast';
import { TYPE_SALE } from 'constants/app';
import { formatNumber } from 'utils/formatNumber';
import { NFT_SALE_TYPES, REGEX_PRICE } from 'constants/index';
import { PLEASE_RELOAD_PAGE } from 'constants/text';
import { ClosingIcon } from 'components/common/iconography/IconBundle';
import ModalConfirm from 'components/common/modal-confirm';
import BigNumber from 'bignumber.js';
import { addCommaToNumber } from 'utils/currencyFormat';
import {
  signPutDataOnSaleAuctionCreated,
  signPutDataOnSaleCreated,
  signPutDataOnSaleDutchAuctionCreated,
} from 'blockchain/utils-created';
import { calculateDecliningPrice } from 'utils/utils';
import { get } from 'lodash';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: '24px',
  maxWidth: '650px',
  width: '90%',
} as React.CSSProperties;

interface IModalEditPrice {
  open: boolean;
  handleClose: () => void;
  bestNftSale?: any;
  nftSaleStatus?: any;
  nftType: string;
  refreshData: () => void;
  floorPrice: string | number;
  isCollectionImport: boolean;
}

const ModalEditPrice = ({
  open,
  handleClose,
  bestNftSale,
  nftSaleStatus,
  nftType,
  refreshData,
  floorPrice,
  isCollectionImport = true,
}: IModalEditPrice) => {
  const currentTime = useMemo(() => moment().unix(), []);
  const initialTime = useMemo(() => {
    return {
      [TIME.HOURS]: moment().hours().toString(),
      [TIME.MINUTES]: moment().minutes().toString(),
      [TIME.SECONDS]: moment().seconds().toString(),
    };
  }, []);
  const router = useRouter();
  const { tokenId, address } = router.query;
  const dispatch = useDispatch();
  const { walletAddress } = useSelector((state) => (state as any)?.user?.data);
  const ownerNftSale = nftSaleStatus.find(
    (ele: any) => ele?.user?.walletAddress?.toLowerCase() === walletAddress?.toLowerCase(),
  );
  const isDutchAuction = bestNftSale?.type === NFT_SALE_TYPES.DUTCH_AUCTION;
  const { priceNativeCoinUsd, priceUmadUsd } = useSelector((state: any) => ({
    priceNativeCoinUsd: state?.system?.priceNativeCoinUsd,
    priceUmadUsd: state?.system?.priceUmadUsd,
  }));
  const { icon, button } = useSelector((state:any) => state.theme);

  const { currencyToken, price } = ownerNftSale || {};

  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState<boolean>(true);
  const [duration, setDuration] = useState<IdurationDate>({
    type: '1 week',
    startDate: moment().unix(),
    endDate: moment().add(7, 'days').unix(),
  });
  const [textError, setTextError] = useState<string>('');

  const [confirmClose, setConfirmClose] = useState(false);
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
  };
  const handleChangePrice = useCallback(
    async (values: any, duration: IdurationDate, toggle: boolean) => {
      try {
        setLoading(true);
        const [orderDetail] = await saleNftService.getNftSaleDetailById(ownerNftSale?.id);
        if (!orderDetail) {
          dispatch(toastError(PLEASE_RELOAD_PAGE));
          return handleCancelEditPrice();
        }
        let saleMetadata = null;
        let data, errPutOnSale;

        const currentPriceOfDutchAuction: any =
          calculateDecliningPrice({
            startDate: bestNftSale?.startDate,
            startPrice: bestNftSale?.startPrice,
            endPrice: bestNftSale?.endPrice,
            expireDate: bestNftSale?.expireDate,
          }) || '0';

        const isFixedPriceOfDutchAuction =
          ownerNftSale?.type === TYPE_SALE.AUCTION_DUT &&
          new BigNumber(values?.amount).lte(currentPriceOfDutchAuction);

        if (ownerNftSale?.type === TYPE_SALE.FIXED_PRICE || isFixedPriceOfDutchAuction) {
          if (isCollectionImport) {
            [data, errPutOnSale] = await signPutDataOnSale({
              collectionAddress: address as string,
              tokenType: ownerNftSale?.currencyToken,
              tokenId: tokenId as string,
              quantity: ownerNftSale?.quantity,
              price: new BigNumber(values?.amount).toString(),
              nftType: nftType!,
              reserveBuyer: ownerNftSale?.reserveBuyer?.walletAddress,
            });
          } else {
            [data, errPutOnSale] = await signPutDataOnSaleCreated({
              collectionAddress: address as string,
              tokenType: ownerNftSale?.currencyToken,
              tokenId: tokenId as string,
              quantity: ownerNftSale?.quantity,
              price: new BigNumber(values?.amount).toString(),
              nftType: nftType!,
              reserveBuyer: ownerNftSale?.reserveBuyer?.walletAddress,
              cidIPFS: orderDetail?.nft?.cid,
            });
          }

          if (errPutOnSale) {
            console.error(errPutOnSale);
            dispatch(toastError('Something went wrong!'));
            return handleCancelEditPrice();
          }
          saleMetadata = data;
        } else if (ownerNftSale?.type === TYPE_SALE.AUCTION_ENG) {
          let dataAuction;
          let errPutAuction;
          if (isCollectionImport) {
            [dataAuction, errPutAuction] = await signPutDataOnSaleAuction({
              collectionAddress: address as string,
              tokenType: ownerNftSale?.currencyToken,
              tokenId: tokenId as string,
              quantity: 1,
              price: new BigNumber(values?.amount).toString(),
              nftType: ASSET_TYPE.ERC721,
            });
          } else {
            [dataAuction, errPutAuction] = await signPutDataOnSaleAuctionCreated({
              collectionAddress: address as string,
              tokenType: ownerNftSale?.currencyToken,
              tokenId: tokenId as string,
              quantity: 1,
              price: new BigNumber(values?.amount).toString(),
              nftType: ASSET_TYPE.ERC721,
              cidIPFS: orderDetail?.nft?.cid,
            });
          }
          if (errPutAuction) {
            handleError(errPutAuction);
            return handleCancelEditPrice();
          }
          saleMetadata = dataAuction;
        } else if (ownerNftSale?.type === TYPE_SALE.AUCTION_DUT) {
          const newStartDate = !toggle ? duration?.startDate : bestNftSale?.startDate;
          const newEndDate = !toggle ? duration?.endDate : bestNftSale?.expireDate;

          const newPrice = new BigNumber(values?.amount).toString();
          const endingPrice = bestNftSale?.endPrice;

          if (isCollectionImport) {
            [saleMetadata, errPutOnSale] = await signPutDataOnSaleDutchAuction({
              collectionAddress: address as string,
              tokenType: ownerNftSale?.currencyToken,
              tokenId: tokenId as string,
              quantity: 1,
              staringPrice: newPrice,
              endingPrice,
              nftType: ASSET_TYPE.ERC721,
              expireTime: newEndDate,
              startTime: newStartDate,
            });
          } else {
            [saleMetadata, errPutOnSale] = await signPutDataOnSaleDutchAuctionCreated({
              collectionAddress: address as string,
              tokenType: ownerNftSale?.currencyToken,
              tokenId: tokenId as string,
              quantity: 1,
              staringPrice: newPrice,
              endingPrice: endingPrice,
              nftType: ASSET_TYPE.ERC721,
              cidIPFS: orderDetail?.nft?.cid,
              expireTime: newEndDate,
              startTime: newStartDate,
            });
          }
        }

        let listingTime = {};
        if (!toggle) {
          listingTime = {
            startDate: duration?.startDate || 0,
            expireDate: duration?.endDate || 0,
          };
        }

        const newType: string = isFixedPriceOfDutchAuction
          ? TYPE_SALE?.FIXED_PRICE
          : bestNftSale?.type;

        const [, errorUpdate] = await saleNftService.editPriceListing(
          {
            newPrice: parseFloat(values?.amount),
            ...listingTime,
            sellHash: (saleMetadata as any)?.sellHash,
            metadata: saleMetadata,
            type: newType,
            startPrice: parseFloat(values?.amount),
          },
          ownerNftSale?.id,
        );

        if (errorUpdate) {
          console.log(errorUpdate);
          setLoading(false);
        } else {
          dispatch(toastSuccess(`Price successfully lowered`));
        }
        handleCancelEditPrice();
        refreshData();
      } catch (error) {
        console.log('error:: ', error);
      }
    },
    [duration, toggle],
  );

  const floorPriceEth = priceNativeCoinUsd
    ? (priceUmadUsd * Number(floorPrice)) / priceNativeCoinUsd
    : 0;

  const minPrice = currencyToken?.toUpperCase() === 'UMAD' ? Number(floorPrice) : floorPriceEth;

  const validationSchema = Yup.object({
    amount: Yup.number()
      .required(`Price is not allowed to be empty.`)
      .positive(`Price must be positive numbers.`)
      .min(
        minPrice,
        `Price is below collection floor price of ${formatNumber(
          minPrice,
          8,
        )} ${currencyToken?.toUpperCase()}`,
      )
      .lessThan(
        parseFloat(price),
        `The new sale price must be lower than the current price. If you need to set a higher price, cancel the listing and re-list.`,
      ),
  });

  const formik = useFormik({
    initialValues: { amount: price },
    validationSchema,
    onSubmit: (values) => {
      handleChangePrice(values, duration, toggle);
    },
  });

  const { errors, values, getFieldProps, setFieldValue, isValid, handleSubmit } = formik;

  const handleChangeAmount = (event: any) => {
    event.preventDefault();
    let value = event.target.value;
    if (REGEX_PRICE.test(value)) {
      setFieldValue('amount', value);
    }
  };

  const handleCancelEditPrice = () => {
    setLoading(false);
    handleClose();
    setToggle(true);
    setConfirmClose(false);
  };
  const onCancelEditPrice = () => {
    setConfirmClose(true);
  };
  const handleConfirm = () => {
    handleCancelEditPrice();
  };
  const handleCloseConfirm = () => {
    setConfirmClose(false);
  };

  const handleChangeDuration = (params: any) => {
    setDuration(params);
    if (toggle || params?.type !== 'Custom date') {
      setTextError('');
      return;
    }
    const { endDate, startDate } = params;
    if (endDate < startDate) {
      setTextError('End time cannot be before start time');
    } else if (endDate < currentTime || startDate < currentTime) {
      setTextError('Duration time cannot be the past');
    } else {
      setTextError('');
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            onCancelEditPrice();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={style}
          className="bg-background-700 rounded-[28px] flex flex-col text-center items-center lg:px-16 lg:py-6 sm:px-3 sm:py-6 md:px-6 md:py-6"
        >
          <div className="absolute right-8 top-6 cursor-pointer">
            <ClosingIcon onClick={onCancelEditPrice} style={icon} />
          </div>
          <p className="font-Chakra font-bold text-lg mb-6">Lower the listing price</p>
          <SwapTextField
            listCurrency={EDIT_PRICE_CURRENCY.filter(
              (item: any) => item?.value === currencyToken?.toUpperCase(),
            )}
            helperText={errors.amount}
            amount={values.amount}
            valueSelect={currencyToken?.toUpperCase()}
            handleChangeAmount={handleChangeAmount}
            nameInput="amount"
            tooltip={
              String(get(errors, 'amount', '')).includes('floor price')
                ? `${addCommaToNumber(minPrice, 18)} ${currencyToken?.toUpperCase()}`
                : ''
            }
            amountLabel="0.00"
          />

          <div className="selet-duration-time flex justify-between items-center w-full mt-3 mb-2">
            <div className="text-white font-bold text-sm">Use previous listing expiration date</div>
            <Switch className="mad-switch" style={icon} checked={toggle} onChange={() => setToggle(!toggle)} />
          </div>
          {!toggle && (
            <SelectDuration
              duration={duration}
              setDuration={handleChangeDuration}
              initialTime={initialTime}
              typesDuration={isDutchAuction ? TYPES_DURATION_DUTCH_AUCTION : TYPES_DURATION_DEFAULT}
            />
          )}
          {!toggle && !!textError && (
            <div className="text-error-60 text--body-small font-normal mt-2 w-full text-left">
              {textError}
            </div>
          )}
          <div className="w-full font-Chakra text-sm text-left mt-5">
            You must pay an additional gas fee if you want to cancel this listing at a later point.
            {/* <span className="text-primary-95 cursor-pointer">
              &nbsp; Learn more about canceling listing
            </span> */}
          </div>
          <div className="flex gap-5 justify-end w-full">
            {/* <OutlinedButton
              onClick={handleCancelEditPrice}
              text="Cancel"
              customClass="!text--label-large mt-[44px] w-[147px] !text-secondary-60"
            /> */}
            <FilledButton
              onClick={handleSubmit}
              text="Set new price"
              customClass="!text--label-large mt-[44px]"
              disabled={!isValid || (!toggle && !!textError)}
              type="submit"
              loading={loading}
              style={button?.default}
            />
          </div>
        </div>
      </Modal>

      <ModalConfirm
        title="Are you sure you want to cancel?"
        open={confirmClose}
        onConfirm={handleConfirm}
        onClose={handleCloseConfirm}
      />
    </div>
  );
};

export default ModalEditPrice;
