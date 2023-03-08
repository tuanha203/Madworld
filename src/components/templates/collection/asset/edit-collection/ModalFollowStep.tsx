import { FC } from 'react';
import ModalCommon from 'components/common/modal';
import CircularProgressIndicator from 'components/common/progress-indicator';

interface IModalFollowStepProps {
  open: boolean;
  onClose: () => void;
}

const ModalFollowStep: FC<IModalFollowStepProps> = (props) => {
  const { open, onClose } = props;
  return (
    <ModalCommon
      open={open}
      handleClose={onClose}
      title="Follow Steps"
      headerClassName={'text-left'}
    >
      <div className="pt-5 pb-10">
        <div className="flex mb-4">
          <div className="mr-3.5">
            <CircularProgressIndicator size={14} />
          </div>
          <div>
            <div className="text--title-medium mb-1.5">Deploy Contract</div>
            <div className="text--body-medium">
              Deploy code for the new collection smart contract
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="mr-3.5">
            <CircularProgressIndicator size={14} />
          </div>
          <div>
            <div className="text--title-medium mb-1.5">Sign Message</div>
            <div className="text--body-medium">Sign message with new collection preferences</div>
          </div>
        </div>
      </div>
    </ModalCommon>
  );
};

export default ModalFollowStep;
