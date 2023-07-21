// lib
import { combineReducers } from 'redux';
// src
import directLinkHandler from './directLinkHandler';
import dateTime from './dateTime';
import filters from './filters';
import book from './book';
import list from './list';

export default combineReducers({
  directLinkHandler,
  dateTime,
  filters,
  book,
  list,
});
