// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import ConfirmModal from 'components/partials/Modals/ConfirmModal';
import TimeChangeBody from './TimeChangeBody';
import NameChangeBody from './NameChangeBody';

const ConfirmModify = ({
  event,
  modifType,
  sendUpdatedBooking,
  handleNameInputChange,
  handleDateInputChange,
  newAttributes,
  detectEnter,
  attemptedConfirm,
}) => {
  const body =
    modifType === 'name' ? (
      <NameChangeBody
        event={event}
        handleNameInputChange={handleNameInputChange}
        eventName={newAttributes.eventName}
        detectEnter={detectEnter}
        attemptedConfirm={attemptedConfirm}
      />
    ) : (
      <TimeChangeBody
        event={event}
        handleDateInputChange={handleDateInputChange}
        newAttributes={newAttributes}
      />
    );

  return (
    <ConfirmModal
      title="Modification de votre réservation"
      body={body}
      confirmButtonText={
        <span>
          Modifier
          <span className="d-none d-sm-inline"> la réservation</span>
        </span>
      }
      confirmButtonFunction={sendUpdatedBooking}
      cancelActionText="Ne pas modifier"
    />
  );
};

ConfirmModify.propTypes = {
  event: PropTypes.object.isRequired,
  modifType: PropTypes.string.isRequired,
  sendUpdatedBooking: PropTypes.func.isRequired,
  handleNameInputChange: PropTypes.func.isRequired,
  handleDateInputChange: PropTypes.object.isRequired,
  newAttributes: PropTypes.object.isRequired,
  detectEnter: PropTypes.func.isRequired,
  attemptedConfirm: PropTypes.bool.isRequired,
};

export default ConfirmModify;
