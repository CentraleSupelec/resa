// lib
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/fontawesome-free-solid';

export default (props) => (
  <FontAwesomeIcon
    className="custom-gray-icon"
    icon={faCircleNotch}
    size="3x"
    spin
    {...props}
  />
);
