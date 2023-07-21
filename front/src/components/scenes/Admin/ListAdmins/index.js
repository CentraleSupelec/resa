// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/fontawesome-free-solid';
// src
import authenticatedFetch from 'services/authenticatedFetch';
import AddAdminModal, { id as addAdminModalId } from './AddAdminModal';
import permissions from './permissions';

class ListAdmins extends Component {
  static propTypes = {
    infos: PropTypes.object.isRequired,
  };

  state = { admins: [] };

  componentDidMount() {
    authenticatedFetch('admin').then(({ admins }) => this.setState({ admins }));
  }

  onDelete = (email) => () => {
    authenticatedFetch(`admin/${email}`, { method: 'DELETE' })
      .then(({ admins }) => this.setState({ admins }))
      .catch(console.error);
  };

  render() {
    const { infos } = this.props;
    const { admins } = this.state;
    return (
      <>
        <button
          type="button"
          className="btn btn-success custom-btn-cs my-3"
          data-toggle="modal"
          data-target={`#${addAdminModalId}`}
        >
          <FontAwesomeIcon icon={faPlus} />
          &nbsp;Ajouter un administrateur
        </button>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Prénom</th>
              <th scope="col">Nom</th>
              <th scope="col">Permissions</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.email}>
                <th>
                  <a href={`mailto:${admin.email}`}>{admin.email}</a>
                </th>
                <td>{admin.firstName}</td>
                <td>{admin.lastName}</td>
                <td>
                  <ul>
                    {admin.permissions.map((permission) => (
                      <li key={permission}>{permissions[permission]}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={this.onDelete(admin.email)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddAdminModal
          infos={infos}
          onSend={(ads) => this.setState({ admins: ads })}
        />
      </>
    );
  }
}

export default ListAdmins;
