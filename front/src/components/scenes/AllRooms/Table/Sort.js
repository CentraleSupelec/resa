// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/fontawesome-free-solid';

const icons = {
  0: faSort,
  1: faSortDown,
  2: faSortUp,
};

const orders = {
  0: '',
  1: 'asc',
  2: 'desc',
};

export default class extends Component {
  static propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    label: null,
    onClick: () => {},
  };

  state = { i: 0 };

  onClick = (event) => {
    const { onClick } = this.props;
    event.preventDefault();
    const { state } = this;
    this.setState(
      ({ i }) => ({ i: (i + 1) % 3 }),
      () => onClick(orders[state.i]),
    );
  };

  render() {
    const { label } = this.props;
    const { state } = this;
    return (
      <button type="button" className="plain" onClick={this.onClick}>
        {label}
        <FontAwesomeIcon icon={icons[state.i]} className="ml-3" />
      </button>
    );
  }
}
