// lib
import React from 'react';
import querystring from 'querystring';
// src
import config from '../../config';

export default class Logout extends React.Component {
  componentDidMount() {
    // Remove user jwt and infos from local storage
    localStorage.clear();
    sessionStorage.clear();

    // Logout from CAS
    const query = querystring.stringify({
      service: config.cas.logoutService,
    });
    window.location.href = `${config.cas.logoutUrl}?${query}`;
  }

  render() {
    return null;
  }
}
