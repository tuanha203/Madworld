import { useMemo, useState, FC, useEffect } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import moment from 'moment';
import * as yup from 'yup';
import get from 'lodash/get';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useUpdateBalance } from 'hooks/useUpdateBalance';

import Divider from 'components/common/divider';
import JustifyBetween from 'components/modules/share/JustifyBetween';
import SwapTextField from 'components/common/textFieldMakeOffer/SwapTextField';
import { TOKEN, ASSET_TYPE } from 'constants/app';
import { SWAP_UMAD_UNISWAP, SWAP_WETH_UNISWAP } from 'constants/text';
import TermsAcknowledge from '../../common/terms-acknowledge';
import SelectExpiration from '../select-expiration';
import { TextFieldFilledCustom } from '../textField';
import { IExpirationDate, CURRENCY_SELECT } from '../../../constants/app';
import { FilledButton } from '../../common/buttons/index';
import { DECIMALS_ERC20, REGEX_PRICE } from 'constants/index';
import { addCommaToNumberHasApproximately } from 'utils/currencyFormat';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { OutlinedButton } from 'components/common';
import { shortenNameNoti } from 'utils/func';

const EXPIRED_TIMES = [
  { type: '7 Days', date: moment(new Date()).add(7, 'days') },
  { type: '14 Days', date: moment(new Date()).add(14, 'days') },
  { type: '1 month', date: moment(new Date()).add(1, 'months') },
  { type: 'Custom date', date: null },
];

export const LIST_OFFER = [
  {
    value: TOKEN.UMAD,
    text: TOKEN.UMAD,
    image: '/icons/mad_icon_outlined.svg',
  },
  {
    value: TOKEN.WETH,
    text: TOKEN.WETH,
    image: '/icons/weth.svg',
  },
];

export interface CurrencyType {
  value: string;
  text: string;
  image: string;
}

interface IMakeAnOfferProps {
  assetDataDetail: any;
  handleSetOfferMetaData: (e: any) => void;
  isSelectedCustomDate: boolean;
  setIsSelectedCustomDate: any;
}

