// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faAt, faComment } from '@fortawesome/fontawesome-free-solid';
// src
import visualFeedback from 'services/visualFeedback';
import validate from 'services/validate';
import authenticatedFetch from 'services/authenticatedFetch';

export const id = 'ReportDysfunctionModal';

class ReportDysfunctionModal extends Component {
  static propTypes = {
    infos: PropTypes.object.isRequired,
    chosenDysfunctions: PropTypes.array.isRequired,
    roomId: PropTypes.string.isRequired,
  }

  state = { email: '', isConnected: false, comment: '' };

  componentDidMount() {
    const { infos } = this.props;
    if (infos) {
      this.setState({ email: infos.email, isConnected: true });
    }
  }

  onChange = (field) => (event) => {
    this.setState({ [field]: event.target.value });
  };

  onChangeEmail = this.onChange('email');

  onChangeComment = this.onChange('comment');

  onSend = (event) => {
    event.preventDefault();
    const { email, comment } = this.state;
    const { chosenDysfunctions, roomId } = this.props;
    if (!email || !comment) return;

    authenticatedFetch('dysfunction/report', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        dysfunctions: chosenDysfunctions.map((d) => d.name),
        comment,
        roomId,
      }),
    })
      .then(() => {
        this.setState(({ isConnected, prevEmail }) => ({
          comment: '',
          email: isConnected ? prevEmail : '',
        }));
        document.getElementById(`${id}_close`).click();
      })
      .catch((error) => {
        console.error(error);
        alert(`Une erreur a eu lieu : \n\n${error.message}`);
      });
  };

  render() {
    const { email, isConnected, comment } = this.state;
    const { chosenDysfunctions } = this.props;
    return (
      <div
        className="modal fade"
        id={id}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Signaler un dysfonctionnement</h5>
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {chosenDysfunctions.map((dysfunction) => (
                  <FontAwesomeIcon
                    icon={dysfunction.icon}
                    size="2x"
                    color="#9a1739"
                    className="mx-2"
                  />
                ))}
              </div>

              <div className="input-group mt-2">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faAt} />
                  </span>
                </div>
                <input
                  type="text"
                  className={`form-control ${visualFeedback(
                    validate.email,
                    email,
                  )}`}
                  placeholder="Email pour vous contacter"
                  aria-label="Email pour vous contacter"
                  value={email}
                  onChange={this.onChangeEmail}
                  readOnly={isConnected}
                />
              </div>

              <div className="input-group mt-2">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faComment} />
                  </span>
                </div>
                <textarea
                  type="text"
                  className="form-control"
                  placeholder="Commentaire"
                  aria-label="Commentaire"
                  value={comment}
                  onChange={this.onChangeComment}
                />
              </div>
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
                type="button"
                className="btn btn-primary custom-btn-cs"
                onClick={this.onSend}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ infos: state.user.infos });

export default connect(mapStateToProps)(ReportDysfunctionModal);
