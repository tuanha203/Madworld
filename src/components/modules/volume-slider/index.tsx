import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { IconVolume } from 'components/common/iconography/IconBundle';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function VolumeSlider() {
    const [value, setValue] = useState<number | string>(30);

    const handleSliderChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    const handleInputChange = (event: any) => {
        setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 100) {
            setValue(100);
        }
    };

    return (
        <Box sx={{ width: 250 }}>
            {/* <Typography id="input-slider" gutterBottom>
                Volume
            </Typography> */}
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <IconVolume />
                </Grid>
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                {/* <Grid item>
                    <Input
                        value={value}
                        className="!text-white"
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 0,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid> */}
            </Grid>
        </Box>
    );
}