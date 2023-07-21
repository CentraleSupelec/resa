// lib
import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import InfiniteScroll from 'react-infinite-scroller';
// src
import LoadSpinner from 'components/partials/LoadSpinner';
import Booking from './Booking';

export default class extends React.PureComponent {
  static propTypes = {
    displayPastBookings: PropTypes.bool.isRequired,
    pastBookingsToDisplay: PropTypes.number.isRequired,
    groupname: PropTypes.string.isRequired,
    events: PropTypes.array.isRequired,
    handleCancelEvent: PropTypes.func.isRequired,
    handleModifyEvent: PropTypes.func.isRequired,
    togglePastBookings: PropTypes.func.isRequired,
    showMorePastBookings: PropTypes.func.isRequired,
  };

  render() {
    const {
      groupname,
      events,
      handleCancelEvent,
      handleModifyEvent,
      togglePastBookings,
      showMorePastBookings,
      displayPastBookings,
      pastBookingsToDisplay,
    } = this.props;

    let groupTitle;
    if (groupname === 'past') {
      groupTitle = 'Vos réservations passées';
    } else {
      groupTitle = 'Vos réservations à venir';
    }

    const isFuture = groupname === 'future';

    const loadingAnimation = (
      <div className="text-center pt-3 pb-3" key="animation">
        <LoadSpinner />
      </div>
    );

    if (isFuture) {
      return (
        <div className="mb-5">
          <h4 className="px-2 pt-0 pb-2">{groupTitle}</h4>
          {events.map((event) => (
            <Booking
              event={event}
              handleCancelEvent={handleCancelEvent}
              handleModifyEvent={handleModifyEvent}
              isFuture={isFuture}
              key={event.id}
            />
          ))}
        </div>
      );
    }
    return (
      <div className="mb-5">
        <div className="row justify-content-start align-items-center no-gutters py-2">
          <h4 className="px-2 py-0 m-0">{groupTitle}</h4>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={togglePastBookings}
          >
            {displayPastBookings ? 'Réduire' : 'Afficher'}
          </button>
        </div>
        <Collapse isOpened={displayPastBookings}>
          <InfiniteScroll
            pageStart={0}
            loadMore={showMorePastBookings}
            hasMore={pastBookingsToDisplay < events.length}
            loader={loadingAnimation}
          >
            {events
              .slice(0, pastBookingsToDisplay)
              .map((event) => (
                <Booking event={event} isFuture={isFuture} key={event.id} />
              ))}
            <p className="text-center text-secondary font-weight-light">
              Les réservations datant d'il y a plus de trois mois ne sont pas
              affichées.
            </p>
          </InfiniteScroll>
        </Collapse>
      </div>
    );
  }
}
