// lib
import { connect } from 'react-redux';
// src
import { fetchBookingsIfNeeded } from 'actions/bookings/list';
import Component from 'components/scenes/Search/DirectSearch';

const mapDispatchToProps = (dispatch) => ({
  fetchBookingsIfNeeded: () => dispatch(fetchBookingsIfNeeded()),
});

export default connect(null, mapDispatchToProps)(Component);
