import { FC } from 'react';
import FullScreenDialog from 'components/modules/dialogs/FullScreenDialog';
import { ClosingIcon } from 'components/common/iconography/IconBundle';
import { TYPE_COLLECTION } from 'constants/app';

import CreateCollectionForm from './Form';

interface IDialogCreateCollectionProps {
  open: boolean;
  onToggle: (status: boolean) => void;
  nftType?: TYPE_COLLECTION.ERC721 | TYPE_COLLECTION.ERC1155;
}

const DialogCreateCollection: FC<IDialogCreateCollectionProps> = (props) => {
  const { open, onToggle, nftType } = props;

  const handleClose = () => {
    onToggle(false);
  };

  return (
    <FullScreenDialog
      open={open}
      onClose={handleClose}
      className="bg-background-asset-detail"
      isHideCloseButton={true}
    >
      <div className="lg:bg-background-asset-detail sm:bg-background-preview-sell w-full h-full overflow-y-auto text-white max-w-[1128px] mx-auto">
        <div
          className="flex items-center ml-auto text-white cursor-pointer absolute lg:right-8 lg:top-6 right-[28px] top-[38px]"
          onClick={handleClose}
        >
          <span className="lg:inline hidden mr-2">Close</span>
          <ClosingIcon />
        </div>
        <CreateCollectionForm onClose={handleClose} nftType={nftType} />
      </div>
    </FullScreenDialog>
  );
};

export default DialogCreateCollection;
