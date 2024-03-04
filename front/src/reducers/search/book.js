// src
import { filterTitles } from "services/string";
import {
  SELECT_ROOM_TO_BOOK,
  SET_EVENT_NAME,
  SET_VIDEO_PROVIDER,
  ATTEMPT_BOOK_CONFIRM,
  REQUEST_BOOK,
  RECEIVE_BOOK_CONFIRMATION,
  RECEIVE_BOOK_UNKNOWN_ERROR,
  RECEIVE_ROOM_ALREADY_BOOKED_ERROR,
  RECEIVE_FAILED_BECAUSE_MISSING_EMAIL_ERROR,
  RECEIVE_FAILED_BECAUSE_NEED_PERMISSION,
} from "actions/rooms/book/types";

export default function book(
  state = {
    room: null,
    eventName: "",
    videoProvider: "none",
    requestSent: false,
    isFetching: false,
    success: false,
    videoMeetingCreated: false,
    failedBecauseAlreadyBooked: false,
    failedBecauseMissingEmail: false,
    failedBecauseNeedPermission: false,
    failedVideoMeetingCreation: false,
    attemptedConfirm: false,
  },
  action,
) {
  switch (action.type) {
    case SELECT_ROOM_TO_BOOK:
      // Reset all params here
      return {
        ...state,
        room: action.payload,
        eventName: "",
        videoProvider:
          action.payload.visioType === "teams"
            ? action.payload.visioType
            : "none",
        requestSent: false,
        isFetching: false,
        success: false,
        videoMeetingCreated: false,
        failedBecauseAlreadyBooked: false,
        failedBecauseMissingEmail: false,
        failedBecauseNeedPermission: false,
        failedVideoMeetingCreation: false,
        attemptedConfirm: false,
      };
    case SET_EVENT_NAME:
      return {
        ...state,
        eventName: filterTitles(action.payload),
      };
    case SET_VIDEO_PROVIDER:
      return {
        ...state,
        videoProvider: action.payload,
      };
    case ATTEMPT_BOOK_CONFIRM:
      return {
        ...state,
        attemptedConfirm: true,
      };
    case REQUEST_BOOK:
      return {
        ...state,
        requestSent: true,
        isFetching: true,
      };
    case RECEIVE_BOOK_CONFIRMATION:
      return {
        ...state,
        isFetching: false,
        success: true,
        videoMeetingCreated: action.payload.videoMeetingCreated,
        failedVideoMeetingCreation: action.payload.failedVideoMeetingCreation,
      };
    case RECEIVE_BOOK_UNKNOWN_ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        failedBecauseAlreadyBooked: false,
      };
    case RECEIVE_ROOM_ALREADY_BOOKED_ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        failedBecauseAlreadyBooked: true,
      };
    case RECEIVE_FAILED_BECAUSE_MISSING_EMAIL_ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        failedBecauseMissingEmail: true,
      };
    case RECEIVE_FAILED_BECAUSE_NEED_PERMISSION:
      return {
        ...state,
        isFetching: false,
        success: false,
        failedBecauseNeedPermission: true,
      };
    default:
      return state;
  }
}
