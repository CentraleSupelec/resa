// src
import makeActionCreator from 'actions/make';
import authenticatedFetch from 'services/authenticatedFetch';
import { forceFetchBookings } from 'actions/bookings/list';
import { forceFetchRooms } from 'actions/rooms/list';
import {
  INITIALIZE_MODIF_MODAL,
  SET_NAME_OF_MODIFIED_EVENT,
  SET_START_HOUR_OF_MODIFIED_EVENT,
  SET_START_MINUTES_OF_MODIFIED_EVENT,
  SET_END_HOUR_OF_MODIFIED_EVENT,
  SET_END_MINUTES_OF_MODIFIED_EVENT,
  SET_ROOM_ID_OF_MODIFIED_EVENT,
  ATTEMPT_MODIF_CONFIRM,
  REQUEST_MODIF,
  RECEIVE_MODIF_CONFIRMATION,
  RECEIVE_MODIF_UNKNOWN_ERROR,
  RECEIVE_MODIF_ALREADY_BOOKED_ERROR,
} from './types';

export const initializeModifModal = makeActionCreator(
  INITIALIZE_MODIF_MODAL,
  'event',
  'modifType',
);
export const setNameOfModifiedEvent = makeActionCreator(
  SET_NAME_OF_MODIFIED_EVENT,
  'newName',
);
export const setStartHourOfModifiedEvent = makeActionCreator(
  SET_START_HOUR_OF_MODIFIED_EVENT,
  'newStartHour',
);
export const setStartMinutesOfModifiedEvent = makeActionCreator(
  SET_START_MINUTES_OF_MODIFIED_EVENT,
  'newStartMinutes',
);
export const setEndHourOfModifiedEvent = makeActionCreator(
  SET_END_HOUR_OF_MODIFIED_EVENT,
  'newEndHour',
);
export const setEndMinutesOfModifiedEvent = makeActionCreator(
  SET_END_MINUTES_OF_MODIFIED_EVENT,
  'newEndMinutes',
);
export const setRoomIdOfModifiedEvent = makeActionCreator(
  SET_ROOM_ID_OF_MODIFIED_EVENT,
  'newRoomId',
);
export const attemptModifConfirm = makeActionCreator(ATTEMPT_MODIF_CONFIRM);
export const requestModif = makeActionCreator(REQUEST_MODIF);
export const receiveModifConfirmation = makeActionCreator(
  RECEIVE_MODIF_CONFIRMATION,
);
export const receiveModifUnknownError = makeActionCreator(
  RECEIVE_MODIF_UNKNOWN_ERROR,
);
export const receiveModifAlreadyBookedError = makeActionCreator(
  RECEIVE_MODIF_ALREADY_BOOKED_ERROR,
);

export function sendModifRequest(event, newAttr) {
  function getUpdatedISOstring(isoDate, hour, minutes) {
    const newDate = new Date(isoDate);
    newDate.setUTCHours(hour, minutes);
    return newDate.toISOString();
  }

  return async (dispatch) => {
    dispatch(attemptModifConfirm());

    // Do nothing if eventName is empty
    if (!newAttr.eventName) return;
    dispatch(requestModif());

    // Format dates
    const newStartDate = getUpdatedISOstring(
      event.startDate,
      newAttr.startHour,
      newAttr.startMinutes,
    );
    const newEndDate = getUpdatedISOstring(
      event.startDate,
      newAttr.endHour,
      newAttr.endMinutes,
    );

    // Test if something has changed
    if (
      event.name === newAttr.eventName &&
      event.startDate === newStartDate &&
      event.endDate === newEndDate &&
      event.room.id === newAttr.roomId
    ) {
      dispatch(receiveModifConfirmation());
      return;
    }

    let unknownError;
    let data;
    try {
      data = await authenticatedFetch('book/modify', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          newEventName: newAttr.eventName,
          newStartDate,
          newEndDate,
          newRoomId: newAttr.roomId,
        }),
      });
    } catch (e) {
      unknownError = true;
    }

    if (unknownError) {
      dispatch(receiveModifUnknownError());
    } else if (!data.success) {
      dispatch(receiveModifAlreadyBookedError());
    } else {
      dispatch(receiveModifConfirmation());
      dispatch(forceFetchBookings());
      dispatch(forceFetchRooms());
    }
  };
}
