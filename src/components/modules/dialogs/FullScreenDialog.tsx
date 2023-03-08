import { FC, ReactNode, memo, useState } from 'react';
import { ClosingIcon } from '../../common/iconography/IconBundle';
import Dialog from '@mui/material/Dialog';
import ModalConfirm from 'components/common/modal-confirm';
import { useSelector } from 'react-redux';

interface IFullScreenDialogProps {
  open: boolean;
  onClose: (status: boolean) => void;
  children: ReactNode;
  confirm4Closed?: boolean;
  isHideCloseButton?: boolean;
  isHideCloseText?: boolean;
  className?: string;
}

const FullScreenDialog: FC<IFullScreenDialogProps> = (props) => {
  const { open, onClose, confirm4Closed = false, children, isHideCloseButton, isHideCloseText, className } = props;
  const [openConfirmCancel, setOpenConfirmCancel] = useState(false);
  const { icon } = useSelector((state:any) => state.theme);
  const handleClose = () => {
    if (confirm4Closed) {
      setOpenConfirmCancel(true);
    } else {
      onClose(false);
    }
  };

  const onOkCancel = () => {
    setOpenConfirmCancel(false);
    onClose(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      PaperProps={{ className: 'bg-transparent' }}
    >
      <div className={`bg-background-asset-detail flex-1 ${className || ''}`}>
        {!isHideCloseButton && (
          <div
            className="flex items-center ml-auto text-white cursor-pointer absolute right-8 top-5 z-[10]"
            onClick={handleClose}
          >
            {!isHideCloseText && <span className="mr-2">Close</span>}
            <ClosingIcon style={icon} />
          </div>
        )}
        {children}
      </div>

      <ModalConfirm
        open={openConfirmCancel}
        onConfirm={onOkCancel}
        onClose={() => setOpenConfirmCancel(false)}
        message="Changes you made so far will not be saved"
        title="Are you sure you want to cancel?"
        cancelText="Cancel"
        confirmText="Confirm"
      />
    </Dialog>
  );
};

export default memo(FullScreenDialog);
