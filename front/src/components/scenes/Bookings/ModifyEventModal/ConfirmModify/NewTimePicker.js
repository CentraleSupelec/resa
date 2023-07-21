// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import Dropdown from 'components/partials/Dropdown';

const NewTimePicker = ({ handleDateInputChange, newAttributes }) => (
  <form className="mt-4">
    <h6>Choisissez votre nouveau créneau pour la réservation sélectionnée :</h6>
    <div className="form-row align-items-center mt-3 mb-3">
      <div className="col-2">Début : </div>
      <div className="col-10">
        <Dropdown
          onChange={handleDateInputChange.startHour}
          valueArray={Array(17)
            .fill()
            .map((_, i) => i + 7)}
          currentValue={newAttributes.startHour}
        />
        {'h'}
        <Dropdown
          onChange={handleDateInputChange.startMinutes}
          valueArray={[0, 15, 30, 45]}
          currentValue={newAttributes.startMinutes}
        />
        {'min'}
      </div>
    </div>
    <div className="form-row align-items-center">
      <div className="col-2">Fin : </div>
      <div className="col-10">
        <Dropdown
          onChange={handleDateInputChange.endHour}
          valueArray={Array(17)
            .fill()
            .map((_, i) => i + 7)}
          currentValue={newAttributes.endHour}
        />
        {'h'}
        <Dropdown
          onChange={handleDateInputChange.endMinutes}
          valueArray={[0, 15, 30, 45]}
          currentValue={newAttributes.endMinutes}
        />
        {'min'}
      </div>
    </div>
  </form>
);

NewTimePicker.propTypes = {
  handleDateInputChange: PropTypes.object.isRequired,
  newAttributes: PropTypes.object.isRequired,
};

export default NewTimePicker;
