// lib
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/fontawesome-free-solid';
import moment from 'moment';
import 'moment/locale/fr';
// src
import ConfirmModal from 'components/partials/Modals/ConfirmModal';

const ConfirmCancel = ({ event, cancelBooking }) => {
  const body = (
    <div className="row align-items-center justify-content-center">
      <div className="col-auto">Réservation à annuler :</div>
      <div className="col-auto">
        <h6 className="mb-1">{event.name}</h6>
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
      </div>
    </div>
  );

  return (
    <ConfirmModal
      title="Annulation de votre réservation"
      body={body}
      confirmButtonText={(
        <span>
          Annuler
          <span className="d-none d-sm-inline"> la réservation</span>
        </span>
)}
      confirmButtonFunction={cancelBooking}
      cancelActionText="Ne pas annuler"
      clearFunction={null}
    />
  );
};

ConfirmCancel.propTypes = {
  event: PropTypes.object.isRequired,
  cancelBooking: PropTypes.func,
};

ConfirmCancel.defaultProps = {
  cancelBooking: null,
};

export default ConfirmCancel;
