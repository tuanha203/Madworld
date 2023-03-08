import { BigButton } from 'components/common/buttons/BigButtons';
import { IconInfoOutline } from 'components/common/iconography/IconBundle';
import { SwitchControl } from 'components/common/selectionControls';
import SwapTextField from 'components/common/textFieldMakeOffer/SwapTextField';
import SelectDuration from 'components/modules/select-duration';
import { MARKET_RAW_FEE_BUY_TOKEN, REGEX_PRICE } from 'constants/index';
import {
  AUCTION_CURRENCY,
  DUTCH_AUCTION_CURRENCY,
  initialTime,
  METHOD_SELL_AUCTION,
  SELL_CURRENCY,
  SELL_TYPE,
  TYPES_DURATION_DEFAULT,
  TYPES_DURATION_DUTCH_AUCTION,
  useStylesTooltipFontSize12, WINDOW_MODE,
} from 'constants/app';
import moment from 'moment';
import { FC, useCallback, useRef, useState } from 'react';
import FixedPrice from '../icons/FixedPrice';
import TimeAuction from '../icons/TimeAution';
import { TextFieldFilledCustom } from 'components/modules/textField';
import SelectCustom from 'components/common/select-type/SelectCustom';
import { SelectChangeEvent } from '@mui/material';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import { METHOD_OPTIONS } from 'pages/create/erc-721';
import MoreOptions from 'components/templates/assets/sell-asset-dialog/AuctionForm/MoreOptions';
import BigNumber from 'bignumber.js';
import useDetectWindowMode from "hooks/useDetectWindowMode";
import { useOnClickOutside } from "utils/hook";

const durationInit = {
  type: '1 week',
  startDate: moment().unix(),
  endDate: moment().add(7, 'days').unix(),
};

