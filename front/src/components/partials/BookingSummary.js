// lib
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/fr';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/fontawesome-free-solid';

const BookingSummary = ({ selectedDate, startTime, endTime }) => (
  <div className="row align-items-center justify-content-left no-gutters my-4">
    <div className="col-lg-3">Créneau demandé :</div>
    <div className="col-lg-9 text-primary custom-text-center-under-lg">
      { moment(selectedDate).format('dddd D MMMM YYYY') }
      <br />
      { startTime.format('H[h]mm') }
      &nbsp;
      <FontAwesomeIcon icon={faAngleRight} />
      &nbsp;
      { endTime.format('H[h]mm') }
    </div>
  </div>
);

BookingSummary.propTypes = {
  selectedDate: PropTypes.object.isRequired,
  startTime: PropTypes.object.isRequired,
  endTime: PropTypes.object.isRequired,
};

export default BookingSummary;
