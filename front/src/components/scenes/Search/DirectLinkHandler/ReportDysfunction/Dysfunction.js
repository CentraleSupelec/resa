// lib
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const Dysfunction = ({ dysfunction, onClick, active }) => {
  const color = active ? '#9a1739' : '#999999';
  return (
    <div className="col-6 col-md-4 my-2">
      <a
        onClick={onClick(dysfunction.name)}
        href="#1"
        style={{ textDecoration: 'none', color }}
      >
        <div
          className="col text-center pt-2 pb-1"
          style={{
            borderRadius: '5px',
            border: 'solid 1px',
            borderColor: color,
          }}
        >
          <div>
            <FontAwesomeIcon icon={dysfunction.icon} size="3x" />
          </div>
          <div>{dysfunction.name}</div>
        </div>
      </a>
    </div>
  );
};

export default Dysfunction;
