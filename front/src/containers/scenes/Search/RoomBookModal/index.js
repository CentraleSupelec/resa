// lib
import { connect } from 'react-redux';
// src
import {
  sendBookRequest,
  setEventName,
  setForUserName,
  setVideoProvider,
} from 'actions/rooms/book';
import Component from 'components/scenes/Search/RoomBookModal';

const mapStateToProps = (state) => ({
  ...state.search.book,
  selectedDate: state.search.dateTime.selectedDate,
  selectedStartTime: state.search.dateTime.selectedStartTime,
  selectedEndTime: state.search.dateTime.selectedEndTime,
  isFetchingAgenda: state.search.directLinkHandler.roomAgenda.isFetching,
  errorWhileFetchingAgenda:
    state.search.directLinkHandler.roomAgenda.errorWhileFetching,
  errorStatus: state.search.directLinkHandler.roomAgenda.errorStatus,
  directLinkRoom: state.search.directLinkHandler.actionSelector.room,
});

const mapDispatchToProps = (dispatch) => ({
  handleSendBookRequest: () => dispatch(sendBookRequest()),
  handleSetEventName: (event) => dispatch(setEventName(event.target.value)),
  handleSetForUserName: (event) => dispatch(setForUserName(event.target.value)),
  handleSetVideoProvider: (event) => dispatch(setVideoProvider(event.target.value)),
  detectEnter: (event) => {
    if (event.key === 'Enter') dispatch(sendBookRequest());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
