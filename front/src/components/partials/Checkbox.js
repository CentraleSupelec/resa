// lib
import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ checked, onChange, name }) => (
  <div className="custom-control custom-checkbox">
    <input
      type="checkbox"
      className="custom-control-input"
      id={name}
      checked={checked}
      onChange={onChange}
    />
    <label className="custom-control-label" htmlFor={name}>
      &nbsp;
      {name}
    </label>
  </div>
);

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default Checkbox;
