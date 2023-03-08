import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { IconMadOutlined } from '../iconography/IconBundle';



export default function PercentRoyaltyTextField() {
    const [value, setValue] = useState<string>();

    // const handleChange = (prop) => (event) => {
    //     setValue({ ...values, [prop]: event.target.value });
    // };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    function SwapFixedCurrency() {
        return (
            <div className="w-[148px] flex items-center gap-3 text-white justify-center">
                <p className="text-secondary-60">%</p>
                <h2 className="text--label-large">Percentage</h2>
                <div className="w-[1px] h-full bg-archive-Neutral-Variant30 absolute left-[149px]"></div>
            </div>
        );
    }

    return (
        <div className="flex swap-current-textField-input swap-fixed-currency w-full">
            <TextField
                sx={{ p: 0, "input": { px: 3 }, "> div" : {p: 0} }}
                className="currency-textField"
                id="filled-start-adornment"
                value={value}
                onChange={handleChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SwapFixedCurrency />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end" className="pr-6">
                            <p className="bold text-medium-emphasis">UMAD</p>
                        </InputAdornment>
                    )
                }}
                variant="filled"
            />
        </div>
    );
}

