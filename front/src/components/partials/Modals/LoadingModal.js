// lib
import React from 'react';
// src
import LoadSpinner from '../LoadSpinner';

export default () => (
  <div className="modal-content">
    <div className="text-center my-5">
      <LoadSpinner />
    </div>
  </div>
);
