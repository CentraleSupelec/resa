// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import BookingSummary from './BookingSummary';

const ForUserNameChangeBody = ({
  event,
  handleForUserNameInputChange,
  forUserName,
  detectEnter,
  attemptedConfirm,
}) => [
  <div
    className={attemptedConfirm ? 'form-group was-validated' : 'form-group'}
    key="forUserNameForm"
  >
    <label htmlFor="forUserName">Pour le compte de :</label>
    <input
      type="text"
      className={forUserName ? 'form-control valid' : 'form-control invalid'}
      id="forUserName"
      maxLength="150"
      value={forUserName}
      onChange={handleForUserNameInputChange}
      onKeyPress={detectEnter}
    />
  </div>,
  <div className="text-center" key="eventDetails">
    <BookingSummary event={event} />
  </div>,
];

ForUserNameChangeBody.propTypes = {
  event: PropTypes.object.isRequired,
  handleForUserNameInputChange: PropTypes.func.isRequired,
  forUserName: PropTypes.string.isRequired,
  detectEnter: PropTypes.func.isRequired,
  attemptedConfirm: PropTypes.bool.isRequired,
};

export default ForUserNameChangeBody;
