// src
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
} from "actions/rooms/filters/types";

import { defaultValue } from "./roomTypes.data";

export default function filters(
  state = {
    minCapacity: 0,
    displayVideoAcquisitionRooms: false,
    displayVideoConferenceRooms: false,
    displayUnavailableRooms: false,
    displayOpenSpaces: false,
    displayCampuses: [],
    displayBuildings: [],
    type: defaultValue,
    searchText: "",
  },
  action,
) {
  switch (action.type) {
    case SET_MIN_CAPACITY:
      return {
        ...state,
        minCapacity: action.payload,
      };
    case TOGGLE_DISPLAY_VIDEO_ACQUISITION_ROOMS:
      return {
        ...state,
        displayVideoAcquisitionRooms: !state.displayVideoAcquisitionRooms,
      };
    case TOGGLE_DISPLAY_VIDEO_MEETING_ROOMS:
      return {
        ...state,
        displayVideoConferenceRooms: !state.displayVideoConferenceRooms,
      };
    case TOGGLE_DISPLAY_UNAVAILABLE_ROOMS:
      return {
        ...state,
        displayUnavailableRooms: !state.displayUnavailableRooms,
      };
    case TOGGLE_DISPLAY_OPEN_SPACES:
      return {
        ...state,
        displayOpenSpaces: !state.displayOpenSpaces,
      };
    case TOGGLE_DISPLAY_CAMPUS_AMONG: {
      const campus = action.payload;
      const newDisplayCampuses = state.displayCampuses.includes(campus)
        ? state.displayCampuses.filter((c) => c !== campus)
        : [...state.displayCampuses, campus];
      return {
        ...state,
        displayCampuses: newDisplayCampuses,
      };
    }
    case TOGGLE_DISPLAY_BUILDING_AMONG: {
      const building = action.payload;
      const newDisplayBuildings = state.displayBuildings.includes(building)
        ? state.displayBuildings.filter((b) => b !== building)
        : [...state.displayBuildings, building];
      return {
        ...state,
        displayBuildings: newDisplayBuildings,
      };
    }
    case SELECT_ROOM_TYPE:
      return {
        ...state,
        type: action.payload,
      };
    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      };
    default:
      return state;
  }
}
