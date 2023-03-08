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

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import TodayIcon from '@mui/icons-material/Today';
import Box from '@mui/material/Box';
import { InputAdornment } from '@material-ui/core';
import { IExpirationDate, REGEX_POSITIVE_NUMBER, TIME } from '../../../constants/app';
import { TextField } from '@mui/material';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
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

interface ISelectExpirationProps {
  date: IExpirationDate;
  setDate: React.Dispatch<React.SetStateAction<IExpirationDate>>;
  TYPES: Array<IExpirationDate>;
  isSelectedCustomDate: boolean;
  setIsSelectedCustomDate: any;
  bgClassNameDynamic?: string;
}

const convertDateToString = (startDate: any) => {
  return `${startDate.format('MM/DD/YYYY [[]HH:mm:ss[]]')}`;
};

export default function SelectExpiration({
  date,
  setDate,
  TYPES,
  isSelectedCustomDate,
  setIsSelectedCustomDate,
  bgClassNameDynamic = '',
}: ISelectExpirationProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = React.useState<any>(null);
  const [endDate, setEndDate] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const { icon, text } = useSelector((state:any) => state.theme);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const buttonRef = React.useRef<any>(null);

  const time = React.useRef({
    [TIME.HOURS]: moment().hours().toString(),
    [TIME.MINUTES]: moment().minutes().toString(),
    [TIME.SECONDS]: moment().seconds().toString(),
  });

  const handleClose = () => {
    if (isSelectedCustomDate) {
      setIsSelectedCustomDate(false);
    }
    time.current = {
      [TIME.HOURS]: moment().hours().toString(),
      [TIME.MINUTES]: moment().minutes().toString(),
      [TIME.SECONDS]: moment().seconds().toString(),
    };
    setAnchorEl(null);
  };

  const valueDuration = !date.type
    ? 'Select a Date'
    : date.type === 'Custom date'
    ? convertDateToString(date.date)
    : date.type;

  function CheckboxList() {
    const handleClick = (value: IExpirationDate) => () => {
      if (value.type !== 'Custom date') {
        setDate(value);
        return handleClose();
      }
      updateTimeDate();
      setIsSelectedCustomDate(true);
    };

    const handlePickTime = (date: any) => {
      if (date) {
        setDate({
          type: 'Custom date',
          date: moment(date)
            .hours(Number(time.current.HOURS))
            .minutes(Number(time.current.MINUTES))
            .seconds(Number(time.current.SECONDS)),
        });
      }
      handleClose();
    };

    const updateTimeDate = () => {
      setDate({
        type: 'Custom date',
        date: moment(date.date)
          .hours(Number(time.current.HOURS))
          .minutes(Number(time.current.MINUTES))
          .seconds(Number(time.current.SECONDS)),
      });
    };

    const resetDateCustom = () => {
      setStartDate(null);
      setEndDate(null);
    };

    return (
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {!isSelectedCustomDate ? (
          TYPES.map((item: IExpirationDate, index: number) => {
            const { type } = item;
            const labelId = `checkbox-list-label-${type}`;
            return (
              <ListItem
                key={type}
                disablePadding
                className="w-full"
                // className={`w-full hover:bg-secondary-20 ${
                //   date.type == type ? 'bg-secondary-20 ' : ''
                // }`}
              >
                <ListItemButton
                  className="py-[8px] px-4"
                  role={undefined}
                  onClick={handleClick(item)}
                  dense
                >
                  <ListItemText className="text--body-large " id={labelId} primary={type} />
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <div>
            <PickDateTime
              timeRef={time}
              selectedDate={date}
              setSelectedDate={handlePickTime}
              updateTimeDate={updateTimeDate}
            />
          </div>
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
          className={`${bgClassNameDynamic ? bgClassNameDynamic : 'bg-secondary-ref'} text--body-large pr-2 normal-case hover:bg-secondary-ref w-full justify-between text-white border-none hover:border-none h-[56px]`}
        >
          <div className="flex gap-3 items-center">
            <AccessTimeIcon className="text-secondary-60" style={icon} />
            <div>
              {open ? <p className="text-secondary-60 text-xs text-left" style={text}>Duration</p> : null}
              <p className="">{valueDuration}</p>
            </div>
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
              p: !isSelectedCustomDate ? '0px !important' : '0px !important',
              backgroundColor: '#646B7A',
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

function PickDateTime({ selectedDate, setSelectedDate, timeRef, updateTimeDate }: any) {
  const [time, setTime] = React.useState<any>(timeRef.current);
  const DATE_SIZE = 35;
  const [hiddenTimeBox, setHiddenTimeBox] = React.useState<boolean>(false);
  const handleChange = (date: any) => {
    setSelectedDate(date);
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
    updateTimeDate();
  }, [time]);

  const onViewChange = (viewName: any) => {
    if (viewName === 'year') {
      setHiddenTimeBox(true);
    } else {
      setHiddenTimeBox(false);
    }
  };

  React.useEffect(() => {
    setTime({
      [TIME.HOURS]: time.HOURS.padStart(2, '0'),
      [TIME.MINUTES]: time.MINUTES.padStart(2, '0'),
      [TIME.SECONDS]: time.SECONDS.padStart(2, '0'),
    });
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="flex flex-col items-center">
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            '& > div': {
              minWidth: 256,
            },
            '& .css-j7qwjs, & .css-epd502, & .MuiCalendarPicker-root': {
              width: 389,
              maxHeight: 'initial',
              backgroundColor: '#161D28',
            },
            '& .MuiCalendarPicker-root div': {
              fontFamily: 'Chakra Petch'
            },
            '& .css-1n2mv2k': {
              justifyContent: 'space-evenly',
            },
            '& .MuiTypography-caption': {
              width: '32px',
            },
            '& .PrivatePickersSlideTransition-root': {
              minHeight: DATE_SIZE * 6,
              height: '220px',
              backgroundColor: '#252D3A !important',
            },
            '& .PrivatePickersSlideTransition-root [role="row"]': {
              margin: 0,
            },
            '& .MuiPickersDay-dayWithMargin': {
              margin: 0,
            },
            '& .MuiPickersDay-root': {
              width: 32,
              height: 32,
            },
            '& .MuiPickersDay-root:(.Mui-selected)': {
              backgroundColor: '#f55e55 !important',
            },
            '& .MuiPickerStaticWrapper-root': {
              height: '320px',
            },
            '& .MuiSvgIcon-root': {
              color: '#F4B1A3 !important',
            },
            '& .css-epd502': {
              height: '320px',
              maxHeight: 'initial',
              backgroundColor: '#252D3A',
            },
            '& button.MuiPickersDay-root.Mui-selected': {
              backgroundColor: '#F55E55',
            },
            '& .css-mvmu1r': {
              justifyContent: 'space-evenly',
              marginTop: '4px !important',
            },
            '& MuiButtonBase-root': {},
            '& .MuiSvgIcon-root': {
              color: '#F4B1A3 !important',
            },
          }}
        >
          {/* <CalendarPicker date={selectedDate} onChange={handleChange} /> */}
          <StaticDatePicker
            onViewChange={onViewChange}
            displayStaticWrapperAs="desktop"
            label="Week picker"
            value={selectedDate.date}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
            inputFormat="'Week of' MMM d"
            minDate={new Date()}
            disablePast={true}
            className="font-Chakra"
          />
          <div
            className={`absolute !min-w-0 bottom-[14px] right-[14px] text-sm flex ${
              hiddenTimeBox ? 'hidden' : 'block'
            }`}
          >
            <input
              className="w-8 h-8 text-center leading-8 bg-background-700 rounded font-bold !outline-[0.2px] focus-visible:outline outline-white font-Chakra"
              value={time?.HOURS}
              onChange={handleChangeTime(TIME.HOURS)}
              onBlur={handleBlur}
            />
            <p className="w-4 h-8 text-center leading-8">:</p>
            <input
              className="w-8 h-8 text-center leading-8 bg-background-700 rounded font-bold !outline-[0.2px] focus-visible:outline outline-white font-Chakra"
              value={time?.MINUTES}
              onChange={handleChangeTime(TIME.MINUTES)}
              onBlur={handleBlur}
            />
            <p className="w-4 h-8 text-center leading-8">:</p>
            <input
              className="w-8 h-8 text-center leading-8 bg-background-700 rounded font-bold !outline-[0.2px] focus-visible:outline outline-white font-Chakra"
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
