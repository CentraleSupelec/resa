// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// src
import SearchUser from 'components/partials/SearchUser';

export const id = 'addMemberModal';

class AddMemberModal extends Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
  };

  state = {
    person: null,
  };

  searchUserRef = React.createRef();

  onSend = (event) => {
    const { onSend } = this.props;
    const { person } = this.state;
    event.preventDefault();
    if (!person) {
      return;
    }
    onSend(person.email);
    document.getElementById(`${id}_close`).click();
    if (this.searchUserRef.current) {
      this.searchUserRef.current.clearSearch();
    }
  };

  render() {
    return (
      <div
        className="modal fade"
        id={id}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ajouter un nouveau membre</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <SearchUser
                ref={this.searchUserRef}
                onFind={(person) => this.setState({ person })}
                placeholder="Email de la personne"
              />
            </div>
            <div className="modal-footer">
              <button
                id={`${id}_close`}
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary custom-btn-cs"
                onClick={this.onSend}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddMemberModal;
