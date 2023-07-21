// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sortable from 'react-sortablejs';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/fontawesome-free-solid';
// src
import authenticatedFetch from 'services/authenticatedFetch';
import AddMemberModal, { id as addMemberModalId } from './AddMemberModal';
import Member from './Member';

const roles = {
  MAIN_MANAGER: 'main-manager',
  MANAGERS: 'managers',
  MEMBERS: 'members',
};

export default class extends Component {
  static propTypes = {
    infos: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    updateGroups: PropTypes.func.isRequired,
  }

  options = {
    group: {
      name: 'managers',
      pull: true,
      put: true,
    },
    onAdd: ({ from, to, item }) => {
      const email = item.dataset.id;
      const { infos } = this.props;
      if (to.dataset.tag === roles.MAIN_MANAGER) {
        this.promoteMainManager(email);
        return;
      }
      if (to.dataset.tag === roles.MEMBERS) {
        if (infos.email === email) {
          alert('On ne peut pas se révoquer soit-même');
        } else {
          this.revokeManager(email);
        }
        return;
      }
      if (
        from.dataset.tag === roles.MAIN_MANAGER
        && to.dataset.tag === roles.MANAGERS
      ) {
        this.revokeMainManager(email);
        return;
      }
      if (
        from.dataset.tag === roles.MEMBERS
        && to.dataset.tag === roles.MANAGERS
      ) {
        this.promoteManager(email);
      }
    },
  };

  // eslint-disable-next-line
  add = role => (email) => {
    const { group, updateGroups } = this.props;
    return authenticatedFetch(
      `member/${encodeURIComponent(
        group.groupId,
      )}?userEmail=${encodeURIComponent(email)}&role=${role}`,
      { method: 'POST' },
    )
      .then(updateGroups)
      .catch((error) => error.text().then(alert));
  }

  promoteManager = this.add('manager');

  promoteMainManager = this.add('main-manager');

  addMember = this.add('member');

  revoke = (role) => (email) => {
    const { group, updateGroups } = this.props;
    return authenticatedFetch(
      `member/${encodeURIComponent(
        group.groupId,
      )}?userEmail=${encodeURIComponent(email)}&role=${role}`,
      { method: 'DELETE' },
    )
      .then(updateGroups)
      .catch((error) => error.text().then(alert));
  }

  revokeManager = this.revoke('manager');

  revokeMainManager = this.revoke('main-manager');

  removeMember = this.revoke('member');

  render() {
    const { group, infos } = this.props;
    const mainManagerEmail = group.mainManager ? group.mainManager.email : '';
    const managerEmails = new Set(group.managers.map(({ email }) => email));
    const members = group.members.filter(
      ({ email }) => !managerEmails.has(email) && email !== mainManagerEmail,
    );
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ flex: 1 }}>Membres</h3>
          <button
            type="button"
            className="btn btn-success custom-btn-cs my-3"
            data-toggle="modal"
            data-target={`#${addMemberModalId}`}
            title="Ajouter un membre"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <h4>Manager référent</h4>
        <ul className="list-group">
          <Sortable
            onChange={() => {}}
            className="custom-draggable"
            options={this.options}
            data-tag={roles.MAIN_MANAGER}
          >
            {group.mainManager ? (
              <Member
                infos={infos}
                key={group.mainManager.email}
                member={group.mainManager}
                onRemove={this.removeMember}
              />
            ) : null}
          </Sortable>
        </ul>

        <h4>Managers</h4>
        <ul className="list-group">
          <Sortable
            onChange={() => {}}
            className="custom-draggable"
            options={this.options}
            data-tag={roles.MANAGERS}
          >
            {group.managers.map((item) => (
              <Member
                key={item.email}
                member={item}
                onRemove={this.removeMember}
              />
            ))}
          </Sortable>
        </ul>

        <>
          <h4>Members classiques</h4>
          <ul className="list-group">
            <Sortable
              onChange={() => {}}
              className="custom-draggable"
              options={this.options}
              data-tag={roles.MEMBERS}
            >
              {members.map((item) => (
                <Member
                  key={item.email}
                  member={item}
                  onRemove={this.removeMember}
                />
              ))}
            </Sortable>
          </ul>
        </>
        <AddMemberModal onSend={this.addMember} />
      </>
    );
  }
}
