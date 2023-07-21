// src
import config from 'config';
import { dispatch, getJWT } from 'store';
import { disconnect } from 'actions/user';

export default async function authenticatedFetch(route, init) {
  // route must be without starting or trailing slash
  const char = route.includes('?') ? '&' : '?';

  const response = await fetch(
    `${config.back.url}/${route}${char}jwtToken=${getJWT()}`,
    init,
  );

  if (response.status === 401) return dispatch(disconnect());

  if (!response.ok) throw response;

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  }

  return null;
}
