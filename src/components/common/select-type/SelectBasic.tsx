import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useSelector } from 'react-redux';
import OverflowTooltip from '../tooltip/OverflowTooltip';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B794F6',
    },
    background: {
      paper: '#3E3F4D',
    },
  },
});

export default function SelectBasic({
  title,
  className,
  selected,
  setSelected,
  nameTypes,
  isDisabled = false,
}: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { button, icon, text } = useSelector((state: any) => state.theme);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        className={`${className} font-Chakra ${isDisabled ? 'opacity-20 cursor-not-allowed' : ''}`}
      >
        <Button
          style={{ ...button?.outline }}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="outlined"
          className={`w-full font-Chakra bg-background-dark-600 text-dark-on-surface-variant h-[32px] font-bold text-sm pr-2 normal-case hover:bg-background-dark-600 border-primary-90 hover:border-secondary-60 ${
            isDisabled ? 'cursor-not-allowed' : ''
          }`}
        >
          <span className="text-ellipsis max-w-full">{selected?.name || title}</span>
          {open ? (
            <ArrowDropUpIcon style={icon} className="ml-1 text-secondary-60" />
          ) : (
            <ArrowDropDownIcon style={icon} className="ml-1 text-secondary-60" />
          )}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            '> div': { color: 'white', bgcolor: 'transparent' },
            ul: { p: '0px !important' },
            text,
          }}
        >
          <MenuItem onClick={handleClose} className="flex flex-col p-0">
            <CheckboxList
              buttonColor={button}
              nameTypes={nameTypes}
              selected={selected}
              setSelected={setSelected}
            />
          </MenuItem>
        </Menu>
      </div>
    </ThemeProvider>
  );
}

function CheckboxList({ nameTypes, selected, setSelected, buttonColor }: any) {
  const handleClick = (value: any) => () => {
    setSelected(value);
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {nameTypes.map((element: any, index: number) => {
        const labelId = `checkbox-list-label-${element?.value}`;
        return (
          <ListItem
            key={`${index}_checkbox`}
            disablePadding
            className={`w-[206px] ${
              !buttonColor?.default ? ' hover:bg-primary-dark' : ''
            } rounded-md ${selected?.value === element?.value ? 'text-primary-90' : ''}`}
            sx={{
              color: selected?.value === element?.value ? buttonColor?.outline?.color : '',
              span: { fontFamily: 'Chakra Petch !important' },
              '&:hover': {
                backgroundColor: `${buttonColor?.default?.background}`,
                color: 'white !important',
              },
            }}
          >
            <ListItemButton
              className="py-[10px] px-4"
              role={undefined}
              onClick={handleClick(element)}
              dense
            >
              <OverflowTooltip
                className="text-[16px] leading-tight w-[100%] font-Chakra"
                title={element.name}
              >
                <>{element.name}</>
              </OverflowTooltip>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
