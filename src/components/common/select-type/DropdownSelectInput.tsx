import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Button, Checkbox, Collapse, Divider, FormControl, FormControlLabel, Select } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { IPriceRangeType } from 'components/templates/collection/asset';
import { TOKEN } from 'constants/app';
import _ from 'lodash';
import { Dispatch, FC, MouseEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { addCommaToNumber } from 'utils/currencyFormat';
import { IconDynamic } from '../iconography/IconBundle';
import IconLocal from '../iconography/IconLocal';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const LIST_CURRENCY = [
  {
    value: TOKEN.UMAD,
    text: TOKEN.UMAD,
    image: '/icons/mad_icon_outlined.svg',
  },
  {
    value: TOKEN.WETH,
    text: TOKEN.WETH,
    image: '/icons/weth.svg',
  },
  {
    value: TOKEN.ETH,
    text: TOKEN.ETH,
    image: '/icons/Eth.svg',
  },
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#F4B1A3',
    },
    background: {
      paper: '#373D4A',
    },
  },
});

export const DEFAULT_CURRENCY_PRICE_RANGE = LIST_CURRENCY[0].value

interface IDropdownSelectInput {
  titleDefault?: string;
  className?: string;
  nameTypes?: string[];
  checked?: string[];
  setChecked?: Dispatch<SetStateAction<string[]>>;
  IconStarts?: JSX.Element[];
  priceRange: IPriceRangeType;
  setPriceRange: (price: IPriceRangeType) => void;
  isReset?: boolean;
}

