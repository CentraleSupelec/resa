// lib
import { connect } from 'react-redux';
// src
import Component from 'components/scenes/Search/RoomBookModal/Success';

const mapStateToProps = (state) => ({
  videoMeetingCreated: state.search.book.videoMeetingCreated,
  failedVideoMeetingCreation: state.search.book.failedVideoMeetingCreation,
});

export default connect(mapStateToProps)(Component);
