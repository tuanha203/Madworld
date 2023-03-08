import { Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { ARTIST_SUBTAB } from 'constants/app';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';

interface TabPanelProp {
  children: any;
  value: number;
  index: number;
  dir: any;
}

const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#B794F6 !important',
          },
        },
      },
    },
  },
});

function TabPanel({ children, value, index, dir, ...other }: TabPanelProp) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs({
  onClick,
  tabs,
  className = '',
  onCallBack,
  activeTab,
  numberCharTitle,
}: any) {
  const [value, setValue] = useState(ARTIST_SUBTAB.CREATE);
  const { text} = useSelector((state:any) => state.theme);

  useEffect(() => {
    if (activeTab || activeTab === '0' || activeTab === 0) setValue(activeTab);
  }, [activeTab]);

  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: React.SetStateAction<number>,
  ) => {
    setValue(newValue);
    onClick(event);
    if (onCallBack) onCallBack(newValue);
  };

  const handleChangeIndex = (index: React.SetStateAction<number>) => {
    setValue(index);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={className}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            TabIndicatorProps={{ style: { backgroundColor: text?.color } }}
            textColor="inherit"
            variant="scrollable"
            scrollButtons
            aria-label="scrollable auto tabs"
          >
            {tabs.map((category: any, index: any) => (
              <Tooltip title={category && category.length > 12 ? `${category}...` : ''}>
                <Tab
                  className="!normal-case active:text-primary-90"
                  key={index}
                  sx={{
                    '&.Mui-selected': {color: `${text?.color} !important`},
                    '&:active': {color: `${text?.color} !important`}
                  }}
                  label={category && numberCharTitle && category.length > numberCharTitle ? `${category.substring(0, numberCharTitle)}...` : category}
                  {...a11yProps(index)}
                />
              </Tooltip>
            ))}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          {tabs.map(() => {
            return <TabPanel value={value} index={100} dir={theme.direction}></TabPanel>;
          })}
        </SwipeableViews>
      </Box>
    </ThemeProvider >
  );
}

FullWidthTabs.defaultProps = {
  tabs: ['artist'],
  onClick: () => { },
};
