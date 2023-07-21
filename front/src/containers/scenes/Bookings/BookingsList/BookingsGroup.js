// lib
import { connect } from 'react-redux';
// src
import { togglePastBookings, showMorePastBookings } from 'actions/bookings/list';
import Component from 'components/scenes/Bookings/BookingsList/BookingsGroup';

function mapStateToProps(state) {
  return {
    displayPastBookings: state.bookings.list.displayPastBookings,
    pastBookingsToDisplay: state.bookings.list.pastBookingsToDisplay,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    togglePastBookings: () => dispatch(togglePastBookings()),
    showMorePastBookings: () => dispatch(showMorePastBookings()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
