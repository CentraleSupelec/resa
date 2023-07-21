// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import DateTimePicker from 'containers/scenes/Search/DateTimePicker';
import Filters from 'containers/scenes/Search/Filters';
import RoomBookModal from 'containers/scenes/Search/RoomBookModal';
import RoomList from 'containers/scenes/Search/RoomList';

export default class Search extends React.Component {
  static propTypes = {
    fetchBookingsIfNeeded: PropTypes.func.isRequired,
    displayRoomList: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    const { fetchBookingsIfNeeded } = this.props;
    fetchBookingsIfNeeded();
  }

  render() {
    const { displayRoomList } = this.props;
    return (
      <>
        <div className="container">
          <DateTimePicker />
          {displayRoomList && (
            <div className="row">
              <div className="col-lg-4 mb-3">
                <Filters />
              </div>
              <div className="col-lg-8">
                <RoomList />
              </div>
            </div>
          )}
        </div>
        <RoomBookModal />
      </>
    );
  }
}
