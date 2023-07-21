// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import BookingSummary from './BookingSummary';

const NameChangeBody = ({
  event,
  handleNameInputChange,
  eventName,
  detectEnter,
  attemptedConfirm,
}) => [
  <div
    className={attemptedConfirm ? 'form-group was-validated' : 'form-group'}
    key="eventNameForm"
  >
    <label htmlFor="eventName">Titre de l'évènement :</label>
    <input
      type="text"
      className={eventName ? 'form-control valid' : 'form-control invalid'}
      id="eventName"
      maxLength="50"
      value={eventName}
      onChange={handleNameInputChange}
      onKeyPress={detectEnter}
      required
    />
    <div className="invalid-feedback">
      Veuillez indiquer l'objet de l'évènement
    </div>
  </div>,
  <div className="text-center" key="eventDetails">
    <BookingSummary event={event} />
  </div>,
];

NameChangeBody.propTypes = {
  event: PropTypes.object.isRequired,
  handleNameInputChange: PropTypes.func.isRequired,
  eventName: PropTypes.string.isRequired,
  detectEnter: PropTypes.func.isRequired,
  attemptedConfirm: PropTypes.bool.isRequired,
};

export default NameChangeBody;
