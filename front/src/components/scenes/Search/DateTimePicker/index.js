// lib
import React from 'react';
import PropTypes from 'prop-types';
import { faCalendarAlt, faClock } from '@fortawesome/fontawesome-free-regular';
import moment from 'moment';
import 'moment/locale/fr';
// src
import DatePickerWrapper from './DatePickerWrapper';
import DateTimeChangeButton from './DateTimeChangeButton';
import TimePicker from './TimePicker';

const DateTimePicker = (props) => {
  const {
    selectDate,
    selectedDate,
    displayDatePicker,
    displayDateTimeStatusBar,
    displayTimePicker,
    toggleDatePicker,
    toggleTimePicker,
    timeNeedsUserInitialization,
    selectStartTime,
    selectEndTime,
    selectedStartTime,
    selectedEndTime,
    directLinkRoom,
    fetchRoomAgenda,
  } = props;
  return (
    <>
      <DatePickerWrapper
        handleDateSelect={selectDate}
        selectedDate={selectedDate}
        isOpened={displayDatePicker}
      />
      {displayDateTimeStatusBar && (
      <div className="row align-items-center mb-3">
        <div className="col-md-3">
          {!displayDatePicker && (
          <DateTimeChangeButton
            handleClick={toggleDatePicker}
            icon={faCalendarAlt}
            tooltip="Modifier la date"
          />
          )}
          {!displayTimePicker
                && !timeNeedsUserInitialization && (
                  <DateTimeChangeButton
                    handleClick={toggleTimePicker}
                    icon={faClock}
                    tooltip="Modifier les horaires"
                  />
          )}
        </div>
        <div className="col-md-6 text-center">
          <span className="align-middle">
            {!displayDatePicker && (
            <span>
              {moment(selectedDate).format('dddd D MMMM YYYY')}
            </span>
            )}
            {!displayTimePicker
                  && !timeNeedsUserInitialization && (
                    <span>
                      &nbsp;
                      de&nbsp;
                      {selectedStartTime.format('H[h]mm')}
                      &nbsp;à&nbsp;
                      {selectedEndTime.format('H[h]mm')}
                    </span>
            )}
          </span>
        </div>

        <div className="col-md-3" />
      </div>
      )}
      <TimePicker
        handleStartTimeChange={selectStartTime}
        handleEndTimeChange={selectEndTime}
        startTime={selectedStartTime}
        endTime={selectedEndTime}
        isOpened={displayTimePicker}
        toggle={toggleTimePicker}
        directLinkRoomName={
            directLinkRoom && directLinkRoom.name
          }
        openDirectBookingWindow={fetchRoomAgenda}
      />
    </>
  );
};

DateTimePicker.propTypes = {
  selectDate: PropTypes.func.isRequired,
  selectedDate: PropTypes.object.isRequired,
  displayDatePicker: PropTypes.bool.isRequired,
  displayDateTimeStatusBar: PropTypes.bool.isRequired,
  displayTimePicker: PropTypes.bool.isRequired,
  toggleDatePicker: PropTypes.func.isRequired,
  toggleTimePicker: PropTypes.func.isRequired,
  timeNeedsUserInitialization: PropTypes.bool.isRequired,
  selectStartTime: PropTypes.func.isRequired,
  selectEndTime: PropTypes.func.isRequired,
  selectedStartTime: PropTypes.object.isRequired,
  selectedEndTime: PropTypes.object.isRequired,
  fetchRoomAgenda: PropTypes.func.isRequired,
  directLinkRoom: PropTypes.object,
};

DateTimePicker.defaultProps = {
  directLinkRoom: null,
};

export default DateTimePicker;
