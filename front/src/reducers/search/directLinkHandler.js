// lib
import { combineReducers } from 'redux';
// src
import {
  SET_ROOM_ID,
  REQUEST_ROOM_DETAIL,
  RECEIVE_ROOM_DETAIL,
  RECEIVE_ROOM_DETAIL_FETCHING_ERROR,
  TOGGLE_ACTION_SELECTOR,
  REQUEST_ROOM_AGENDA,
  RECEIVE_ROOM_AGENDA,
  RECEIVE_ROOM_AGENDA_FETCHING_ERROR,
} from 'actions/rooms/directLinkHandler/types';

function actionSelector(
  state = {
    displayActionSelector: true,
    isFetching: false,
    errorWhileFetching: null,
    roomId: null,
    room: null,
  },
  action,
) {
  switch (action.type) {
    case SET_ROOM_ID:
      return {
        ...state,
        roomId: action.roomId,
      };
    case REQUEST_ROOM_DETAIL:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_ROOM_DETAIL:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: false,
        room: action.room,
      };
    case RECEIVE_ROOM_DETAIL_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: true,
      };
    case TOGGLE_ACTION_SELECTOR:
      return {
        ...state,
        displayActionSelector: !state.displayActionSelector,
      };
    default:
      return state;
  }
}

function roomAgenda(
  state = {
    isFetching: false,
    errorWhileFetching: false,
    success: false,
    errorStatus: null,
  },
  action,
) {
  switch (action.type) {
    case REQUEST_ROOM_AGENDA:
      return {
        ...state,
        isFetching: true,
        errorWhileFetching: false,
        success: false,
        errorStatus: null,
      };
    case RECEIVE_ROOM_AGENDA:
      return {
        ...state,
        isFetching: false,
        success: true,
      };
    case RECEIVE_ROOM_AGENDA_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: true,
        success: false,
        errorStatus: action.status,
      };
    default:
      return state;
  }
}

const directLinkHandler = combineReducers({
  actionSelector,
  roomAgenda,
});

export default directLinkHandler;
