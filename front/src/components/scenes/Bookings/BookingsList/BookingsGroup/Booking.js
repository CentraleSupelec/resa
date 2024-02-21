// lib
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/fontawesome-free-solid';
import moment from 'moment';
import 'moment/locale/fr';
// src
import RoomResource from 'containers/partials/RoomResource';
import extractResources from 'services/extractResources';

const Booking = ({ event, handleCancelEvent, handleModifyEvent, isFuture }) => (
  <div className="card mb-3">
    <div className="card-body">
      <div className="row align-items-center justify-content-between">
        <div className="col-lg-2 custom-text-center-under-lg">
          <h2 className="custom-text-color-cs">
            {event.room && event.room.name}
            &nbsp;
          </h2>
        </div>
        <div className="col-lg-4">
          <ul>
            {event.room &&
              extractResources(event.room, true).map((res) => (
                <RoomResource
                  key={`${event.room.id}#${res.type}`}
                  resource={res}
                  showBuilding
                />
              ))}
          </ul>
        </div>
        <div className="col-lg-3 my-4 custom-info-text-color">
          <h5>{event.name}</h5>
          {moment(event.startDate).utc().format('dddd D MMMM YYYY')}
          <br />
          {moment(event.startDate).utc().format('H[h]mm')}
          &nbsp;
          <FontAwesomeIcon icon={faAngleRight} />
          &nbsp;
          {moment(event.endDate).utc().format('H[h]mm')}
        </div>
        <div className="col-lg-3 custom-text-right-above-lg custom-text-center-under-lg">
          {isFuture && !event.local && (
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Modifier
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <button
                  type="button"
                  className="dropdown-item"
                  data-toggle="modal"
                  data-target="#modifyEventModal"
                  onClick={() => {
                    handleModifyEvent(event, 'name');
                  }}
                >
                  Modifier le titre
                </button>
                {event.room.allowBooking && (
                  <button
                    type="button"
                    className="dropdown-item"
                    data-toggle="modal"
                    data-target="#modifyEventModal"
                    onClick={() => {
                      handleModifyEvent(event, 'time');
                    }}
                  >
                    Modifier l'horaire
                  </button>
                )}

                <div className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item"
                  data-toggle="modal"
                  data-target="#cancelEventModal"
                  onClick={() => handleCancelEvent(event.id)}
                >
                  Annuler la réservation
                </button>
              </div>
            </div>
          )}
          {event.local && <div>Réservation en attente de validation</div>}
        </div>
      </div>
    </div>
  </div>
);

Booking.propTypes = {
  event: PropTypes.object.isRequired,
  isFuture: PropTypes.bool.isRequired,
  handleModifyEvent: PropTypes.func,
  handleCancelEvent: PropTypes.func,
};

Booking.defaultProps = {
  handleModifyEvent: null,
  handleCancelEvent: null,
};

export default Booking;
