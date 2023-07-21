// lib
import { connect } from 'react-redux';
// src
import { fetchBookingsIfNeeded } from 'actions/bookings/list';
import Component from 'components/scenes/Search';

const mapStateToProps = (state) => {
  const { displayDatePicker, displayTimePicker } = state.search.dateTime;

  return {
    displayRoomList: !displayDatePicker && !displayTimePicker,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchBookingsIfNeeded: () => dispatch(fetchBookingsIfNeeded()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
