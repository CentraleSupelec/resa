// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import NavBarItem from './NavBarItem';
import UserMenu from './UserMenu';

const NavBar = ({
  infos,
  isAdmin,
  isGreylistManager,
  isManager,
  hasRightToAddManagers,
}) => (
  <nav className="navbar navbar-expand-md navbar-dark fixed-top custom-navbar-prop">
    <span className="navbar-brand">
      <a href="/recherche" className="navbar-brand custom-brand-font mr-0">
        <img src="/assets/LogoCS.png" height="30" alt="Logo CentraleSupélec" />
        &nbsp;Resa&nbsp;
      </a>
    </span>
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div
      className="collapse navbar-collapse custom-font-size-16"
      id="navbarSupportedContent"
    >
      <ul className="navbar-nav ml-auto">
        <NavBarItem text="Recherche" link="/recherche" />
        {infos && <NavBarItem text="Mes réservations" link="/reservations" />}
        {isAdmin && <NavBarItem text="Administration" link="/admin/" />}
        {(isManager || hasRightToAddManagers || isGreylistManager) && (
          <NavBarItem text="Gestion des salles" link="/manager/" />
        )}
        <NavBarItem text="Salles" link="/rooms" />
        <NavBarItem text="Aide" link="/help" />
        <UserMenu infos={infos} link="#" />
      </ul>
    </div>
  </nav>
);

NavBar.propTypes = {
  infos: PropTypes.object,
  isAdmin: PropTypes.bool,
  isManager: PropTypes.bool.isRequired,
  isGreylistManager: PropTypes.bool.isRequired,
  hasRightToAddManagers: PropTypes.bool.isRequired,
};

NavBar.defaultProps = {
  infos: null,
  isAdmin: false,
};

export default NavBar;
