// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import Loading from 'components/partials/Modals/LoadingModal';
import ConfirmCancel from './ConfirmCancel';
import FailedCancel from './FailedCancel';
import SuccessfulCancel from './SuccessfulCancel';

const CancelEventModal = ({
  event,
  success,
  isFetching,
  userConfirmedCancellation,
  cancelBooking,
}) => (
  <div
    className="modal fade"
    id="cancelEventModal"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="cancelEventModal"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      {event && !userConfirmedCancellation ? (
        <ConfirmCancel event={event} cancelBooking={cancelBooking} />
      ) : null}
      {isFetching && <Loading />}
      {userConfirmedCancellation
            && !isFetching
            && success && <SuccessfulCancel />}
      {userConfirmedCancellation
            && !isFetching
            && !success && <FailedCancel />}
    </div>
  </div>
);

CancelEventModal.propTypes = {
  event: PropTypes.object,
  success: PropTypes.bool,
  isFetching: PropTypes.bool.isRequired,
  userConfirmedCancellation: PropTypes.bool.isRequired,
  cancelBooking: PropTypes.func.isRequired,
};

CancelEventModal.defaultProps = {
  event: null,
  success: null,
};

export default CancelEventModal;
