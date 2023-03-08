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
import ContentTooltip from '../tooltip/ContentTooltip';
import { useSelector } from 'react-redux';

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
  onBlur?: any;
  classCustomError?: any;
  tooltip?: string;
  idAmount?: any;
  bgTextFieldDynamic?: string;
}

function SwapTextField({
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
  onBlur,
  disabled = false,
  classCustomError,
  tooltip,
  idAmount,
  bgTextFieldDynamic = '',
  ...rest
}: ISwapTextField & TextFieldProps) {
  // const [currency, setCurrency] = useState(get(listCurrency, '[0].value', ''));
  const { text, icon } = useSelector((state:any) => state.theme);
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
        <div
          className={`flex ${
            bgTextFieldDynamic ? bgTextFieldDynamic : 'swap-current-textField-input'
          } w-full`}
        >
          <FormControl variant="filled" className="currency-selection w-[31%]">
            <Select
              labelId="swap-currency-select"
              id="demo-simple-select"
              sx={{
                '.Mui-disabled > div': {
                  WebkitTextFillColor: '#E7ECEE !important',
                  color: '#E7ECEE !important',
                },
                svg: {
                  color: `${
                    disabled
                      ? `${icon?.color || '#f4b1a333'} !important`
                      : `${icon?.color || '#F4B1A3'} !important`
                  }`,
                  WebkitTextFillColor: `${
                    disabled
                      ? `${icon?.color || '#f4b1a333'} !important`
                      : `${icon?.color || '#F4B1A3'} !important`
                  }`,
                },
              }}
              value={valueSelect}
              label="currency"
              disabled={disabled}
              onChange={handleSelectionCurrency}
              IconComponent={ArrowDropDownIcon}
              disableUnderline
              className="background-test"
            >
              {listCurrency?.map((ele: any, index: any) => {
                return (
                  <MenuItem value={ele.value} key={index}>
                    <div className="flex flex-row items-center">
                      <img className="w-6 h-6 lg:mr-3 mr-2" src={ele.image} alt="" />
                      <p
                        className="text--label-large"
                        style={valueSelect === ele.value ? text : {}}
                      >
                        {ele.text}
                      </p>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <TextField
            className="currency-textField w-[69%] text--subtitle !text-light-on-primary"
            id={idAmount}
            value={amount}
            onChange={handleChangeAmount}
            label={amountLabel}
            type={typeInput}
            variant="filled"
            name={nameInput}
            autoComplete="off"
            onBlur={onBlur}
            sx={{
              '& .MuiFilledInput-root::after': {
                borderColor: `${text?.color || ''} !important`,
              },
            }}
            {...rest}
          />
        </div>
        {helperText && (
          <ContentTooltip title={tooltip || ''}>
            <p className={`text-error-60 mt-1 !text--body-small ${classCustomError}`}>
              {helperText}
            </p>
          </ContentTooltip>
        )}
      </div>
    </>
  );
}

SwapTextField.defaultProps = {
  helperText: '',
  listCurrency: SELL_CURRENCY,
};

export default SwapTextField;
