// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// src
import SearchUser from 'components/partials/SearchUser';
import authenticatedFetch from 'services/authenticatedFetch';
import permissions from './permissions';

export const id = 'addAdminModal';

const Permission = ({ permission, onClick, checked }) => (
  <div className="custom-control custom-checkbox">
    <input
      id={`permission_${permission}`}
      type="checkbox"
      className="custom-control-input"
      value={permission}
      onClick={onClick}
      checked={checked}
    />
    <label
      className="custom-control-label"
      htmlFor={`permission_${permission}`}
    >
      {permissions[permission]}
    </label>
  </div>
);

Permission.propTypes = {
  permission: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default class AddAdminModal extends Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    infos: PropTypes.object.isRequired,
  };

  state = {
    person: null,
    selectedPermissions: [],
  };

  searchUserRef = React.createRef();

  adminPermissions = [];

  handleSend = (event) => {
    const { person, selectedPermissions } = this.state;
    event.preventDefault();
    if (!person || selectedPermissions.length === 0) {
      return;
    }
    authenticatedFetch('admin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: person.email,
        permissions: selectedPermissions,
      }),
    })
      .then(({ admins }) => {
        const { onSend } = this.props;
        document.getElementById(`${id}_close`).click();
        onSend(admins);
        if (this.searchUserRef.current) {
          this.searchUserRef.current.clearSearch();
        }
      })
      .catch((error) => error.text().then(alert));
  };

  componentDidMount = () => {
    const { infos } = this.props;
    this.adminPermissions = (infos.adminPermissions || '').split(' ');

    if (this.adminPermissions.includes('SUPER_ADMIN')) {
      this.adminPermissions = Object.keys(permissions);
    }
  };

  onTogglePermission = (event) => {
    const { selectedPermissions } = this.state;
    const currentPermission = event.target.value;
    if (selectedPermissions.includes(currentPermission)) {
      this.setState(({ selectedPermissions: prevPermissions }) => ({
        selectedPermissions: prevPermissions.filter(
          (permission) => permission !== currentPermission,
        ),
      }));
    } else {
      this.setState(({ selectedPermissions: prevPermissions }) => ({
        selectedPermissions: [...prevPermissions, currentPermission],
      }));
    }
  };

  render() {
    const { person, selectedPermissions } = this.state;
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
              <h5 className="modal-title">Ajouter un nouvel administrateur</h5>
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
                onFind={(p) => this.setState({ person: p })}
                placeholder="Email de l'administrateur"
              />
              {person && (
                <div className="mt-2">
                  <h4>Permissions :</h4>
                  {this.adminPermissions.map((permission) => (
                    <Permission
                      key={permission}
                      permission={permission}
                      onClick={this.onTogglePermission}
                      checked={selectedPermissions.includes(permission)}
                    />
                  ))}
                </div>
              )}
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
                onClick={this.handleSend}
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
