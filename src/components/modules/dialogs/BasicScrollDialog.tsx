import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { OutlinedButton, TextButton } from 'components/common/buttons';
import { IconMobileCheck, IconMobileCheckDarken } from 'components/common/iconography/IconBundle';

export default function BasicScrollDialog({ scheme }: any) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <OutlinedButton onClick={handleClickOpen} text="Open alert dialog" />
      <Dialog
        className={`basic-alert-dialog mad-dialog ${scheme}`}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="flex items-center justify-center w-full pt-3">
          {scheme == 'dark' ? <IconMobileCheck /> : <IconMobileCheckDarken />}
        </div>
        <DialogTitle id="alert-dialog-title" className="text-center">
          {'Dialog with hero icon'}
        </DialogTitle>
        <DialogContent>
          <p className="h-[50px]">Changes you made so far will not be saved</p>
        </DialogContent>
        <DialogActions>
          <TextButton
            customClass="!text--label-large"
            scheme={scheme}
            text="Action 2"
            onClick={handleClose}
          ></TextButton>
          <TextButton
            customClass="!text--label-large"
            scheme={scheme}
            text="Action 1"
            onClick={handleClose}
          ></TextButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

BasicScrollDialog.defaultProps = {
  // light / dark
  scheme: 'dark',
};
