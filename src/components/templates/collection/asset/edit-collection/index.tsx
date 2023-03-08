import { FC, useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FullScreenDialog from '../../../../modules/dialogs/FullScreenDialog';
import EditCollectionForm from './Form';
import ModalFollowStep from './ModalFollowStep';
import { checkForCollectionSetter } from 'blockchain/utils';
import _, { values } from 'lodash';
import useDetectWindowMode from 'hooks/useDetectWindowMode';
import { WINDOW_MODE } from 'constants/app';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { removeEventChangePage } from 'store/actions/forceUpdating';
import { NETWORK_CHAIN_ID } from 'constants/envs';
import { ClosingIcon } from 'components/common/iconography/IconBundle';
import CloseIcon from '@mui/icons-material/Close';

interface IDialogEditCollectionProps {
  open: boolean;
  onToggle: (status: boolean) => void;
  dataCollection: any;
  onLoadData: (shortUrl: string) => void;
}

export interface ISocialValues {
  web?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
}
export interface IUtilityValues {
  staking?: string;
  vr?: string;
  governance?: string;
  game?: string;
}

export interface IInitialUpdateValues {
  name: string;
  payoutAddress: string;
  description: string;
  shortUrl: string;
  royalty: number;
  bannerUrl?: File[] | string;
  thumbnailUrl?: File[] | string;
  social: ISocialValues;
  utility: IUtilityValues;
}

const DialogEditCollection: FC<IDialogEditCollectionProps> = (props) => {
  const { open, onToggle, dataCollection, onLoadData } = props;
  const { icon } = useSelector((state:any) => state.theme);
  const windowMode = useDetectWindowMode();
  const { priceNativeCoinUsd, priceUmadUsd, walletAddress } = useSelector((state: any) => ({
    priceNativeCoinUsd: state?.system?.priceNativeCoinUsd,
    priceUmadUsd: state?.system?.priceUmadUsd,
    walletAddress: state?.user?.data?.walletAddress,
  }));

  const [toggleFlowSteps, setToggleFlowSteps] = useState(false);
  const [addressSetter, setAddressSetter] = useState<string>('');

  const { account, library, chainId } = useWeb3React();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!walletAddress) {
      dispatch(removeEventChangePage(1));
      router.push('/marketplace');
    }
  }, [walletAddress]);

  useEffect(() => {
    if (chainId && chainId?.toString() !== NETWORK_CHAIN_ID) {
      dispatch(removeEventChangePage(1));
      router.push('/marketplace');
    }
  }, [chainId]);

  useEffect(() => {
    if (!library) return;
    const onChangeAccount = ([accountConnected]: any) => {
      if (accountConnected === account) return;
      dispatch(removeEventChangePage(1));
      router.push('/marketplace');
    };

    if (library?.provider && library?.provider?.on) {
      library.provider && library.provider.on('accountsChanged', onChangeAccount);
    }
    return () => {
      library?.provider?.removeListener('accountsChanged', onChangeAccount); // need func reference to remove correctly
    };
  }, [account, library]);

  useEffect(() => {
    const getAddressSetter = async () => {
      const response = await checkForCollectionSetter(dataCollection?.address);
      const address = response[0] || [];
      setAddressSetter(address);
    };

    if (dataCollection?.address) {
      getAddressSetter();
    }
  }, [dataCollection?.address]);

  const handleClose = () => {
    onToggle(false);
  };

  const onCloseUpdateSuccess = (shortUrl: string) => {
    handleClose();
    onLoadData(shortUrl);
  };

  return (
    <FullScreenDialog open={open} onClose={handleClose} isHideCloseButton={true}>
      <div className="lg:bg-background-asset-detail sm:bg-background-preview-sell w-full h-full overflow-y-auto text-white max-w-[1128px] mx-auto">
        <div
          className="flex items-center ml-auto text-white cursor-pointer absolute lg:right-8 lg:top-6 right-[28px] top-[38px]"
          onClick={handleClose}
        >
          <span className="lg:inline hidden mr-2">Close</span>
          <CloseIcon style={icon} />
        </div>
        <EditCollectionForm
          handleCloseEdit={handleClose}
          dataCollection={dataCollection}
          onCloseUpdateSuccess={onCloseUpdateSuccess}
          addressSetter={addressSetter}
        />
      </div>
      <ModalFollowStep open={toggleFlowSteps} onClose={() => setToggleFlowSteps(false)} />
    </FullScreenDialog>
  );
};

export default DialogEditCollection;
