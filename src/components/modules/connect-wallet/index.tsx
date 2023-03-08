import { FC, useState } from 'react';
import FullScreenDialog from '../dialogs/FullScreenDialog';
import SignInForm from './SignInForm';
import WalletConnect from './WalletConnect';
import ChoosePreferredWallet from './ChoosePreferredWallet';

interface IDialogConnectWalletProps {
  open: boolean;
  onToggle: (status: boolean) => void;
}

type ITogglePanelType = 'walletConnect' | 'preferred' | undefined;

const DialogConnectWallet: FC<IDialogConnectWalletProps> = (props) => {
  const { open, onToggle } = props;
  const [togglePanel, setTogglePanel] = useState<ITogglePanelType>();

  const handleClose = () => {
    onToggle(false);
    setTogglePanel(undefined);
  };

  const handleTogglePanel = (type: ITogglePanelType) => {
    setTogglePanel(type);
  };

  const renderContent = () => {
    if (togglePanel === 'walletConnect') {
      return <WalletConnect />;
    }

    if (togglePanel === 'preferred') {
      return <ChoosePreferredWallet />;
    }

    return <SignInForm onTogglePanel={handleTogglePanel} />;
  };

  return (
    <FullScreenDialog open={open} onClose={handleClose}>
      <div className="flex h-full">
        <div className="w-96 h-full bg-[url('/images/wallet/bg-donut.png')] bg-no-repeat bg-cover" />
        <div className="py-6 w-[700px] h-full flex flex-col bg-background-dark-800 overflow-hidden items-center">
          {renderContent()}
        </div>
      </div>
    </FullScreenDialog>
  );
};
export default DialogConnectWallet;
