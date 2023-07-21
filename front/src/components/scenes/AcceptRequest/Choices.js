// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OptionalImage from 'react-image';
import moment from 'moment';
import 'moment/locale/fr';
// src
import config from 'config';
import EventList from 'components/partials/EventList';
import LoadSpinner from 'components/partials/LoadSpinner';
import BookingSummary from 'components/partials/BookingSummary';
import Response from './Response';

const imageExtension = 'jpg';

const request = (url, method, { onClick, cb }) => (event) => {
  if (event) {
    event.preventDefault();
  }
  onClick(event);
  return fetch(url, { method })
    .then((res) => res.json())
    .then((res) => cb(res, null))
    .catch((error) => cb(null, error));
};

class Choices extends Component {
  static propTypes = {
    booking: PropTypes.object.isRequired,
    route: PropTypes.string.isRequired,
    onSend: PropTypes.func.isRequired,
    onResponse: PropTypes.func.isRequired,
    isSent: PropTypes.bool.isRequired,
    isCancelled: PropTypes.bool.isRequired,
    initRotate: PropTypes.number,
  };

  static defaultProps = {
    initRotate: 0,
  };

  state = {
    room: null,
    loading: false,
  };

  componentDidMount() {
    this.setState({ loading: true });
    const { booking } = this.props;
    const startDate = moment.utc(booking.startDate);
    fetch(
      `${config.back.url}/room/detail/${
        booking.roomId
      }/${startDate.toISOString()}`,
    )
      .then((res) => res.json())
      .then((room) => this.setState({ room, loading: false }))
      .catch(() => this.setState({ room: null, loading: false }));
  }

  render() {
    const {
      route,
      booking,
      onSend,
      onResponse,
      initRotate,
      isSent,
      isCancelled,
    } = this.props;
    const { room, loading } = this.state;

    if (loading) {
      return (
        <div className="text-center pt-3 pb-3">
          <LoadSpinner transform={{ rotate: initRotate }} />
        </div>
      );
    }

    if (!room || !room.id) {
      return null;
    }

    const accept = request(route, 'POST', {
      onClick: onSend,
      cb: onResponse(false),
    });
    const reject = request(route, 'DELETE', {
      onClick: onSend,
      cb: onResponse(true),
    });

    const startDate = moment.utc(booking.startDate);
    const endDate = moment.utc(booking.endDate);

    return (
      <>
        <OptionalImage
          src={`${config.imagesBaseURL}${room.id}.${imageExtension}`}
          className="img-fluid mb-4"
          alt={`Photo de la salle ${room.name}`}
        />
        <div className="mb-4">
          <EventList
            selectedDate={startDate}
            roomName={room.name}
            events={room.events.filter((event) => !event.local)}
          />
        </div>
        {!isSent && (
          <div>
            Demande de réservation effectuée par &nbsp;
            <a href={`mailto:${booking.userEmail}`}>
              {booking.userFirstName}
              &nbsp;
              {booking.userLastName}
            </a>
            &nbsp; pour le motif suivant : &nbsp;
            <span className="font-weight-bold">{booking.eventName}</span>
          </div>
        )}
        <BookingSummary
          selectedDate={startDate}
          startTime={startDate}
          endTime={endDate}
        />
        {!isSent && (
          <div className="row justify-content-around">
            <button
              type="button"
              onClick={reject}
              className="btn btn-secondary"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={accept}
              className="btn btn-success custom-btn-cs"
            >
              Accepter
            </button>
          </div>
        )}
        {isSent && <Response isCancelled={isCancelled} booking={booking} />}
      </>
    );
  }
}

export default Choices;