const MakeAnOffer: FC<IMakeAnOfferProps> = (props) => {
  const { assetDataDetail, handleSetOfferMetaData, isSelectedCustomDate, setIsSelectedCustomDate } =
    props;

  const [isChecked, setChecked] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [expiration, setExpiration] = useState<IExpirationDate>(EXPIRED_TIMES[0]);
  const { wethBalance, umadBalance } = useSelector((state: any) => state?.user?.data || {});

  const { updateBalance } = useUpdateBalance();

  useEffect(() => {
    updateBalance();
  }, []);

  const maxQuantity = useMemo(() => {
    return get(assetDataDetail, 'ownerNft', []).reduce((prev: any, curr: any) => {
      return prev + curr.remainAmount;
    }, 0);
  }, []);

  const validationSchema = yup.object({
    yourOffer: yup
      .number()
      .typeError(`Must be number`)
      .required('Your offer is not allowed to be empty')
      .positive(`Price/Price per unit must be greater than 0`)
      .test({
        name: 'yourOffer',
        exclusive: false,
        params: {},
        test: function (value: any, { createError, parent }: any) {
          const { currency } = parent;
          if (!value) return false;
          const insuff =
            currency === CURRENCY_SELECT.UMAD ? value > umadBalance : value > wethBalance;
          if (insuff) {
            return createError({
              message: `Insufficient ${currency} balance`,
              path: 'yourOffer',
            });
          }
          return true;
        },
      }),
    quantity: yup
      .number()
      .typeError(`Must be number`)
      .required('Quantity is not allowed to be empty')
      .positive(`Quantity must be greater than 0`)
      .max(maxQuantity, `The quantity cannot exceed ${maxQuantity}`),
  });

  const { errors, values, handleSubmit, setFieldValue, isValid } = useFormik({
    initialValues: {
      yourOffer: '',
      quantity: 1,
      currency: CURRENCY_SELECT.UMAD,
    },
    validationSchema: validationSchema,
    onSubmit: () => handleMakeOffer(),
  });

  const handleMakeOffer = async () => {
    handleSetOfferMetaData({
      yourOffer: values.yourOffer,
      date: expiration.date,
      quantity,
      currency: values.currency,
    });
  };

  const handleChangeYourOffer = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value;

    if (
      value.split('.')[1] &&
      value.split('.')[1].length > DECIMALS_ERC20[values.currency.toLowerCase()]
    )
      return;

    if (REGEX_PRICE.test(value)) {
      setFieldValue('yourOffer', value);
    }
  };

  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value;

    if (REGEX_PRICE.test(value)) {
      setQuantity(Number(value));
      setFieldValue('quantity', value);
    }
  };

  const handleSelectionCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue('currency', event.target.value);

    if (
      values.yourOffer.split('.')[1] &&
      values.yourOffer.split('.')[1].length > DECIMALS_ERC20[event.target.value.toLowerCase()]
    ) {
      setFieldValue(
        'yourOffer',
        values.yourOffer.split('.')[0] +
          '.' +
          values.yourOffer.split('.')[1].slice(0, DECIMALS_ERC20[event.target.value.toLowerCase()]),
      );
    }
  };

  const insufficient =
    values?.currency === CURRENCY_SELECT.UMAD
      ? values.yourOffer > umadBalance
      : values.yourOffer > wethBalance;

  const disabled = !isChecked || !isValid || moment(expiration.date).isBefore(new Date());

  return (
    <>
      <div className="modal-content pt-6 pb-2 w-[389px] truncate">
        <div className="text--body-medium font-normal flex flex-wrap gap-1">
          <div>You are about to make an offer for 111</div>
          <ContentTooltip title={assetDataDetail.title} arrow>
            <div className="text--label-large truncate max-w-[142px]">{assetDataDetail.title}</div>
          </ContentTooltip>
          by{' '}
          <ContentTooltip
            title={
              get(assetDataDetail, 'ownerNft.0.user.username') ||
              get(assetDataDetail, 'ownerNft.0.user.walletAddress')
            }
          >
            <div>
              <Link href={`/artist/${get(assetDataDetail, 'ownerNft.0.user.walletAddress')}`}>
                <div className="text--label-large cursor-pointer max-w-[389px] truncate">
                  {get(assetDataDetail, 'ownerNft.0.user.username')
                    ? shortenNameNoti(get(assetDataDetail, 'ownerNft.0.user.username'), 9)
                    : get(assetDataDetail, 'ownerNft.0.user.walletAddress', '')?.slice(0, 6)}
                </div>
              </Link>
            </div>
          </ContentTooltip>
        </div>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ mb: 4 }}>
            <div>
              <h2 className="text--headline-xsmall mb-2">Your Offer</h2>
              <SwapTextField
                helperText={errors.yourOffer}
                amount={values.yourOffer}
                valueSelect={values.currency}
                listCurrency={LIST_OFFER}
                handleChangeAmount={handleChangeYourOffer}
                handleSelectionCurrency={handleSelectionCurrency}
                nameInput="amount"
                amountLabel="Amount"
              />
            </div>

            {get(assetDataDetail, 'collection.type') === ASSET_TYPE.ERC1155 && (
              <div>
                <h2 className="text--headline-xsmall mb-2">Quantity</h2>
                <TextFieldFilledCustom
                  scheme="dark"
                  name="quantity"
                  value={quantity}
                  onChange={handleChangeQuantity}
                  helperText={errors.quantity}
                  error={Boolean(errors.quantity)}
                />
              </div>
            )}
            <div>
              <h2 className="text--headline-xsmall mb-2">Offer Expiration</h2>
              <SelectExpiration
                isSelectedCustomDate={isSelectedCustomDate}
                setIsSelectedCustomDate={setIsSelectedCustomDate}
                date={expiration}
                setDate={setExpiration}
                TYPES={EXPIRED_TIMES}
              />
              {moment(expiration.date).isBefore(new Date()) && (
                <p className="text-error-60 mt-1 text--body-small">
                  Offer expiration time cannot be the past
                </p>
              )}
            </div>

            <Stack spacing={2}>
              <JustifyBetween
                children={
                  <>
                    <p className="text-sm">Balance</p>
                    <ContentTooltip
                      title={`${
                        values.currency === CURRENCY_SELECT.UMAD
                          ? addCommaToNumberHasApproximately(umadBalance, 8)
                          : addCommaToNumberHasApproximately(wethBalance, 18)
                      } ${values.currency}`}
                    >
                      <p className="text--title-small">
                        {`${
                          values.currency === CURRENCY_SELECT.UMAD
                            ? addCommaToNumberHasApproximately(umadBalance, 8)
                            : addCommaToNumberHasApproximately(wethBalance, 8)
                        } ${values.currency}`}
                      </p>
                    </ContentTooltip>
                  </>
                }
                customClass=""
              />
              <Divider customClass="my-2 " />
              <div className="flex justify-between">
                <p className="text-sm">Total Payable</p>
                <ContentTooltip
                  title={`${addCommaToNumberHasApproximately(values.yourOffer, 18)} ${
                    values.currency
                  }`}
                >
                  <p className="text--title-small">
                    {addCommaToNumberHasApproximately(values.yourOffer, 8)} {values.currency}
                  </p>
                </ContentTooltip>
              </div>
              <div>
                <TermsAcknowledge
                  onChange={(_, checked: boolean) => setChecked(checked)}
                  value={isChecked}
                  className="mt-2"
                />
              </div>
            </Stack>
          </Stack>

          <div className="flex justify-end items-center gap-2">
            {insufficient && (
              <OutlinedButton
                customClass="!text--label-large ml-3 !text-secondary-60 font-bold h-[44.5px]"
                text={`Buy ${values?.currency}`}
                onClick={() =>
                  window.open(
                    values?.currency === CURRENCY_SELECT.UMAD
                      ? SWAP_UMAD_UNISWAP
                      : SWAP_WETH_UNISWAP,
                    '_blank',
                  )
                }
              />
            )}
            <FilledButton type="submit" disabled={disabled} text="Make an offer" />
          </div>
        </form>
      </div>
    </>
  );
};

export default MakeAnOffer;
