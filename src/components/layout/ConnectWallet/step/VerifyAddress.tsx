import { FC, memo } from 'react';
import CircularProgressIndicator from 'components/common/progress-indicator';
import Stack from '@mui/material/Stack';

interface IVerifyAddressProps {}

const VerifyAddress: FC<IVerifyAddressProps> = (props) => {
  return (
    <Stack spacing={3} className="w-full flex flex-col items-center justify-center">
      <div className="text--headline-xsmall text-dark-on-surface">Verifying Address...</div>
      <div>
        <CircularProgressIndicator size={56} />
      </div>
      <div className="text--body-medium text-archive-Neutral-Variant70">
        <div>Having trouble signing in? Take a look at our</div>
        <div className="text-primary-90 font-bold"> Sign in FAQs</div>
      </div>
    </Stack>
  );
};

export default memo(VerifyAddress);
