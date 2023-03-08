import { socketActions } from '../constants/forceUpdating';
import { utilsActions } from '../constants/utils';

export const forceUpdateInternalSale = () => {
  return {
    type: socketActions.INTERNAL_SALE,
    payload: Date.now(),
  };
};

export const removeEventChangePage = (payload: number) => {
  return {
    type: utilsActions.REMOVE_EVENT_CHANGE_PAGE,
    payload,
  };
};
