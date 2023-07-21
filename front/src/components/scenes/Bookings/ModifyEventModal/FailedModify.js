// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import FailureOrSuccessModal from 'components/partials/Modals/FailureOrSuccessModal';

const FailedModify = ({ failedBecauseAlreadyBooked }) => {
  let bodyText;
  if (failedBecauseAlreadyBooked) {
    bodyText = [
      "Cette salle est déjà réservée à l'horaire demandé.",
      <br />,
      <br />,
      'Essayez avec un autre horaire.',
    ];
  } else {
    bodyText = ["Une erreur s'est produite lors de la réservation."];
  }

  return (
    <FailureOrSuccessModal
      isAFailureModal
      title="Modification de votre réservation"
      bodyText={bodyText}
    />
  );
};

FailedModify.propTypes = {
  failedBecauseAlreadyBooked: PropTypes.bool.isRequired,
};

export default FailedModify;
