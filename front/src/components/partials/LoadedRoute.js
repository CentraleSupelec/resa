// lib
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
// src
import LoadSpinner from 'components/partials/LoadSpinner';

const LoadedRoute = ({
  component: Component, isLogged, isLoaded, ...rest
}) => {
  const render = (props) => {
    if (!isLogged) return <Redirect to="/login" />;
    if (!isLoaded) {
      return (
        <div className="text-center pt-3 pb-3" key="animation">
          <LoadSpinner />
        </div>
      );
    }
    return <Component {...props} />;
  };

  return <Route {...rest} render={render} />;
};

LoadedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  isLogged: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
};

export default LoadedRoute;
