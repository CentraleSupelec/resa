// lib
import React from 'react';
import PropTypes from 'prop-types';

export default class EventNameInput extends React.PureComponent {
  static propTypes = {
    available: PropTypes.bool.isRequired,
    attemptedConfirm: PropTypes.bool.isRequired,
    eventName: PropTypes.string.isRequired,
    handleEventNameInputChange: PropTypes.func.isRequired,
    detectEnter: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { available } = this.props;
    // Focus on the text input
    if (available) {
      setTimeout(() => {
        this._input.focus();
      }, 500);
    }
  }

  render() {
    const {
      available, attemptedConfirm, eventName, handleEventNameInputChange, detectEnter,
    } = this.props;
    if (!available) {
      return (
        <div className="alert alert-secondary" role="alert">
          Cette salle n'est pas disponible au créneau demandé. Vous pouvez :
          <br />
          -
          &nbsp;
          <a className="alert-secondary" href="/">
            choisir un autre créneau
          </a>
          <br />
          - contacter la personne ayant réservé la salle au créneau souhaité, en
          cliquant sur son nom ci-dessus
        </div>
      );
    }
    return (
      <div className="row align-items-center justify-content-center no-gutters">
        <div className="col-lg-3">Titre de l'évènement :</div>
        <div className="col-lg-9">
          <div
            className={
              attemptedConfirm
                ? 'form-group mb-0 was-validated'
                : 'form-group mb-0'
            }
          >
            <input
              ref={(input) => {
                this._input = input;
              }}
              type="text"
              className={
                eventName
                  ? 'form-control valid'
                  : 'form-control invalid'
              }
              id="eventName"
              maxLength="50"
              value={eventName}
              onChange={handleEventNameInputChange}
              onKeyPress={detectEnter}
              required
            />
            <div className="invalid-feedback">
              Veuillez indiquer l'objet de l'évènement
            </div>
          </div>
        </div>
      </div>
    );
  }
}
