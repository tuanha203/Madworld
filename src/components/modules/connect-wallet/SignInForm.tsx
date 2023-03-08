import { FC } from 'react';
import WalletList from './WalletList';
import { IWalletItemProps } from './WalletItem';

type ITogglePanelType = 'walletConnect' | 'preferred' | undefined;

interface ISignInFormProps {
  onTogglePanel: (type?: ITogglePanelType) => void;
}

const SignInForm: FC<ISignInFormProps> = (props) => {
  const { onTogglePanel } = props;

  const walletOptions: IWalletItemProps[] = [
    {
      img: '/images/wallet/metamask-logo.png',
      title: 'Metamask',
    },
    {
      img: '/images/wallet/coinbase-logo.png',
      title: 'Coinbase',
    },
    {
      img: '/images/wallet/fortmatic-logo.png',
      title: 'Fortmatic',
    },
    {
      img: '/images/wallet/walletconnect-logo.png',
      title: 'WalletConnect',
      onClick: () => onTogglePanel('walletConnect'),
    },
    {
      img: '/icons/plus.svg',
      title: 'Show more options',
      onClick: () => onTogglePanel('preferred'),
    },
  ];

  return (
    <>
      <div className="text-center text-white mb-11 mt-20">
        <h1 className="text--display-medium mb-3.5">{'Sign In with your wallet'}</h1>
        <div className="text--title-medium text-archive-Neutral-Variant70">
          Sign In with one of available wallet providers or create a new wallet.
        </div>
      </div>
      <div className="w-full px-28">
        <WalletList list={walletOptions} />
        <div className="text--label-medium text-white">
          We do not own your private keys and cannot access your funds without your confirmation.
        </div>
      </div>
    </>
  );
};

export default SignInForm;
