// lib
import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
// src
import ListAdmins from 'containers/scenes/Admin/ListAdmins';
import Whitelist from 'containers/scenes/Admin/Whitelist';
import ListDysfunctions from './ListDysfunctions';

import TYPES, { superAdminTypes, typeTranslator } from './types';

const AdminTab = ({ dict, type, active }) => (
  <li className="nav-item">
    <Link
      className={`nav-link${active ? ' active' : ''}`}
      to={`/admin/${dict[type]}`}
    >
      {typeTranslator[type]}
    </Link>
  </li>
);

AdminTab.propTypes = {
  dict: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

const Admin = ({ match, isSuperAdmin }) => {
  const activeType = match.params.type || TYPES.LIST_ADMINS;
  let AdminComponent;
  switch (activeType) {
    case TYPES.LIST_ADMINS:
      AdminComponent = ListAdmins;
      break;
    case TYPES.LIST_DYSFUNCTIONS:
      AdminComponent = ListDysfunctions;
      break;
    case superAdminTypes.WHITELIST:
      AdminComponent = Whitelist;
      break;
    default:
      AdminComponent = () => <Redirect to="/admin/" />;
      break;
  }
  return (
    <>
      <ul className="bm nav nav-tabs justify-content-center">
        {Object.keys(TYPES).map((type) => (
          <AdminTab
            key={type}
            dict={TYPES}
            type={type}
            active={TYPES[type] === activeType}
          />
        ))}
        {isSuperAdmin
          && Object.keys(superAdminTypes).map((type) => (
            <AdminTab
              key={type}
              dict={superAdminTypes}
              type={type}
              active={superAdminTypes[type] === activeType}
            />
          ))}
      </ul>
      <div className="container">
        <AdminComponent />
      </div>
    </>
  );
};

Admin.propTypes = {
  match: PropTypes.object.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
};

export default Admin;
