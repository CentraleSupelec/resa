// src
import {
  TOGGLE_PAST_BOOKINGS,
  SHOW_MORE_PAST_BOOKINGS,
  INVALIDATE_BOOKINGS,
  REQUEST_BOOKINGS,
  RECEIVE_BOOKINGS,
  RECEIVE_BOOKINGS_FETCHING_ERROR,
  RECEIVE_FAVORITE_ROOMS,
} from 'actions/bookings/list/types';

export default function list(
  state = {
    needsReload: true,
    isFetching: false,
    errorWhileFetching: null,
    bookingGroups: [],
    favoriteRooms: null,
    displayPastBookings: false,
    pastBookingsToDisplay: 10,
  },
  action,
) {
  switch (action.type) {
    case TOGGLE_PAST_BOOKINGS:
      return {
        ...state,
        displayPastBookings: !state.displayPastBookings,
        pastBookingsToDisplay: 10,
      };
    case SHOW_MORE_PAST_BOOKINGS:
      return {
        ...state,
        pastBookingsToDisplay: state.pastBookingsToDisplay + 10,
      };
    case INVALIDATE_BOOKINGS:
      return {
        ...state,
        needsReload: true,
      };
    case REQUEST_BOOKINGS:
      return {
        ...state,
        needsReload: false,
        isFetching: true,
      };
    case RECEIVE_BOOKINGS:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: false,
        bookingGroups: action.items,
      };
    case RECEIVE_BOOKINGS_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: true,
      };
    case RECEIVE_FAVORITE_ROOMS:
      return {
        ...state,
        favoriteRooms: action.items,
      };
    default:
      return state;
  }
}
