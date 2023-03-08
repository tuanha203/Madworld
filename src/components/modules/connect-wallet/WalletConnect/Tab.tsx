import { FC, useState, ReactNode } from 'react';
import get from 'lodash/get';
import Tab from '@mui/material/Tab';
import { TabPanel, TabContext, TabList } from '@mui/lab';

interface IWalletConnectTabProps {
  tabs: {
    value: string;
    label: string;
    component: ReactNode;
  }[];
  initialTab: string;
}

const WalletConnectTab: FC<IWalletConnectTabProps> = (props) => {
  const { tabs, initialTab } = props;

  const [selectedTab, setTab] = useState<string>(initialTab || get(tabs, '[0].value'));

  const handleTabChange = (event: any, newValue: string) => {
    setTab(newValue);
  };

  return (
    <TabContext value={selectedTab} sx={{ width: '100%' }}>
      <TabList
        value={selectedTab}
        onChange={handleTabChange}
        TabIndicatorProps={{ style: { background: '#1EFCF1' } }}
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            className={
              tab.value === selectedTab
                ? 'text--label-large text-primary-dark'
                : 'text--label-large'
            }
            sx={{ textTransform: 'none' }}
          />
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.value} value={tab.value} className="w-full">
          {tab.component}
        </TabPanel>
      ))}
    </TabContext>
  );
};

export default WalletConnectTab;
