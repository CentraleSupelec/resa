// lib
import moment from 'moment';
// src
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
} from 'actions/rooms/dateTime/types';

function getDefaultTime() {
  const start = moment();
  if (start.isAfter(moment('22', 'hh')) || start.isBefore(moment('7', 'hh'))) {
    start.hours(7);
    start.minutes(0);
  } else {
    start.minutes(Math.ceil(start.minutes() / 15) * 15);
  }

  const end = moment(start);
  end.hours(parseInt(start.hours() + 1, 10));

  return { start, end };
}

export default function dateTime(
  state = {
    selectedDate: new Date(),
    selectedStartTime: getDefaultTime().start,
    selectedEndTime: getDefaultTime().end,
    displayDatePicker: true,
    displayTimePicker: false,
    displayDateTimeStatusBar: false,
    timeNeedsUserInitialization: true,
  },
  action,
) {
  switch (action.type) {
    case SELECT_DATE:
      return {
        ...state,
        selectedDate: action.payload,
        displayDatePicker: false,
        displayDateTimeStatusBar: true,
        // If the user has never set the time, open time picker:
        displayTimePicker: state.timeNeedsUserInitialization,
      };
    case SELECT_START_TIME:
      return {
        ...state,
        selectedStartTime: action.payload,
      };
    case SELECT_END_TIME:
      return {
        ...state,
        selectedEndTime: action.payload,
      };
    case TOGGLE_DATE_PICKER:
      return {
        ...state,
        displayDatePicker: !state.displayDatePicker,
      };
    case HIDE_DATE_PICKER:
      return {
        ...state,
        displayDatePicker: false,
      };
    case SHOW_DATE_PICKER:
      return {
        ...state,
        displayDatePicker: true,
      };
    case TOGGLE_TIME_PICKER:
      return {
        ...state,
        displayTimePicker: !state.displayTimePicker,
        timeNeedsUserInitialization: false,
      };
    case HIDE_TIME_PICKER:
      return {
        ...state,
        displayTimePicker: false,
      };
    case SHOW_TIME_PICKER:
      return {
        ...state,
        displayTimePicker: true,
      };
    case HIDE_DATETIME_STATUS_BAR:
      return {
        ...state,
        displayDateTimeStatusBar: false,
      };
    default:
      return state;
  }
}
