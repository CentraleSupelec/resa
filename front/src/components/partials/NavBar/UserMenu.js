// lib
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// src
import NavBarItem from './NavBarItem';

const UserMenu = ({ infos }) => (infos ? (
  <li className="nav-item dropdown">
    <button
      type="button"
      className="btn btn-link nav-link dropdown-toggle text-white custom-cursor-pointer"
      id="navbarDropdownMenuLink"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      { `${infos.firstName} ${infos.lastName}` }
    </button>
    <div
      className="dropdown-menu dropdown-menu-right"
      aria-labelledby="navbarDropdownMenuLink"
    >
      <Link to="/logout/" className="dropdown-item">
        Déconnexion
      </Link>
    </div>
  </li>
) : (
  <NavBarItem text="Connexion" link="/login" />
));

UserMenu.propTypes = {
  infos: PropTypes.object,
};

UserMenu.defaultProps = {
  infos: null,
};

export default UserMenu;
