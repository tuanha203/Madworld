import { modalActions, MODAL_TYPE, CONNECT_WALLET_STEP_LOGIN } from 'store/constants/modal';

/**
 * * stepConnectWallet is only for CONNECT_WALLET modal
 * * MODAL_TYPE === CONNECT_WALLET
 */

interface IToggleModalAction {
  type: MODAL_TYPE;
  status: boolean;
}

export const toggleModal = (payload: IToggleModalAction) => {
  return (dispatch: any) => {
    dispatch({
      type: modalActions.MODAL_TOGGLE_MODAL,
      payload,
    });
  };
};

export const setConnectWalletStep = (payload: {
  stepConnectWallet?: CONNECT_WALLET_STEP_LOGIN | '-1';
}) => {
  
  return (dispatch: any) => {
    dispatch({
      type: modalActions.SET_CONNECT_WALLET_STEP,
      payload,
    });
  };
};

export const closedAllModal = () => {
  return (dispatch: any) => {
    dispatch({
      type: modalActions.CLOSE_ALL_MODAL,
    });
  };
};
