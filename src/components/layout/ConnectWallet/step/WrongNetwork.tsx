import { FC, memo } from 'react';
import Stack from '@mui/material/Stack';
import { FilledButton } from 'components/common';
import CircularProgressIndicator from 'components/common/progress-indicator';

interface IWrongNetwork {
  onDisconnect?: () => void;
}

const WrongNetwork: FC<IWrongNetwork> = (props) => {
  const { onDisconnect } = props;

  return (
    <Stack spacing={3} className="w-full flex flex-col items-center justify-center">
      <div className="text--headline-xsmall text-dark-on-surface text center">Wrong Network</div>
      <div>
        <CircularProgressIndicator size={56} />
      </div>
      <div className="text--title-small text-archive-Neutral-Variant70">
        You are connecting to unsupported network. Please connect the appropriate Ethereum network.
      </div>
      <FilledButton text="Disconnected" customClass="font-bold" fullWidth onClick={onDisconnect} />
    </Stack>
  );
};

export default memo(WrongNetwork);
