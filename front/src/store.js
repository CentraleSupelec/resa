// lib
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
// src
import rootReducer from 'reducers';
import { FETCH_JWT } from 'actions/user/types';
import { CHOOSE_ROOM, UNSET_ROOM } from 'actions/rooms/select/types';

const middlewares = [thunkMiddleware];

// JSON.parse(localStorage.getItem('avatar')) : {}

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

store.subscribe(() => {
  const { lastAction: action } = store.getState();
  if (action === FETCH_JWT) {
    // jwt is a string
    localStorage.setItem('user.jwt', store.getState().user.jwt);
  } else if (action === CHOOSE_ROOM) {
    sessionStorage.setItem('currentRoom.id', store.getState().currentRoom.id);
  } else if (action === UNSET_ROOM) {
    sessionStorage.clearItem('currentRoom.id');
  }
});

export const getJWT = () => store.getState().user.jwt;
export const { dispatch } = store;
export default store;
