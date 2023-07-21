// src
import makeActionCreator from 'actions/make';
import { updateFavoriteRoomsEvents } from 'actions/bookings/list';
import {
  SELECT_DATE,
  SELECT_START_TIME,
  SELECT_END_TIME,
  TOGGLE_DATE_PICKER,
  HIDE_DATE_PICKER,
  SHOW_DATE_PICKER,
  TOGGLE_TIME_PICKER,
  HIDE_TIME_PICKER,
  SHOW_TIME_PICKER,
  HIDE_DATETIME_STATUS_BAR,
} from './types';

export function selectDate(dateObj) {
  return (dispatch) => {
    dispatch({
      type: SELECT_DATE,
      payload: dateObj,
    });
    dispatch(updateFavoriteRoomsEvents(undefined, dateObj));
  };
}

export const selectStartTime = makeActionCreator(SELECT_START_TIME, 'payload');
export const selectEndTime = makeActionCreator(SELECT_END_TIME, 'payload');
export const toggleDatePicker = makeActionCreator(TOGGLE_DATE_PICKER);
export const hideDatePicker = makeActionCreator(HIDE_DATE_PICKER);
export const showDatePicker = makeActionCreator(SHOW_DATE_PICKER);
export const toggleTimePicker = makeActionCreator(TOGGLE_TIME_PICKER);
export const hideTimePicker = makeActionCreator(HIDE_TIME_PICKER);
export const showTimePicker = makeActionCreator(SHOW_TIME_PICKER);
export const hideDatetimeStatusBar = makeActionCreator(HIDE_DATETIME_STATUS_BAR);
