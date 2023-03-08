import { FC, memo } from 'react';
import Stack from '@mui/material/Stack';
import { FilledButton } from 'components/common';
import { useSelector } from 'react-redux';

interface IWeb3NotDetectedProps {
  onCancel: () => void;
}

const Web3NotDetected: FC<IWeb3NotDetectedProps> = (props) => {
  const { onCancel } = props;
  const { text } = useSelector((state: any) => state.theme);
  return (
    <Stack spacing={3} className="w-full flex flex-col items-center justify-center">
      <div className="text--headline-xsmall text-dark-on-surface">Web3 wallet not detected</div>
      <div className="text--body-medium">
        Please make sure your wallet is unlocked and available. If you do not currently have Web3
        wallet, we suggest{' '}
        <a
          className="text-primary-90 text--title-small"
          href=" https://metamask.io/download/"
          target="_blank"
          style={text}
        >
          Metamask
        </a>
      </div>
      <FilledButton text="Cancel" customClass="font-bold" fullWidth onClick={onCancel} />
    </Stack>
  );
};

export default memo(Web3NotDetected);
