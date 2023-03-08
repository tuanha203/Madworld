import { FC, useState, useMemo, useEffect } from 'react';
import FullScreenDialog from '../dialogs/FullScreenDialog';
import TypeList from './TypeList';
import { ITypeItemProps } from './TypeItem';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';

interface IDialogChooseTypeProps {
  open: boolean;
  onToggle: (status: boolean) => void;
}

const DialogChooseType: FC<IDialogChooseTypeProps> = ({ open, onToggle }) => {
  const { account, library } = useWeb3React();

  const router = useRouter();
  const {} = router;
  

  useEffect(() => {
    if (!library) return;

    const onChangeAccount = ([accountConnected]: any) => {
      if (accountConnected) {
        onToggle(false);
        router.back();
      }
    };

    if (library?.provider && library?.provider?.on) {
      library.provider && library.provider.on('accountsChanged', onChangeAccount);
    }
    return () => {
      library?.provider?.removeListener('accountsChanged', onChangeAccount); // need func reference to remove correctly
    };
  }, [account, library]);

  const handleClose = () => {
    onToggle(false);
  };

  const TYPE_OPTIONS: ITypeItemProps[] = useMemo(
    () => [
      {
        title: 'Single',
        img: '/images/nft-single.svg',
        description: 'If you want to highlight the uniqueness and \n individuality of your item',
        pathname: '/create/single',
      },
      {
        title: 'Multiple',
        img: '/images/nft-multiple.svg',
        description: 'If you want to share your item with a large \n number of community members',
        pathname: '/create/multiple',
      },
    ],
    [],
  );

  return (
    <FullScreenDialog open={open} onClose={handleClose}>
      <div className="flex justify-center h-full">
        <div className="pt-16">
          <div className="text-center text-white mb-16">
            <h1 className="text--display-medium">Choose Type</h1>
            <div className="text--body-large w-[578px] mx-auto">
              Choose “Single” for one of a kind or “Multiple” if you want to sell one collectible
              multiple times
            </div>
          </div>
          <TypeList list={TYPE_OPTIONS} handleClose={handleClose} />
        </div>
      </div>
    </FullScreenDialog>
  );
};
export default DialogChooseType;
