import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextButton, OutlinedButton } from 'components/common/buttons';
import { CheckBoxControl } from 'components/common/selectionControls';
import { IconDoc } from 'components/common/iconography/IconBundle';

export default function FreezingMetaDataDialog({ scheme }: any) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <OutlinedButton onClick={handleClickOpen} text="Open Freezing meta dialog" />
      <Dialog
        className={`freezing-metadata-dialog mad-dialog ${scheme}`}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className=" w-full flex items-center justify-center pt-6">
          <IconDoc />
        </div>
        <DialogTitle id="alert-dialog-title">{'Freezing MetaData'}</DialogTitle>
        <DialogContent>
          <div className="flex flex-row gap-2 ">
            <div>
              <CheckBoxControl />
            </div>
            <p>
              I understand that by locking my metadata, my content is permanently stored in
              decentralized file storage (IPFS) and cannot be edited nor removed. All of my content
              is exactly how it's intended to be presented.
            </p>
          </div>
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

FreezingMetaDataDialog.defaultProps = {
  // light / dark
  scheme: 'dark',
};
