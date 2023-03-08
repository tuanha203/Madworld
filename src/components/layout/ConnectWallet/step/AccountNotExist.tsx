import { FC, memo } from 'react';
import Stack from '@mui/material/Stack';
import { FilledButton } from 'components/common/buttons';

interface IAccountNotExist {
  address?: string | null | undefined;
  onSignUp: () => void;
  onSwitchAccount?: () => any;
}

const AccountNotExist: FC<IAccountNotExist> = (props) => {
  const { address, onSignUp, onSwitchAccount } = props;

  return (
    <Stack spacing={3} className="w-full mt-5">
      <div className="font-bold text-dark-on-surface text-sm">No account linked to this address.</div>
      <div className="px-3.5 py-4 rounded-lg bg-background-dark-800">
          <div className="text--title-small text-archive-Neutral-Variant70">Address</div>
        <div className="mt-2 text--title-small text-[10px]">{address}</div>
      </div>

      <FilledButton
        text="Switch Address"
        fullWidth
        customClass="font-bold"
        onClick={onSwitchAccount}
      />
      <div
        className="text-center mt-6 text-primary-90 cursor-pointer text--label-large"
        onClick={onSignUp}
      >
        Would you like to sign up instead?
      </div>
    </Stack>
  );
};

AccountNotExist.defaultProps = {
  address: '0x08bCAFfb09966A909ecfF2aF4fA78A1e615175A3',
};

export default memo(AccountNotExist);
