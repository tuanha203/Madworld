import { FC, Dispatch, SetStateAction, useState, MouseEvent } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1EFCF1',
    },
    background: {
      paper: '#3E3F4D',
    },
  },
});

interface saleTypeItem {
  label: string, value: string
}

interface IDropdownSelect {
  title: string;
  className?: string;
  listSaleType: Array<saleTypeItem>;
  listChecked: string[];
  setListChecked: Dispatch<SetStateAction<string[]>>;
  IconStarts?: JSX.Element[];
  iconColor?: any;
  buttonColor?: any;
}

function CheckboxList({ listChecked, setListChecked, listSaleType, IconStarts, iconColor, buttonColor }: any) {
  const showIconStart = IconStarts && IconStarts.length == listSaleType.length;

  const handleToggle = (value: string) => () => {
    const currentIndex = listChecked.indexOf(value);
    const newListChecked = [...listChecked];

    if (currentIndex === -1) {
      newListChecked.push(value);
    } else {
      newListChecked.splice(currentIndex, 1);
    }

    setListChecked(newListChecked);
  };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', fontFamily: 'Chakra Petch' }}>
      {listSaleType.map(({ label, value }: saleTypeItem, index: number) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem sx={{
            '&:hover': {
              backgroundColor: `${buttonColor?.default?.background} !important`,
            },
          }} key={value} disablePadding className="hover:bg-primary-dark font-Chakra">
            <ListItemButton
              className={`${showIconStart ? 'pl-[12px]' : ''} font-Chakra`}
              role={undefined}
              onClick={handleToggle(value)}
              dense
            >
              {showIconStart ? <ListItemIcon>{IconStarts[index]}</ListItemIcon> : null}
              <ListItemText sx={{ span: { fontSize: '16px', fontFamily: 'Chakra Petch !important' } }} id={labelId}>
                <div className="truncate">
                  {label}
                </div>
              </ListItemText>
              <ListItemIcon className="pl-8">
                <Checkbox
                  edge="end"
                  checked={listChecked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  sx={{
                    color: iconColor ? iconColor.color : '#B794F6',
                    '&.Mui-checked': {
                      color: iconColor ? iconColor.color : '#B794F6',
                    },
                  }}
                />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

const DropdownSelect: FC<IDropdownSelect> = (props) => {
  const { title, className, listSaleType, listChecked, setListChecked, IconStarts } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { button, icon } = useSelector((state:any) => state.theme);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={`${className} font-Chakra`}>
        <Button
          style={button?.outline}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="outlined"
          className="font-Chakra bg-background-dark-600 border-primary-90 text-dark-on-surface-variant h-[32px] font-bold text-sm pr-2 normal-case hover:bg-background-dark-600 hover:border-secondary-60"

        >
          {title}
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
          sx={{ '> div': { color: '#FFF', bgcolor: 'transparent' }, ul: { p: '0px !important' } }}
        >
          <MenuItem className="flex flex-col p-0 font-Chakra">
            <CheckboxList {...{ listSaleType, listChecked, setListChecked, IconStarts, iconColor: icon, buttonColor: button }} />
          </MenuItem>
        </Menu>
      </div>
    </ThemeProvider>
  );
};

export default DropdownSelect;
