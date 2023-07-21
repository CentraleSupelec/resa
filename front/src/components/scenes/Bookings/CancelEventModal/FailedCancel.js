// lib
import React from 'react';
// src
import FailureOrSuccessModal from 'components/partials/Modals/FailureOrSuccessModal';

export default () => {
  const bodyText = [
    "Une erreur s'est produite lors de l'annulation de la réservation.",
  ];

  return (
    <FailureOrSuccessModal
      isAFailureModal
      title="Annulation de votre réservation"
      bodyText={bodyText}
    />
  );
};
