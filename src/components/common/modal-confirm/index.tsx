import { TextButton } from 'components/common';
import { FC, memo } from 'react';
import ModalCommon from 'components/common/modal';
import { OutlinedButton, FilledButton } from 'components/common';
import { useSelector } from 'react-redux';

interface IModalConfirmProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  message?: string;
  title?: string;
  cancelText?: string;
  confirmText?: string;
}

const ModalConfirm: FC<IModalConfirmProps> = (props) => {
  const {
    open,
    onConfirm,
    onClose,
    message = 'Changes you made so far will not be saved',
    title = 'Are you sure you want to cancel?',
    cancelText = 'Cancel',
    confirmText = 'Confirm',
  } = props;
  const { button } = useSelector((state:any) => state.theme);
  return (
    <ModalCommon
      isCloseIcon={false}
      title={false}
      open={open}
      handleClose={onClose}
      wrapperClassName="w-[312px] !md:px-6 sm:px-2"
    >
      <div className="w-full text-center">
        <div className="text--headline-small mb-4 md:text-2xl">{title}</div>
        <div className="text-sm text-archive-Neutral-Variant80  mb-6">{message}</div>
        <div className="flex justify-center gap-3">
          <OutlinedButton customClass="w-[178px]" style={button?.outline} text={cancelText} onClick={onClose} dark />
          <FilledButton customClass="w-[178px]" style={button?.default} text={confirmText} onClick={onConfirm} />
        </div>
      </div>
    </ModalCommon>
  );
};

export default memo(ModalConfirm);