const DropdownSelectInput: FC<IDropdownSelectInput> = (props) => {
  const { titleDefault, priceRange, setPriceRange, isReset } = props;
  const { min, max, currency } = priceRange;
  const { button, icon, text } = useSelector((state: any) => state.theme);
  const [minValue, setMinValue] = useState<any>(null);
  const [maxValue, setMaxValue] = useState<any>(null);
  const [currencyValue, setCurrencyValue] = useState(TOKEN.UMAD);
  const [error, setError] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectionCurrency = (event: any) => {
    setCurrencyValue(event.target.value);
  };

  const handleChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMinValue(value.replace(/[^0-9.]/g, ''));
    if (value.split('.').length > 2) {
      setMinValue(value.replace(/.$/, ''));
    }
  };

  const handleChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMaxValue(value.replace(/[^0-9.]/g, ''));
    if (value.split('.').length > 2) {
      setMaxValue(value.replace(/.$/, ''));
    }
  };

  const handleApply = () => {

    if ((minValue || maxValue) && minValue !== 0 && maxValue !== 0 && !error) {
      const price = {
        min: minValue === '' ? '' : Number(minValue).toFixed(2),
        max: maxValue === '' ? '' : Number(maxValue).toFixed(2),
        currency: currencyValue,
      };
      setPriceRange(price);
      setAnchorEl(null);
    } else {
      const price = {
        min: '',
        max: '',
        currency: '',
      };
      setPriceRange(price);
    }
  };

  useEffect(() => {

    if (minValue !== '' && maxValue !== '' && minValue !== 0 && maxValue !== 0 && Number(minValue) > Number(maxValue)) {
      setError(true);
    } else {
      setError(false);
    }
  }, [minValue, maxValue, currency]);

  useEffect(() => {
    if (!isReset) {
      setMinValue('');
      setMaxValue('');
      setCurrencyValue(TOKEN.UMAD);
    }
  }, [isReset]);

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-background-700 h-max font-Chakra">
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
          {min || max ? (
            <div className="flex">
              <IconDynamic
                className="mr-2 w-[18px] h-[18px]"
                image={LIST_CURRENCY.find((currencyItem) => currencyItem.text === currency)?.image}
              />
              {`${currency} : ${min === '' ? '0' : addCommaToNumber(min)} - ${max === '' ? '~' : addCommaToNumber(max)}`}
            </div>
          ) : (
            titleDefault
          )}
          {open ? (
            <ArrowDropUpIcon style={icon} sx={{ ml: 1, color: 'primary.main' }} />
          ) : (
            <ArrowDropDownIcon style={icon} sx={{ ml: 1, color: 'primary.main' }} />
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
          sx={{ ul: { p: '0px !important' } }}
        >
          <MenuItem className="bg-background-700 flex flex-col px-4 pt-9 pb-4 w-full font-Chakra">
            <div className="swap-current-textField-input">
              <FormControl className="filter-selection min-w-[275px]">
                <Select sx={{
                  'fieldset': {
                    borderColor: `${button?.outline?.color}`
                  }
                }} value={currencyValue} onChange={handleSelectionCurrency} displayEmpty>
                  {LIST_CURRENCY?.map((ele: any, index: any) => {
                    return (
                      <MenuItem
                        value={ele.value}
                        key={index}
                        sx={{
                          ':hover': {
                            backgroundColor: button ? `${button?.default?.background} !important` : '#7340d3 !important',
                          },
                        }}
                      >
                        <div className="flex flex-row items-center text-light-on-primary font-Chakra">
                          <img className="w-6 h-6 mr-3" src={ele.image} alt="" />
                          <p className="text--label-large font-Chakra">{ele.text}</p>
                        </div>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <div className="flex justify-between mt-3 mb-1 font-Chakra">
                <FormControl className="flex w-[130px]" variant="outlined">
                  <OutlinedInput
                    className="text-light-on-primary custom-input text-base font-Chakra"
                    id="outlined-adornment-weight"
                    value={minValue}
                    onChange={handleChangeMin}
                    aria-describedby="outlined-weight-helper-text"
                    placeholder="Min"
                    type="string"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: button ? `${button?.outline?.color}` : '#889391 !important'
                      },
                    }}
                  />
                </FormControl>
                <FormControl className="flex w-[130px]" variant="outlined">
                  <OutlinedInput
                    className="text-light-on-primary custom-input text-base font-Chakra"
                    value={maxValue}
                    onChange={handleChangeMax}
                    aria-describedby="outlined-weight-helper-text"
                    placeholder="Max"
                    type="string"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: button ? `${button?.outline?.color}` : '#889391 !important'
                      },
                    }}
                  />
                </FormControl>
              </div>
              {error ? (
                <p className="text-sm text-error-50 font-Chakra">
                  Minimum must be less than maximum
                </p>
              ) : null}
              <p
                onClick={() => {
                  if (!error) handleApply()
                }}
                style={text}
                className={`font-bold text-sm text-primary-90 mt-3 font-Chakra ${error && 'text-archive-Neutral-Variant30'}`}
              >
                Apply
              </p>
            </div>
          </MenuItem>
        </Menu>
      </div>
    </ThemeProvider>
  );
};

export default DropdownSelectInput;



