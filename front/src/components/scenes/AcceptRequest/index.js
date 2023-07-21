// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// src
import config from 'config';
import LoadSpinner from 'components/partials/LoadSpinner';
import Choices from './Choices';
import Error from './Error';

const delayMinSpinner = 500;

// Delay min spinner is here just to avoid having a blick of a loader

class AcceptRequest extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  state = {
    booking: null,
    loading: true,
    error: null,
    isSent: false,
    sendError: false,
    isCancelled: false,
    initRotate: 0,
    // initRotate is here to set the angle of the second spinner (to have them both synced)
  };

  constructor(props) {
    super(props);

    const { match } = this.props;
    this.route = match.params && match.params.token
      ? `${config.back.url}/confirm/${match.params.token}`
      : null;

    this.time = 0;
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.time = Date.now();
    fetch(this.route)
      .then((res) => res.json())
      .then((booking) => {
        if (!booking) {
          throw new Error('Empty book');
        }
        this.setState({ booking, error: null, loading: false });
      })
      .catch((error) => this.setState({ error, booking: null, loading: false }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { loading } = this.state;
    // Costemic: for the spinners
    const diffTime = Date.now() - this.time;
    if (loading && !nextState.loading) {
      if (diffTime < delayMinSpinner && diffTime > 0) {
        setTimeout(() => {
          const initRotate = ((Date.now() - this.time) * 360) / 2000;
          this.time = 0;
          this.setState({ ...nextState, initRotate });
        }, delayMinSpinner - diffTime);
      } else {
        const initRotate = (diffTime * 360) / 2000;
        this.time = 0;
        this.setState({ initRotate });
      }
      return false;
    }

    return true;
  }

  onSend = () => {
    this.time = Date.now();
    this.setState({ loading: true });
  };

  onResponse = (isCancelled) => (res, err) => {
    if (err) {
      this.setState({ loading: false, sendError: true });
      return;
    }
    if (res.failedBecauseAlreadyBooked || res.failedBecauseMissingEmail) {
      this.setState({ loading: false, sendError: res });
      return;
    }
    this.setState({ loading: false, isSent: true, isCancelled });
  };

  render() {
    const {
      error,
      sendError,
      booking,
      loading,
      initRotate,
      isSent,
      isCancelled,
    } = this.state;
    if (
      !this.route
      || error
      || sendError
      || (booking && booking.responseDate)
    ) {
      return <Error onValidation={sendError} booking={booking} />;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card my-2">
              <div className="card-body">
                {loading ? (
                  <div className="text-center pt-3 pb-3">
                    <LoadSpinner />
                  </div>
                ) : (
                  <Choices
                    initRotate={initRotate}
                    route={this.route}
                    booking={booking}
                    onSend={this.onSend}
                    onResponse={this.onResponse}
                    isSent={isSent}
                    isCancelled={isCancelled}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AcceptRequest;
