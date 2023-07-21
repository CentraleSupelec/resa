// src
import {
  OPEN_CANCEL_MODAL,
  REQUEST_CANCEL,
  RECEIVE_CANCEL_CONFIRMATION,
  RECEIVE_CANCEL_ERROR,
} from 'actions/bookings/cancel/types';

function cancel(
  state = {
    eventId: null,
    userConfirmedCancellation: false,
    isFetching: false,
    success: null,
  },
  action,
) {
  switch (action.type) {
    case OPEN_CANCEL_MODAL:
      // Reset all params here
      return {
        ...state,
        eventId: action.eventId,
        userConfirmedCancellation: false,
        isFetching: false,
        success: null,
      };
    case REQUEST_CANCEL:
      return {
        ...state,
        userConfirmedCancellation: true,
        isFetching: true,
      };
    case RECEIVE_CANCEL_CONFIRMATION:
      return {
        ...state,
        isFetching: false,
        success: true,
      };
    case RECEIVE_CANCEL_ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
      };
    default:
      return state;
  }
}

export default cancel;
