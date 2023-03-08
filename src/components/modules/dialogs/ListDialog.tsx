import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { OutlinedButton, TextButton } from 'components/common/buttons';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { CheckBoxControl } from 'components/common/selectionControls';
import Divider from 'components/common/divider';

export default function ListDialog({ scheme }: any) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [checked, setChecked] = React.useState([1]);

  const handleToggle = (value: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
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
        <DialogTitle id="alert-dialog-title">{'Basic dialog title'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Changes you made so far will not be saved
          </DialogContentText>

          <div>
            <List
              dense
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'transparent', color: '#BEC9C7' }}
            >
              {[0, 1, 2].map((value, index) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (
                  <>
                    <ListItem
                      key={value}
                      secondaryAction={
                        <CheckBoxControl
                          edge="end"
                          inputProps={{ 'aria-labelledby': labelId }}
                          onChange={handleToggle(value)}
                          checked={checked.indexOf(value) !== -1}
                        />
                      }
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar alt={`Avatar n°${value + 1}`} src="" />
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
                      </ListItemButton>
                    </ListItem>
                    <Divider customClass="my-1" />
                  </>
                );
              })}
            </List>
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

ListDialog.defaultProps = {
  // light / dark
  scheme: 'dark',
};
