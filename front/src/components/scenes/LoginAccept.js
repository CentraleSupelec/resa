// lib
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import querystring from 'querystring';
// src
import config from 'config';
import { fetchJWT } from 'actions/user';
import LoadSpinner from 'components/partials/LoadSpinner';

class LoginAccept extends React.Component {
  state = {
    loading: true,
    forbidden: false,
  };

  async componentDidMount() {
    const { dispatch, casToken } = this.props;
    const casTicket = querystring.parse(casToken.substring(1)).ticket;

    if (casTicket !== undefined) {
      try {
        // Validate the CAS-provided ticket with the back-end
        const response = await fetch(`${config.back.url}/login/${casTicket}`);
        if (!response.ok) {
          if (response.status === 403) {
            // user is not whitelisted and has no "greylist" room
            this.setState({ loading: false, forbidden: true });
          }
          throw Error(response.statusText);
        }
        // Clear localStorage (useful in case of issues with older versions of Resa)
        localStorage.clear();
        // Store the jwt for future requests to the back-end
        const jwt = await response.json();
        dispatch(fetchJWT(jwt));
      } catch (error) {
        this.setState({ loading: false });
      }
    }
  }

  render() {
    const { loading, forbidden } = this.state;
    if (loading) {
      return (
        <div className="container d-flex h-100 align-items-center justify-content-center">
          <div className="text-center pt-3 pb-3">
            <LoadSpinner />
          </div>
        </div>
      );
    }

    if (forbidden) {
      return (
        <div className="container d-flex h-100 align-items-center justify-content-center">
          <div className="text-center pt-3 pb-3">
            <h4 className="mb-4">Vous ne pouvez pas réserver de salle.</h4>
          </div>
        </div>
      );
    }

    return (
      <div className="container d-flex h-100 align-items-center justify-content-center">
        <div className="text-center pt-3 pb-3">
          <h4 className="mb-4">
            Une erreur s'est produite lors de l'authentification.
          </h4>
          <Link to="/login" className="btn btn-primary">
            Réessayer
          </Link>
        </div>
      </div>
    );
  }
}

LoginAccept.propTypes = {
  dispatch: PropTypes.func.isRequired,
  casToken: PropTypes.string.isRequired,
};

export default connect()(LoginAccept);
