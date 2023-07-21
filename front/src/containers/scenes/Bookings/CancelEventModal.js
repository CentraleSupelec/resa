// lib
import { connect } from 'react-redux';
// src
import { sendCancelRequest } from 'actions/bookings/cancel';
import Component from 'components/scenes/Bookings/CancelEventModal';

function mapDispatchToProps(dispatch, ownProps) {
  return {
    cancelBooking: () => dispatch(sendCancelRequest(ownProps.event.id)),
    dispatch,
  };
}

export default connect((state) => state.bookings.cancel, mapDispatchToProps)(Component);
