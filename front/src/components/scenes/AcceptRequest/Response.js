// lib
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/fontawesome-free-solid';

const Response = ({ isCancelled, booking }) => (
  <>
    <FontAwesomeIcon
      icon={isCancelled ? faTimes : faCheck}
      style={{ color: '#9a1739' }}
    />
    &nbsp;
    La demande de réservation a bien été
    &nbsp;
    <span className="font-weight-bold custom-text-color-cs">
      {isCancelled ? 'déclinée' : 'acceptée'}
    </span>
    &nbsp;
    et
    &nbsp;
    <a href={`mailto:${booking.userEmail}`}>
      {booking.userFirstName}
      &nbsp;
      {booking.userLastName}
    </a>
    &nbsp;
    en a été informé.
  </>
);

Response.propTypes = {
  isCancelled: PropTypes.bool.isRequired,
  booking: PropTypes.object.isRequired,
};

export default Response;
