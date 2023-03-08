import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import CircularProgressIndicator from 'components/common/progress-indicator';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: '24px',
  padding: '32px',
  width: '479px',
} as React.CSSProperties;

const ModalLoading = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={(e: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={style}
          className="bg-background-700 rounded-[28px] h-[216px] flex flex-col text-center items-center"
        >
          <p className="font-Spartan font-bold text-lg mb-6">Please wait...</p>
          <div>
            <CircularProgressIndicator size={53} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalLoading;
