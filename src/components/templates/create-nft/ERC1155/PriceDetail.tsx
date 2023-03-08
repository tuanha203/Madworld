import { BigButton } from 'components/common/buttons/BigButtons';
import { IconInfoOutline } from 'components/common/iconography/IconBundle';
import { SwitchControl } from 'components/common/selectionControls';
import SwapTextField from 'components/common/textFieldMakeOffer/SwapTextField';
import SelectDuration from 'components/modules/select-duration';
import { MARKET_RAW_FEE_BUY_TOKEN, REGEX_PRICE } from 'constants/index';
import {
  initialTime,
  REGEX_PRICE_ONLY_NUMBER,
  SELL_CURRENCY,
  SELL_TYPE,
  TYPES_DURATION_DEFAULT,
  useStylesTooltipFontSize12, WINDOW_MODE,
} from 'constants/app';
import { FC, useCallback, useRef, useState } from 'react';
import FixedPrice from '../icons/FixedPrice';
import { TextFieldFilledCustom } from 'components/modules/textField';
import BigNumber from 'bignumber.js';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import useDetectWindowMode from "hooks/useDetectWindowMode";
import { useOnClickOutside } from "utils/hook";

const PriceDetail: FC<any> = ({ formik, collectionSelected }) => {
  const { values, errors, getFieldProps, setFieldValue, touched, setFieldTouched } = formik;
  const useStylesTooltip = useStylesTooltipFontSize12();
  const { duration } = values;
  const [showTooltipText, setShowTooltipText] = useState<boolean>(false)
  const ref: any = useRef();
  const windowMode = useDetectWindowMode();

  useOnClickOutside(ref, () => {
    setShowTooltipText(false);
  });

  const handleSetDuration = (duration: any) => {
    setFieldValue('duration', duration);
  };

  const setListYourAsset = (value: boolean) => {
    setFieldValue('listYourAsset', value);
  };

  const handleChangeYourOffer = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    if (REGEX_PRICE.test(value)) {
      setFieldValue('amount', value);
    }
  };

  const handleSelectionCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFieldValue('currency', value);
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    const pressedKey = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!REGEX_PRICE.test(pressedKey)) {
      event.preventDefault();
      return false;
    }
  };

  const renderReceiveAmount = useCallback(
    (amount, currency) => {
      if (amount) {
        const rawFee =
          currency === 'UMAD' ? MARKET_RAW_FEE_BUY_TOKEN.umad : MARKET_RAW_FEE_BUY_TOKEN.eth;

        const royaltyFee = 0;

        const systemFee = new BigNumber(rawFee).dividedBy(100).toFixed().toString();

        const receiveFee = new BigNumber(1).minus(systemFee).minus(royaltyFee).toFixed().toString();

        const receiveAmount = new BigNumber(amount as any)
          .multipliedBy(receiveFee)
          .toFixed()
          .toString();
        return receiveAmount;
      }
      return '0';
    },
    [values?.amount, values.currency],
  );

  const handleChangeQuantity = (event: any) => {
    const { value } = event.target;
    if (REGEX_PRICE_ONLY_NUMBER.test(value)) {
      const quantity = value.replace(/^0+/, '');
      setFieldValue('quantity', quantity);
    }
  };

  const renderFixedPrice = () => {
    return (
      <>
        <div className="mt-12">
          <TextFieldFilledCustom
            customClassName="custom-field"
            scheme="dark"
            classCustomError="text--body-small !text-xs !font-normal !text-error-60 pl-4"
            onWheel={(e: any) => e.target.blur()}
            label={
              <>
                <p className="text-sm mb-[8px]">
                  Quantity<span className="text-error-60">*</span>
                </p>
                <div className="text-archive-Neutral-Variant70 text-xs mb-3 mt-3 font-normal">
                  {`${values.supply} available`}
                </div>
              </>
            }
            disableUnderline
            placeholder="1"
            error={touched.quantity && Boolean(errors?.quantity)}
            helperText={touched.quantity && errors?.quantity}
            className="font-Chakra"
            onChange={handleChangeQuantity}
            type="text"
            value={values.quantity}
            onKeyPress={onKeyPress}
            onBlur={() => {
              setFieldTouched('quantity')
            }}
          />
        </div>
        <div>
          <div className="text-white font-bold mt-8 text-sm">Price per unit</div>
          <div className="text-archive-Neutral-Variant70 text-xs mb-3 mt-3 font-normal">
            Enter Price for the asset
          </div>
          <SwapTextField
            listCurrency={SELL_CURRENCY}
            error={touched.amount && Boolean(errors?.amount)}
            helperText={touched.amount && errors?.amount}
            amount={values.amount}
            valueSelect={values.currency}
            handleChangeAmount={handleChangeYourOffer}
            handleSelectionCurrency={handleSelectionCurrency}
            classCustomError="pl-4 text-xs"
            amountLabel="Amount"
            nameInput="amount"
            idAmount="amount"
            onWheel={(e: any) => e.target.blur()}
            onKeyPress={onKeyPress}
            onBlur={() => {
              setFieldTouched('amount')
            }}
          />
          <div className="text-archive-Neutral-Variant70 mt-3 text-sm">
            <span>Service fee</span>
            <span className="text-secondary-60 font-bold">
              {' '}
              {values.currency === 'UMAD'
                ? MARKET_RAW_FEE_BUY_TOKEN.umad
                : MARKET_RAW_FEE_BUY_TOKEN.eth}
              %
            </span>
          </div>
          <div className="text-archive-Neutral-Variant70 mt-3 text-sm flex gap-1">
            <div> You will receive </div>
            <div className="text-secondary-60 font-bold truncate w-[70%]">
              {renderReceiveAmount(values.amount, values.currency)} {values.currency.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="selet-duration-time mt-8">
          <div className="text-white font-bold mb-2 text-sm">Duration</div>
          <SelectDuration
            duration={duration}
            setDuration={handleSetDuration}
            initialTime={initialTime}
            typesDuration={TYPES_DURATION_DEFAULT}
          />
          {errors.duration && (
            <p className="text-error-60 mt-1 text--body-small pl-4 text-xs">{errors.duration}</p>
          )}
        </div>
        <div className="text-white font-bold mt-8 mb-2 flex justify-between text-sm">
          <div>Royalty fee</div>
          <div>{values?.collectionSelected?.royalty || 0}%</div>
        </div>
        <div className="text-xs	font-normal text-archive-Neutral-Variant70">
          Royalty fee is set up on the collection that NFT belongs to
        </div>
        <div className="mt-8">
          <div className="flex flex justify-between items-center">
            <div className="flex">
              <p className="font-bold text-sm text-white mr-2">Reserve for specific buyer</p>
            </div>
            <SwitchControl
              isChecked={values.isShowReserveBuyer}
              parentCallback={() => setFieldValue('isShowReserveBuyer', !values.isShowReserveBuyer)}
            />
          </div>
          <p className="text-archive-Neutral-Variant70 text-xs text-white">
            This item can be purchased as soon as it's listed.
          </p>
          {values.isShowReserveBuyer && (
            <TextFieldFilledCustom
              customClassName="custom-field"
              scheme="dark"
              disableUnderline
              placeholder="0x3dE5700..."
              classCustomError="text--body-small !text-xs !font-normal !text-error-60 pl-4"
              error={touched.reserveBuyer && Boolean(errors?.reserveBuyer)}
              helperText={touched.reserveBuyer && errors?.reserveBuyer}
              className="font-Chakra mt-2"
              {...getFieldProps('reserveBuyer')}
              onWheel={(e: any) => e.target.blur()}
              value={values.reserveBuyer}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <div className="mt-8">
      <div>
        <div className="flex flex justify-between items-center">
          <div className="flex">
            <p className="font-bold text-sm text-white mr-2">List your asset</p>
          </div>
          <SwitchControl isChecked={values.listYourAsset} parentCallback={setListYourAsset} />
        </div>
        <p className="text-archive-Neutral-Variant70 text-xs text-white">
          Enter price to allow users instantly purchase your NFT{' '}
        </p>
      </div>
      {values.listYourAsset && (
        <>
          <div className="mt-8">
            <div className="flex relative">
              <p className="font-bold text-sm text-white mr-2">Select your selling method</p>
              {
                [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode) ? (
                  <>
                    <div onClick={() => setShowTooltipText(true)} ref={ref}>
                      <IconInfoOutline/>
                    </div>
                    {
                      showTooltipText && (
                        <p className="absolute top-[30px] left-0 bg-[#1f262c] w-11/12 z-10 text-[10px] py-2 px-5 tooltip-text after:left-[196px]">
                          Choose “Fixed Price” for sell at a fixed price
                        </p>
                      )
                    }
                  </>
                ) : (
                  <ContentTooltip
                    classes={useStylesTooltip}
                    title="Choose “Fixed Price” for sell at a fixed price"
                    arrow
                    placement="bottom"
                  >
                    <div>
                      <IconInfoOutline />
                    </div>
                  </ContentTooltip>
                )
              }
            </div>
            <div className="flex mt-4">
              <BigButton
                className="mr-6 !border-primary-60"
                text="Fixed Price"
                Icon={<FixedPrice color="#F4B1A3" />}
                onClick={() => setFieldValue('sellMethod', SELL_TYPE.FIX_PRICE)}
              />
            </div>
          </div>
          {renderFixedPrice()}
        </>
      )}
    </div>
  );
};

export default PriceDetail;
