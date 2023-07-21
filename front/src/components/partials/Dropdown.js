// lib
import React from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ onChange, valueArray, currentValue }) => (
  <select
    className="custom-select custom-width-auto mx-2"
    onChange={onChange}
    value={currentValue}
  >
    {valueArray.map((value) => (
      <option value={value} key={value}>
        {value}
      </option>
    ))}
  </select>
);

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  valueArray: PropTypes.array.isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Dropdown;
