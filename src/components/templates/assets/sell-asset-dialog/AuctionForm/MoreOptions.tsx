import { FC, useRef, useState } from 'react';
import { Switch, Tooltip, Collapse, Stack } from '@mui/material';
import SwapTextField from 'components/common/textFieldMakeOffer/SwapTextField';
import { AUCTION_CURRENCY, SELL_CURRENCY, useStylesTooltipFontSize12, WINDOW_MODE } from 'constants/app';
import { ArrowDropDown, IconInfoOutline } from 'components/common/iconography/IconBundle';
import ContentTooltip from 'components/common/tooltip/ContentTooltip';
import useDetectWindowMode from "hooks/useDetectWindowMode";
import { useOnClickOutside } from "utils/hook";

interface IMoreOptionsProps {
  currency?: string;
  helperText?: any;
  startPrice?: string;
  handleChangeReserve: any;
  reversePrice: boolean;
  setReservePrice: any;
  onBlur: any;
  idAmount?: string;
  nameInput?: string;
}

const MoreOptions: FC<IMoreOptionsProps> = (props) => {
  const {
    currency,
    startPrice,
    helperText,
    handleChangeReserve,
    reversePrice,
    setReservePrice,
    onBlur,
    idAmount,
    nameInput,
  } = props;
  const useStylesTooltip = useStylesTooltipFontSize12();
  const [showMore, setShowMore] = useState<boolean>(false);
  const [showTooltipText, setShowTooltipText] = useState<boolean>(false)
  const ref: any = useRef();
  const windowMode = useDetectWindowMode();

  useOnClickOutside(ref, () => {
    setShowTooltipText(false);
  });

  return (
    <Stack className='remove-background-color' spacing={1}>
      <Collapse className='remove-background-color' in={showMore}>
        <div className="flex justify-between relative">
          <div className="flex gap-2 my-auto">
            <div className="text-white font-bold text-sm">Include reserve price</div>
              {
                [WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode) ? (
                  <>
                    <div onClick={() => setShowTooltipText(true)} ref={ref}>
                      <IconInfoOutline/>
                    </div>
                    {
                      showTooltipText && (
                        <p className="absolute top-[30px] left-0 bg-[#1f262c] z-10 text-[10px] py-2 px-5 tooltip-text after:left-[157px] after:top-[-0.5rem]">
                          If you don't receive any bids equal to or greater than your reserve, the auction will end without a sale.
                        </p>
                      )
                    }
                  </>
                ) : (
                  <ContentTooltip
                    classes={useStylesTooltip}
                    title={`If you don't receive any bids equal to or greater than your reserve, the auction will end without a sale.`}
                    arrow
                    placement="bottom"
                  >
                    <img src="/icons/warning-icon.svg" alt="" />
                  </ContentTooltip>
                )
              }
          </div>
          <div>
            <Switch
              checked={reversePrice}
              onChange={() => {
                setReservePrice(!reversePrice);
              }}
            />
          </div>
        </div>
        <div className="text-archive-Neutral-Variant70 text-xs mb-3">
          Bids below this amount won’t be allowed.
        </div>
        <Collapse in={reversePrice}>
          <SwapTextField
            listCurrency={AUCTION_CURRENCY.filter((item: any) => item?.value === currency)}
            valueSelect={currency}
            helperText={helperText}
            handleChangeAmount={handleChangeReserve}
            amount={startPrice}
            disabled={true}
            amountLabel="Amount"
            nameInput={nameInput}
            onBlur={onBlur}
            idAmount={idAmount}
          />
        </Collapse>
      </Collapse>
      <div
        className="flex gap-2 items-center text-primary-90 text--label-large cursor-pointer remove-background-color"
        onClick={() => {
          setShowMore(!showMore);
          setReservePrice(false);
        }}
      >
        <span className="w-[100px]">{showMore ? 'Fewer options' : 'More options'}</span>
        <ArrowDropDown
          className={`transition duration-300 duration-300 ${showMore ? 'rotate-180' : ''}`}
        />
      </div>
    </Stack>
  );
};

export default MoreOptions;
