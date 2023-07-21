// lib
import React from "react";
import PropTypes from "prop-types";
import OptionalImage from "react-image";
// src
import config from "config";
import ConfirmModal from "components/partials/Modals/ConfirmModal";
import EventList from "components/partials/EventList";
import BookingSummary from "components/partials/BookingSummary";
import EventNameInput from "./EventNameInput";
import VideoProviderInput from "./VideoProviderInput";

const imageExtension = "jpg";

const ConfirmBooking = ({
  room,
  selectedDate,
  startTime,
  endTime,
  confirmBooking,
  eventName,
  videoProvider,
  handleEventNameInputChange,
  handleVideoProviderInputChange,
  attemptedConfirm,
  detectEnter,
}) => {
  const body = [
    <OptionalImage
      src={`${config.imagesBaseURL}${room.id}.${imageExtension}`}
      className="img-fluid mb-4"
      alt={`Photo de la salle ${room.name}`}
      key="image"
    />,
    <div className="mb-4" key="eventList">
      <EventList
        selectedDate={selectedDate}
        roomName={room.name}
        events={room.events}
      />
    </div>,
    <BookingSummary
      selectedDate={selectedDate}
      startTime={startTime}
      endTime={endTime}
      key="bookingSummary"
    />,
    room.modular === true ? (
      <div className="alert alert-danger" role="alert">
        ATTENTION, cette salle sera décloisonnée
      </div>
    ) : null,
    <EventNameInput
      available={room.available}
      eventName={eventName}
      handleEventNameInputChange={handleEventNameInputChange}
      detectEnter={detectEnter}
      attemptedConfirm={attemptedConfirm}
      key="eventNameInput"
    />,
    <VideoProviderInput
      enabled={room.videoConference}
      providers={room.videoProviders}
      visioType={room.visioType}
      videoProvider={videoProvider}
      handleVideoProviderInputChange={handleVideoProviderInputChange}
      detectEnter={detectEnter}
      key="videoProviderInput"
    />,
  ];

  return (
    <ConfirmModal
      title={`Réservation de ${room.name}`}
      body={body}
      confirmButtonText={
        <span>
          Confirmer
          <span className="d-none d-sm-inline"> la réservation</span>
        </span>
      }
      confirmButtonFunction={confirmBooking}
      showConfirmButton={room.available}
      cancelActionText={room.available ? "Annuler" : "OK"}
    />
  );
};

ConfirmBooking.propTypes = {
  room: PropTypes.object.isRequired,
  selectedDate: PropTypes.object.isRequired,
  startTime: PropTypes.object.isRequired,
  endTime: PropTypes.object.isRequired,
  confirmBooking: PropTypes.func.isRequired,
  eventName: PropTypes.string.isRequired,
  videoProvider: PropTypes.string.isRequired,
  handleEventNameInputChange: PropTypes.func.isRequired,
  handleVideoProviderInputChange: PropTypes.func.isRequired,
  attemptedConfirm: PropTypes.bool.isRequired,
  detectEnter: PropTypes.func.isRequired,
};

export default ConfirmBooking;
