import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';

export default function MadMobileTimePicker() {
    const [value, setValue] = useState(new Date('2018-01-01T00:00:00.000Z'));
    const refMobileTimePicker = useRef()

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileTimePicker
                ref={refMobileTimePicker as any}
                className='mobile-time-picker'
                label="Select Time"
                value={value}
                onChange={(newValue: any) => {
                    setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}
