// lib
import React from 'react';
import PropTypes from 'prop-types';
// src
import Modal from './Modal';

const ConfirmModal = ({
  title,
  body,
  confirmButtonText,
  confirmButtonFunction,
  showConfirmButton = true,
  cancelActionText,
}) => {
  // see "Modal.js" for details on what clearFunction is

  const footer = [
    <button
      type="button"
      className="btn btn-secondary"
      data-dismiss="modal"
      key="cancelAction"
    >
      {cancelActionText}
    </button>,
  ];

  if (showConfirmButton) {
    footer.push(
      <button
        type="button"
        className="btn btn-success custom-btn-cs"
        onClick={confirmButtonFunction}
        key="confirmAction"
      >
        {confirmButtonText}
      </button>,
    );
  }

  return <Modal title={title} body={body} footer={footer} />;
};

ConfirmModal.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.any.isRequired,
  confirmButtonText: PropTypes.object.isRequired,
  confirmButtonFunction: PropTypes.func.isRequired,
  cancelActionText: PropTypes.string.isRequired,
  showConfirmButton: PropTypes.bool,
};

ConfirmModal.defaultProps = {
  showConfirmButton: true,
};

export default ConfirmModal;
