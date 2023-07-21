// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// src
import authenticatedFetch from 'services/authenticatedFetch';
import GroupComposition from './GroupComposition';

const GroupTab = ({ groupId, label, active }) => (
  <li className="nav-item">
    <Link
      className={`nav-link${active ? ' active' : ''}`}
      to={`/manager/groups/${groupId}`}
    >
      {label}
    </Link>
  </li>
);

GroupTab.propTypes = {
  groupId: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

let savedGroups = [];

const sort = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export default class extends Component {
  static propTypes = {
    infos: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { groups: savedGroups };

    authenticatedFetch('member')
      .then(this.updateGroups)
      .catch((error) => error.text().then(alert));
  }

  updateGroups = (groups) => {
    if (!Array.isArray(groups)) {
      return;
    }
    savedGroups = groups.sort((g1, g2) => sort(g1.label, g2.label));
    this.setState({
      groups: savedGroups,
    });
  };

  render() {
    const { match, infos } = this.props;
    const { groups } = this.state;
    const activeGroupId = parseInt(match.params.id, 10);
    const activeGroup = groups.find(({ groupId }) => groupId === activeGroupId);
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-auto">
            <ul
              className="nav nav-pills justify-content-center container flex-column"
              style={{
                flexWrap: 'nowrap',
                overflowX: 'scroll',
              }}
            >
              {groups.map(({ groupId, label }) => (
                <GroupTab
                  key={groupId}
                  groupId={groupId}
                  label={label}
                  active={groupId === activeGroupId}
                />
              ))}
            </ul>
          </div>
          <div className="col">
            {activeGroup ? (
              <GroupComposition
                infos={infos}
                group={activeGroup}
                updateGroups={this.updateGroups}
              />
            ) : (
              <h3 style={{ textAlign: 'center', marginTop: '2em' }}>
                <span role="img" aria-label="top arrow">
                  ⇦
                </span>
                &nbsp;Veuillez choisir un groupe
              </h3>
            )}
          </div>
        </div>
      </div>
    );
  }
}
