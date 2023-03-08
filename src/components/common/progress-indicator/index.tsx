import { FC } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { BackdropProps } from '@mui/material';

export const LinearProgressBar = () => {
  return (
    <Box className="linear-progress" sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
};

export const LinearProgressBarSecondary = () => {
  return (
    <Box className="linear-progress-secondary" sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
};

interface ICircularProgressIndicatorProps {
  size?: number;
  className?: string;
}

function CircularProgressIndicator({ size, className }: ICircularProgressIndicatorProps) {
  return (
    <Box className={`circular-progress ${className || ''}`} sx={{ display: 'flex' }}>
      <CircularProgress size={size} />
    </Box>
  );
}

interface IBackdropCircularProgressProps {
  open: boolean;
}

export const BackdropCircularProgress: FC<IBackdropCircularProgressProps & BackdropProps> = ({
  open,
  ...rest
}) => {
  return (
    <Backdrop open={open} className="absolute flex flex-col items-center justify-center" {...rest}>
      <CircularProgressIndicator className="justify-center" />
    </Backdrop>
  );
};

export default CircularProgressIndicator;
