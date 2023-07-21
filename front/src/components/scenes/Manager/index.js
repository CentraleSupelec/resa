// lib
import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
// src
import Groups from 'containers/scenes/Manager/Groups';
import Greylists from 'containers/scenes/Manager/Greylists';

const Manager = ({
  match, isAdmin, isManager, isGreylistManager,
}) => {
  if (!isAdmin && !isManager && !isGreylistManager) return null;

  const activeType = match.params.type || (isManager ? 'groups' : 'lists');
  let ManagerComponent;
  switch (activeType) {
    case 'groups':
      ManagerComponent = Groups;
      break;
    case 'lists':
      ManagerComponent = Greylists;
      break;
    default:
      ManagerComponent = () => <Redirect to="/manager/" />;
      break;
  }
  return (
    <>
      <ul className="bm nav nav-tabs justify-content-center">
        {(isAdmin || isManager) && (
          <li key="groups" className="nav-item">
            <Link
              className={`nav-link${activeType === 'groups' ? ' active' : ''}`}
              to="/manager/groups"
            >
              Groupes de validation des salles
            </Link>
          </li>
        )}
        {(isAdmin || isGreylistManager) && (
          <li key="lists" className="nav-item">
            <Link
              className={`nav-link${activeType === 'lists' ? ' active' : ''}`}
              to="/manager/lists"
            >
              Listes de contrôle des utilisateurs
            </Link>
          </li>
        )}
      </ul>
      <div className="container">
        <ManagerComponent match={match} />
      </div>
    </>
  );
};

Manager.propTypes = {
  match: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isManager: PropTypes.bool.isRequired,
  isGreylistManager: PropTypes.bool.isRequired,
};

export default Manager;
