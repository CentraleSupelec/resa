// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
// src
import authenticatedFetch from 'services/authenticatedFetch';
import visualFeedback from 'services/visualFeedback';
import validate from 'services/validate';

export const id = 'addDysfunctionModal';

const initialState = {
  emailDelegate: '',
  name: '',
  icon: '',
  actionCode: null,
};

class AddDysfunctionModal extends Component {
  static propTypes = {
    dysfunction: PropTypes.object,
    onSend: PropTypes.func.isRequired,
    edit: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    dysfunction: null,
  }

  state = initialState;

  componentWillReceiveProps(nextProps) {
    const { dysfunction } = this.props;
    if (dysfunction !== nextProps.dysfunction) {
      if (nextProps.dysfunction) {
        this.setState({
          name: nextProps.dysfunction.name,
          emailDelegate: nextProps.dysfunction.emailDelegate,
          icon: nextProps.dysfunction.icon,
          actionCode: nextProps.dysfunction.actionCode,
        });
      } else {
        this.setState(initialState);
      }
    }
  }

  onChangeName = (event) => {
    this.setState({ name: event.target.value });
  };

  onChangeIcon = (event) => {
    this.setState({ icon: event.target.value });
  };

  onChangeEmailDelegate = (event) => {
    this.setState({ emailDelegate: event.target.value });
  };

  isValid = () => {
    const { icon, emailDelegate, name } = this.state;
    return Boolean(
      validate.icon(icon)
        && validate.email(emailDelegate)
        && name,
    );
  }

  onSend = (event) => {
    const { edit, onSend } = this.props;
    const {
      icon, emailDelegate, name, actionCode,
    } = this.state;
    event.preventDefault();
    if (!this.isValid()) {
      return;
    }
    authenticatedFetch('dysfunction', {
      method: edit ? 'PUT' : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          emailDelegate,
          name,
          icon,
          ...(actionCode ? { actionCode } : {}),
        },
      ),
    })
      .then(({ dysfunctions }) => {
        document.getElementById(`${id}_close`).click();
        this.setState(
          {
            emailDelegate: '',
            name: '',
            icon: '',
          },
          () => onSend(dysfunctions),
        );
      })
      .catch((error) => {
        console.error(`Une erreur a eu lieu : \n\n${error.message}`);
      });
  };

  render() {
    const { edit } = this.props;
    const {
      icon, emailDelegate, name,
    } = this.state;
    return (
      <form action="" method="POST" onSubmit={this.onSend}>
        <div
          className="modal fade"
          id={id}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Ajouter un nouveau type de dysfonctionnement
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
              <div className="modal-body">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Élément</span>
                  </div>
                  <input
                    type="text"
                    className={`form-control ${visualFeedback(
                      (t) => t,
                      name,
                    )}`}
                    placeholder="Vidéoprojecteur"
                    aria-label="Vidéoprojecteur"
                    value={name}
                    onChange={this.onChangeName}
                    readOnly={edit}
                  />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">@</span>
                  </div>
                  <input
                    type="email"
                    className={`form-control ${visualFeedback(
                      validate.email,
                      emailDelegate,
                    )}`}
                    placeholder="Email du responsable"
                    aria-label="Email du responsable"
                    value={emailDelegate}
                    onChange={this.onChangeEmailDelegate}
                  />
                </div>

                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Icône</span>
                  </div>
                  <input
                    type="text"
                    className={`form-control ${visualFeedback(
                      validate.icon,
                      icon,
                    )}`}
                    placeholder="Vidéoprojecteur"
                    aria-label="Vidéoprojecteur"
                    value={icon}
                    onChange={this.onChangeIcon}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      {validate.icon(icon) && (
                        <FontAwesomeIcon icon={icon} />
                      )}
                    </span>
                  </div>
                </div>
                <small className="form-text text-muted">
                  Liste des icônes sur
                  &nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://fontawesome.com/icons?d=gallery"
                  >
                    fontawesome.com
                  </a>
                </small>
              </div>

              <div className="modal-footer">
                <button
                  id={`${id}_close`}
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn custom-btn-cs btn-primary"
                  onClick={this.onSend}
                  disabled={!this.isValid()}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default AddDysfunctionModal;
