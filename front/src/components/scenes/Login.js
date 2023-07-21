// lib
import React from 'react';
// src
import { loginRequest } from 'config';

export default class Login extends React.Component {
  componentDidMount() {
    window.location.href = loginRequest;
  }

  render() {
    return null;
  }
}
