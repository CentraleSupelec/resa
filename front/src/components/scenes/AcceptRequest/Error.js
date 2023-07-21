// lib
import React from 'react';
import PropTypes from 'prop-types';

const displayError = (err) => {
  if (err.failedBecauseAlreadyBooked) {
    return 'Cette salle est déjà reservée.';
  }
  if (err.failedBecauseMissingEmail) {
    return "L'utilisateur ne fait pas partie des personnes acceptées sur Resa.";
  }
  return (
    <>
      Un problème technique nous a empêché de finaliser votre demande.
      <br />
      <br />
      <a href="mailto:informatique@centralesupelec.fr">
        informatique@centralesupelec.fr
      </a>
      &nbsp;
      a été informé cet erreur et un administeur vous recontactera dans les plus
      brefs delais
    </>
  );
};

const Error = ({ onValidation, booking }) => (
  <div className="container my-2">
    <div className="row">
      <div className="col-12">
        <div className="card my-3">
          <div className="card-body">
            {onValidation ? (
              <>
                <p>{displayError(onValidation)}</p>
                <p>
                  De plus, un email a été addressé à
                  &nbsp;
                  <a href={`mailto:${booking.userEmail}`}>
                    {booking.userFirstName}
                    &nbsp;
                    {booking.userLastName}
                  </a>
                  &nbsp;
                  pour le prévenir que sa réservation est déclinée
                </p>
              </>
            ) : (
              'Cette demande a déjà été traitée'
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

Error.propTypes = {
  onValidation: PropTypes.bool.isRequired,
  booking: PropTypes.object.isRequired,
};

export default Error;
