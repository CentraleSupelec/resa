// lib
import React from 'react';

export default ({
  onChange, data, selectedType, disabled,
}) => data.options.map((type) => (
  <div key={type.value} className="custom-control custom-radio mb-1">
    <input
      className="custom-control-input"
      type="radio"
      name="type"
      id={type.value.toString()}
      value={type.value.toString()}
      onChange={() => onChange(type)}
      checked={type.value.toString() === selectedType.value.toString()}
      disabled={disabled}
    />
    <label className="custom-control-label" htmlFor={type.value}>
      {type.fullName}
    </label>
  </div>
));
