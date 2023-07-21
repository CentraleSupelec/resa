// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import ModifyEventModal from 'containers/scenes/Bookings/ModifyEventModal';
import CancelEventModal from 'containers/scenes/Bookings/CancelEventModal';
import BookingsList from './BookingsList';

class Bookings extends React.PureComponent {
  static propTypes = {
    bookings: PropTypes.object.isRequired,
    handleCancelEvent: PropTypes.func.isRequired,
    handleModifyEvent: PropTypes.func.isRequired,
    fetchBookingsIfNeeded: PropTypes.func.isRequired,
    forceFetchBookings: PropTypes.func.isRequired,
    selectedCancelEventId: PropTypes.string,
    selectedModifyEventId: PropTypes.string,
  }

  static defaultProps = {
    selectedCancelEventId: null,
    selectedModifyEventId: null,
  }

  componentDidMount() {
    const { fetchBookingsIfNeeded } = this.props;
    fetchBookingsIfNeeded();
  }

  componentDidUpdate() {
    const { fetchBookingsIfNeeded } = this.props;
    fetchBookingsIfNeeded();
  }

  getBookingWithId(eventId, bookingGroups) {
    if (eventId) {
      const futureGroup = bookingGroups.filter(
        (group) => group.name === 'future',
      )[0];
      if (futureGroup) {
        return futureGroup.content.filter((event) => event.id === eventId)[0];
      }
    }
    return null;
  }

  reloadBookings = () => {
    const { forceFetchBookings } = this.props;
    forceFetchBookings();
  };

  render() {
    const {
      bookings: {
        isFetching,
        errorWhileFetching,
        bookingGroups,
      },
      selectedCancelEventId,
      selectedModifyEventId,
      handleCancelEvent,
      handleModifyEvent,
    } = this.props;
    return (
      <div className="container">
        <BookingsList
          loading={isFetching}
          error={errorWhileFetching}
          eventGroups={bookingGroups}
          handleCancelEvent={handleCancelEvent}
          handleModifyEvent={handleModifyEvent}
          reload={this.reloadBookings}
        />
        <CancelEventModal
          event={this.getBookingWithId(selectedCancelEventId, bookingGroups)}
        />
        <ModifyEventModal
          event={this.getBookingWithId(selectedModifyEventId, bookingGroups)}
        />
      </div>
    );
  }
}

export default Bookings;
