import { FC } from 'react';
import WalletConnectDesktop from './Desktop';
import WalletConnectScanQR from './ScanQR';
import WalletConnectTab from './Tab';

interface IWalletConnectProps {}

const WalletConnect: FC<IWalletConnectProps> = (props) => {
  const tabs = [
    {
      value: 'scanQR',
      label: 'Scan QR',
      component: <WalletConnectScanQR />,
    },
    {
      value: 'desktop',
      label: 'Desktop',
      component: <WalletConnectDesktop />,
    },
  ];

  return (
    <div className="mt-10 w-full">
      <div className="mb-14">
        <h2 className="text--title-large text-center text-white">
          <img
            className="w-10 mr-2 inline"
            src="/images/wallet/walletconnect-logo.png"
            alt="logo"
          />
          <span>{'WalletConnect'}</span>
        </h2>
      </div>
      <div className="flex flex-col items-center text-center text-white w-full">
        <WalletConnectTab tabs={tabs} initialTab="scanQR" />
      </div>
    </div>
  );
};
export default WalletConnect;
