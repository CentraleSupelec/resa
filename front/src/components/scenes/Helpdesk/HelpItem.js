// lib
import React from 'react';
import PropTypes from 'prop-types';

const HelpItem = ({ index, title, content }) => (
  <div className="card mb-3">
    <div
      className="card-header custom-bg-grey"
      role="tab"
      id={`heading${index}`}
    >
      <h6 className="mb-0">
        <a
          className="collapsed"
          data-toggle="collapse"
          href={`#collapse${index}`}
          aria-expanded="false"
          aria-controls={`collapse${index}`}
        >
          {title}
        </a>
      </h6>
    </div>
    <div
      id={`collapse${index}`}
      className="collapse"
      role="tabpanel"
      aria-labelledby={`heading${index}`}
      data-parent="#accordion"
    >
      <div className="card-body">{content}</div>
    </div>
  </div>
);

HelpItem.propTypes = {
  index: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default HelpItem;
