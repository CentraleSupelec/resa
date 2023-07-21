// lib
import { connect } from 'react-redux';
// src
import {
  selectDate,
  selectStartTime,
  selectEndTime,
  toggleDatePicker,
  toggleTimePicker,
} from 'actions/rooms/dateTime';
import { fetchRoomAgenda } from 'actions/rooms/directLinkHandler';
import Component from 'components/scenes/Search/DateTimePicker';

const mapStateToProps = (state) => ({
  ...state.search.dateTime,
  directLinkRoom: state.search.directLinkHandler.actionSelector.room,
});

const mapDispatchToProps = (dispatch) => ({
  selectDate: (date) => dispatch(selectDate(date)),
  selectStartTime: (time) => dispatch(selectStartTime(time)),
  selectEndTime: (time) => dispatch(selectEndTime(time)),
  toggleDatePicker: () => dispatch(toggleDatePicker()),
  toggleTimePicker: () => dispatch(toggleTimePicker()),
  fetchRoomAgenda: () => dispatch(fetchRoomAgenda()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
