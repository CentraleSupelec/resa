// src
import {
  INVALIDATE_ROOMS,
  REQUEST_ROOMS,
  RECEIVE_ROOMS,
  RECEIVE_ROOMS_FETCHING_ERROR,
} from 'actions/rooms/list/types';

export default function list(
  state = {
    needsReload: true,
    isFetching: false,
    errorWhileFetching: null,
    roomGroups: [],
    lastFetchSelectedDate: null,
    lastFetchStartTime: null,
    lastFetchEndTime: null,
  },
  action,
) {
  switch (action.type) {
    case INVALIDATE_ROOMS:
      return {
        ...state,
        needsReload: true,
      };
    case REQUEST_ROOMS:
      return {
        ...state,
        needsReload: false,
        isFetching: true,
        lastFetchSelectedDate: action.selectedDate,
        lastFetchSelectedStartTime: action.selectedStartTime,
        lastFetchSelectedEndTime: action.selectedEndTime,
      };
    case RECEIVE_ROOMS:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: false,
        roomGroups: action.items,
      };
    case RECEIVE_ROOMS_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: true,
      };
    default:
      return state;
  }
}
