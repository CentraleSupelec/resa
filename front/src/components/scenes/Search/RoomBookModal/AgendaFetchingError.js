// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import FailureOrSuccessModal from 'components/partials/Modals/FailureOrSuccessModal';

const AgendaFetchingError = ({ errorStatus, roomName }) => {
  let bodyText = `Erreur lors du chargement du planning de la salle ${roomName}.<br /><br />`;
  if (errorStatus === 403) {
    bodyText
      += "Vous n'avez pas les droits nécessaires pour réserver cette salle.";
  } else {
    bodyText
      += 'Il se peut que cette salle ne soit pas ouverte à la réservation sur Resa.';
  }

  return (
    <FailureOrSuccessModal
      title={`Réservation de ${roomName}`}
      isAFailureModal
      bodyText={bodyText}
    />
  );
};

AgendaFetchingError.propTypes = {
  roomName: PropTypes.string.isRequired,
  errorStatus: PropTypes.number.isRequired,
};

export default AgendaFetchingError;
