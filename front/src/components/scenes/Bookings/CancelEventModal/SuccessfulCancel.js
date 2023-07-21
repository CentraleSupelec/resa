// lib
import React from 'react';
// src
import FailureOrSuccessModal from 'components/partials/Modals/FailureOrSuccessModal';

export default () => (
  <FailureOrSuccessModal
    isAFailureModal={false}
    title="Annulation de votre réservation"
    bodyText="Votre réservation a bien été annulée."
  />
);
