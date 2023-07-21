// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import DateTimePicker from 'containers/scenes/Search/DateTimePicker';
import DirectLinkHandler from 'containers/scenes/Search/DirectLinkHandler';
import RoomBookModal from 'containers/scenes/Search/RoomBookModal';

class DirectSearch extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    fetchBookingsIfNeeded: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchBookingsIfNeeded } = this.props;
    fetchBookingsIfNeeded();
  }

  render() {
    const { match } = this.props;
    return (
      <>
        <div className="container">
          <DirectLinkHandler resourceId={match.params.resourceId} />
          <DateTimePicker />
        </div>
        <RoomBookModal />
      </>
    );
  }
}

export default DirectSearch;
