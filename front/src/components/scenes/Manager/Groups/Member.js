// lib
import React from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {
  faArrowsAlt,
  faTrash,
} from '@fortawesome/fontawesome-free-solid';

const Icon = ({
  variant = 'primary', title, style, ...props
}) => (
  <button
    type="button"
    className={`btn ${variant}`}
    title={title}
    style={style}
  >
    <FontAwesomeIcon {...props} />
  </button>
);

Icon.propTypes = {
  variant: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
};

const Member = ({ infos, member: { firstName, lastName, email }, onRemove }) => (
  <li
    data-id={email}
    className="list-group-item"
    style={{ display: 'flex', alignItems: 'center' }}
  >
    <FontAwesomeIcon icon={faArrowsAlt} />
    <span
      style={{
        margin: '0.5em', fontWeight: 500, fontSize: '1.5em', flex: 1,
      }}
    >
      {firstName}
      &nbsp;
      {lastName}
      &nbsp;
      <span style={{ fontSize: '0.8em', color: '#7b7b7b' }}>
(
        {email}
)
      </span>
      &nbsp;
    </span>
    {(!infos || (infos.email !== email)) && (
    <Icon
      variant="btn-danger"
      icon={faTrash}
      onClick={() => onRemove(email)}
      style={{ marginLeft: '1em' }}
      title="Supprimer"
    />
    )}
  </li>
);

Member.propTypes = {
  member: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  infos: PropTypes.object,
};

Member.defaultProps = {
  infos: null,
};

export default Member;
