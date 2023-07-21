// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/fontawesome-free-solid';
// src
import authenticatedFetch from 'services/authenticatedFetch';

const User = ({ infos }) => (
  <div className="mt-3">
    <div>
      <b>Prénom :</b>
      &nbsp;
      <span className="text-secondary">{infos ? infos.firstName : ''}</span>
    </div>
    <div>
      <b>Nom :</b>
      &nbsp;
      <span className="text-secondary">{infos ? infos.lastName : ''}</span>
    </div>
    <div>
      <b>Email :</b>
      &nbsp;
      <span className="text-secondary">{infos ? infos.email : ''}</span>
    </div>
  </div>
);

User.propTypes = {
  infos: PropTypes.object.isRequired,
};

const defaultState = {
  term: '',
  isLoading: false,
  notInGeode: false,
  user: null,
  error: false,
};

class SearchUser extends Component {
  state = defaultState;

  static propTypes = {
    onFind: PropTypes.func,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    onFind: () => {},
    placeholder: 'Email',
  };

  onChange = (event) => {
    this.setState({ term: event.target.value });
  };

  clearSearch = () => {
    this.setState(defaultState);
  };

  onVerifyEmail = async (event) => {
    event.preventDefault();
    const { onFind } = this.props;
    const { term } = this.state;

    try {
      const { person: p } = await authenticatedFetch(`user/search/${term}`);
      if (p) {
        const user = { ...p, email: term };
        this.setState({ isLoading: false, user });
        onFind(user);
      } else {
        this.setState({ isLoading: false, notInGeode: true });
      }
    } catch (error) {
      this.setState({ isLoading: false, error });
    }
  };

  render() {
    const { placeholder } = this.props;
    const { term, isLoading, user } = this.state;
    return (
      <>
        <div className="input-group mb-3">
          <form onSubmit={this.onVerifyEmail} style={{ flexGrow: 1 }}>
            <input
              type="text"
              className="form-control"
              placeholder={placeholder}
              aria-label={placeholder}
              value={term}
              onChange={this.onChange}
            />
          </form>
          <div className="input-group-append">
            {isLoading ? (
              <button className="btn btn-secondary" type="button">
                <FontAwesomeIcon icon={faCircleNotch} spin />
              </button>
            ) : (
              <button
                className="btn btn-primary custom-btn-cs"
                type="button"
                onClick={this.onVerifyEmail}
              >
                Vérifier
              </button>
            )}
          </div>
        </div>
        {user && <User infos={user} />}
      </>
    );
  }
}

export default SearchUser;
