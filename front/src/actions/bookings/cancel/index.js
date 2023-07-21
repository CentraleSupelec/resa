// src
import makeActionCreator from 'actions/make';
import authenticatedFetch from 'services/authenticatedFetch';
import { forceFetchBookings } from 'actions/bookings/list';
import { forceFetchRooms } from 'actions/rooms/list';

import {
  OPEN_CANCEL_MODAL,
  REQUEST_CANCEL,
  RECEIVE_CANCEL_CONFIRMATION,
  RECEIVE_CANCEL_ERROR,
} from './types';

export const openCancelModal = makeActionCreator(OPEN_CANCEL_MODAL, 'eventId');
export const requestCancel = makeActionCreator(REQUEST_CANCEL);
export const receiveCancelConfirmation = makeActionCreator(RECEIVE_CANCEL_CONFIRMATION);
export const receiveCancelError = makeActionCreator(RECEIVE_CANCEL_ERROR);

export function sendCancelRequest(eventId) {
  return async (dispatch) => {
    dispatch(requestCancel());

    let error;
    try {
      await authenticatedFetch('book/cancel', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      });
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveCancelError());
    } else {
      dispatch(receiveCancelConfirmation());
      dispatch(forceFetchBookings());
      dispatch(forceFetchRooms());
    }
  };
}
