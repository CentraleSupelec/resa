// lib
import { combineReducers } from 'redux';
// src
import user from './user';
import bookings from './bookings';
import search from './search';
import currentRoom from './currentRoom';
import lastAction from './last-action';

export default combineReducers({
  user,
  search,
  bookings,
  currentRoom,
  lastAction,
});
