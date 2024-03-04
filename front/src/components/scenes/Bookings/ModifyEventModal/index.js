// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import { sendModifRequest } from 'actions/bookings/modify';
import Loading from 'components/partials/Modals/LoadingModal';
import ConfirmModify from './ConfirmModify';
import FailedModify from './FailedModify';
import SuccessfulModify from './SuccessfulModify';

export default class extends React.PureComponent {
  static propTypes = {
    status: PropTypes.object.isRequired,
    event: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    newAttributes: PropTypes.object.isRequired,
    handleNameInputChange: PropTypes.func.isRequired,
    handleDateInputChange: PropTypes.object.isRequired,
  };

  static defaultProps = {
    event: null,
  };

  sendUpdatedBooking = () => {
    const { dispatch, event, newAttributes } = this.props;
    dispatch(sendModifRequest(event, newAttributes));
  };

  detectEnter = (event) => {
    if (event.key === 'Enter') {
      this.sendUpdatedBooking();
    }
  };

  render() {
    const {
      status,
      event,
      newAttributes,
      handleNameInputChange,
      handleDateInputChange,
    } = this.props;

    return (
      <div
        className="modal fade"
        id="modifyEventModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modifyEventModal"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          {event && !status.frontendValidationPassed ? (
            <ConfirmModify
              event={event}
              modifType={status.modifType}
              sendUpdatedBooking={this.sendUpdatedBooking}
              handleNameInputChange={handleNameInputChange}
              handleDateInputChange={handleDateInputChange}
              newAttributes={newAttributes}
              detectEnter={this.detectEnter}
              attemptedConfirm={status.attemptedConfirm}
            />
          ) : null}
          {status.isFetching && <Loading />}
          {status.frontendValidationPassed &&
            !status.isFetching &&
            status.success && <SuccessfulModify />}
          {status.frontendValidationPassed &&
            !status.isFetching &&
            !status.success && (
              <FailedModify
                failedBecauseAlreadyBooked={status.failedBecauseAlreadyBooked}
              />
            )}
        </div>
      </div>
    );
  }
}
