// lib
import { connect } from 'react-redux';
// src
import Component from 'components/scenes/Bookings';
import { openCancelModal } from 'actions/bookings/cancel';
import { initializeModifModal } from 'actions/bookings/modify';
import {
  forceFetchBookings,
  fetchBookingsIfNeeded,
} from 'actions/bookings/list';

const mapStateToProps = (state) => (
  {
    bookings: state.bookings.list,
    selectedCancelEventId: state.bookings.cancel.eventId,
    selectedModifyEventId: state.bookings.modify.status.eventId,
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    handleCancelEvent: (eventId) => dispatch(openCancelModal(eventId)),
    handleModifyEvent: (eventId, modifType) => dispatch(initializeModifModal(eventId, modifType)),
    fetchBookingsIfNeeded: () => dispatch(fetchBookingsIfNeeded()),
    forceFetchBookings: () => dispatch(forceFetchBookings()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Component);
