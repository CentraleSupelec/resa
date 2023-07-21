// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import NavBar from 'containers/partials/NavBar';

const Shell = ({ children }) => (
  <div className="h-100">
    <>
      <NavBar />
      <section>{children}</section>
    </>
  </div>
);

Shell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Shell;
