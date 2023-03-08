import { FC } from 'react';
import WalletList from '../WalletList';
import { IWalletItemProps } from '../WalletItem';

interface IWalletConnectDesktopProps {}

const WalletConnectDesktop: FC<IWalletConnectDesktopProps> = () => {
  const walletOptions: IWalletItemProps[] = [
    {
      img: '/images/wallet/metamask-logo.png',
      title: 'Ledger Live',
    },
    {
      img: '/images/wallet/tokenary-logo.png',
      title: 'Tokenary',
    },
    {
      img: '/images/wallet/infinity-wallet-logo.png',
      title: 'Infinity Wallet',
    },
    {
      img: '/images/wallet/wallet-3-logo.png',
      title: 'Wallet 3',
      onClick: () => {},
    },
    {
      img: '/images/wallet/ambire-wallet-logo.png',
      title: 'Ambire Wallet',
      onClick: () => {},
    },
  ];

  return (
    <div className="gap-8 w-full px-40">
      <div className="text--label-large mb-4">Choose your preferred waller</div>
      <WalletList list={walletOptions} />
    </div>
  );
};

export default WalletConnectDesktop;
