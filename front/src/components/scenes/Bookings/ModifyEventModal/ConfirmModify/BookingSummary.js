// lib
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/fontawesome-free-solid';

const BookingSummary = ({ event }) => (
  <div className="text-primary">
    Salle
    &nbsp;
    {event.room.name}
    <br />
    {moment(event.startDate)
      .utc()
      .format('dddd D MMMM YYYY')}
    <br />
    {moment(event.startDate)
      .utc()
      .format('H[h]mm')}
    &nbsp;
    <FontAwesomeIcon icon={faAngleRight} />
    &nbsp;
    {moment(event.endDate)
      .utc()
      .format('H[h]mm')}
  </div>
);

BookingSummary.propTypes = {
  event: PropTypes.object.isRequired,
};

export default BookingSummary;