const PriceDetail: FC<any> = ({ formik, collectionSelected }) => {
  const {
    values,
    errors,
    getFieldProps,
    setFieldValue,
    handleBlur,
    touched,
    setFieldTouched,
  } = formik;
  const useStylesTooltip = useStylesTooltipFontSize12();
  const { duration, methodType, isShowReversePrice, durationEngAuction, durationDutchAuction } =
    values;
  const isDutchAuction = methodType === METHOD_SELL_AUCTION.SELL_WITH_DECLINING_PRICE;
  const [showTooltipText, setShowTooltipText] = useState<boolean>(false)
  const ref: any = useRef();
  const windowMode = useDetectWindowMode();

  useOnClickOutside(ref, () => {
    setShowTooltipText(false);
  });

  const handleSetDuration = (duration: any) => {
    setFieldValue('duration', duration);
  };

  const handleSetDurationAuction = (durationAuction: any) => {
    if (isDutchAuction) {
      setFieldValue('durationDutchAuction', durationAuction);
      setFieldValue('durationEngAuction', durationInit);
    } else {
      setFieldValue('durationDutchAuction', durationInit);
      setFieldValue('durationEngAuction', durationAuction);
    }
  };

  const setListYourAsset = (value: boolean) => {
    setFieldValue('listYourAsset', value);
  };

  const setReservePrice = (value: boolean) => {
    setFieldValue('isShowReversePrice', value);
  };

  const handleChangeYourOffer = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    if (REGEX_PRICE.test(value)) {
      setFieldValue('amount', value);
    }
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    const pressedKey = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!REGEX_PRICE.test(pressedKey)) {
      event.preventDefault();
      return false;
    }
  };

  const handleSelectionCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFieldValue('currency', value);
  };

  const handleChangeStartingPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    if (REGEX_PRICE.test(value)) {
      if (isDutchAuction) {
        setFieldValue('staringPrice', value);
      } else {
        setFieldValue('startingPriceEngAuction', value);
      }
    }
  };

  const handleSelectionStaringCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (isDutchAuction) {
      setFieldValue('staringCurrency', value);
    } else {
      setFieldValue('startingEngAuctionCurrency', value);
    }
  };

  const handleChangeEndingPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    if (REGEX_PRICE.test(value)) {
      setFieldValue('endingPrice', value);
    }
  };

  const handleSelectionEndingCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFieldValue('endingCurrency', value);
  };

  const handleChangeReserve = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    let value = event.target.value;
    if (REGEX_PRICE.test(value)) {
      setFieldValue('reservePrice', value);
    }
  };

  const handleMethodChange = (event: SelectChangeEvent<unknown>, _: any) => {
    setFieldValue('methodType', event.target.value as string);
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
    [
      values?.amount,
      values?.staringPrice,
      values?.endingPrice,
      values.staringCurrency,
      values.currency,
    ],
  );
  
  const renderFixedPrice = () => {
    return (
      <>
        <div>
          <div className="text-white font-bold lg:mt-8 mt-6 text-sm">Price</div>
          <div className="text-archive-Neutral-Variant70 text-xs mb-3 mt-3">
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

        <div className="selet-duration-time lg:mt-8 mt-6">
          <div className="text-white font-bold mb-2 text-sm">Duration</div>
          <SelectDuration
            duration={duration}
            setDuration={handleSetDuration}
            initialTime={initialTime}
            typesDuration={TYPES_DURATION_DEFAULT}
          />
          {errors.duration && (
            <p className="text-error-60 mt-1 text--body-small pl-4">{errors.duration}</p>
          )}
        </div>
        <div className="text-white font-bold mt-8 mb-2 flex justify-between">
          <div className='text-sm'>Royalty fee</div>
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
              parentCallback={(value) => setFieldValue('isShowReserveBuyer', value)}
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
              classCustomError="text--body-small !text-xs !font-normal !text-error-60 pl-4"
              placeholder="0x3dE5700..."
              error={touched.reserveBuyer && Boolean(errors?.reserveBuyer)}
              helperText={touched.reserveBuyer && errors?.reserveBuyer}
              className="font-Chakra mt-2"
              {...getFieldProps('reserveBuyer')}
              value={values.reserveBuyer}
            />
          )}
        </div>
      </>
    );
  };

  const renderTimeAuction = () => {
    return (
      <>
        <div>
          <div className="lg:mt-8 mt-6">
            <SelectCustom
              selectClassName="!bg-[#3E3F4D]"
              label={'Method'}
              // className="mb-3"
              optionClassName="flex gap-2 text--body-large"
              classNameLabel="!text-sm"
              options={METHOD_OPTIONS}
              value={methodType}
              onChange={handleMethodChange}
            />
          </div>
          <div className="text-white font-bold lg:mt-8 mt-6 mb-2 text-sm">Starting price</div>
          {!isDutchAuction && (
            <div className="text-archive-Neutral-Variant70 text-xs mb-3 mt-3">
              Bids below this amount won't be allowed
            </div>
          )}
          {isDutchAuction ? (
            <>
              <SwapTextField
                listCurrency={DUTCH_AUCTION_CURRENCY}
                valueSelect={values.staringCurrency}
                helperText={touched.staringPrice && errors.staringPrice}
                handleChangeAmount={handleChangeStartingPrice}
                handleSelectionCurrency={handleSelectionStaringCurrency}
                onKeyPress={onKeyPress}
                amount={values.staringPrice}
                classCustomError="pl-4 text-xs"
                amountLabel="Amount"
                nameInput="staringPrice"
                idAmount="staringPrice"
                typeInput="text"
                onWheel={(e: any) => e.target.blur()}
                onBlur={() => {
                  setFieldTouched('staringPrice')
                }}
              />
              <div className="text-archive-Neutral-Variant70 mt-3 text-sm">
                <span>Service fee</span>
                <span className="text-secondary-60 font-bold">
                  {' '}
                  {values.staringCurrency === 'UMAD'
                    ? MARKET_RAW_FEE_BUY_TOKEN.umad
                    : MARKET_RAW_FEE_BUY_TOKEN.eth}
                  %
                </span>
              </div>
              <div className="text-archive-Neutral-Variant70 mt-3 text-sm flex gap-1">
                <div> You will receive </div>
                <div className="text-secondary-60 font-bold truncate w-[70%]">
                  {renderReceiveAmount(values.staringPrice, values.staringCurrency)}{' '}
                  {values.staringCurrency.toUpperCase()}
                </div>
              </div>
            </>
          ) : (
            <>
              <SwapTextField
                listCurrency={AUCTION_CURRENCY}
                valueSelect={values?.startingEngAuctionCurrency}
                helperText={touched.startingPriceEngAuction && errors?.startingPriceEngAuction}
                handleChangeAmount={handleChangeStartingPrice}
                handleSelectionCurrency={handleSelectionStaringCurrency}
                amount={values?.startingPriceEngAuction}
                classCustomError="pl-4 text-xs"
                amountLabel="Amount"
                nameInput="startingPriceEngAuction"
                idAmount="startingPriceEngAuction"
                typeInput="text"
                onWheel={(e: any) => e.target.blur()}
                onKeyPress={onKeyPress}
                onBlur={() => {
                  setFieldTouched('startingPriceEngAuction')
                }}
              />
              <div className="text-archive-Neutral-Variant70 mt-3 text-sm">
                <span>Service fee</span>
                <span className="text-secondary-60 font-bold">
                  {' '}
                  {values.startingEngAuctionCurrency === 'UMAD'
                    ? MARKET_RAW_FEE_BUY_TOKEN.umad
                    : MARKET_RAW_FEE_BUY_TOKEN.eth}
                  %
                </span>
              </div>
              <div className="text-archive-Neutral-Variant70 mt-3 text-sm flex gap-1">
                <div> You will receive </div>
                <div className="text-secondary-60 font-bold truncate w-[70%]">
                  {renderReceiveAmount(
                    values?.startingPriceEngAuction,
                    values.startingEngAuctionCurrency,
                  )}{' '}
                  {values.startingEngAuctionCurrency.toUpperCase()}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="selet-duration-time lg:mt-8 mt-6">
          <div className="text-white font-bold mb-2 text-sm">Duration</div>
          <SelectDuration
            duration={isDutchAuction ? durationDutchAuction : durationEngAuction}
            setDuration={handleSetDurationAuction}
            initialTime={initialTime}
            typesDuration={isDutchAuction ? TYPES_DURATION_DUTCH_AUCTION : TYPES_DURATION_DEFAULT}
          />
          {errors.durationDutchAuction && (
            <p className="text-error-60 mt-1 text--body-small pl-4">
              {errors.durationDutchAuction}
            </p>
          )}
          {errors.durationEngAuction && (
            <p className="text-error-60 mt-1 text--body-small pl-4">{errors.durationEngAuction}</p>
          )}
          {/* {renderErrorDate()} */}
        </div>
        {isDutchAuction && (
          <>
            <div className="text-white font-bold mt-8 mb-2 text-sm">Ending price</div>
            <SwapTextField
              listCurrency={DUTCH_AUCTION_CURRENCY.filter(
                (item: any) => item?.value === values.staringCurrency,
              )}
              valueSelect={values.staringCurrency}
              helperText={touched.endingPrice && errors.endingPrice}
              handleChangeAmount={handleChangeEndingPrice}
              handleSelectionCurrency={handleSelectionEndingCurrency}
              amount={values.endingPrice}
              classCustomError="pl-4 text-xs"
              amountLabel="Amount"
              nameInput="amount"
              typeInput="text"
              disabled
              onWheel={(e: any) => e.target.blur()}
              onKeyPress={onKeyPress}
              onBlur={() => {
                setFieldTouched('endingPrice')
              }}
            />
            <div className="text-archive-Neutral-Variant70 mt-3 text-sm">
              <span>Service fee</span>
              <span className="text-secondary-60 font-bold">
                {' '}
                {values.staringCurrency === 'UMAD'
                  ? MARKET_RAW_FEE_BUY_TOKEN.umad
                  : MARKET_RAW_FEE_BUY_TOKEN.eth}
                %
              </span>
            </div>
            <div className="text-archive-Neutral-Variant70 mt-3 text-sm flex gap-1">
              <div> You will receive </div>
              <div className="text-secondary-60 font-bold truncate w-[70%]">
                {renderReceiveAmount(values.endingPrice, values.staringCurrency)}{' '}
                {values.staringCurrency.toUpperCase()}
              </div>
            </div>
          </>
        )}
        <div className="text-white font-bold lg:mt-8 mt-6 mb-2 flex justify-between text-sm">
          <div>Royalty fee</div>
          <div>{values?.collectionSelected?.royalty || 0}%</div>
        </div>
        <div className="text-xs	font-normal text-archive-Neutral-Variant70">
          Royalty fee is set up on the collection that NFT belongs to
        </div>
        {!isDutchAuction && (
          <div className="lg:mt-8 mt-6">
            <MoreOptions
              currency={values.startingEngAuctionCurrency}
              startPrice={values.reservePrice}
              helperText={touched.reservePrice && errors.reservePrice}
              handleChangeReserve={handleChangeReserve}
              reversePrice={isShowReversePrice}
              setReservePrice={setReservePrice}
              onBlur={handleBlur}
              nameInput="reservePrice"
              idAmount="reservePrice"
              onKeyPress={onKeyPress}
              {...getFieldProps('reservePrice')}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="lg:mt-8 mt-6">
      <div>
        <div className="flex flex justify-between items-center">
          <div className="flex">
            <p className="font-bold text-sm text-white mr-2">List your asset</p>
          </div>
          <SwitchControl isChecked={values.listYourAsset} parentCallback={setListYourAsset} />
        </div>
        <p className="text-archive-Neutral-Variant70 text-xs text-white font-normal">
          Enter price to allow users instantly purchase your NFT{' '}
        </p>
      </div>
      {values.listYourAsset && (
        <>
          <div className="lg:mt-8 mt-6">
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
                        <p className="absolute top-[30px] left-0 bg-[#1f262c] z-10 text-[10px] py-2 px-5 tooltip-text after:left-[196px]">
                          Choose “Fixed Price” for sell at a fixed price or “Time Auction” if you want to sell to highest bidder or declining price
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
                className={`mr-6 !font-Chakra ${
                  values.sellMethod === SELL_TYPE.FIX_PRICE
                    ? '!border-primary-60'
                    : '!border-background-700'
                }`}
                text="Fixed Price"
                Icon={
                  <FixedPrice
                    color={values.sellMethod === SELL_TYPE.FIX_PRICE ? '#F4B1A3' : '#525252'}
                  />
                }
                onClick={() => setFieldValue('sellMethod', SELL_TYPE.FIX_PRICE)}
              />
              <BigButton
                className={`${
                  values.sellMethod === SELL_TYPE.AUCTION
                    ? '!border-primary-60'
                    : '!border-background-700'
                }`}
                onClick={() => setFieldValue('sellMethod', SELL_TYPE.AUCTION)}
                text="Time Auction"
                Icon={
                  <TimeAuction
                    color={values.sellMethod === SELL_TYPE.AUCTION ? '#F4B1A3' : '#525252'}
                  />
                }
              />
            </div>
          </div>
          {values.sellMethod === SELL_TYPE.FIX_PRICE && renderFixedPrice()}
          {values.sellMethod === SELL_TYPE.AUCTION && renderTimeAuction()}
        </>
      )}
    </div>
  );
};

export default PriceDetail;
