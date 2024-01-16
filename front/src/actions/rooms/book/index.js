// src
import makeActionCreator from 'actions/make';
import authenticatedFetch from 'services/authenticatedFetch';
import getFormattedDate from 'services/getFormattedDate';
import { forceFetchRooms } from 'actions/rooms/list';
import { forceFetchBookings } from 'actions/bookings/list';
import {
  SELECT_ROOM_TO_BOOK,
  SET_EVENT_NAME,
  SET_FOR_USER_NAME,
  SET_VIDEO_PROVIDER,
  ATTEMPT_BOOK_CONFIRM,
  REQUEST_BOOK,
  RECEIVE_BOOK_CONFIRMATION,
  RECEIVE_BOOK_UNKNOWN_ERROR,
  RECEIVE_ROOM_ALREADY_BOOKED_ERROR,
  RECEIVE_FAILED_BECAUSE_MISSING_EMAIL_ERROR,
  RECEIVE_FAILED_BECAUSE_NEED_PERMISSION,
} from './types';

export const selectRoomToBook = makeActionCreator(
  SELECT_ROOM_TO_BOOK,
  'payload',
);
export const setEventName = makeActionCreator(SET_EVENT_NAME, 'payload');
export const setForUserName = makeActionCreator(SET_FOR_USER_NAME, 'payload');
export const setVideoProvider = makeActionCreator(
  SET_VIDEO_PROVIDER,
  'payload',
);
export const attemptBookConfirm = makeActionCreator(ATTEMPT_BOOK_CONFIRM);
export const requestBook = makeActionCreator(REQUEST_BOOK);
export const receiveBookConfirmation = makeActionCreator(
  RECEIVE_BOOK_CONFIRMATION,
  'payload',
);
export const receiveBookUnknownError = makeActionCreator(
  RECEIVE_BOOK_UNKNOWN_ERROR,
);
export const receiveRoomAlreadyBookedError = makeActionCreator(
  RECEIVE_ROOM_ALREADY_BOOKED_ERROR,
);
export const receiveFailedBecauseMissingEmailError = makeActionCreator(
  RECEIVE_FAILED_BECAUSE_MISSING_EMAIL_ERROR,
);
export const receiveFailedBecauseNeedPermission = makeActionCreator(
  RECEIVE_FAILED_BECAUSE_NEED_PERMISSION,
);

export function sendBookRequest() {
  return async (dispatch, getState) => {
    dispatch(attemptBookConfirm());

    const state = getState();
    const { room, eventName, forUserName, videoProvider } = state.search.book;
    const { selectedDate, selectedStartTime, selectedEndTime } =
      state.search.dateTime;
    const formattedDate = getFormattedDate(
      selectedDate,
      selectedStartTime,
      selectedEndTime,
    );

    // Do nothing if eventName is empty
    if (!eventName) return;

    dispatch(requestBook());

    try {
      const data = await authenticatedFetch('book/add', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: forUserName ? `<${forUserName}> ${eventName}` : eventName,
          videoProvider,
          startDate: formattedDate.start,
          endDate: formattedDate.end,
          roomId: room.id,
        }),
      });

      if (data.failedBecauseMissingEmail) {
        dispatch(receiveFailedBecauseMissingEmailError());
      } else if (data.failedBecauseAlreadyBooked) {
        dispatch(receiveRoomAlreadyBookedError());
      } else if (data.failedBecauseNeedPermission) {
        dispatch(receiveFailedBecauseNeedPermission());
        // Reload available rooms
        dispatch(forceFetchRooms());
        // Preload or reload Bookings
        dispatch(forceFetchBookings());
      } else {
        // Success !
        dispatch(receiveBookConfirmation(data));
        // Reload available rooms
        dispatch(forceFetchRooms());
        // Preload or reload Bookings
        dispatch(forceFetchBookings());
      }
    } catch (e) {
      dispatch(receiveBookUnknownError());
    }
  };
}
