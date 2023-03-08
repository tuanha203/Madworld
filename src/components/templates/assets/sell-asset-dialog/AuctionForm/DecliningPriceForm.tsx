import { useState, FC, useCallback, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import SwapTextField from 'components/common/textFieldMakeOffer/SwapTextField';
import SelectDuration from 'components/modules/select-duration';
import {
  AUCTION_CURRENCY,
  DUTCH_AUCTION_CURRENCY,
  IdurationDate,
  MAX_PRICE,
  TIME,
  TYPES_DURATION_DEFAULT,
  TYPES_DURATION_DUTCH_AUCTION,
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

const initialTime = {
  [TIME.HOURS]: moment().hours().toString(),
  [TIME.MINUTES]: moment().minutes().toString(),
  [TIME.SECONDS]: moment().seconds().toString(),
};
interface IDecliningPriceFormProps {
  formik?: any;
  className?: string;
  putDataAuction: (values: any) => void;
  assetDataDetail: any;
  updatePreviewConfig?: any;
  setDurationAuction?: any;
}

const DecliningPriceForm: FC<IDecliningPriceFormProps> = (props) => {
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
    staringPrice: Yup.number().test({
      name: 'staringPrice',
      exclusive: false,
      params: {},
      test: function (value: any, { createError }: any) {
        if (value <= 0) {
          return createError({
            message: `Price must be greater than 0`,
            path: 'staringPrice', // Fieldname
          });
        }
        if (!value) {
          return createError({
            message: `Starting price is not allowed to be empty`,
            path: 'staringPrice', // Fieldname
          });
        }

        if (value > MAX_PRICE) {
          return createError({
            message: `The amount cannot exceed 10,000,000,000,000`,
            path: 'staringPrice', // Fieldname
          });
        }

        const floorPrice = currency === 'UMAD' ? UMadFloorPrice : ethFloorPrice;
        if (value < floorPrice) {
          return createError({
            message: `Price is below collection floor price of ${UMadFloorPrice} UMAD | ${ethFloorPrice} ETH`,
            path: 'staringPrice', // Fieldname
          });
        }
        return true;
      },
    }),
    endingPrice: Yup.number().test({
      name: 'endingPrice',
      exclusive: false,
      params: {},
      test: function (value: any, { createError }: any) {
        if (value <= 0) {
          return createError({
            message: `Price must be greater than 0`,
            path: 'endingPrice', // Fieldname
          });
        }
        if (!value) {
          return createError({
            message: `Ending price is not allowed to be empty`,
            path: 'endingPrice', // Fieldname
          });
        }

        if (value > MAX_PRICE) {
          return createError({
            message: `The amount cannot exceed 10,000,000,000,000`,
            path: 'endingPrice', // Fieldname
          });
        }

        if (value >= this?.parent?.staringPrice) {
          return createError({
            message: `Ending price must be less than starting price`,
            path: 'endingPrice', // Fieldname
          });
        }

        const floorPrice = currency === 'UMAD' ? UMadFloorPrice : ethFloorPrice;
        if (value < floorPrice) {
          return createError({
            message: `Price is below collection floor price of ${UMadFloorPrice} UMAD | ${ethFloorPrice} ETH`,
            path: 'endingPrice', // Fieldname
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
      staringPrice: '',
      endingPrice: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      putDataAuction({
        ...values,
        currency,
        duration,
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
      updatePreviewConfig({ price: value }); // chỗ này em xem lại nha a sửa amount thành staringPrice
      formik.setFieldValue('staringPrice', value);
    }
  };

  const handleChangeAmountEndingPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    if (REGEX_PRICE.test(value)) {
      formik.setFieldValue('endingPrice', value);
    }
  };

  const handleChangeReserve = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;

    if (REGEX_PRICE.test(value)) {
      formik.setFieldValue('reserve', value);
    }
  };

  const renderReceiveAmount = useCallback(
    (amount) => {
      if (amount) {
        const systemFee =
          currency === 'UMAD' ? MARKET_RAW_FEE_BUY_TOKEN.umad : MARKET_RAW_FEE_BUY_TOKEN.eth;

        const receiveFee = 1 - systemFee / 100 - assetDataDetail?.collection?.royalty / 100;

        const receiveAmount = new BigNumber(amount as any)
          .multipliedBy(receiveFee)
          .toFixed()
          .toString();
        return receiveAmount;
      }
      return '0';
    },
    [formik.values?.amount, currency, formik.values?.staringPrice, formik.values?.endingPrice],
  );

  const renderErrorDate = useCallback(() => {
    if (duration?.type === 'Unlimited') return;

    switch (true) {
      case (duration.endDate as number) < (duration.startDate as number):
        return (
          <p className="text-error-60 mt-1 text--body-small">
            {'End time cannot be before start time'}
          </p>
        );

      default:
        return null;
    }
  }, [duration]);

  useUpdateEffect(() => {
    validateForm();
  }, [currency, reversePrice]);

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2} className={'mb-5'}>
        <div className="mt-8">
          <div className="text-white font-bold mb-2">Starting price</div>
          <SwapTextField
            listCurrency={DUTCH_AUCTION_CURRENCY}
            valueSelect={currency}
            helperText={touched?.staringPrice && errors.staringPrice}
            amount={formik.values.staringPrice}
            handleChangeAmount={handleChangeAmount}
            handleSelectionCurrency={handleSelectionCurrency}
            amountLabel="Amount"
            nameInput="staringPrice"
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
                {renderReceiveAmount(formik.values.staringPrice)} {currency.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="selet-duration-time !mt-8">
          <div className="text-white font-bold mb-2">Duration</div>
          <SelectDuration
            duration={duration}
            setDuration={setDuration}
            initialTime={initialTime}
            typesDuration={TYPES_DURATION_DUTCH_AUCTION}
          />
          {renderErrorDate()}
        </div>

        <div className="!mt-8">
          <div className="text-white font-bold mb-2">Ending price</div>
          <SwapTextField
            listCurrency={DUTCH_AUCTION_CURRENCY}
            valueSelect={currency}
            helperText={touched?.endingPrice && errors.endingPrice}
            amount={formik.values.endingPrice}
            handleChangeAmount={handleChangeAmountEndingPrice}
            handleSelectionCurrency={handleSelectionCurrency}
            amountLabel="Amount"
            nameInput="endingPrice"
            onBlur={formik.handleBlur}
            disabled
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
                {renderReceiveAmount(formik.values.endingPrice)} {currency.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </Stack>
      <Divider />
      <div className="mt-8">
        <FilledButton
          text="Post your listing"
          type="submit"
          customClass="font-bold sm:w-full md:w-auto"
          onClick={handleSubmit}
          disabled={!isValid || Boolean(renderErrorDate())}
        />
      </div>
    </form>
  );
};

export default DecliningPriceForm;
