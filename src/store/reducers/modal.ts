import { modalActions, MODAL_TYPE, CONNECT_WALLET_STEP_LOGIN } from 'store/constants/modal';

export interface IModalState {
  toggleModalSuccessItemSale?: boolean;
  toggleModalConnectWallet?: boolean;
  toggleModalMakeAnOffer?: boolean;
  toggleModalAcceptOffer?: boolean;
  toggleModalSellAsset?: boolean;
  toggleModalCompleteCheckout?: boolean;
  toggleModalProcessingMakeOffer?: boolean;
  stepConnectWallet?: CONNECT_WALLET_STEP_LOGIN;
}

const initialState: IModalState = {
  toggleModalSuccessItemSale: false,
  toggleModalConnectWallet: false,
  toggleModalMakeAnOffer: false,
  toggleModalAcceptOffer: false,
  toggleModalSellAsset: false,
  toggleModalCompleteCheckout: false,
  toggleModalProcessingMakeOffer: false,
  stepConnectWallet: undefined,
};

const modalReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case modalActions.SET_CONNECT_WALLET_STEP: {
      const { stepConnectWallet } = action.payload;
      if (stepConnectWallet === '-1') {
        return {
          ...initialState,
        };
      }

      return {
        ...state,
        stepConnectWallet,
      };
    }

    case modalActions.MODAL_TOGGLE_MODAL: {
      /**
       * * type: MODAL_TYPE
       * * status: status of modal
       */
      const { type, status } = action.payload;
      switch (type) {
        case MODAL_TYPE.CONNECT_WALLET:
          return {
            ...state,
            toggleModalConnectWallet: status ?? !state.toggleModalConnectWallet,
          };

        case MODAL_TYPE.SUCCESS_ITEM_SALE:
          return {
            ...state,
            toggleModalSuccessItemSale: status ?? !state.toggleModalSuccessItemSale,
          };

        case MODAL_TYPE.ACCEPT_OFFER:
          return {
            ...state,
            toggleModalAcceptOffer: status ?? !state.toggleModalAcceptOffer,
          };

        case MODAL_TYPE.MAKE_AN_OFFER:
          return {
            ...state,
            toggleModalMakeAnOffer: status ?? !state.toggleModalMakeAnOffer,
          };

        case MODAL_TYPE.SELL_ASSET:
          return {
            ...state,
            toggleModalSellAsset: status ?? !state.toggleModalSellAsset,
          };

        case MODAL_TYPE.COMPLETE_CHECKOUT:
          return {
            ...state,
            toggleModalCompleteCheckout: status ?? !state.toggleModalCompleteCheckout,
          };
        case MODAL_TYPE.PROCESSING_MAKE_OFFER:
          return {
            ...state,
            toggleModalProcessingMakeOffer: status ?? !state.toggleModalProcessingMakeOffer,
          };
        default:
          return { ...state };
      }
    }

    case modalActions.CLOSE_ALL_MODAL: {
      return {
        ...state,
        toggleModalSuccessItemSale: false,
        toggleModalMakeAnOffer: false,
        toggleModalAcceptOffer: false,
        toggleModalSellAsset: false,
        toggleModalCompleteCheckout: false,
        toggleModalProcessingMakeOffer: false,
      };
    }

    default: {
      return state;
    }
  }
};

export default modalReducer;
