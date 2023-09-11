// lib
import querystring from 'querystring';
// src

let configBase;

try {
  configBase = require('./config-local').default;
} catch (e) {
  configBase = require('./config').default;
}

const UPSACLAY_CAS_REGEX = /^resa-upsaclay/;
const chooseHostContext = (config) => {
  if (UPSACLAY_CAS_REGEX.test(window.location.hostname)) {
    return { ...config, cas: config.altCas, back: config.altBack };
  }
  return config;
};

const config = chooseHostContext(configBase);

const loginQuery = querystring.stringify({
  service: config.cas.loginService,
});

export const loginRequest = `${config.cas.loginUrl}?${loginQuery}`;
export const CAMPUSES = ['Saclay', 'Metz', 'Rennes'];
export const CAMPUS_SACLAY = 'Saclay';
export const BUILDINGS = ['Lumen'];

export default config;
