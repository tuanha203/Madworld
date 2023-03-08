import { ReactNode, FC, CSSProperties, useRef } from 'react';
import Modal from '@mui/material/Modal';
import ModalWrapper from 'components/modules/share/ModalWrapper';
import ModalHeader from 'components/modules/share/ModalHeader';
import { ClosingIcon } from '../iconography/IconBundle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ImageBase from '../ImageBase';
import { FullScreenDialog } from 'components/modules/dialogs';
import { useOnClickOutside } from 'utils/hook';
import { useSelector } from 'react-redux';

const style: CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
};

interface IModalCommon {
  title?: any;
  open: boolean;
  handleClose: () => void;
  isCloseIcon?: boolean;
  children: ReactNode | void;
  className?: string;
  wrapperClassName?: string;
  headerClassName?: string;
}
interface ImageProfile {
  open: boolean;
  imageUrl?: string;
  onTriggerClose: () => void;
}

const ModalCommon: FC<IModalCommon> = (props) => {
  const {
    title,
    open,
    handleClose,
    isCloseIcon = true,
    children,
    className = '',
    wrapperClassName,
    headerClassName,
  } = props;

  const { icon } = useSelector((state:any) => state.theme);

  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className={className || ''}
    >
      <ModalWrapper className={wrapperClassName} style={style}>
        {isCloseIcon && (
          <div className="absolute right-8 top-6 cursor-pointer">
            <ClosingIcon onClick={handleClose} style={icon} />
          </div>
        )}
        {title && <ModalHeader className={headerClassName}>{title}</ModalHeader>}
        {children}
      </ModalWrapper>
    </Modal>
  );
};

ModalCommon.defaultProps = {
  isCloseIcon: true,
};
export const ImageProfile = (props: ImageProfile) => {
  const { open, onTriggerClose, imageUrl } = props;
  const ref: any = useRef();

  useOnClickOutside(ref, () => {
    onTriggerClose();
  });

  return (
    <FullScreenDialog
      open={open}
      onClose={() => {
        onTriggerClose();
      }}
    >
      <div className="flex justify-center items-center h-full w-full">
        <div ref={ref}>
          <ImageBase
            url={imageUrl}
            alt="Image detail"
            errorImg="Default"
            type="HtmlImage"
            className="max-w-[85vw] max-h-[85vh]"
          />
        </div>
      </div>
    </FullScreenDialog>
  );
};

export default ModalCommon;
