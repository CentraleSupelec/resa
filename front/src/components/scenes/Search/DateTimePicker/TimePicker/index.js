// lib
import React from "react";
import { Collapse } from "react-collapse";
import PropTypes from "prop-types";
import moment from "moment";
// src
import TimeInput from "./TimeInput";

export default class TimePicker extends React.PureComponent {
  state = { incoherentTimes: false };

  static propTypes = {
    handleStartTimeChange: PropTypes.func.isRequired,
    handleEndTimeChange: PropTypes.func.isRequired,
    startTime: PropTypes.instanceOf(moment).isRequired,
    endTime: PropTypes.instanceOf(moment).isRequired,
    isOpened: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    openDirectBookingWindow: PropTypes.func.isRequired,
    directLinkRoomName: PropTypes.bool,
  };

  static defaultProps = {
    directLinkRoomName: null,
  };

  handleStartTimeChange = (startTime) => {
    const { handleStartTimeChange } = this.props;
    handleStartTimeChange(startTime);
    this.checkTimeCoherence();
    this.forceUpdate();
  };

  handleEndTimeChange = (endTime) => {
    const { handleEndTimeChange } = this.props;
    handleEndTimeChange(endTime);
    this.checkTimeCoherence();
    this.forceUpdate();
  };

  checkTimeCoherence = () => {
    const { endTime, startTime } = this.props;
    const diffTime = endTime - startTime;

    this.setState({ incoherentTimes: false });
    this.setState({ tooLongTimes: false });

    if (endTime.isSameOrBefore(startTime)) {
      this.setState({ incoherentTimes: true });
    } else if (diffTime / 3600000 > 2) {
      this.setState({ tooLongTimes: true });
    }
  };

  format = (timeToFormat) => {
    let hours = timeToFormat.substring(0, 2);
    let minutes = "";

    if (timeToFormat.slice(-2) !== "00") {
      minutes = timeToFormat.slice(-2);
    }

    if (timeToFormat.substring(0, 1) === "0") {
      hours = hours.substring(1, 2);
    }

    return `${hours}h${minutes}`;
  };

  render() {
    const {
      isOpened,
      startTime,
      endTime,
      toggle,
      directLinkRoomName,
      openDirectBookingWindow,
    } = this.props;

    const { incoherentTimes } = this.state;
    const { tooLongTimes } = this.state;

    return (
      <Collapse isOpened={isOpened}>
        <div className="row">
          <div className="col-12">
            <div className="card my-3">
              <div className="card-body">
                <div className="row justify-content-around no-gutters">
                  <div className="col-lg-4">
                    <h4 className="pt-0 mb-4 text-center">Heure de début</h4>
                    <TimeInput
                      moment={startTime}
                      onChange={this.handleStartTimeChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <h4 className="pt-0 mb-4 text-center">Heure de fin</h4>
                    <TimeInput
                      moment={endTime}
                      onChange={this.handleEndTimeChange}
                    />
                  </div>
                </div>
                <div className="row justify-content-center">
                  {!directLinkRoomName && (
                    <button
                      type="button"
                      className="btn btn-success custom-btn-cs"
                      onClick={toggle}
                      disabled={incoherentTimes || tooLongTimes}
                    >
                      Voir les salles disponibles
                    </button>
                  )}
                  {directLinkRoomName && (
                    <button
                      type="button"
                      className="btn btn-success custom-btn-cs"
                      onClick={openDirectBookingWindow}
                      data-toggle="modal"
                      data-target="#roomBookModal"
                      disabled={incoherentTimes || tooLongTimes}
                    >
                      Voir la disponibilité
                    </button>
                  )}
                </div>
                {incoherentTimes && (
                  <div className="row justify-content-center mt-3">
                    <p>
                      L'heure de début doit être antérieure à l'heure de fin.
                    </p>
                  </div>
                )}
                {tooLongTimes && (
                  <div className="row justify-content-center mt-3">
                    <p>La plage horaire demandée ne peut excéder 2 heures.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Collapse>
    );
  }
}
