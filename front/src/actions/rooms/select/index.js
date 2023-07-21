// src
import makeActionCreator from 'actions/make';
import {
  UNSET_ROOM,
  CHOOSE_ROOM,
} from './types';

export const unsetRoom = makeActionCreator(UNSET_ROOM);
export const chooseRoom = makeActionCreator(CHOOSE_ROOM, 'payload');
