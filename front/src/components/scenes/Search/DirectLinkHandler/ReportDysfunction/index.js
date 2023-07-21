// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
// src
import authenticatedFetch from 'services/authenticatedFetch';
import ListDysfunctions from './ListDysfunctions';

class ReportDysfunction extends Component {
  static propTypes = {
    roomId: PropTypes.string.isRequired,
  }

  state = {
    open: false, dysfunctions: [], error: null, loading: false,
  };

  componentDidMount() {
    this.fetchDysfunction();
  }

  openCollapse = () => this.setState({ open: true });

  closeCollapse = () => this.setState({ open: false });

  fetchDysfunction = () => {
    this.setState({ error: null, loading: true }, () => {
      authenticatedFetch('dysfunction')
        .then(({ dysfunctions }) => {
          this.setState({ dysfunctions, loading: false });
        })
        .catch((error) => this.setState({ error, loading: false }));
    });
  };

  render() {
    const {
      open, error, loading, dysfunctions,
    } = this.state;
    const { roomId } = this.props;
    return (
      <div className="row justify-content-center">
        <div className="jumbotron col-lg-6 text-center">
          {!open && (
            <button
              onClick={this.openCollapse}
              type="button"
              className="btn btn-primary"
            >
              Signaler un dysfonctionnement
            </button>
          )}
          <Collapse isOpened={open}>
            {!error
              && !loading && (
                <ListDysfunctions
                  dysfunctions={dysfunctions}
                  roomId={roomId}
                />
            )}
          </Collapse>
        </div>
      </div>
    );
  }
}

export default ReportDysfunction;
