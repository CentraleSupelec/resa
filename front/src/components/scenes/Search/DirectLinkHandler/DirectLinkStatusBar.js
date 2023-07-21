// lib
import React from 'react';
import PropTypes from 'prop-types';

const DirectLinkStatusBar = ({ roomName, showActionSelector }) => (
  <div className="row justify-content-center">
    <div
      className="col-lg-6 alert alert-secondary text-center custom-hover-darkens"
      role="alert"
      onClick={showActionSelector}
    >
      Salle sélectionnée :&nbsp;
      <span className="font-weight-bold">{roomName}</span>
    </div>
  </div>
);

DirectLinkStatusBar.propTypes = {
  roomName: PropTypes.string.isRequired,
  showActionSelector: PropTypes.func.isRequired,
};

export default DirectLinkStatusBar;
