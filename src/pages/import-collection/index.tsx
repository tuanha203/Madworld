import { walletConnect } from 'blockchain/connectors';
import { ClosingIcon } from 'components/common/iconography/IconBundle';
import ImportCollection from 'components/templates/import-collection';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CONNECT_WALLET_STEP_LOGIN } from 'store/constants/modal';
import { IModalState } from 'store/reducers/modal';
const ImportCollectionPage = () => {
  const router = useRouter();
  const [isImport, setIsImport] = useState(false);

  const { walletAddress: userLogin } = useSelector((state) => (state as any)?.user?.data || '');
  const { stepConnectWallet } = useSelector(
    (state: { modal: IModalState }) => state.modal,
  );
    
  useEffect( () => {
    if(!userLogin || stepConnectWallet === CONNECT_WALLET_STEP_LOGIN.WRONG_NETWORK) {
      router.push('/marketplace')
    }
  }, [userLogin, stepConnectWallet])
  
  return (
    <div className={`bg-background-asset-detail flex items-center justify-center py-[20vh]`}>
      <div
        className={`flex items-center ml-auto text-white cursor-pointer absolute right-8 top-5 ${
          isImport && 'cursor-not-allowed'
        }`}
        onClick={() => !isImport && router.back()}
      >
        <span className="mr-2">Close</span>
        <ClosingIcon />
      </div>
      <ImportCollection isImport={setIsImport} />
    </div>
  );
};

export default ImportCollectionPage;
