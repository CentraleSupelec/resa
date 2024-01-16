// lib
import React from 'react';
import PropTypes from 'prop-types';

export default class ForUserNameInput extends React.PureComponent {
  static propTypes = {
    available: PropTypes.bool.isRequired,
    attemptedConfirm: PropTypes.bool.isRequired,
    forUserName: PropTypes.string.isRequired,
    handleForUserNameInputChange: PropTypes.func.isRequired,
    detectEnter: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { available } = this.props;
    // Focus on the text input
    if (available) {
      setTimeout(() => {
        this._input.focus();
      }, 500);
    }
  }

  render() {
    const {
      available,
      attemptedConfirm,
      forUserName,
      handleForUserNameInputChange,
      detectEnter,
    } = this.props;
    if (!available) {
      return null;
    }
    return (
      <div className="row align-items-center justify-content-center no-gutters">
        <div className="col-lg-3">Pour le compte de :</div>
        <div className="col-lg-9">
          <div
            className={
              attemptedConfirm
                ? 'form-group mb-0 was-validated'
                : 'form-group mb-0'
            }
          >
            <input
              ref={(input) => {
                this._input = input;
              }}
              type="text"
              className={
                forUserName ? 'form-control valid' : 'form-control invalid'
              }
              id="forUserName"
              maxLength="150"
              value={forUserName}
              onChange={handleForUserNameInputChange}
              onKeyPress={detectEnter}
            />
          </div>
        </div>
      </div>
    );
  }
}
