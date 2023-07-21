// lib
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/fontawesome-free-solid';
import moment from 'moment';
import 'moment/locale/fr';
// src
import extractResources from 'services/extractResources';
import RoomResource from 'containers/partials/RoomResource';

const Room = ({
  room, handleSelectRoomToBook, selectedDate,
}) => {

  return (
    <div
      className="card custom-hover-darkens mb-3"
      onClick={handleSelectRoomToBook}
      role="button"
      data-toggle="modal"
      data-target="#roomBookModal"
    >
      <div
        className={`card-body ${
          room.available ? '' : ' bg-light custom-disabled'
        }`}
      >
        <div className="row align-items-center custom-no-margin-under-sm">
          <div className="col-sm-4 custom-no-padding-under-sm custom-text-center-under-sm">
            <h2 className="custom-text-color-cs">
              {room.name}
              &nbsp;
            </h2>
          </div>
          <div className="col-sm-8 custom-no-padding-under-sm">
            <ul>
              {extractResources(room).map((res) => (
                <RoomResource key={`${room.id}#${res.type}`} resource={res} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

Room.propTypes = {
  room: PropTypes.object.isRequired,
  handleSelectRoomToBook: PropTypes.func.isRequired,
  selectedDate: PropTypes.object.isRequired,
};

export default Room;
