// lib
import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
// src
import authenticatedFetch from 'services/authenticatedFetch';

const getGreylist = (slug) => authenticatedFetch(`greylist/${slug}`);

const redirectToLists = () => window.location.replace('/manager/lists');

const createGreylist = async (formData) => {
  await authenticatedFetch('greylist', {
    method: 'POST',
    body: formData,
  });
  redirectToLists();
};

const updateGreylist = async (slug, formData) => {
  await authenticatedFetch(`greylist/${slug}`, {
    method: 'POST',
    body: formData,
  });
  redirectToLists();
};

const removeGreylist = async (slug) => {
  await authenticatedFetch(`greylist/${slug}`, {
    method: 'DELETE',
  });
  redirectToLists();
};

const initialFormState = () => ({
  name: '',
  roomIds: '',
  domains: '',
  managerEmails: '',
  userEmails: '',
});

const formReducer = (state, { type, value }) => {
  if (type === 'all') return value;
  if (type === 'reset') return initialFormState();
  return { ...state, [type]: value };
};

const GreylistForm = ({ slug, isAdmin, greylistManagerOf }) => {
  const isListManager = greylistManagerOf.includes(slug);
  // state
  const [isNew, setIsNew] = useState(slug === 'new');
  const [isInvalidPaths, setInvalidPaths] = useState([]);
  const [formState, formDispatch] = useReducer(formReducer, initialFormState());

  useEffect(() => {
    const fetchAndDispatch = async () => {
      try {
        setIsNew(slug === 'new');
        setInvalidPaths([]);
        if (slug !== 'new') {
          const data = await getGreylist(slug);
          formDispatch({ type: 'all', value: data });
        } else {
          formDispatch({ type: 'reset' });
        }
      } catch (e) {
        redirectToLists();
      }
    };
    fetchAndDispatch();
  }, [slug]);

  // authorize
  if (!isAdmin && !isListManager) return null;

  const getClassName = (path) => (isInvalidPaths.includes(path) ? 'form-control is-invalid' : 'form-control');

  const handleChange = (e) => {
    formDispatch({ type: e.target.name, value: e.target.value });
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    if (window.confirm('Souhaitez-vous supprimer cette liste de contrôle ?')) {
      await removeGreylist(slug);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare data
    const formData = new FormData(e.target);
    // Submit
    try {
      setInvalidPaths([]);
      isNew
        ? await createGreylist(formData)
        : await updateGreylist(slug, formData);
    } catch (error) {
      const { paths } = await error.json();
      setInvalidPaths(paths);
    }
  };

  return (
    <form className="form-greylist" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom de la liste*</label>
        <input
          onChange={handleChange}
          value={formState.name}
          className={getClassName('name')}
          type="text"
          id="name"
          name="name"
          minLength="2"
          required
          disabled={!isAdmin}
        />
      </div>
      <div className="form-group">
        <label htmlFor="roomIds">
          Salles réservables dans le cadre de cette liste*
        </label>
        <textarea
          onChange={handleChange}
          value={formState.roomIds}
          className={getClassName('roomIds')}
          id="roomIds"
          name="roomIds"
          required
          disabled={!isAdmin}
        />
        <small className="form-text text-muted">
          Indiquer les IDOPs séparés par des virgules, par exemple : 635,636
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="domains">
          Autorisation de réservation groupée : par nom de domaine des emails
        </label>
        <input
          onChange={handleChange}
          value={formState.domains}
          className={getClassName('domains')}
          type="text"
          id="domains"
          name="domains"
          disabled={!isAdmin}
        />
        <small className="form-text text-muted">
          Les utilisateurs dont l'email (de login) est compris dans ces noms de
          domaine sont autorisés à réserver les salles indiquées ci-dessus.
          Séparer par des virgules, par exemple : domain1.fr,sub.domain2.com
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="managerEmails">
          Emails des gestionnaires de la liste
        </label>
        <input
          onChange={handleChange}
          value={formState.managerEmails}
          className={getClassName('managerEmails')}
          type="text"
          id="managerEmails"
          name="managerEmails"
          disabled={!isAdmin}
        />
        <small className="form-text text-muted">
          Les gestionnaires peuvent ajouter nommément des utilisateurs dans la
          liste, leur donnant la possibilité de réserver les salles déclarées
          ci-dessus (mais seuls les admins Resa peuvent autoriser par nom de
          domaine). Indiquer les emails des gestionnaires, séparés par des
          virgules, par exemple :
          gestionnaire1@domain1.fr,gestionnaire2@domain1.fr
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="userEmails">
          Autorisation de réservation nominative : par email des utilisateurs
        </label>
        <textarea
          onChange={handleChange}
          value={formState.userEmails}
          className={getClassName('userEmails')}
          id="userEmails"
          name="userEmails"
        />
        <small className="form-text text-muted">
          Indiquer les emails des utilisateurs, séparés par des virgules, par
          exemple : utilisateur1@domain1.fr,utilisateur2@domain1.fr
        </small>
      </div>
      <div className="tm form-group ">
        {!isNew && isAdmin && (
          <button
            onClick={handleRemove}
            type="button"
            className="float-left btn btn-secondary"
          >
            Supprimer
          </button>
        )}
        <button
          type="submit"
          className="float-right btn btn-primary custom-btn-cs"
        >
          {isNew ? 'Créer' : 'Modifier'}
        </button>
      </div>
    </form>
  );
};

GreylistForm.propTypes = {
  slug: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
  greylistManagerOf: PropTypes.any,
};

GreylistForm.defaultProps = {
  isAdmin: false,
  greylistManagerOf: [],
};

export default GreylistForm;