export function DropdownSelectInputMobile(props: any) {
  const [open, setOpen] = useState(false);
  const { title, priceRange, setPriceRange, isReset } = props;
  const { min, max, currency } = priceRange;
  const [error, setError] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);
  const { button, icon, text } = useSelector((state: any) => state.theme);

  const handleSelectionCurrency = (event: any) => {
    setPriceRange({ ...priceRange, currency: event.target.value })
  };

  const handleChangeMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let minValue = value.replace(/[^0-9.]/g, '')
    if (value.split('.').length > 2) {
      minValue = value.replace(/.$/, '')
    }
    setPriceRange({ ...priceRange, min: minValue })

  };

  const handleChangeMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let maxValue = value.replace(/[^0-9.]/g, '')
    if (value.split('.').length > 2) {
      maxValue = value.replace(/.$/, '')
    }
    setPriceRange({ ...priceRange, max: maxValue })
  };

  const handleChange = () => {
    if (checked) {
      const price = {
        min: '',
        max: '',
        currency: DEFAULT_CURRENCY_PRICE_RANGE,
      };
      setChecked(false)
      setPriceRange(price);
    } else {
      if (min && max)
        setChecked(true)
    }
  }

  useEffect(() => {
    if (min !== 0 && max !== 0 && Number(min) > Number(max)) {
      setError(true);
      setChecked(false)
    } else {
      setError(false);
      if (min && max) {
        setChecked(true)
      } else {
        setChecked(false)
      }
    }
  }, [min, max, currency]);


  /*   useEffect(() => {
      if (!isReset) {
        setMinValue('');
        setMaxValue('');
        setCurrencyValue(TOKEN.UMAD);
      }
    }, [isReset]); */

  return (
    <div className={`font-normal `}>
      <FormControlLabel
        label=""
        sx={{
          border: "none !important"
        }}
        control={
          <div className="flex w-full relative">
            <Checkbox
              checked={checked}
              onChange={handleChange}
              className={`Madcheckbox ${!icon ? "!text-[#BBA2EA]" : ""}`}
              sx={{
                color: icon ? `${icon?.color} !important` : '',
              }}
            />
            <span className="self-center">{title}</span>
            <Button
              className={`flex ${open ? 'justify-start' : 'justify-end'} absolute right-[-3px]  ${open && 'rotate-180'
                }`}
              onClick={() => setOpen(!open)}
            >
              <KeyboardArrowDownIcon style={{ ...icon, fontSize: "32px" }} />

            </Button>
          </div>
        }
        className={`flex mr-[0] ${open ? "border-solid border-b border-neutral-600" : ""}`}
      />

      {
        <Divider className="w-screen relative right-[24px] h-[1px] mt-3" />
      }

      <Collapse sx={{
        backgroundColor: "#050119",
        width: "100vw",
        position: "relative",
        left: "-24px",
        paddingTop: "8px",
        ".MuiCollapse-wrapperInner": {
          paddingX: "48px"
        }
      }} in={open} timeout="auto" unmountOnExit>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            ml: 6,
            gap: '8px',
            marginY: '10px',
            marginLeft: '0px !important',
            maxHeight: '400px !important',
            overflowY: 'auto',
          }}
          className="scroll-filter-collections scroll-hidden"
        >
          <div className="swap-current-textField-input">
            <FormControl className="filter-selection w-full">
              <Select sx={{
                "& fieldset": {
                  borderColor: button?.outline?.color || ""
                },
                "& svg": {
                  color: `${icon?.color} !important` || ""
                }
              }} value={currency} onChange={handleSelectionCurrency} displayEmpty>
                {LIST_CURRENCY?.map((ele: any, index: any) => {
                  return (
                    <MenuItem
                      value={ele.value}
                      key={index}
                      sx={{
                        '&:hover': {
                          backgroundColor: button ? `${button?.default?.background} !important` : '#7340d3 !important',
                        },
                      }}
                    >
                      <div className="flex flex-row items-center text-light-on-primary font-Chakra">
                        <img className="w-6 h-6 mr-3" src={ele.image} alt="" />
                        <p className="text--label-large font-Chakra">{ele.text}</p>
                      </div>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div className="flex justify-between mt-5 mb-1 font-Chakra">
              <FormControl className="flex w-[130px] !min-w-[0px]" variant="outlined">
                <OutlinedInput
                  className="text-light-on-primary custom-input text-base font-Chakra"
                  id="outlined-adornment-weight"
                  value={min}
                  onChange={handleChangeMin}
                  aria-describedby="outlined-weight-helper-text"
                  placeholder="Min"
                  type="string"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: button ? `${button?.outline?.color}` : '#889391 !important'
                    },
                  }}
                />
              </FormControl>
              <FormControl className="flex w-[130px] !min-w-[0px]" variant="outlined">
                <OutlinedInput
                  className="text-light-on-primary custom-input text-base font-Chakra"
                  value={max}
                  onChange={handleChangeMax}
                  aria-describedby="outlined-weight-helper-text"
                  placeholder="Max"
                  type="string"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: button ? `${button?.outline?.color}` : '#889391 !important'
                    },
                  }}
                />
              </FormControl>
            </div>
            {error ? (
              <p className="text-sm text-error-50 font-Chakra">
                Minimum must be less than maximum
              </p>
            ) : null}
          </div>
        </Box>
      </Collapse>
    </div>
  );
};
