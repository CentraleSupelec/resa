// lib
import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import InfiniteScroll from 'react-infinite-scroller';
import ReactTooltip from 'react-tooltip';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/fontawesome-free-solid';
// src
import Room from 'containers/scenes/Search/RoomList/Room';

export default class RoomGroup extends React.PureComponent {
  static propTypes = {
    groupname: PropTypes.string.isRequired,
    rooms: PropTypes.array.isRequired,
    loadingAnimation: PropTypes.object.isRequired,
    isFavoriteRoomsGroup: PropTypes.bool,
  };

  static defaultProps = {
    isFavoriteRoomsGroup: false,
  };

  state = { isOpened: false, roomsToDisplay: 10 };

  handleLoadMoreRooms = () => {
    this.setState((prevState) => ({
      roomsToDisplay: prevState.roomsToDisplay + 10,
    }));
  };

  toggleRooms = () => {
    this.setState((prevState) => ({ isOpened: !prevState.isOpened }));
  };

  render() {
    const roomsToDisplayInitially = 3;

    const {
      groupname,
      rooms,
      loadingAnimation,
      isFavoriteRoomsGroup,
    } = this.props;

    const { isOpened, roomsToDisplay } = this.state;

    if (rooms.length === 0) {
      return null;
    }

    return (
      <>
        <div className="row justify-content-between align-items-center no-gutters">
          <div className="col-md-auto">
            <h4 className="pt-0">
              {`${isFavoriteRoomsGroup ? '' : 'Bâtiment '}${groupname} (${
                rooms.length
              } salles)`}
            </h4>
          </div>
          <div className="col-md-auto">
            {isOpened && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.toggleRooms}
              >
                Réduire
              </button>
            )}
          </div>
        </div>
        <ul>
          {rooms.slice(0, roomsToDisplayInitially).map((room) => (
            <li key={room.id}>
              <Room room={room} />
            </li>
          ))}
          {!isOpened && rooms.length > roomsToDisplayInitially && (
            <div className="text-center">
              <button
                className="btn btn-link custom-cursor-pointer"
                type="button"
                onClick={this.toggleRooms}
                data-tip="Afficher plus de salles dans ce bâtiment"
                data-for={`${groupname.split(' ').join('-')}-show-more`}
              >
                <FontAwesomeIcon icon={faEllipsisH} />
              </button>
              <ReactTooltip
                id={`${groupname.split(' ').join('-')}-show-more`}
                effect="solid"
              />
            </div>
          )}
          <Collapse isOpened={isOpened}>
            <InfiniteScroll
              pageStart={0}
              loadMore={this.handleLoadMoreRooms}
              hasMore={roomsToDisplay < rooms.length}
              loader={loadingAnimation}
            >
              {rooms
                .slice(roomsToDisplayInitially, roomsToDisplay)
                .map((room) => (
                  <li key={room.id}>
                    <Room
                      room={room}
                      isFavoriteRoomsGroup={isFavoriteRoomsGroup}
                    />
                  </li>
                ))}
            </InfiniteScroll>
          </Collapse>
        </ul>
      </>
    );
  }
}
