// lib
import React from 'react';
// src
import HelpVideo from './HelpVideo';
// import HelpItem from "./components/HelpItem";
// import HelpData from "./HelpData";

export default () => (
  <div className="container mb-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        &nbsp;
        <h4>Présentation de Resa</h4>
        <HelpVideo />
        <p className="tm">
          Pour toute question, contactez le
          {' '}
          <a href="mailto:support.resa@centralesupelec.fr">support</a>
          .
        </p>
      </div>
    </div>
  </div>
);
