// lib
import { connect } from 'react-redux';
// src
import { selectRoomToBook } from 'actions/rooms/book';
import Component from 'components/scenes/Search/RoomList/RoomGroup/Room';

const mapStateToProps = ({ search: { dateTime } }) => ({
  selectedDate: new Date(dateTime.selectedDate),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleSelectRoomToBook: () => dispatch(selectRoomToBook(ownProps.room)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
