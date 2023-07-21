// lib
import { combineReducers } from 'redux';
// src
import { filterTitles } from 'services/string';
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
} from 'actions/bookings/modify/types';

function status(
  state = {
    modifType: null,
    eventId: null,
    frontendValidationPassed: false,
    isFetching: false,
    success: null,
    failedBecauseAlreadyBooked: null,
    attemptedConfirm: false,
  },
  action,
) {
  switch (action.type) {
    case INITIALIZE_MODIF_MODAL:
      // Reset all params here
      return {
        modifType: action.modifType,
        eventId: action.event.id,
        frontendValidationPassed: false,
        isFetching: false,
        success: null,
        failedBecauseAlreadyBooked: null,
        attemptedConfirm: false,
      };
    case ATTEMPT_MODIF_CONFIRM:
      return { ...state, attemptedConfirm: true };
    case REQUEST_MODIF:
      return {
        ...state,
        frontendValidationPassed: true,
        isFetching: true,
      };
    case RECEIVE_MODIF_CONFIRMATION:
      return {
        ...state,
        isFetching: false,
        success: true,
      };
    case RECEIVE_MODIF_UNKNOWN_ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        failedBecauseAlreadyBooked: false,
      };
    case RECEIVE_MODIF_ALREADY_BOOKED_ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        failedBecauseAlreadyBooked: true,
      };
    default:
      return state;
  }
}

function newAttributes(
  state = {
    eventName: null,
    startHour: null,
    startMinutes: null,
    endHour: null,
    endMinutes: null,
    roomId: null,
  },
  action,
) {
  switch (action.type) {
    case INITIALIZE_MODIF_MODAL:
      // Reset all params here
      return {
        eventName: action.event.name,
        startHour: new Date(action.event.startDate).getUTCHours(),
        startMinutes: new Date(action.event.startDate).getUTCMinutes(),
        endHour: new Date(action.event.endDate).getUTCHours(),
        endMinutes: new Date(action.event.endDate).getUTCMinutes(),
        roomId: action.event.room.id,
      };
    case SET_NAME_OF_MODIFIED_EVENT:
      return {
        ...state,
        eventName: filterTitles(action.newName),
      };
    case SET_START_HOUR_OF_MODIFIED_EVENT:
      return {
        ...state,
        startHour: action.newStartHour,
      };
    case SET_START_MINUTES_OF_MODIFIED_EVENT:
      return {
        ...state,
        startMinutes: action.newStartMinutes,
      };
    case SET_END_HOUR_OF_MODIFIED_EVENT:
      return {
        ...state,
        endHour: action.newEndHour,
      };
    case SET_END_MINUTES_OF_MODIFIED_EVENT:
      return {
        ...state,
        endMinutes: action.newEndMinutes,
      };
    case SET_ROOM_ID_OF_MODIFIED_EVENT:
      return {
        ...state,
        roomId: action.newRoomId,
      };
    default:
      return state;
  }
}

const modify = combineReducers({
  status,
  newAttributes,
});

export default modify;
