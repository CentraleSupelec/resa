// lib
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// src
import FailureOrSuccessModal from 'components/partials/Modals/FailureOrSuccessModal';

const Failure = ({
  room,
  failedBecauseAlreadyBooked,
  failedBecauseMissingEmail,
  failedBecauseNeedPermission,
  history,
}) => {
  let bodyText;
  let isAFailureModal = true;
  let redirectFunction = () => {};
  if (failedBecauseAlreadyBooked) {
    bodyText = "Cette salle est déjà réservée à l'horaire demandé.<br /><br />Essayez avec une autre salle ou un autre horaire.";
  } else if (failedBecauseMissingEmail) {
    bodyText = 'Vous ne faites pas encore partie des utilisateurs pouvant utiliser Resa.<br />Contactez &nbsp;<a href="mailto:informatique@centralesupelec.fr">mailto:informatique@centralesupelec.fr</a>&nbsp; pour vous permettre de réserver des salles.';
  } else if (failedBecauseNeedPermission) {
    bodyText = 'Une demande de validation a été adressée au gestionnaire.';
    redirectFunction = () => history.push('/reservations');
    isAFailureModal = false;
  } else {
    bodyText = "Une erreur s'est produite lors de la réservation.";
  }

  return (
    <FailureOrSuccessModal
      title={`Réservation de ${room.name}`}
      isAFailureModal={isAFailureModal}
      bodyText={bodyText}
      redirectFunction={redirectFunction}
    />
  );
};

Failure.propTypes = {
  room: PropTypes.object.isRequired,
  failedBecauseAlreadyBooked: PropTypes.bool.isRequired,
  failedBecauseMissingEmail: PropTypes.bool.isRequired,
  failedBecauseNeedPermission: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(Failure);
