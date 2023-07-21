// lib
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/fontawesome-free-solid';
// src
import applyFilters from 'services/applyFilters';
import LoadSpinner from 'components/partials/LoadSpinner';
import RoomGroup from './RoomGroup';

const loadingAnimation = (
  <div className="text-center pt-3 pb-3" key="animation">
    <LoadSpinner />
  </div>
);
class RoomList extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    fetchRoomsIfNeeded: PropTypes.func.isRequired,
    forceFetchRooms: PropTypes.func.isRequired,
    roomGroups: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    errorWhileFetching: PropTypes.bool,
  };

  static defaultProps = {
    errorWhileFetching: false,
  };

  componentDidMount() {
    const { fetchRoomsIfNeeded } = this.props;
    fetchRoomsIfNeeded();
  }

  render() {
    const {
      isFetching,
      errorWhileFetching,
      forceFetchRooms,
      roomGroups,
      filters,
    } = this.props;
    if (isFetching) {
      return loadingAnimation;
    }

    if (errorWhileFetching) {
      return (
        <div className="card">
          <div className="card-body">
            <strong>
              Hum, une erreur s'est produite lors de la recherche de salles...
            </strong>
            <p>
              <button
                type="button"
                className="btn btn-link custom-cursor-pointer"
                onClick={forceFetchRooms}
              >
                <FontAwesomeIcon icon={faSync} />
                &nbsp; Cliquez ici pour réessayer
              </button>
            </p>
          </div>
        </div>
      );
    }

    const numResults = roomGroups.reduce(
      (acc, group) => group.content.reduce((a, room) => (room.available ? a + 1 : a), acc),
      0,
    );
    if (numResults === 0) {
      return (
        <div className="card">
          <div className="card-body">
            <strong>
              Il n'y a pas de salle disponible répondant à vos critères.
            </strong>
          </div>
        </div>
      );
    }

    return roomGroups.map((group) => (
      <RoomGroup
        groupname={group.name}
        isFavoriteRoomsGroup={group.isFavoriteRoomsGroup}
        rooms={applyFilters(group.content, filters, group.isFavoriteRoomsGroup)}
        loadingAnimation={loadingAnimation}
        key={group.name}
      />
    ));
  }
}

export default RoomList;
