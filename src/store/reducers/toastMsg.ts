import { toastMsgActons } from 'store/constants/toastMsg';

const initialState = {
  isOpen: false,
  message: '',
  type: '',
  txHash: '',
};

const toastMsgReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case toastMsgActons.OPEN:
      return {
        isOpen: true,
        ...action.payload,
      };
    case toastMsgActons.CLOSE:
      return {
        ...state,
        isOpen: false,
        message: '',
        type: '',
        txHash: '',
      }
    default: {
      return state;
    }
  }
};

export default toastMsgReducer;
