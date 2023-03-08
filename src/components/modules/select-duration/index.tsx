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

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { CalendarPicker } from '@mui/x-date-pickers';

import TodayIcon from '@mui/icons-material/Today';
import Box from '@mui/material/Box';
import { InputAdornment } from '@material-ui/core';
import { IdurationDate, REGEX_POSITIVE_NUMBER, TIME } from 'constants/app';
import moment from 'moment';
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

interface ISelectDurationProps {
  duration: IdurationDate;
  setDuration: React.Dispatch<React.SetStateAction<IdurationDate>>;
  initialTime: any;
  typesDuration: any;
}

const convertDateToString = (startDate: any, endDate: any) => {
  return `${moment.unix(startDate).format('MM/DD/YYYY [[]HH:mm:ss[]]')} - ${moment
    .unix(endDate)
    .format('MM/DD/YYYY [[]HH:mm:ss[]]')}`;
};

const startDateOfDay = new Date(new Date().setHours(0, 0, 0, 0));

export default function SelectDuration({
  duration,
  setDuration,
  initialTime,
  typesDuration,
}: ISelectDurationProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isSelectedCustomDate, setIsSelectedCustomDate] = React.useState<boolean>(false);
  const [startDate, setStartDate] = React.useState<any>(startDateOfDay);
  const [endDate, setEndDate] = React.useState<any>(startDateOfDay);
  const [isOpenSelectStartDate, setOpenSelectStartDate] = React.useState<boolean>(false);
  const [isOpenSelectEndDate, setOpenSelectEndDate] = React.useState<boolean>(false);
  const { icon, button, text } = useSelector((state:any) => state.theme);
  const startTime = React.useRef(initialTime);
  const endTime = React.useRef(initialTime);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const buttonRef = React.useRef<any>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const valueDuration = React.useCallback(() => {
    return !duration.type
      ? 'Select a Date'
      : duration.type === 'Custom date'
      ? convertDateToString(duration.startDate, duration.endDate)
      : duration.type;
  }, [duration]);

  function CheckboxList() {
    const handleClick = (value: IdurationDate) => () => {
      // startTime.current = {
      //   [TIME.HOURS]: moment().hours().toString(),
      //   [TIME.MINUTES]: moment().minutes().toString(),
      //   [TIME.SECONDS]: moment().seconds().toString(),
      // };
      // endTime.current = {
      //   [TIME.HOURS]: moment().hours().toString(),
      //   [TIME.MINUTES]: moment().minutes().toString(),
      //   [TIME.SECONDS]: moment().seconds().toString(),
      // };
      if (value.type !== 'Custom date') {
        setDuration(value);
        return handleClose();
      }

      setIsSelectedCustomDate(true);
    };

    const resetDateCustom = () => {
      setStartDate(null);
      setEndDate(null);
    };

    const handleCloseWhenCustomDate = () => {
      setIsSelectedCustomDate(false);
      handleClose();
    };

    const handleConfirmBtnCustomDate = () => {
      handleClose();
      setIsSelectedCustomDate(false);
      if (startDate && endDate) {
        let tempStartDate = moment(startDate)
          .hours(Number(startTime.current.HOURS))
          .minutes(Number(startTime.current.MINUTES))
          .seconds(Number(startTime.current.SECONDS))
          .unix();
        let tempEndDate = moment(endDate)
          .hours(Number(endTime.current.HOURS))
          .minutes(Number(endTime.current.MINUTES))
          .seconds(Number(endTime.current.SECONDS))
          .unix();
        // if (tempStartDate >= tempEndDate || tempStartDate < moment().unix()) return;
        setDuration({
          type: 'Custom date',
          startDate: tempStartDate,
          endDate: tempEndDate,
        });
      }
    };
    return (
      <List
        sx={{ width: '100%', bgcolor: 'background.paper', fontFamily: 'Chakra Petch !important' }}
      >
        {!isSelectedCustomDate ? (
          typesDuration.map((item: IdurationDate) => {
            const { type } = item;
            const labelId = `checkbox-list-label-${type}`;
            return (
              <ListItem
                key={type}
                disablePadding
                className={`w-full ${button?.default ? '' : 'hover:bg-secondary-60'} ${
                  duration.type == type && !button?.default ? 'bg-secondary-60 ' : ''
                }`}
                sx={duration.type == type ? button?.default : {}}
              >
                <ListItemButton
                  className="py-[8px] px-4"
                  role={undefined}
                  onClick={handleClick(item)}
                  dense
                >
                  <ListItemText sx={{ span: { fontSize: '16px' } }} id={labelId} primary={type} />
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <>
            <div className="flex px-[5px] lg:flex-row flex-col">
              <div className="lg:mb-0 mb-4">
                <PickDateTime
                  selectedDate={startDate}
                  setSelectedDate={setStartDate}
                  timeRef={startTime}
                  minDate={new Date().setHours(0, 0, 0, 0)}
                  title="Start Date"
                  isOpen={isOpenSelectStartDate}
                  handleShow={setOpenSelectStartDate}
                />
              </div>
              <PickDateTime
                minDate={startDate}
                timeRef={endTime}
                selectedDate={endDate}
                setSelectedDate={setEndDate}
                title="End Date"
                isOpen={isOpenSelectEndDate}
                handleShow={setOpenSelectEndDate}
              />
            </div>
            <div className="flex gap-2 ml-auto w-fit mt-6">
              <Button
                onClick={handleCloseWhenCustomDate}
                className="normal-case font-normal text-secondary-60 font-Chakra"
                size="medium"
                variant="text"
                style={text}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmBtnCustomDate}
                className="normal-case font-normal text-secondary-60 font-Chakra"
                size="medium"
                variant="text"
                style={text}
              >
                Confirm
              </Button>
            </div>
          </>
        )}
      </List>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="w-full">
        <Button
          ref={buttonRef}
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          variant="outlined"
          className="bg-background-dark-600 text-dark-on-surface-variant h-[52px] pr-2 normal-case hover:bg-background-dark-600 w-full justify-between text--body-large border-none hover:border-none"
        >
          <div className="flex gap-3 w-11/12 items-center">
            <TodayIcon className="text-secondary-60" style={icon} />
            <p className="w-full text-left truncate !text-[#ffffff99]">{valueDuration()}</p>
          </div>
          {open ? (
            <ArrowDropUpIcon className="ml-1 text-secondary-60" style={icon} />
          ) : (
            <ArrowDropDownIcon className="ml-1 text-secondary-60" style={icon} />
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
          className="menu-duration"
          sx={{
            "> div[tabindex='-1']": {
              color: 'white',
              bgcolor: 'background.paper',
              width:
                buttonRef.current && !isSelectedCustomDate
                  ? buttonRef.current.offsetWidth + 'px'
                  : 'initial',
            },
            ul: {
              p: !isSelectedCustomDate ? '0px !important' : '8px !important',
            },
          }}
        >
          <MenuItem className="flex flex-col p-0">
            <CheckboxList />
          </MenuItem>
        </Menu>
      </div>
    </ThemeProvider>
  );
}

function PickDateTime({
  title,
  selectedDate,
  setSelectedDate,
  timeRef,
  minDate,
  isOpen,
  handleShow,
}: any) {
  const [time, setTime] = React.useState<any>(timeRef.current);
  const [dateInput, setDateInput] = React.useState(selectedDate);
  const [hiddenTimeBox, setHiddenTimeBox] = React.useState<boolean>(false);
  const { icon } = useSelector((state:any) => state.theme);
  const DATE_SIZE = 32;
  const handleChange = (date: any) => {
    if (!moment(date).isValid() || date < minDate) return setDateInput('Invalid Date');
    setSelectedDate(date);
    setDateInput(date);
  };

  const handleChangeTime = (type: TIME) => (e: any) => {
    if (!e.target.value) return setTime({ ...time, [type]: '' });
    if (!REGEX_POSITIVE_NUMBER.test(e.target.value)) return;
    switch (true) {
      case type === TIME.HOURS && Number(e.target.value) >= 0 && Number(e.target.value) < 24:
        timeRef.current = { ...time, [TIME.HOURS]: e.target.value };
        setTime(timeRef.current);
        break;

      case type === TIME.MINUTES && Number(e.target.value) >= 0 && Number(e.target.value) < 60:
        timeRef.current = { ...time, [TIME.MINUTES]: e.target.value };
        setTime(timeRef.current);
        break;

      case type === TIME.SECONDS && Number(e.target.value) >= 0 && Number(e.target.value) < 60:
        timeRef.current = { ...time, [TIME.SECONDS]: e.target.value };
        setTime(timeRef.current);
        break;

      default:
        break;
    }
  };

  const handleBlur = React.useCallback(() => {
    setTime({
      [TIME.HOURS]: time.HOURS.padStart(2, '0'),
      [TIME.MINUTES]: time.MINUTES.padStart(2, '0'),
      [TIME.SECONDS]: time.SECONDS.padStart(2, '0'),
    });
  }, [time]);

  React.useEffect(() => {
    handleBlur();
  }, []);

  const onViewChange = (viewName: any) => {
    if (viewName === 'year') {
      setHiddenTimeBox(true);
    } else {
      setHiddenTimeBox(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div
        className={`flex flex-col items-center wrapper-input-full-width ${
          isOpen ? 'custom-input-active' : 'custom-input-inactive'
        }`}
      >
        <DatePicker
          label={title}
          value={dateInput}
          onChange={handleChange}
          inputFormat="MMM dd,yyyy"
          open={false}
          renderInput={(params) => (
            <TextField
              onClick={() => handleShow(!isOpen)}
              sx={{
                '&::after, &::before': {
                  display: 'none',
                },
                input: { color: 'rgba(255, 255, 255, 0.87)', fontFamily: "'Chakra Petch'" },
                label: { color: 'rgba(255, 255, 255, 0.6)', fontFamily: "'Chakra Petch'" },
                '& label.Mui-focused': { color: '#F4B1A3' },
                '> div::before': { display: 'none' },
                '&:focus-within': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                width: '220px',
                '& .MuiInputAdornment-positionEnd': {
                  marginLeft: 0,
                  '& .MuiSvgIcon-root': {
                    margin: 0,
                    color: `${icon?.color || '#F4B1A3'} !important`,
                  },
                },
                '& .css-1c3ekw8-MuiInputBase-root-MuiFilledInput-root': {
                  paddingRight: '3px',
                },
                '& > .MuiFilledInput-root:after': {
                  borderBottom: '2px solid #F4B1A3',
                },
                '.PrivatePickersYear-yearButton': {
                  fontFamily: "'Chakra Petch'",
                },
              }}
              id="filled-basic"
              label="Filled"
              variant="filled"
              {...params}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <ArrowDropDownIcon className="ml-1 text-secondary-60" style={icon} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Box
          className={`lg:block ${isOpen ? 'block' : 'hidden'}`}
          sx={{
            position: 'relative',
            fontFamily: "'Chakra Petch'",
            '& > div': {
              minWidth: 256,
            },
            '& .css-j7qwjs, & .css-epd502, & .MuiCalendarPicker-root': {
              width: 256,
              maxHeight: 'initial',
              backgroundColor: '#161D28',
            },
            '& .css-1n2mv2k': {
              justifyContent: 'space-evenly',
            },
            '& .MuiTypography-caption': {
              width: DATE_SIZE,
              margin: 0,
            },
            '& .PrivatePickersSlideTransition-root': {
              minHeight: DATE_SIZE * 6 + 20,
              backgroundColor: '#252D3A !important',
            },
            '& .MuiSvgIcon-root': {
              color: `${icon?.color || '#F4B1A3'} !important`,
            },
            '& .PrivatePickersSlideTransition-root [role="row"]': {
              margin: 0,
            },
            '& .MuiPickersDay-dayWithMargin': {
              margin: 0,
            },
            '& .MuiPickersDay-root': {
              width: DATE_SIZE,
              height: DATE_SIZE,
            },
            '& .MuiCalendarPicker-root > div > div': {
              fontFamily: "'Chakra Petch'",
            },
            '& .css-mvmu1r': {
              justifyContent: 'space-evenly',
              marginTop: '2px !important',
            },
            '& .Mui-selected': {
              backgroundColor: `${icon?.color || '#F4B1A3'} !important`,
              border: `${icon?.color || '#F4B1A3'} !important`,
            },
            '& .MuiPickersDay-today': {
              borderColor: `${icon?.color || '#F4B1A3'} !important`,
            },
          }}
        >
          <CalendarPicker
            minDate={minDate || new Date()}
            date={selectedDate}
            onChange={handleChange}
            onViewChange={onViewChange}
          />
          <div
            className={`absolute !min-w-0 bottom-[4px] right-[4px] text-sm flex ${
              hiddenTimeBox ? 'hidden' : 'block'
            }`}
          >
            <input
              className="w-8 h-8 text-center leading-8 bg-background-700 rounded font-bold !outline-[0.2px] focus-visible:outline outline-white"
              value={time?.HOURS}
              onChange={handleChangeTime(TIME.HOURS)}
              onBlur={handleBlur}
            />
            <p className="w-4 h-8 text-center leading-8">:</p>
            <input
              className="w-8 h-8 text-center leading-8 bg-background-700 rounded font-bold !outline-[0.2px] focus-visible:outline outline-white"
              value={time?.MINUTES}
              onChange={handleChangeTime(TIME.MINUTES)}
              onBlur={handleBlur}
            />
            <p className="w-4 h-8 text-center leading-8">:</p>
            <input
              className="w-8 h-8 text-center leading-8 bg-background-700 rounded font-bold !outline-[0.2px] focus-visible:outline outline-white"
              value={time?.SECONDS}
              onChange={handleChangeTime(TIME.SECONDS)}
              onBlur={handleBlur}
            />
          </div>
        </Box>
      </div>
    </LocalizationProvider>
  );
}
