// lib
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// src
import FailureOrSuccessModal from 'components/partials/Modals/FailureOrSuccessModal';

const defaultBody = 'La salle est désormais réservée.';
const meetingCreatedBody = "La salle est désormais réservée.<br/><br/>Retrouvez les informations de connexion au système de visioconférence dans l'email de réservation qui vient d'être envoyé.";
const meetingFailedBody = "La salle est désormais réservée mais le système de visioconférence n'a pas été alloué pour cette réunion.";

const body = (videoMeetingCreated, failedVideoMeetingCreation) => {
  if (videoMeetingCreated) return meetingCreatedBody;
  if (failedVideoMeetingCreation) return meetingFailedBody;
  return defaultBody;
};

const Success = ({
  roomName,
  history,
  videoMeetingCreated,
  failedVideoMeetingCreation,
}) => (
  <FailureOrSuccessModal
    isAFailureModal={false}
    title={`Réservation de ${roomName}`}
    bodyText={body(videoMeetingCreated, failedVideoMeetingCreation)}
    redirectFunction={() => history.push('/reservations')}
  />
);

Success.propTypes = {
  roomName: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  videoMeetingCreated: PropTypes.bool,
  failedVideoMeetingCreation: PropTypes.bool,
};

Success.defaultProps = {
  videoMeetingCreated: false,
  failedVideoMeetingCreation: false,
};

export default withRouter(Success);
