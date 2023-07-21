// lib
import { combineReducers } from 'redux';
// src
import list from './list';
import cancel from './cancel';
import modify from './modify';

export default combineReducers({
  list,
  cancel,
  modify,
});
