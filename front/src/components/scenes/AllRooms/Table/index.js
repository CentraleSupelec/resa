// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
// src
import Sort from './Sort';
import headers from './headers';

export default class extends Component {
  static propTypes = {
    component: PropTypes.func,
    data: PropTypes.array,
  };

  static defaultProps = {
    component: () => {},
    data: [],
  };

  constructor(props) {
    super(props);

    const state = {};
    headers.forEach(({ key }) => {
      state[key] = '';
    });
    this.state = state;
  }

  static getDerivedStateFromProps = ({ data }) => {
    const parsedData = data.map((row) => {
      const newRow = { ...row };
      headers.forEach(({ key, validation }) => {
        newRow[key] = validation(row[key]);
      });
      return newRow;
    });
    return { parsedData };
  }

  orderData = () => {
    const { parsedData } = this.state;
    const keys = [];
    const orders = [];
    headers.forEach(({ key }) => {
      const { state } = this;
      if (state[key]) {
        keys.push(key);
        orders.push(state[key]);
      }
    });
    return orderBy(parsedData, keys, orders);
  };

  render() {
    const { component: Child } = this.props;
    return (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key} scope="col" className="text-center">
                <Sort
                  label={header.label}
                  onClick={(value) => this.setState({ [header.key]: value })}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.orderData().map((data) => <Child data={data} key={data.id} />)}
        </tbody>
      </table>
    );
  }
}
