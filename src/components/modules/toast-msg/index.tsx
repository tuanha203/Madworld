import React from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface SnackbarCustomProps {
  severity: string;
  message: string;
  txHash?: string;
  open: boolean;
  handleClose: () => void;
}

const theme = createTheme({
  components: {
    MuiSnackbarContent: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: '14px',
          background: '#E4E4E4 !important',
        },
        action: {
          padding: '3px 2px',
          margin: '0px',
          width: '100%',
        },
      },
    },
  },
});

// @mui example
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const HIDE_DURATION_TIME = 7000;

export const anchorMsg = { vertical: 'top', horizontal: 'right' };

export const SnackbarCustom = ({
  severity,
  message,
  txHash,
  open,
  handleClose,
}: SnackbarCustomProps) => {
  const isSuccess = severity === 'success' || severity === 'info';

  const action = (
    <div className={`sm:flex xl:flex xl:items-center xl:justify-between w-full`}>
      <div className="flex items-center w-full">
        {isSuccess ? (
          <img src="/icons/toast-success.svg" alt="Success" />
        ) : (
          <img src="/icons/toast-error.svg" alt="Error" />
        )}
        <div
          className={`${isSuccess ? 'text-primary-50' : 'text-secondary-65'} font-Chakra ${
            txHash ? 'w-[50%]' : ''
          } lg:w-[unset] ml-2.5 `}
        >
          {message}
        </div>
        {txHash && (
          <a
            href={txHash}
            className="flex items-center ml-3 2xl:ml-8 hover:bg-gray-300 2xl:p-2 rounded w-[50%] lg:w-[unset]"
            target={'_blank'}
          >
            <img src="/icons/icon-hypelink.svg" alt="View on Etherscan" />
            <div className="text-primary-50 ml-2.5 font-Chakra">View on Etherscan</div>
          </a>
        )}
      </div>
      <div className="flex items-end justify-end ">
        <IconButton
          aria-label="close"
          onClick={handleClose}
          className="text-primary-50 h-9 w-20 rounded uppercase text-base ml-8 font-Chakra"
        >
          CLOSE
        </IconButton>
      </div>
    </div>
  );
  return (
    <ThemeProvider theme={theme}>
      {open && (
        <Snackbar
          open={open}
          autoHideDuration={HIDE_DURATION_TIME}
          anchorOrigin={anchorMsg as any}
          action={action}
          onClose={handleClose}
        />
      )}
    </ThemeProvider>
  );
};
