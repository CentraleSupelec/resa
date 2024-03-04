// lib
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { recapitalize } from 'services/string';

const EventList = ({
  selectedDate,
  roomName,
  events,
  highlightedEvent,
  useToday,
}) => {
  if (events === null) {
    return (
      <h6>
        Nous n&apos;avons pas pu charger les évènements au sein de cette salle.
      </h6>
    );
  }
  if (!events || events.length === 0) {
    return (
      <h6>
        Aucun évènement n&apos;est prévu
        {!useToday && ` le ${moment(selectedDate).format('D MMMM')} `}
        {useToday && " aujourd'hui "}
        en
        &nbsp;
        <span className="font-weight-bold">{roomName}</span>
      </h6>
    );
  }
  return (
    <>
      <h6>
        {events.length === 1 && 'Un seul évènement est prévu'}
        {events.length >= 2 && `${events.length} évènements sont prévus`}
        {!useToday && ` le ${moment(selectedDate).format('D MMMM')} `}
        {useToday && " aujourd'hui "}
        en
        &nbsp;
        <span className="font-weight-bold">{roomName}</span>
      </h6>
      <div className="list-group mt-3">
        {events.map((event) => {
          const isHighlighted = event.id === highlightedEvent;
          return (
            <div
              className={`list-group-item flex-column align-items-start ${
                isHighlighted ? 'active' : ''
              }`}
              key={event.id}
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{event.name}</h5>
                <span className={!isHighlighted ? 'text-muted' : ''}>
                  de&nbsp;
                  {moment(event.startDate)
                    .utc()
                    .format('H[h]mm')}
                  &nbsp;à&nbsp;
                  {moment(event.endDate)
                    .utc()
                    .format('H[h]mm')}
                </span>
              </div>
              <span className={!isHighlighted ? 'text-muted' : ''}>
                Réservé par
                &nbsp;
                <a
                  className={!isHighlighted ? 'text-secondary' : 'text-white'}
                  href={`mailto:${event.author.email}`}
                >
                  {recapitalize(event.author.firstName)}
                  &nbsp;
                  {recapitalize(event.author.lastName)}
                </a>
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

EventList.propTypes = {
  selectedDate: PropTypes.object.isRequired,
  roomName: PropTypes.string.isRequired,
  highlightedEvent: PropTypes.string,
  useToday: PropTypes.bool,
  events: PropTypes.array,
};

EventList.defaultProps = {
  highlightedEvent: null,
  useToday: false,
  events: null,
};

export default EventList;
