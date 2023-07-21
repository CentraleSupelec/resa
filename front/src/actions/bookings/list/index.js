// lib
import flatMap from 'lodash/flatMap';
import moment from 'moment';
// src
import makeActionCreator from 'actions/make';
import authenticatedFetch from 'services/authenticatedFetch';
import {
  TOGGLE_PAST_BOOKINGS,
  SHOW_MORE_PAST_BOOKINGS,
  INVALIDATE_BOOKINGS,
  REQUEST_BOOKINGS,
  RECEIVE_BOOKINGS,
  RECEIVE_BOOKINGS_FETCHING_ERROR,
  RECEIVE_FAVORITE_ROOMS,
} from './types';

export const togglePastBookings = makeActionCreator(TOGGLE_PAST_BOOKINGS);
export const showMorePastBookings = makeActionCreator(SHOW_MORE_PAST_BOOKINGS);
export const invalidateBookings = makeActionCreator(INVALIDATE_BOOKINGS);
export const requestBookings = makeActionCreator(REQUEST_BOOKINGS);

export function updateFavoriteRoomsEvents(rooms, dateObj) {
  return (dispatch, getState) => {
    const favoriteRooms = rooms || getState().bookings.list.favoriteRooms;
    const selectedDate = dateObj || getState().search.dateTime.selectedDate;
    if (favoriteRooms === null) {
      return;
    }
    dispatch({
      type: RECEIVE_FAVORITE_ROOMS,
      items: favoriteRooms.map((room) => ({
        ...room,
        events: null,
      })),
    });

    Promise.all(
      favoriteRooms.map(async (room) => {
        try {
          const favRoom = await authenticatedFetch(
            `search/favorite/${room.id}/${moment(selectedDate).format(
              'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
            )}`,
          );
          return favRoom;
        } catch (e) {
          return null;
        }
      }),
    ).then((favoriteRoomsWithEvents) => {
      const authorizedFavRooms = favoriteRoomsWithEvents.filter((r) => !!r);
      dispatch({
        type: RECEIVE_FAVORITE_ROOMS,
        items: authorizedFavRooms,
      });
    });
  };
}

function fetchFavorites(listOfBookings) {
  return (dispatch) => {
    const previousBookings = flatMap(
      listOfBookings,
      (bookingGroup) => bookingGroup.content,
    ).map((content) => content.room);
    let cumulativePreviousBookings = [];
    previousBookings.forEach((booking) => {
      const index = cumulativePreviousBookings.findIndex(
        (x) => x[1].id === booking.id,
      );
      if (index === -1) {
        cumulativePreviousBookings.push([1, booking]);
      } else {
        cumulativePreviousBookings[index][0] += 1;
      }
    });
    cumulativePreviousBookings.sort((b1, b2) => b2[0] - b1[0]);
    cumulativePreviousBookings = cumulativePreviousBookings
      .filter((_, i) => i < 3)
      .map((booking) => {
        const room = { ...booking[1], events: null };
        return room;
      });
    dispatch({
      type: RECEIVE_FAVORITE_ROOMS,
      items: cumulativePreviousBookings,
    });
    dispatch(updateFavoriteRoomsEvents(cumulativePreviousBookings));
  };
}

export const receiveBookings = makeActionCreator(RECEIVE_BOOKINGS, 'items');
export const receiveBookingsFetchingError = makeActionCreator(
  RECEIVE_BOOKINGS_FETCHING_ERROR,
);

function fetchBookings() {
  return async (dispatch) => {
    dispatch(requestBookings());

    let error;
    let data;
    try {
      data = await authenticatedFetch('user/bookings');
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveBookingsFetchingError());
    } else {
      dispatch(receiveBookings(data.eventList));
      dispatch(fetchFavorites(data.eventList));
    }
  };
}

function shouldFetchBookings(state) {
  const bookings = state.bookings.list;
  if (bookings.isFetching) {
    return false;
  }
  return bookings.needsReload;
}

export function fetchBookingsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchBookings(getState())) {
      return dispatch(fetchBookings());
    }
    return undefined;
  };
}

export function forceFetchBookings() {
  return async (dispatch) => {
    dispatch(invalidateBookings());
    dispatch(fetchBookingsIfNeeded());
  };
}
