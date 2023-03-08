import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box, Select, Input } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TonalButton } from 'components/common';
import * as React from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F4B1A3',
    },
    secondary: {
      main: '#B794F6',
    },
    background: {
      paper: '#363642',
    },
  },
});

export default function DropdownRange({ title, className }: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selected, setSelected] = React.useState<any>(null);
  const [obj, setObj] = React.useState<any>({});
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleSelection(e: any) {
    const { value } = e.target;
    if (value) setSelected(value);
  }

  function handlerImputChange(e: any) {
    let _obj = { ...obj } as any;
    const { value, name } = e.target;
    _obj[name] = value;
    setObj({ ..._obj });
  }
  return (
    <ThemeProvider theme={theme}>
      <div className={className}>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="outlined"
          color="secondary"
          className="text-dark-on-surface-variant h-[32px]  normal-case font-bold text-sm pr-2 normal-case hover:bg-background-dark-600 bg-background-dark-600"
        >
          {title}
          {open ? (
            <ArrowDropUpIcon sx={{ ml: 1, color: 'primary.main' }} />
          ) : (
            <ArrowDropDownIcon sx={{ ml: 1, color: 'primary.main' }} />
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
          sx={{ '> div': { color: 'white' }, ul: { p: '0px !important' } }}
        >
          <MenuItem className="flex flex-col p-0 bg-[#363642]">
            <Box className="min-w-[300px] p-5 bg-[#363642]">
              <Select
                labelId="swap-currency-select"
                id="demo-simple-select"
                value={selected}
                label=" currency"
                className="w-[100%] bg-[#363642]  text-[#ffff] border-[#b1afaf] border"
                onChange={handleSelection}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: ' unset !important',
                  },
                }}
              >
                <MenuItem value={10}>
                  <div className="flex flex-row items-center">
                    <img className="w-6 h-6 mr-3" src="./icons/weth.svg" alt="" />
                    <p className="text--label-large">WETH</p>
                  </div>
                </MenuItem>
                <MenuItem value={20}>
                  <div className="flex flex-row items-center">
                    <img className="w-6 h-6 mr-3" src="./icons/weth.svg" alt="" />
                    <p className="text--label-large">BTC</p>
                  </div>
                </MenuItem>
                <MenuItem value={30}>
                  <div className="flex flex-row items-center">
                    <img className="w-6 h-6 mr-3" src="./icons/weth.svg" alt="" />
                    <p className="text--label-large">SHIB</p>
                  </div>
                </MenuItem>
              </Select>
            </Box>
            <Box className="w-[300px] p-5 flex">
              <Input
                placeholder="Min"
                className="mr-2 w-[150px] text-[#ffff] border-[#b1afaf] border rounded-md p-2"
                sx={{
                  color: '#CED4E1',
                  '&::after, &::before': {
                    display: 'none',
                  },
                  '& .MuiInputLabel-root': {},
                }}
                name="min"
                value={obj?.min}
                type="number"
                onChange={handlerImputChange}
              />
              <Input
                placeholder="Max"
                className="ml-2 w-[150px] text-[#ffff] border-[#b1afaf] border rounded-md p-2"
                sx={{
                  color: '#CED4E1',
                  '&::after, &::before': {
                    display: 'none',
                  },
                  '& .MuiInputLabel-root': {},
                }}
                name="max"
                type="number"
                value={obj?.max}
                onChange={handlerImputChange}
              />
            </Box>
            <TonalButton
              customClass={`text--label-large none-active right-[130px] mb-5`}
              text="Apply"
              disabled={true}
            />
          </MenuItem>
        </Menu>
      </div>
    </ThemeProvider>
  );
}
