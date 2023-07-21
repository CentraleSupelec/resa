// lib
import React from 'react';
// src
import EventList from 'components/partials/EventList';
import NewTimePicker from './NewTimePicker';

export default ({ event, handleDateInputChange, newAttributes }) => [
  <EventList
    selectedDate={event.startDate}
    roomName={event.room.name}
    events={event.room.events}
    highlightedEvent={event.id}
    key="eventList"
  />,
  <NewTimePicker
    handleDateInputChange={handleDateInputChange}
    newAttributes={newAttributes}
    key="timePicker"
  />,
];
