// lib
import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const DateTimeChangeButton = ({ handleClick, tooltip, icon }) => (
  <button
    type="button"
    className="btn btn-primary mr-3"
    onClick={handleClick}
    data-tip={tooltip}
    data-for={`date-time-button-${icon}`}
  >
    <FontAwesomeIcon icon={icon} />
    <ReactTooltip
      id={`date-time-button-${icon}`}
      effect="solid"
      place="bottom"
    />
  </button>
);

DateTimeChangeButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
};

export default DateTimeChangeButton;
