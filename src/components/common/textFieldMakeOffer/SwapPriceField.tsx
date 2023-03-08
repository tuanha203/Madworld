import { FC, useState, ReactNode } from 'react';
import TextField from '@mui/material/TextField';
import { TextFieldProps, SelectChangeEvent } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { SELL_CURRENCY } from 'constants/app';
import get from 'lodash/get';
import { CurrencyType } from 'components/modules/MakeAnOfferModal/MakeAnOffer';
import { IconDynamic } from '../iconography/IconBundle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface ISwapTextField {
  amount?: any;
  amountLabel?: string;
  amountType?: string;
  helperText?: any;
  listCurrency: Array<CurrencyType>;
  label?: ReactNode;
  required?: boolean;
  handleChangeAmount?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectionCurrency?: (event: any) => void;
  nameInput?: string;
  valueSelect?: string;
  typeInput?: string;
  disabled?: boolean;
}

function SwapPriceField({
  amount,
  amountLabel,
  amountType,
  listCurrency,
  handleChangeAmount,
  handleSelectionCurrency,
  helperText,
  label,
  required,
  nameInput,
  valueSelect,
  typeInput,
  disabled = false,
}: ISwapTextField & TextFieldProps) {
  // const [currency, setCurrency] = useState(get(listCurrency, '[0].value', ''));
  function CustomSvgIcon(props?: any) {
    return (
      <SvgIcon {...props}>
        <path color="white" d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
      </SvgIcon>
    );
  }

  return (
    <>
      <div className="w-full">
        {label && (
          <div className="mb-2 text-white font-bold">
            {label}
            {required && <span className="text-secondary-60">*</span>}
          </div>
        )}
        <div className="flex swap-current-textField-input w-full">
          <FormControl variant="filled" className="currency-selection">
            <Select
              labelId="swap-currency-select"
              id="demo-simple-select"
              sx={{
                '.Mui-disabled': {
                  WebkitTextFillColor: 'rgba(255,246, 246,0.38) !important',
                  color: 'rgba(255,246, 246,0.38) !important',
                },
              }}
              value={valueSelect}
              label="currency"
              disabled={disabled}
              onChange={handleSelectionCurrency}
              IconComponent={ArrowDropDownIcon}
            >
              {listCurrency?.map((ele: any, index: any) => {
                return (
                  <MenuItem value={ele.value} key={index}>
                    <div className="flex flex-row items-center">
                      <img className="w-6 h-6 mr-3" src={ele.image} alt="" />
                      <p className="text--label-large">{ele.text}</p>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            className="currency-textField"
            id="filled-basic"
            value={amount}
            onChange={handleChangeAmount}
            label={amountLabel}
            type={typeInput}
            variant="filled"
            name={nameInput}
            autoComplete="off"
          />
        </div>
        {helperText && <p className="text-error-60 mt-1 text--body-small">{helperText}</p>}
      </div>
    </>
  );
}

SwapPriceField.defaultProps = {
  helperText: '',
  listCurrency: SELL_CURRENCY,
};

export default SwapPriceField;
