// lib
import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// src
import authenticatedFetch from 'services/authenticatedFetch';

const redirectToAdminRoot = () => window.location.replace('/admin');

const getWhitelist = () => authenticatedFetch('whitelist');

const updateWhitelist = async (formData) => {
  await authenticatedFetch('whitelist', {
    method: 'POST',
    body: formData,
  });
  redirectToAdminRoot();
};

const initialFormState = () => ({
  domains: '',
});

const formReducer = (state, { type, value }) => {
  if (type === 'all') return value;
  return { ...state, [type]: value };
};

const Whitelist = ({ isSuperAdmin }) => {
  // state
  const [isInvalidPaths, setInvalidPaths] = useState([]);
  const [formState, formDispatch] = useReducer(formReducer, initialFormState());

  useEffect(() => {
    const fetchAndDispatch = async () => {
      const data = await getWhitelist();
      formDispatch({ type: 'all', value: data });
    };
    fetchAndDispatch();
  }, []);

  if (!isSuperAdmin) return redirectToAdminRoot();

  const getClassName = (path) => (isInvalidPaths.includes(path) ? 'form-control is-invalid' : 'form-control');

  const handleChange = (e) => {
    formDispatch({ type: e.target.name, value: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare data
    const formData = new FormData(e.target);
    // Submit
    try {
      await updateWhitelist(formData);
    } catch (error) {
      const { paths } = await error.json();
      setInvalidPaths(paths);
    }
  };

  return (
    <form className="form-greylist" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="domains">
          Domaines mail des utilisateurs pouvant réserver toutes les salles
        </label>
        <input
          onChange={handleChange}
          value={formState.domains}
          className={getClassName('domains')}
          type="text"
          id="domains"
          name="domains"
        />
        <small className="form-text text-muted">
          Attention : la suppression de noms de domaine entraînera
          l'impossibilité pour les personnes concernées d'utiliser Resa. Séparer
          par des virgules, par exemple : hostname.fr,anotherhostname.fr
        </small>
        <small className="form-text text-muted">
          Il est possible de définir des
          {' '}
          <Link to="/manager/lists">listes de contrôles</Link>
          {' '}
          plus fines en
          associant certains utilisateurs à certaines salles.
        </small>
      </div>
      <div className="tm form-group ">
        <button
          type="submit"
          className="float-right btn btn-primary custom-btn-cs"
        >
          Modifier
        </button>
      </div>
    </form>
  );
};

Whitelist.propTypes = {
  isSuperAdmin: PropTypes.bool.isRequired,
};

export default Whitelist;
