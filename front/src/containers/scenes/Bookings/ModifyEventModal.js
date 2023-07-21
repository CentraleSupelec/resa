// lib
import { connect } from 'react-redux';
// src
import {
  setNameOfModifiedEvent,
  setStartHourOfModifiedEvent,
  setStartMinutesOfModifiedEvent,
  setEndHourOfModifiedEvent,
  setEndMinutesOfModifiedEvent,
} from 'actions/bookings/modify';
import Component from 'components/scenes/Bookings/ModifyEventModal';

const mapStateToProps = (state) => (
  { ...state.bookings.modify }
);

const mapDispatchToProps = (dispatch) => (
  {
    handleDateInputChange: {
      startHour: (event) => dispatch(setStartHourOfModifiedEvent(event.target.value)),
      startMinutes: (event) => dispatch(setStartMinutesOfModifiedEvent(event.target.value)),
      endHour: (event) => dispatch(setEndHourOfModifiedEvent(event.target.value)),
      endMinutes: (event) => dispatch(setEndMinutesOfModifiedEvent(event.target.value)),
    },
    handleNameInputChange: (event) => dispatch(setNameOfModifiedEvent(event.target.value)),
    dispatch,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Component);
