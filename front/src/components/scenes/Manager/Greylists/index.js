// lib
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/fontawesome-free-solid';
// src
import authenticatedFetch from 'services/authenticatedFetch';
import GreylistForm from 'containers/scenes/Manager/Greylists/GreylistForm';

const GreylistTab = ({ name, active }) => (
  <li className="nav-item">
    <Link
      className={`nav-link${active ? ' active' : ''}`}
      to={`/manager/lists/${slugify(name)}`}
    >
      {name}
    </Link>
  </li>
);

GreylistTab.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
};

const Greylist = ({ match, isAdmin }) => {
  const [greylists, setGreylists] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const data = await authenticatedFetch('greylist');
      setGreylists(data);
    };
    fetchAll();
  }, []);

  const activeSlug = match.params.id;
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
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link${
                      activeSlug === 'new' ? ' active' : ''
                    }`}
                    to="/manager/lists/new"
                  >
                    Nouvelle liste&nbsp;
                    <FontAwesomeIcon icon={faPlus} />
                  </Link>
                </li>
                <li className="separator" />
              </>
            )}
            {greylists.map(({ name }) => (
              <GreylistTab
                key={name}
                name={name}
                active={slugify(name) === activeSlug}
              />
            ))}
          </ul>
        </div>
        <div className="col">
          {activeSlug ? (
            <GreylistForm slug={activeSlug} />
          ) : (
            <h3 style={{ textAlign: 'center', marginTop: '2em' }}>
              <span role="img">⇦</span>
              &nbsp;Veuillez choisir une liste
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

Greylist.propTypes = {
  match: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
};

Greylist.defaultProps = {
  isAdmin: false,
};

export default Greylist;
