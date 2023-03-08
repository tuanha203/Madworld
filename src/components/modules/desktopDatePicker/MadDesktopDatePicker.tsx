import * as React from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

export default function MadDesktopDatePicker() {
    const [value, setValue] = React.useState(new Date());

    return (
        <LocalizationProvider className="date-picker" dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                className='desktop-date-picker'
                label="For desktop"
                value={value}
                minDate={new Date('2017-01-01')}
                onChange={(newValue: any) => {
                    setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}
