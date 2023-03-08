import { FC, useMemo } from 'react';
import ModalCommon from 'components/common/modal';
import CircularProgressIndicator from 'components/common/progress-indicator';
import CheckIcon from '@mui/icons-material/Check';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { LINK_SCAN } from 'constants/envs';
import { OutlinedButton } from 'components/common';

export type StepType = 'uploadDeploySC' | 'createCollection' | 'updateRoyalty' | 'finished';

interface IModalFollowStepProps {
  open: boolean;
  onClose: () => void;
  currentStep: StepType | undefined;
  processedSteps: StepType[];
  values: any;
  hashCreateCollection?: string;
  hashUpdateRoyaltyFee?: string;
}

const ModalFollowStep: FC<IModalFollowStepProps> = (props) => {
  const { open, onClose, currentStep, values, hashCreateCollection, hashUpdateRoyaltyFee } = props;

  const STEPS: { value: StepType; title: string; message: string; viewScan?: string }[] =
    useMemo(() => {
      const temptSteps: { value: StepType; title: string; message: string; viewScan?: string }[] = [
        {
          value: 'uploadDeploySC',
          title: '1. Deploy Contract',
          message: 'Please wait to upload processing',
          viewScan: hashCreateCollection || '',
        },
        {
          value: 'createCollection',
          title: '2. Create Collection',
          message: 'Creating new collection',
        },
      ];

      // if (values.royalty !== '') {
      //   temptSteps.push({
      //     value: 'updateRoyalty',
      //     title: '3. Update Royalty',
      //     message: 'Send transactions to update royalty',
      //     viewScan: hashUpdateRoyaltyFee || ''
      //   });
      // }

      return temptSteps;
    }, [values.royalty, hashCreateCollection, hashUpdateRoyaltyFee]);

  const isProcessedStep = (index: number) => {
    const currentStepIndex = STEPS.findIndex((s) => s.value === currentStep);

    return currentStepIndex >= index;
  };

  const isFinishedStep = () => {
    return currentStep === 'finished';
  }

  const renderStep = () => {
    if (isFinishedStep()) {
      return (
        <Stack spacing={2.5} justifyContent="center" alignItems="center">
          <div className="text-center text--headline-small text-white">Collection Created</div>
          <img
            className="inline-block w-[40px] h-[40px]"
            src="/icons/check-circle-outline.svg"
            alt=""
          />
          <p className="text--body-medium font-normal text-center w-[300px]">
            Congratulations! Your collection is successfully created!
          </p>
          <Button className={`filled-button mad-button !text-white w-full`} onClick={onClose}>
            Close
          </Button>
        </Stack>
      );
    }

    return (
      <Stack spacing={2}>
        <div className="text-center text--headline-small text-dark-on-surface">Follow Steps</div>
        <div className="flex flex-col gap-4 overflow-auto max-h-[40%]">
          {STEPS.map((step, index) => (
            <div
              key={`${step.value}-${index}`}
              className="flex bg-background-asset-detail px-5 py-4 rounded-lg"
            >
              <div className="w-[20px]">
                {step.value === currentStep ? (
                  <CircularProgressIndicator size={20} />
                ) : (
                  <>{isProcessedStep(index) ? <CheckIcon className="text-primary-60" /> : <> </>}</>
                )}
              </div>
              <div className="ml-3.5">
                <div className="text--body-large text-dark-on-surface mb-1.5">{step.title}</div>
                <div className="text--body-medium font-normal text-archive-Neutral-Variant70">
                  {step.message}
                </div>
                {step.viewScan && (
                  <div className="mt-3">
                    <a href={`${LINK_SCAN}tx/${step.viewScan}`} target="_blank">
                      <OutlinedButton
                        customClass="!text-secondary-60 w-[260px] h-[40px] font-bold"
                        target="_blank"
                        fullWidth
                        text="View on Etherscan"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Stack>
    );
  };

  return (
    <ModalCommon
      open={open}
      handleClose={onClose}
      isCloseIcon={false}
      title=""
      wrapperClassName="!p-0 lg:!w-[438px] max-w[95%] !w-[350px] "
    >
      <div className="lg:py-8 lg:px-12 px-2 py-6 bg-background-dark-600 w-full">
        {renderStep()}
        {!isFinishedStep() && (
          <div className="text--body-small archive-Neutral-Variant70 lg:mt-6 mt-2 text-xs text-archive-Neutral-Variant70">
            <div>Please wait for creating collection. This will take a while.</div>
            <div>Please don't reload the current page.</div>
          </div>
        )}
      </div>
    </ModalCommon>
  );
};

export default ModalFollowStep;
