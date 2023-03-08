import { Collapse, Stack, Switch } from '@mui/material';
import BigNumber from 'bignumber.js';
import { Divider, FilledButton } from 'components/common';
import { WarningSvg } from 'components/common/iconography/iconsComponentSVG';
import SwapTextField from 'components/common/textFieldMakeOffer/SwapTextField';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import SelectDuration from 'components/modules/select-duration';
import { TextFieldFilledCustom } from 'components/modules/textField';
import {
  ASSET_TYPE,
  IdurationDate,
  MAX_PRICE,
  SELL_CURRENCY,
  TIME,
  TYPES_DURATION_DEFAULT
} from 'constants/app';
import { MARKET_RAW_FEE_BUY_TOKEN, REGEX_PRICE, REGEX_QUANTITY } from 'constants/index';
import { useFormik } from 'formik';
import useUpdateEffect from 'hooks/useUpdateEffect';
import { get } from 'lodash';
import moment from 'moment';
import { FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { addCommaToNumber } from 'utils/currencyFormat';
import Web3 from 'web3';
import * as Yup from 'yup';

interface IFixedPriceFormProps {
  putOnSale: (values: any) => void;
  nftType?: string;
  assetDataDetail?: any;
  updatePreviewConfig?: any;
  bestNftSale: any;
  setDurationFixedPrice?: any;
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

const FixedPriceForm: FC<IFixedPriceFormProps> = (props) => {
  const {
    putOnSale,
    nftType,
    assetDataDetail,
    updatePreviewConfig,
    bestNftSale,
    setDurationFixedPrice,
  } = props;
  const walletAddress = useSelector((state: any) => (state as any)?.user?.data?.walletAddress);
  const isERC1155 = nftType === ASSET_TYPE.ERC1155;
  const [toggleSpecificBuyer, setToggleSpecificBuyer] = useState(false);
  const [duration, setDuration] = useState<IdurationDate>({
    type: '1 week',
    startDate: moment().unix(),
    endDate: moment().add(7, 'days').unix(),
  });
  const [currency, setCurrency] = useState<string>('UMAD');
  const [available, setAvailable] = useState<number>(0);
  const [onSaleAmount, setOnSaleAmount] = useState<number>(0);
  const [reserveBuyer, setReserveBuyer] = useState<string>('');
  const { icon, text, button } = useSelector((state:any) => state.theme);
  const { priceNativeCoinUsd, priceUmadUsd } = useSelector((state: any) => ({
    priceNativeCoinUsd: state?.system?.priceNativeCoinUsd,
    priceUmadUsd: state?.system?.priceUmadUsd,
  }));

  const UMadFloorPrice = assetDataDetail?.floorPrice;
  const ethFloorPrice = priceNativeCoinUsd
    ? (UMadFloorPrice * priceUmadUsd) / priceNativeCoinUsd
    : 0;
  const isCreator =
    walletAddress?.toLowerCase() === assetDataDetail?.creator?.walletAddress?.toLowerCase();

  const validationSchema = Yup.object({
    quantity: isERC1155
      ? Yup.number()
          .moreThan(0, `Quantity must be greater than 0`)
          .required('Quantity is not allowed to be empty')
          .max(available, `The quantity can not exceed ${addCommaToNumber(available)}`)
      : Yup.number(),
    amount: Yup.number().test({
      name: 'amount',
      exclusive: false,
      params: {},
      test: function (value: any, { createError }: any) {
        if (value <= 0) {
          return createError({
            message: `Price must be greater than 0`,
            path: 'amount',
          });
        }
        if (value > MAX_PRICE) {
          return createError({
            message: `The amount cannot exceed ${addCommaToNumber(MAX_PRICE)}`,
            path: 'amount',
          });
        }
        if (!value) {
          return createError({
            message: `${isERC1155 ? 'Price per unit' : 'Price'} is not allowed to be empty`,
            path: 'amount',
          });
        }
        const floorPrice = currency === 'UMAD' ? UMadFloorPrice : ethFloorPrice;
        if (value < floorPrice) {
          return createError({
            message: `Price is below collection floor price of ${UMadFloorPrice} UMAD | ${ethFloorPrice} ETH`,
            path: 'amount',
          });
        }

        return true;
      },
    }),
    reserveBuyer: Yup.string().test({
      name: 'reserveBuyer',
      exclusive: false,
      params: {},
      test: function (value: any, { createError }: any) {
        if (!toggleSpecificBuyer) {
          return true;
        }
        if (Web3.utils.isAddress(value)) return true;
        if (!value) {
          return createError({
            message: `Address is not allowed to be empty`,
            path: 'reserveBuyer', // Fieldname
          });
        }
        return createError({
          message: `Invalid address`,
          path: 'reserveBuyer', // Fieldname
        });
      },
    }),
  });

  const {
    values,
    errors,
    handleSubmit,
    setFieldValue,
    isValid,
    validateForm,
    touched,
    handleBlur,
    setFieldTouched,
    setFieldError,
  } = useFormik({
    initialValues: { amount: '', quantity: 1, reserveBuyer: '' },
    validationSchema,
    onSubmit: (values) => {
      putOnSale({
        ...values,
        currency,
        duration,
        reserveBuyer: toggleSpecificBuyer ? reserveBuyer : '',
      });
    },
  });

  const handleChangeYourOffer = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    if (REGEX_PRICE.test(value)) {
      updatePreviewConfig({ price: value });
      setFieldValue('amount', value);
    }
  };

  const handleSelectionCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // setFieldValue("currency", value);
    setCurrency(value);
    updatePreviewConfig({
      currencyToken: value,
    });
  };

  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    if (REGEX_QUANTITY.test(value) || !value) {
      setFieldValue('quantity', value);
    }
  };

  const renderReceiveAmount = useCallback(() => {
    if (values.amount) {
      const rawFee =
        currency === 'UMAD' ? MARKET_RAW_FEE_BUY_TOKEN.umad : MARKET_RAW_FEE_BUY_TOKEN.eth;

      const royaltyFee = isCreator
        ? 0
        : new BigNumber(assetDataDetail?.collection?.royalty as any)
            .dividedBy(100)
            .toFixed()
            .toString();

      const systemFee = new BigNumber(rawFee).dividedBy(100).toFixed().toString();

      const receiveFee = new BigNumber(1).minus(systemFee).minus(royaltyFee).toFixed().toString();

      const receiveAmount = new BigNumber(values.amount as any)
        .multipliedBy(receiveFee)
        .toFixed()
        .toString();
      return receiveAmount;
    }
    return '0';
  }, [values?.amount, currency, isCreator]);

  const handleChangeReserveBuyer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReserveBuyer(event.target.value);
    setFieldValue('reserveBuyer', event.target.value || undefined);
  };

  const renderErrorDate = useCallback(() => {
    if (duration?.type !== 'Custom date') return;

    switch (true) {
      case Number(duration.startDate) < moment().unix() ||
        Number(duration.endDate) < moment().unix():
        return (
          <p className="text-error-60 mt-1 text--body-small pl-4">
            Duration time cannot be the past
          </p>
        );

      case (duration.endDate as number) < (duration.startDate as number):
        return (
          <p className="text-error-60 mt-1 text--body-small pl-4">
            End time cannot be before start time
          </p>
        );

      default:
        return null;
    }
  }, [duration]);

  useEffect(() => {
    setDurationFixedPrice(duration);
  }, [duration]);

  useEffect(() => {
    if (isERC1155) {
      const ownerNFTs = get(assetDataDetail, 'ownerNft', []).find((item: any) => {
        return get(item, 'user.walletAddress') === walletAddress;
      });
      if (ownerNFTs) {
        setAvailable(ownerNFTs?.remainAmount || 0);
        setOnSaleAmount(ownerNFTs?.remainAmount - ownerNFTs?.offSaleAmount);
      }
    }
  }, [assetDataDetail.id]);

  useUpdateEffect(() => {
    validateForm();
  }, [currency]);

  useUpdateEffect(() => {
    if (!toggleSpecificBuyer || (toggleSpecificBuyer && values?.reserveBuyer)) {
      validateForm();
    }
  }, [toggleSpecificBuyer]);

  const shouldDisableBtnSubmit = (): boolean => {
    let flag = false;
    Object.keys(errors).forEach((key: string) => {
      if (touched[key] === true) flag = true;
    });
    return flag;
  };
  
  const handleCheckValidation = () => {
    if (toggleSpecificBuyer && !errors.reserveBuyer) {
      setFieldTouched('reserveBuyer', true);
      setFieldError('reserveBuyer', 'Address is not allowed to be empty');
      return;
    }
    handleSubmit
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2.25} className="my-5">
          {isERC1155 && (
            <div>
              <div className="text-white font-bold text-sm">Quantity</div>
              <div className="text-archive-Neutral-Variant70 text-xs mb-3 mt-3">
                {addCommaToNumber(available)} available
              </div>
              <TextFieldFilledCustom
                customClassName="custom-field"
                placeholder="1"
                scheme="dark"
                className="mt-2"
                classCustomError="pl-4 text-xs"
                label=""
                name="quantity"
                value={values.quantity}
                onChange={handleChangeQuantity}
                error={Boolean(errors.quantity)}
                helperText={touched.quantity && errors.quantity}
                onBlur={handleBlur}
              />
            </div>
          )}
          <div>
            <div className="text-white font-bold text-sm">
              {isERC1155 ? 'Price per unit' : 'Price'}
            </div>
            <div className="text-archive-Neutral-Variant70 text-xs mb-3 mt-3">
              Your asset will be on sale until you transfer or cancel it.
            </div>
            <SwapTextField
              listCurrency={SELL_CURRENCY}
              helperText={touched.amount && errors.amount}
              amount={values.amount}
              valueSelect={currency}
              handleChangeAmount={handleChangeYourOffer}
              handleSelectionCurrency={handleSelectionCurrency}
              classCustomError="pl-4 text-xs"
              amountLabel="Amount"
              nameInput="amount"
              onBlur={handleBlur}
            />
            <div className="text-archive-Neutral-Variant70 mt-3 text-xs">
              <span>Service fee</span>
              <span className="text-secondary-60 font-bold" style={text}>
                {' '}
                {currency === 'UMAD' ? MARKET_RAW_FEE_BUY_TOKEN.umad : MARKET_RAW_FEE_BUY_TOKEN.eth}
                %
              </span>
            </div>
            <div className="text-archive-Neutral-Variant70 mt-3 text-xs">
              <span>Royalty fee</span>
              <span className="text-secondary-60 font-bold" style={text}>
                {' '}
                {assetDataDetail?.collection?.royalty || 0}%
              </span>
            </div>
            <div className="text-archive-Neutral-Variant70 mt-3 text-xs flex gap-1">
              <div> You will receive </div>
              <div className="text-secondary-60 font-bold truncate w-[70%]" style={text}>
                {renderReceiveAmount()} {currency.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="selet-duration-time">
            <div className="text-white font-bold mb-2 text-sm	">Duration</div>
            <SelectDuration
              duration={duration}
              setDuration={setDuration}
              initialTime={initialTime}
              typesDuration={TYPES_DURATION_DEFAULT}
            />
            {renderErrorDate()}
          </div>

          <Stack spacing={1}>
            <div>
              <div className="flex justify-between">
                <div className="flex gap-2 my-auto">
                  <div className="text-white font-bold text-sm">Reserve for specific buyer</div>
                  <div>
                    <ContentTooltip
                      title={`This item can be purchased as soon as it's listed.`}
                      arrow
                    >
                      <WarningSvg color={icon?.color}/>
                    </ContentTooltip>
                  </div>
                </div>
                <div>
                  <Switch
                    checked={toggleSpecificBuyer}
                    onChange={() => {
                      setToggleSpecificBuyer(!toggleSpecificBuyer);
                    }}
                    style={icon}
                  />
                </div>
              </div>
              <div className="text-archive-Neutral-Variant70 text-xs">
                This item can be purchased as soon as it's listed.
              </div>
            </div>
            <Collapse in={toggleSpecificBuyer}>
              <TextFieldFilledCustom
                customClassName="custom-field"
                scheme="dark"
                className="mt-2 font-Chakra"
                placeholder="0x3dE5700..."
                label=""
                name="reserveBuyer"
                value={reserveBuyer}
                onChange={handleChangeReserveBuyer}
                error={Boolean(errors.reserveBuyer)}
                classCustomError="!text-xs"
                helperText={touched?.reserveBuyer && errors.reserveBuyer}
                onBlur={handleBlur}
              />
            </Collapse>
          </Stack>
        </Stack>
        <Divider />
        <div className="mt-8">
          <FilledButton
            text="Post your listing"
            type="submit"
            customClass="font-bold sm:w-full md:w-auto"
            onClick={handleCheckValidation}
            disabled={shouldDisableBtnSubmit() || Boolean(renderErrorDate())}
            style={button?.default}
          />
        </div>
      </form>
    </>
  );
};

export default FixedPriceForm;
