// lib
import { connect } from "react-redux";
// src
import {
  selectRoomType,
  setMinCapacity,
  toggleDisplayUnavailableRooms,
  toggleDisplayVideoAcquisitionRooms,
  toggleDisplayVideoConferenceRooms,
  toggleDisplayOpenSpaces,
  toggleDisplayCampusAmong,
  toggleDisplayBuildingAmong,
  setSearchText,
} from "actions/rooms/filters";
import Component from "components/scenes/Search/Filters";

const mapStateToProps = (state) => ({ ...state.search.filters });

const mapDispatchToProps = (dispatch) => ({
  selectRoomType: (value) => dispatch(selectRoomType(value)),
  setMinCapacity: (pos) => dispatch(setMinCapacity(Math.floor(pos.x))),
  toggleDisplayVideoAcquisitionRooms: () =>
    dispatch(toggleDisplayVideoAcquisitionRooms()),
  toggleDisplayVideoConferenceRooms: () =>
    dispatch(toggleDisplayVideoConferenceRooms()),
  toggleDisplayUnavailableRooms: () =>
    dispatch(toggleDisplayUnavailableRooms()),
  toggleDisplayOpenSpaces: () => dispatch(toggleDisplayOpenSpaces()),
  toggleDisplayCampusAmong: (value) =>
    dispatch(toggleDisplayCampusAmong(value)),
  toggleDisplayBuildingAmong: (value) =>
    dispatch(toggleDisplayBuildingAmong(value)),

  setSearchText: (searchText) => dispatch(setSearchText(searchText)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
