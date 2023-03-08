import { socketActions } from 'store/constants/forceUpdating';
import { utilsActions } from 'store/constants/utils';

export interface IForceUpdatingState {
  internalSale: number;
  eventChangePage: number;
}

const initialState: IForceUpdatingState = {
  internalSale: 0,
  eventChangePage: 0,
};

const forceUpdatingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case socketActions.INTERNAL_SALE: {
      return {
        ...state,
        internalSale: action.payload,
      };
    }

    case utilsActions.REMOVE_EVENT_CHANGE_PAGE: {
      return {
        ...state,
        eventChangePage: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default forceUpdatingReducer;
