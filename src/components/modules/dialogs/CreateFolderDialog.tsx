import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextButton, OutlinedButton } from 'components/common/buttons';

export default function CreateFolderDialog({ scheme }: any) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Open form dialog
            </Button>

            <Dialog
                className={`create-folder-dialog mad-dialog ${scheme}`}
                open={open} onClose={handleClose}>

                <DialogTitle>Folder Name</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="folder"
                        label="Untitled Folder"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <TextButton customClass="!text--label-large" scheme={scheme} text="Cancel" onClick={handleClose}></TextButton>
                    <TextButton customClass="!text--label-large" scheme={scheme} text='Create' onClick={handleClose}></TextButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}


CreateFolderDialog.defaultProps = {
    // light / dark 
    scheme: "dark"
}