import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { IconMadOutlined } from '../iconography/IconBundle';

interface ISwapFixedTextField {
  helperText: string;
  value?: string;
  onchange?: (value: string) => void;
  error?: boolean;
  type?: string;
}

export default function SwapFixedTextField({
  helperText,
  value,
  onchange,
  error,
  type,
}: ISwapFixedTextField) {
  // const handleChange = (prop) => (event) => {
  //     setValue({ ...values, [prop]: event.target.value });
  // };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onchange && onchange(event.target.value);
  };

  function SwapFixedCurrency() {
    return (
      <div className="w-[148px] flex items-center gap-3 text-white">
        <IconMadOutlined />
        <h2 className="text--label-large">UMAD</h2>
        <div className="w-[1px] h-full bg-archive-Neutral-Variant30 absolute left-[149px]"></div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex swap-current-textField-input swap-fixed-currency w-full`}
      >
        <TextField
          error={error}
          helperText={helperText}
          className="currency-textField"
          id="filled-start-adornment"
          value={value}
          onChange={handleChange}
          type={type}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SwapFixedCurrency />
              </InputAdornment>
            ),
          }}
          variant="filled"
        />
      </div>
      
    </>
  );
}

SwapFixedTextField.defaultProps = {
  helperText: '',
};

SwapFixedTextField.prototype = {
  helperText: PropTypes.string,
};
