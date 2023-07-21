// src
import makeActionCreator from 'actions/make';
import {
  DISCONNECT,
  FETCH_JWT,
  FETCH_MEMBER,
} from './types';

export const disconnect = makeActionCreator(DISCONNECT);
export const fetchJWT = makeActionCreator(FETCH_JWT, 'payload');
export const fetchMember = makeActionCreator(FETCH_MEMBER, 'payload');
