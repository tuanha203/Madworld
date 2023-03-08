import { FC, useCallback, useState, memo, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import copy from 'copy-to-clipboard';
import { IconCopy, IconWallet } from 'components/common/iconography/IconBundle';
import { FilledButton } from 'components/common/buttons';
import OverflowTooltip from 'components/common/tooltip/OverflowTooltip';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

interface IWelcomeBackUserProps {
  username?: string | null | undefined;
  onSignIn?: () => void;
  loading?: boolean;
}

const WelcomeBackUserModal: FC<IWelcomeBackUserProps> = (props) => {
  const { username, onSignIn, loading } = props;
  const [isCopyStatus, setCopyStatus] = useState(false);
  const { account, connector } = useWeb3React();
  const [walletName, setWalletName] = useState('');

  const handleCopyAddress = useCallback(() => {
    copy(account as string);

    setCopyStatus(true);
  }, [account, isCopyStatus]);

  useEffect(() => {
    if (connector instanceof WalletConnectConnector) {
      setWalletName('WalletConnect')
    } else {
      setWalletName('Metamask')
    }
  }, [connector])

  return (
    <Stack spacing={3}>
      <div className="text-dark-on-surface text-lg font-bold">
        <OverflowTooltip title={username || account || ''}>
          <>{`@${username || account}`}</>
        </OverflowTooltip>
      </div>
      <div className="px-3.5 py-4 rounded-lg bg-background-dark-800 text-sm text-archive-Neutral-Variant70 font-bold font-Chakra">
        <Stack spacing={1}>
          <div>
            Connect with{' '}
            {walletName}
          </div>
          <div className="flex justify-between items-center gap-1">
            <span>
              <IconWallet />
            </span>
            <div className="grow text--title-small text-white text-[10px] text-ellipsis">{account}</div>
            {isCopyStatus ? (
              <img src="/icons/copy-success.svg" />
            ) : (
              <div className="cursor-pointer" onClick={handleCopyAddress}>
                <Tooltip title="Copy" placement="top">
                  <span>
                    <IconCopy fontSize="small" />
                  </span>
                </Tooltip>
              </div>
            )}
          </div>
        </Stack>
      </div>
      <FilledButton
        text="Sign in to MADWorld"
        fullWidth
        customClass="font-bold"
        onClick={onSignIn}
        loading={loading}
      />
    </Stack>
  );
};

WelcomeBackUserModal.defaultProps = {
  username: 'username',
};

export default memo(WelcomeBackUserModal);
