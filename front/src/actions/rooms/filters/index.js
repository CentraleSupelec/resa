// src
import makeActionCreator from "actions/make";
import {
  SET_MIN_CAPACITY,
  TOGGLE_DISPLAY_VIDEO_ACQUISITION_ROOMS,
  TOGGLE_DISPLAY_VIDEO_MEETING_ROOMS,
  TOGGLE_DISPLAY_UNAVAILABLE_ROOMS,
  TOGGLE_DISPLAY_OPEN_SPACES,
  TOGGLE_DISPLAY_CAMPUS_AMONG,
  TOGGLE_DISPLAY_BUILDING_AMONG,
  SELECT_ROOM_TYPE,
  SET_SEARCH_TEXT,
} from "./types";

export const setMinCapacity = makeActionCreator(SET_MIN_CAPACITY, "payload");
export const toggleDisplayVideoAcquisitionRooms = makeActionCreator(
  TOGGLE_DISPLAY_VIDEO_ACQUISITION_ROOMS,
);
export const toggleDisplayVideoConferenceRooms = makeActionCreator(
  TOGGLE_DISPLAY_VIDEO_MEETING_ROOMS,
);
export const toggleDisplayUnavailableRooms = makeActionCreator(
  TOGGLE_DISPLAY_UNAVAILABLE_ROOMS,
);
export const toggleDisplayOpenSpaces = makeActionCreator(
  TOGGLE_DISPLAY_OPEN_SPACES,
);
export const toggleDisplayCampusAmong = makeActionCreator(
  TOGGLE_DISPLAY_CAMPUS_AMONG,
  "payload",
);
export const toggleDisplayBuildingAmong = makeActionCreator(
  TOGGLE_DISPLAY_BUILDING_AMONG,
  "payload",
);

export const selectRoomType = makeActionCreator(SELECT_ROOM_TYPE, "payload");
export const setSearchText = makeActionCreator(SET_SEARCH_TEXT, "payload");
