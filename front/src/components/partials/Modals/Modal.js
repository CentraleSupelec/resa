// lib
import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ title, body, footer }) => (
  /* clearFunction is called when the modal is somehow exited.
  It should clear data in the parent components so that if the modal is
  opened again, it loads fresh data
  (e.g. if the user clicks on a new room, it opens the modal with the data of
  the new room and not the old data from a previous room he had clicked on)
  */

  <div className="modal-content">
    <div className="modal-header">
      <h5 className="modal-title" id="exampleModalLabel">
        {title}
      </h5>
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="modal-body">{body}</div>
    <div className="modal-footer">{footer}</div>
  </div>
);

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.any.isRequired,
  footer: PropTypes.any.isRequired,
};

export default Modal;
