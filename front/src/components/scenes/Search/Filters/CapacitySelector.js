// lib
import React from 'react';
import PropTypes from 'prop-types';
import InputSlider from 'react-input-slider';

const CapacitySelector = ({ minCapacity, onChange }) => (
  <>
    <div className="row mt-3">Nombre de personnes :</div>
    <div className="row mb-4 align-items-center">
      <div className="col-9 pr-0">
        <InputSlider
          className="u-slider-time"
          x={minCapacity}
          onChange={onChange}
          xmin={0}
          xmax={50}
        />
      </div>
      <div className="col-3 text-right pl-0">
        <strong>{minCapacity}</strong>
      </div>
    </div>
  </>
);

CapacitySelector.propTypes = {
  minCapacity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CapacitySelector;
