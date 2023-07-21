// lib
import { connect } from 'react-redux';
// src
import { unsetRoom, chooseRoom } from 'actions/rooms/select';
import {
  showDatePicker,
  hideDatePicker,
  hideTimePicker,
  hideDatetimeStatusBar,
} from 'actions/rooms/dateTime';
import { setRoomId, fetchRoomDetail, toggleActionSelector } from 'actions/rooms/directLinkHandler';
import Component from 'components/scenes/Search/DirectLinkHandler';

const mapStateToProps = (state) => ({
  ...state.search.directLinkHandler.actionSelector,
  isLogged: state.user.isLogged,
  currentRoomId: state.currentRoom.id,
});

const mapDispatchToProps = (dispatch) => ({
  setRoomId: (roomId) => dispatch(setRoomId(roomId)),
  fetchRoomDetail: () => dispatch(fetchRoomDetail()),
  initBookingProcess: () => {
    dispatch(toggleActionSelector());
    dispatch(showDatePicker());
  },
  showActionSelector: () => {
    dispatch(toggleActionSelector());
    dispatch(hideDatePicker());
    dispatch(hideTimePicker());
    dispatch(hideDatetimeStatusBar());
  },
  hideDatePicker: () => dispatch(hideDatePicker()),
  unsetRoom: () => dispatch(unsetRoom()),
  chooseRoom: (id) => dispatch(chooseRoom(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
