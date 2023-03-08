import { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarCloseReason } from '@mui/material';
import { TextButton } from '../buttons';

export const SnackbarOneLine = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (_: any, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    // console.log('click');

    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClick}>Open one line snackbar</Button>
      <Snackbar
        sx={{ maxWidth: 340 }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="One line text string."
      />
    </div>
  );
};

export const SnackbarOneLineAction = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (_: any, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <TextButton onClick={handleClose} text="ACTION" />
      <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpen(false)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      <Button onClick={handleClick}>Open one line Action snackbar</Button>
      <Snackbar
        sx={{ maxWidth: 340 }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="One line text string with one action."
        action={action}
      />
    </div>
  );
};

export const SnackbarTwoLines = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (_: any, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClick}>Open 2 line snackbar</Button>
      <Snackbar
        sx={{ maxWidth: 340 }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={`Two lines with one action. One to two lines is preferable on mobile.`}
      />
    </div>
  );
};

export const SnackbarTwoLinesAction = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (_: any, reason: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <TextButton onClick={handleClose} text="Long text button" />
      <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpen(false)}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      <Button onClick={handleClick}>Open 2 line action snackbar</Button>
      <Snackbar
        sx={{ maxWidth: 340 }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={`Two lines with longer text action. One to two lines is preferable on mobile and tablet.`}
        action={action}
      />
    </div>
  );
};
