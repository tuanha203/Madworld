import { useSelector, useDispatch } from 'react-redux';
import { modalActions, MODAL_TYPE } from 'store/constants/modal';

const useConnectWallet = () => {
  const { walletAddress } = useSelector((state: any) => ({
    walletAddress: state.user.data.walletAddress,
  }));

  const dispatch = useDispatch();

  const openModalConnectWallet = () => {
    if (!walletAddress) {
      dispatch({
        type: modalActions.MODAL_TOGGLE_MODAL,
        payload: {
          type: MODAL_TYPE.CONNECT_WALLET,
          status: true,
        },
      });
    }
  };

  return {
    openModalConnectWallet,
  };
};

export default useConnectWallet;
