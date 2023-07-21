// lib
import jwtDecode from 'jwt-decode';
// src
import { DISCONNECT, FETCH_JWT, FETCH_MEMBER } from 'actions/user/types';

// Initial localStorage value

// Helpers
const isLogged = (jwt) => !!jwt;
const isAdmin = (infos) => infos && !!infos.adminPermissions;
const isSuperAdmin = (infos) => infos
  && infos.adminPermissions
  && infos.adminPermissions.includes('SUPER_ADMIN');

const initStateFromJWT = (jwt = null) => {
  const infos = jwt ? jwtDecode(jwt) : null;
  return {
    jwt,
    infos,
    isLogged: isLogged(jwt),
    isAdmin: isAdmin(infos),
    isSuperAdmin: isSuperAdmin(infos),
    member: null,
    isLoaded: false,
    // for validation groups
    memberOf: [],
    managerOf: [],
    isManager: false,
    // for control lists (greylists)
    greylistManagerOf: [],
    isGreylistManager: false,
    hasRightToAddManagers: false,
  };
};

const stateFromMember = (state, member) => {
  const isLoaded = true; // even if user is not a member, considered "loaded"
  const hasRightToAddManagers = state.isAdmin
    && (state.infos.adminPermissions.includes('SUPER_ADMIN')
      || state.infos.adminPermissions.includes('ADD_MANAGER'));
  const greylistManagerOf = member
    ? member.greylistManagerOf.map(({ name }) => name)
    : [];
  const isGreylistManager = greylistManagerOf.length > 0;
  if (!member || !member.memberOf) {
    return {
      ...state,
      isLoaded,
      hasRightToAddManagers,
      greylistManagerOf,
      isGreylistManager,
    };
  }
  const memberOf = member.memberOf.map(({ groupId }) => groupId);
  const managerOf = member.managerOf.map(({ groupId }) => groupId);
  const isManager = managerOf.length > 0;
  return {
    ...state,
    isLoaded,
    hasRightToAddManagers,
    memberOf,
    managerOf,
    isManager,
    greylistManagerOf,
    isGreylistManager,
  };
};

const user = (
  state = initStateFromJWT(localStorage.getItem('user.jwt')),
  action,
) => {
  switch (action.type) {
    case DISCONNECT:
      localStorage.clear();
      return initStateFromJWT();
    case FETCH_JWT: {
      const { payload: jwt } = action;
      return initStateFromJWT(jwt);
    }
    case FETCH_MEMBER: {
      const { payload: member } = action;
      return stateFromMember(state, member);
    }
    default:
      return state;
  }
};

export default user;
