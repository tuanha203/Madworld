import { FC, useEffect } from 'react';
import EditArtistForm from './Form';
import { FullScreenDialog } from 'components/modules/dialogs';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { WINDOW_MODE } from 'constants/app';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
interface IDialogEditArtistProps {
  open: boolean;
  onToggle: (status: boolean) => void;
  dataUserInfo: any;
  onLoadData: () => void;
  lazyLoad: boolean;
}

const DialogEditArtist: FC<IDialogEditArtistProps> = (props) => {
  const { open, onToggle, dataUserInfo, onLoadData, lazyLoad } = props;
  const windowMode = useDetectWindowMode();
  const handleClose = () => {
    onToggle(false);
  };
  const onCloseUpdateSuccess = () => {
    handleClose();
    onLoadData();
  };

  return (
    <FullScreenDialog
      open={open}
      onClose={handleClose}
      isHideCloseText={[WINDOW_MODE['SM'], WINDOW_MODE['MD']].includes(windowMode)}
    >
      <div className="lg:bg-background-dark-900 sm:bg-background-700 w-full h-full overflow-y-auto text-white lg:px-40 sm:px-4">
        {dataUserInfo && open && !lazyLoad &&(
          <EditArtistForm dataUserInfo={dataUserInfo} onCloseUpdateSuccess={onCloseUpdateSuccess} />
        )}
      </div>
    </FullScreenDialog>
  );
};

export default DialogEditArtist;
