// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import ConfirmModal from 'components/partials/Modals/ConfirmModal';
import TimeChangeBody from './TimeChangeBody';
import NameChangeBody from './NameChangeBody';
import ForUserNameChangeBody from './ForUserNameChangeBody';

const ConfirmModify = ({
  event,
  modifType,
  sendUpdatedBooking,
  handleNameInputChange,
  handleForUserNameInputChange,
  handleDateInputChange,
  newAttributes,
  detectEnter,
  attemptedConfirm,
}) => {
  let body;
  const matchForUserNameAndEventName =
    newAttributes.eventName.match(/<(.*?)>(.*)/);
  if (matchForUserNameAndEventName) {
    newAttributes.forUserName = matchForUserNameAndEventName[1].trim();
    newAttributes.eventName = matchForUserNameAndEventName[2].trim();
  }
  if (modifType === 'name') {
    body = (
      <NameChangeBody
        event={event}
        handleNameInputChange={handleNameInputChange}
        eventName={newAttributes.eventName}
        detectEnter={detectEnter}
        attemptedConfirm={attemptedConfirm}
      />
    );
  } else if (modifType === 'forUserName') {
    body = (
      <ForUserNameChangeBody
        event={event}
        handleForUserNameInputChange={handleForUserNameInputChange}
        forUserName={newAttributes.forUserName}
        detectEnter={detectEnter}
        attemptedConfirm={attemptedConfirm}
      />
    );
  } else {
    body = (
      <TimeChangeBody
        event={event}
        handleDateInputChange={handleDateInputChange}
        newAttributes={newAttributes}
      />
    );
  }

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
  handleForUserNameInputChange: PropTypes.func.isRequired,
  handleDateInputChange: PropTypes.object.isRequired,
  newAttributes: PropTypes.object.isRequired,
  detectEnter: PropTypes.func.isRequired,
  attemptedConfirm: PropTypes.bool.isRequired,
};

export default ConfirmModify;
