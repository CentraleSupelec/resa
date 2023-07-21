// src
import makeActionCreator from 'actions/make';
import authenticatedFetch from 'services/authenticatedFetch';
import getFormattedDate from 'services/getFormattedDate';
import { selectRoomToBook } from 'actions/rooms/book';
import {
  SET_ROOM_ID,
  REQUEST_ROOM_DETAIL,
  RECEIVE_ROOM_DETAIL,
  RECEIVE_ROOM_DETAIL_FETCHING_ERROR,
  TOGGLE_ACTION_SELECTOR,
  REQUEST_ROOM_AGENDA,
  RECEIVE_ROOM_AGENDA,
  RECEIVE_ROOM_AGENDA_FETCHING_ERROR,
} from './types';

export const setRoomId = makeActionCreator(SET_ROOM_ID, 'roomId');
export const requestRoomDetail = makeActionCreator(REQUEST_ROOM_DETAIL);
export const receiveRoomDetail = makeActionCreator(RECEIVE_ROOM_DETAIL, 'room');
export const receiveRoomDetailFetchingError = makeActionCreator(
  RECEIVE_ROOM_DETAIL_FETCHING_ERROR,
);

export function fetchRoomDetail() {
  return async (dispatch, getState) => {
    const { roomId } = getState().search.directLinkHandler.actionSelector;
    dispatch(requestRoomDetail());

    let error;
    let data;
    const currentDate = new Date();
    try {
      data = await authenticatedFetch(
        `room/detail/${roomId}/${currentDate.toISOString()}`,
      );
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveRoomDetailFetchingError());
    } else {
      dispatch(receiveRoomDetail(data));
    }
  };
}

export const toggleActionSelector = makeActionCreator(TOGGLE_ACTION_SELECTOR);
export const requestRoomAgenda = makeActionCreator(REQUEST_ROOM_AGENDA);
export const receiveRoomAgenda = makeActionCreator(RECEIVE_ROOM_AGENDA);
export const receiveRoomAgendaFetchingError = makeActionCreator(
  RECEIVE_ROOM_AGENDA_FETCHING_ERROR,
  'status',
);

export function fetchRoomAgenda() {
  return async (dispatch, getState) => {
    const state = getState();
    const { roomId } = state.search.directLinkHandler.actionSelector;
    const {
      selectedDate,
      selectedStartTime,
      selectedEndTime,
    } = state.search.dateTime;

    dispatch(requestRoomAgenda());
    dispatch(selectRoomToBook(null));

    const formattedDate = getFormattedDate(
      selectedDate,
      selectedStartTime,
      selectedEndTime,
    );

    let error;
    let data;
    try {
      data = await authenticatedFetch(
        `search/roomAgenda/${roomId}/${formattedDate.start}/${formattedDate.end}`,
      );
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveRoomAgendaFetchingError());
    } else {
      dispatch(receiveRoomAgenda());
      dispatch(selectRoomToBook(data));
    }
  };
}
