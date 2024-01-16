// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import Loading from 'components/partials/Modals/LoadingModal';
import Success from 'containers/scenes/Search/RoomBookModal/Success';
import ConfirmBooking from './ConfirmBooking';
import Failure from './Failure';
import AgendaFetchingError from './AgendaFetchingError';

const RoomBookModal = ({
  isFetching,
  isFetchingAgenda,
  errorWhileFetchingAgenda,
  errorStatus,
  success,
  room,
  requestSent,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  eventName,
  forUserName,
  videoProvider,
  attemptedConfirm,
  failedBecauseAlreadyBooked,
  failedBecauseMissingEmail,
  failedBecauseNeedPermission,
  handleSendBookRequest,
  handleSetEventName,
  handleSetForUserName,
  handleSetVideoProvider,
  detectEnter,
  directLinkRoom,
}) => (
  <div
    className="modal fade"
    id="roomBookModal"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="roomBookModal"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-lg" role="document">
      {room && !requestSent && !isFetching ? (
        <ConfirmBooking
          room={room}
          selectedDate={selectedDate}
          startTime={selectedStartTime}
          endTime={selectedEndTime}
          confirmBooking={handleSendBookRequest}
          handleEventNameInputChange={handleSetEventName}
          handleForUserNameInputChange={handleSetForUserName}
          handleVideoProviderInputChange={handleSetVideoProvider}
          eventName={eventName}
          forUserName={forUserName}
          videoProvider={videoProvider}
          attemptedConfirm={attemptedConfirm}
          detectEnter={detectEnter}
        />
      ) : null}
      {((requestSent && isFetching) || isFetchingAgenda) && <Loading />}
      {errorWhileFetchingAgenda && (
        <AgendaFetchingError
          roomName={directLinkRoom && directLinkRoom.name}
          errorStatus={errorStatus}
        />
      )}
      {requestSent && !isFetching && success && (
        <Success roomName={room.name} />
      )}
      {requestSent && !isFetching && !success && (
        <Failure
          room={room}
          failedBecauseAlreadyBooked={failedBecauseAlreadyBooked}
          failedBecauseMissingEmail={failedBecauseMissingEmail}
          failedBecauseNeedPermission={failedBecauseNeedPermission}
        />
      )}
    </div>
  </div>
);

RoomBookModal.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isFetchingAgenda: PropTypes.bool.isRequired,
  errorWhileFetchingAgenda: PropTypes.bool.isRequired,
  errorStatus: PropTypes.number,
  success: PropTypes.bool.isRequired,
  requestSent: PropTypes.bool.isRequired,
  selectedDate: PropTypes.object.isRequired,
  selectedStartTime: PropTypes.object.isRequired,
  selectedEndTime: PropTypes.object.isRequired,
  eventName: PropTypes.string.isRequired,
  forUserName: PropTypes.string.isRequired,
  videoProvider: PropTypes.string.isRequired,
  attemptedConfirm: PropTypes.bool.isRequired,
  failedBecauseAlreadyBooked: PropTypes.bool.isRequired,
  failedBecauseMissingEmail: PropTypes.bool.isRequired,
  failedBecauseNeedPermission: PropTypes.bool.isRequired,
  handleSendBookRequest: PropTypes.func.isRequired,
  handleSetEventName: PropTypes.func.isRequired,
  handleSetForUserName: PropTypes.func.isRequired,
  handleSetVideoProvider: PropTypes.func.isRequired,
  detectEnter: PropTypes.func.isRequired,
  room: PropTypes.object,
  directLinkRoom: PropTypes.object,
};

RoomBookModal.defaultProps = {
  errorStatus: null,
  room: null,
  directLinkRoom: null,
};

export default RoomBookModal;
