// src
import makeActionCreator from 'actions/make';
import authenticatedFetch from 'services/authenticatedFetch';
import getFormattedDate from 'services/getFormattedDate';
import {
  INVALIDATE_ROOMS,
  REQUEST_ROOMS,
  RECEIVE_ROOMS,
  RECEIVE_ROOMS_FETCHING_ERROR,
} from './types';

export const invalidateRooms = makeActionCreator(INVALIDATE_ROOMS);

function requestRooms(selectedDate, selectedStartTime, selectedEndTime) {
  return {
    type: REQUEST_ROOMS,
    selectedDate: new Date(selectedDate),
    selectedStartTime: selectedStartTime.clone(),
    selectedEndTime: selectedEndTime.clone(),
  };
}

export const receiveRooms = makeActionCreator(RECEIVE_ROOMS, 'items');
export const receiveRoomsFetchingError = makeActionCreator(RECEIVE_ROOMS_FETCHING_ERROR);

function fetchRooms() {
  return async (dispatch, getState) => {
    const {
      selectedDate,
      selectedStartTime,
      selectedEndTime,
    } = getState().search.dateTime;

    dispatch(requestRooms(selectedDate, selectedStartTime, selectedEndTime));

    const formattedDate = getFormattedDate(
      selectedDate,
      selectedStartTime,
      selectedEndTime,
    );

    let error;
    let data;
    try {
      data = await authenticatedFetch(
        `search/available/${formattedDate.start}/${formattedDate.end}`,
      );
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveRoomsFetchingError());
    } else {
      dispatch(receiveRooms(data));
    }
  };
}

function shouldFetchRooms(state) {
  const bookings = state.search.list;
  if (bookings.isFetching) {
    return false;
  } if (bookings.needsReload) {
    return true;
  }

  const {
    lastFetchSelectedDate,
    lastFetchSelectedStartTime,
    lastFetchSelectedEndTime,
  } = bookings;
  const {
    selectedDate,
    selectedStartTime,
    selectedEndTime,
  } = state.search.dateTime;

  // Compare currently selected date&time with date&time used for last fetch:
  if (
    Number(lastFetchSelectedDate) === Number(selectedDate)
    && lastFetchSelectedStartTime.isSame(selectedStartTime)
    && lastFetchSelectedEndTime.isSame(selectedEndTime)
  ) {
    return false;
  }
  return true;
}

export function fetchRoomsIfNeeded() {
  // eslint-disable-next-line
  return (dispatch, getState) => {
    if (shouldFetchRooms(getState())) {
      return dispatch(fetchRooms());
    }
  };
}

export function forceFetchRooms() {
  return async (dispatch) => {
    dispatch(invalidateRooms());
    dispatch(fetchRoomsIfNeeded());
  };
}
