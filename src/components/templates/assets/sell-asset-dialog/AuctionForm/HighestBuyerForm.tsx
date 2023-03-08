import { useState, FC, useCallback, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import SwapTextField from 'components/common/textFieldMakeOffer/SwapTextField';
import SelectDuration from 'components/modules/select-duration';
import {
  AUCTION_CURRENCY,
  IdurationDate,
  MAX_PRICE,
  TIME,
  TYPES_DURATION_DEFAULT,
} from 'constants/app';
import MoreOptions from './MoreOptions';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { Divider, FilledButton } from 'components/common';
import { MARKET_RAW_FEE_BUY_TOKEN, REGEX_PRICE } from 'constants/index';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import useUpdateEffect from 'hooks/useUpdateEffect';
interface IHighestBuyerFormProps {
  formik?: any;
  className?: string;
  putDataAuction: (values: any) => void;
  assetDataDetail: any;
  updatePreviewConfig?: any;
  setDurationAuction?: any;
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

const HighestBuyerForm: FC<IHighestBuyerFormProps> = (props) => {
  const { putDataAuction, assetDataDetail, updatePreviewConfig, setDurationAuction } = props;
  const [reversePrice, setReservePrice] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('UMAD');
  const { priceNativeCoinUsd, priceUmadUsd } = useSelector((state: any) => ({
    priceNativeCoinUsd: state?.system?.priceNativeCoinUsd,
    priceUmadUsd: state?.system?.priceUmadUsd,
  }));

  const UMadFloorPrice = assetDataDetail?.floorPrice;
  const royalFee = assetDataDetail?.collection?.royalty || 0;
  const ethFloorPrice = priceNativeCoinUsd
    ? (UMadFloorPrice * priceUmadUsd) / priceNativeCoinUsd
    : 0;

  const validationSchema = Yup.object({
    amount: Yup.number().test({
      name: 'amount',
      exclusive: false,
      params: {},
      test: function (value: any, { createError }: any) {
        if (value <= 0) {
          return createError({
            message: `Price must be greater than 0`,
            path: 'amount', // Fieldname
          });
        }
        if (!value) {
          return createError({
            message: `Starting price is not allowed to be empty`,
            path: 'amount', // Fieldname
          });
        }

        if (value > MAX_PRICE) {
          return createError({
            message: `The amount cannot exceed 10,000,000,000,000`,
            path: 'amount', // Fieldname
          });
        }
        const floorPrice = currency === 'UMAD' ? UMadFloorPrice : ethFloorPrice;
        if (value < floorPrice) {
          return createError({
            message: `Price is below collection floor price of ${UMadFloorPrice} UMAD | ${ethFloorPrice} ETH`,
            path: 'amount', // Fieldname
          });
        }
        return true;
      },
    }),
    reserve: Yup.mixed().test({
      name: 'reserve',
      exclusive: false,
      params: {},
      test: function (value: any, { createError, parent }: any) {
        if (!reversePrice) return true;
        if (!value) {
          return createError({
            message: `Include reserve price is not allowed to be empty`,
            path: 'reserve',
          });
        }
        if (value <= parent.amount) {
          return createError({
            message: `Reserve price must be greater than starting price`,
            path: 'reserve',
          });
        }
        if ((currency === 'UMAD' && value < 5000) || (currency === 'WETH' && value < 1)) {
          return createError({
            message: `The reserve price must be greater than or equal to 1 WETH / 5000 UMAD`,
            path: 'reserve',
          });
        }
        return true;
      },
    }),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      reserve: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      putDataAuction({
        ...values,
        currency,
        duration,
        reversePrice: reversePrice,
      });
    },
  });

  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    isValid,
    validateForm,
    handleBlur,
    touched,
  } = formik;
  const [duration, setDuration] = useState<IdurationDate>({
    type: '1 week',
    startDate: moment().unix(),
    endDate: moment().add(7, 'days').unix(),
  });
  const handleSelectionCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCurrency(value);
    updatePreviewConfig({
      currencyToken: value,
    });
  };
  useEffect(() => {
    setDurationAuction(duration);
  }, [duration]);
  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    let REGEX_POSITIVE_NUMBER = /^(\d+(\.)?\d*)?$/g;

    if (REGEX_PRICE.test(value)) {
      updatePreviewConfig({ price: value });
      formik.setFieldValue('amount', value);
    }
  };

  const handleChangeReserve = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;

    if (REGEX_PRICE.test(value)) {
      formik.setFieldValue('reserve', value);
    }
  };

  const renderReceiveAmount = useCallback(() => {
    if (formik.values.amount) {
      const systemFee =
        currency === 'UMAD' ? MARKET_RAW_FEE_BUY_TOKEN.umad : MARKET_RAW_FEE_BUY_TOKEN.eth;

      const receiveFee = 1 - systemFee / 100 - assetDataDetail?.collection?.royalty / 100;

      const receiveAmount = new BigNumber(formik.values.amount as any)
        .multipliedBy(receiveFee)
        .toFixed()
        .toString();
      return receiveAmount;
    }
    return '0';
  }, [formik.values?.amount, currency]);

  const renderErrorDate = useCallback(() => {
    if (duration?.type !== 'Custom date') return;

    switch (true) {
      case (duration.endDate as number) < (duration.startDate as number):
        return (
          <p className="text-error-60 mt-1 text--body-small">
            {'End time cannot be before start time'}
          </p>
        );

      case Number(duration.startDate) < moment().unix() ||
        Number(duration.endDate) < moment().unix():
        return (
          <p className="text-error-60 mt-1 text--body-small pl-4">
            Duration time cannot be the past
          </p>
        );

      default:
        return null;
    }
  }, [duration]);

  const shouldDisableBtnSubmit = (): boolean => {
    let flag = false;
    Object.keys(errors).forEach((key: string) => {
      if (touched[key] === true) flag = true;
    });
    return flag;
  };

  useUpdateEffect(() => {
    validateForm();
  }, [currency, reversePrice]);
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} className={'mb-5'}>
        <div>
          <div className="text-white font-bold">Starting price</div>
          <div className="text-archive-Neutral-Variant70 text-xs mb-3 mt-3">
            Bids below this amount won’t be allowed.
          </div>
          <SwapTextField
            listCurrency={AUCTION_CURRENCY}
            valueSelect={currency}
            helperText={touched.amount && errors.amount}
            amount={formik.values.amount}
            handleChangeAmount={handleChangeAmount}
            handleSelectionCurrency={handleSelectionCurrency}
            amountLabel="Amount"
            nameInput="amount"
            onBlur={handleBlur}
          />
          <div className="text-archive-Neutral-Variant70 mt-3 text-sm">
            <div>
              <span>Service fee</span>
              <span className="text-secondary-60 font-bold">
                {' '}
                {currency === 'UMAD' ? MARKET_RAW_FEE_BUY_TOKEN.umad : MARKET_RAW_FEE_BUY_TOKEN.eth}
                %
              </span>
            </div>
            <div className="text-archive-Neutral-Variant70 mt-3 text-sm">
              <span>Royalty fee</span>
              <span className="text-secondary-60 font-bold"> {royalFee}%</span>
            </div>
            <div className="text-archive-Neutral-Variant70 mt-3 text-sm">
              <span> You will receive </span>
              <span className="text-secondary-60 font-bold">
                {renderReceiveAmount()} {currency.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="selet-duration-time">
          <div className="text-white font-bold mb-2">Duration</div>
          <SelectDuration
            duration={duration}
            setDuration={setDuration}
            initialTime={initialTime}
            typesDuration={TYPES_DURATION_DEFAULT}
          />
          {renderErrorDate()}
        </div>

        <MoreOptions
          currency={currency}
          startPrice={formik.values.reserve}
          helperText={touched.reserve && errors.reserve}
          handleChangeReserve={handleChangeReserve}
          reversePrice={reversePrice}
          setReservePrice={setReservePrice}
          onBlur={handleBlur}
          nameInput="reserve"
          idAmount="reserve"
        />
      </Stack>

      <Divider />

      <div className="mt-8">
        <FilledButton
          text="Post your listing"
          type="submit"
          customClass="font-bold sm:w-full md:w-auto"
          onClick={handleSubmit}
          disabled={shouldDisableBtnSubmit() || Boolean(renderErrorDate())}
        />
      </div>
    </form>
  );
};

export default HighestBuyerForm;
