// lib
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const NavBarItem = ({ link, text }) => (
  <li className="nav-item">
    <NavLink to={link} className="nav-link" activeClassName="active">
      {text}
    </NavLink>
  </li>
);

NavBarItem.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default NavBarItem;
