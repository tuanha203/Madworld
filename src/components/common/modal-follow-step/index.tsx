import * as React from 'react';
import Modal from '@mui/material/Modal';
import CheckIcon from '@mui/icons-material/Check';

import CircularProgressIndicator from 'components/common/progress-indicator';
import { STATE_STEP } from 'constants/app';
import { OutlinedButton } from '../buttons';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: '24px',
} as React.CSSProperties;

interface DataStep {
  title: string;
  des: string;
  state: STATE_STEP;
}

interface IModalFollowStepProps {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  handleClose: React.Dispatch<React.SetStateAction<boolean>>;
  steps?: DataStep[];
  textHeader: string;
  Header?: JSX.Element;
  children?: any;
  classCustom?: string;
  footerText?: string;
}

const ModalFollowStep = ({
  open,
  setOpen,
  steps,
  textHeader,
  Header,
  handleClose,
  children,
  classCustom,
  footerText,
}: IModalFollowStepProps) => {
  const [expanding, setExpanding] = React.useState<number[]>([]);
  console.log('footerText', footerText);
  
  const handleExpand = (value: number) => () => {
    const currentIndex = expanding.indexOf(value);
    const newExpanding: number[] = [...expanding];

    if (currentIndex === -1) {
      newExpanding.push(value);
    } else {
      newExpanding.splice(currentIndex, 1);
    }

    setExpanding(newExpanding);
  };

  const StepComponent = ({ step: { title, des, state, indexNum, link } }: any) => {
    const isExpend = expanding.includes(indexNum);

    return (
      <div
        className="flex bg-background-asset-detail p-4 rounded-lg mb-4 cursor-pointer"
        onClick={handleExpand(indexNum)}
      >
        <div className="pr-3 pl-1 w-10">
          {state == STATE_STEP.LOADING ? (
            <CircularProgressIndicator size={20} />
          ) : state == STATE_STEP.UNCHECKED ? (
            <CheckIcon style={{ color: '#6F7978' }} />
          ) : (
            <CheckIcon className="text-primary-dark" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <p className="font-Spartan font-bold text-dark-on-surface">{`${indexNum}. ${title}`}</p>
            <div className="p-2">
              {
                <img
                  src="/icons/arrow-bottom.svg"
                  className={`relative bottom-1 text-primary-dark ml-3 ${
                    isExpend ? 'rotate-180' : ''
                  } `}
                />
              }
            </div>
          </div>
          {isExpend ? (
            <div className="pr-2">
              <p className="text-archive-Neutral-Variant70 text-sm mt-2">{des}</p>
              {!link && (
                <p className="text-xs text-[#7A84A5] mt-3 mb-3">Waiting for initialization...</p>
              )}
              <a href={link} target="_blank">
                <OutlinedButton
                  customClass="!text-secondary-60"
                  target="_blank"
                  fullWidth
                  text="View on Etherscan"
                />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={(e: any, reason: string) => {
        if (reason !== 'backdropClick') {
          handleClose(e);
        }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div>
      <div
        style={style}
        className={`
        lg:w-[450px] lg:p-8 lg:rounded-[28px]
        w-[90%] py-6 px-1 rounded-[14px]
        bg-background-700  flex flex-col ${classCustom}`}
      >
        <p className="font-Chakra text-2xl font-bold text-lg text-center lg:mb-7 mb-1 text-dark-on-surface">
          {textHeader}
        </p>
        {Header || null}
        <div className="flex-1">{children}</div>
        {footerText && (
          <div className="text-xs lg:px-0 px-3">
            {footerText}
          </div>
        )}
      </div>
      </div>
    </Modal>
  );
};

export default ModalFollowStep;
