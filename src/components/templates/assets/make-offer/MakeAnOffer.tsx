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
import { TOKEN, ASSET_TYPE, MAX_PRICE, TYPES_DURATION_MAKE_OFFER } from 'constants/app';
import { SWAP_UMAD_UNISWAP, SWAP_WETH_UNISWAP } from 'constants/text';
import TermsAcknowledge from 'components/common/terms-acknowledge';
import SelectExpiration from 'components/modules/select-expiration';
import { TextFieldFilledCustom } from 'components/modules/textField';
import { IExpirationDate, CURRENCY_SELECT } from 'constants/app';
import { FilledButton } from 'components/common/buttons/index';
import { DECIMALS_ERC20, REGEX_PRICE } from 'constants/index';
import { addCommaToNumberHasApproximately } from 'utils/currencyFormat';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { OutlinedButton } from 'components/common';
import { shortenNameNoti } from 'utils/func';
import BigNumber from 'bignumber.js';
import { formatNumber } from 'utils/formatNumber';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';

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
  const [expiration, setExpiration] = useState<IExpirationDate>(TYPES_DURATION_MAKE_OFFER[1]);
  const [insufficient, setInsufficient] = useState<boolean>(false);
  const { wethBalance, umadBalance } = useSelector((state: any) => state?.user?.data || {});
  const { text, button } = useSelector((state:any) => state.theme);
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
      .positive(`Your offer must be greater than 0`)
      .test({
        name: 'yourOffer',
        exclusive: false,
        params: {},
        test: function (value: any, { createError, parent }: any) {
          const { currency, quantity } = parent;
          if (!value) return false;

          const userBalance = currency === CURRENCY_SELECT.UMAD ? umadBalance : wethBalance;
          const totalPayable = new BigNumber(value).multipliedBy(quantity).toString();

          const insuff = new BigNumber(totalPayable).gt(userBalance);

          if (value > MAX_PRICE) {
            return createError({
              message: `The amount cannot exceed 10,000,000,000`,
              path: 'yourOffer', // Fieldname
            });
          }
          // currency === CURRENCY_SELECT.UMAD ? value > umadBalance : value > wethBalance;
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

  const { errors, values, handleSubmit, setFieldValue, isValid, touched, handleBlur } = useFormik({
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
    if (value.includes('.')) return;
    if (REGEX_PRICE.test(value) || !value) {
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

  useEffect(() => {
    const userBalance = values?.currency === CURRENCY_SELECT.UMAD ? umadBalance : wethBalance;
    const totalPayable = new BigNumber(values?.yourOffer).multipliedBy(values?.quantity).toString();
    const insuff = new BigNumber(totalPayable).gt(userBalance);
    setInsufficient(insuff);
  }, [values, umadBalance, wethBalance]);

  // const insufficient =
  //   values?.currency === CURRENCY_SELECT.UMAD
  //     ? values.yourOffer > umadBalance
  //     : values.yourOffer > wethBalance;

  const disabled =
    !isChecked ||
    !isValid ||
    (moment(expiration.date).isBefore(new Date()) && expiration.date !== 0);

  const totalPayable = +values.yourOffer * quantity || 0;
  return (
    <>
      <div className="modal-content pt-6 pb-2 sm:w-full md:w-[389px] truncate">
        <div className="text--body-medium font-normal flex flex-wrap gap-1 sm:mb-4 md:mb-0">
          <div>You are about to make an offer for</div>
          <div className="max-w-[90px]">
            <OverflowTooltip
              title={assetDataDetail.title}
              className="text-[#7340D3] text-[16px]"
              arrow
              style={text}
            >
              <Link
                href={`/asset/${assetDataDetail?.collection?.address}/${assetDataDetail?.tokenId}`}
              >
                <a target="_blank">
                  <span
                    className="text--label-large text-primary-90 truncate w-full max-w-[142px] cursor-pointer"
                    style={text}
                  >
                    {assetDataDetail.title}
                  </span>
                </a>
              </Link>
            </OverflowTooltip>
          </div>
          by{' '}
          <div className="max-w-[90px]">
            <OverflowTooltip
              title={
                get(assetDataDetail, 'ownerNft.0.user.username') ||
                get(assetDataDetail, 'ownerNft.0.user.walletAddress')
              }
              className="text-primary-90 text--label-large"
            >
              <Link href={`/artist/${get(assetDataDetail, 'ownerNft.0.user.walletAddress')}`}>
                <a target="_blank">
                  <span className="cursor-pointer" style={text}>
                    {get(assetDataDetail, 'ownerNft.0.user.username') ||
                      get(assetDataDetail, 'ownerNft.0.user.walletAddress')}
                  </span>
                </a>
              </Link>
            </OverflowTooltip>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <Stack
            spacing={3}
            sx={{ mb: 4 }}
            className="max-h-[471px] 2xl:max-h-[unset] overflow-auto"
          >
            <div>
              <h2 className="text--headline-xsmall mb-2">Your Offer</h2>
              <SwapTextField
                helperText={touched?.yourOffer && errors.yourOffer}
                amount={values.yourOffer}
                valueSelect={values.currency}
                listCurrency={LIST_OFFER}
                handleChangeAmount={handleChangeYourOffer}
                handleSelectionCurrency={handleSelectionCurrency}
                nameInput="yourOffer"
                amountLabel="Amount"
                classCustomError={'sm:min-w-[120px]'}
                onBlur={handleBlur}
                bgTextFieldDynamic="swap-current-textField-input-custom-1"
              />
            </div>

            {get(assetDataDetail, 'collection.type') === ASSET_TYPE.ERC1155 && (
              <div>
                <h2 className="text--headline-xsmall mb-2">Quantity</h2>
                <div className="mb-2 text-sm opacity-60	">{formatNumber(maxQuantity)} available</div>
                <TextFieldFilledCustom
                  scheme="dark-2"
                  name="quantity"
                  value={values.quantity}
                  onChange={handleChangeQuantity}
                  helperText={touched?.quantity && errors.quantity}
                  error={Boolean(errors.quantity)}
                  classCustomError={'pl-0'}
                  onBlur={handleBlur}
                  placeholder="1"
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
                TYPES={TYPES_DURATION_MAKE_OFFER}
                bgClassNameDynamic="bg-fantasy-background-dark-500"
              />
              {moment(expiration.date).isBefore(new Date()) && expiration.date !== 0 && (
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
              <Divider customClass="sm:my-0 md:my-2 sm:hidden md:block" />
              <div className="flex justify-between">
                <p className="text-sm">Total Payable</p>
                <ContentTooltip
                  title={`${addCommaToNumberHasApproximately(totalPayable, 18)} ${values.currency}`}
                >
                  <p className="text--title-small">
                    {addCommaToNumberHasApproximately(totalPayable, 8)} {values.currency}
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
                customClass={`!text--label-large xl:ml-3 ml-0 ${
                  button?.outline ? '' : '!text-primary-60'
                }  font-bold h-[44.5px] xl:w-fit w-[50%]`}
                text={`Buy ${values?.currency}`}
                style={button?.outline}
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
            <FilledButton
              type="submit"
              disabled={disabled}
              text="Make an offer"
              customClass="xl:w-fit w-[50%]"
              style={!disabled ? button?.default : {}}
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default MakeAnOffer;
