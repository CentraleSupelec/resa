// lib
import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPencilAlt,
  faTrash,
  faArrowsAlt,
} from '@fortawesome/fontawesome-free-solid';
import Sortable from 'react-sortablejs';
import sortBy from 'lodash/sortBy';
// src
import authenticatedFetch from 'services/authenticatedFetch';
import AddDysfunctionModal, {
  id as addDysfunctionModalId,
} from './AddDysfunctionModal';

class ListAdmins extends Component {
  state = {
    dysfunctions: [],
    order: [],
    edit: false,
    selectedDysfunction: null,
  };

  componentDidMount() {
    authenticatedFetch('dysfunction').then(({ dysfunctions }) => this.setState({ dysfunctions }));
  }

  componentWillUpdate(nextProps, nextState) {
    const { dysfunctions } = this.state;
    if (dysfunctions.length !== nextState.dysfunctions.length) {
      // eslint-disable-next-line
      nextState.order = sortBy(nextState.dysfunctions, "order").map(
        (dysfunction) => dysfunction.name,
      );
    }
  }

  onDelete = (name) => () => {
    authenticatedFetch(`dysfunction/${name}`, { method: 'DELETE' })
      .then(({ dysfunctions }) => this.setState({ dysfunctions }))
      .catch(console.error);
  };

  get orderedDysfunctions() {
    const { dysfunctions, order } = this.state;
    return sortBy(dysfunctions, (dysfunction) => order.findIndex((name) => dysfunction.name === name));
  }

  changeOrder = (order) => {
    this.setState({ order });
    authenticatedFetch('dysfunction/reorder', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order,
      }),
    })
      .then(({ order: o }) => this.setState({ order: o }))
      .catch(console.error);
  };

  openModal = (selectedDysfunction = null) => () => {
    this.setState({ edit: selectedDysfunction !== null, selectedDysfunction });
  };

  render() {
    const { edit, selectedDysfunction } = this.state;
    return (
      <>
        <button
          type="button"
          className="btn btn-success custom-btn-cs my-3"
          data-toggle="modal"
          data-target={`#${addDysfunctionModalId}`}
          onClick={this.openModal()}
        >
          <FontAwesomeIcon icon={faPlus} />
          &nbsp;Ajouter un type de dysfonctionnement
        </button>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col" />
              <th scope="col">Type de dysfonctionnement</th>
              <th scope="col">Email du responsable</th>
              <th scope="col">Code d'action</th>
              <th scope="col" />
              <th scope="col" />
            </tr>
          </thead>
          <Sortable onChange={this.changeOrder} tag="tbody">
            {this.orderedDysfunctions.map((dysfunction) => (
              <tr key={dysfunction.name} data-id={dysfunction.name}>
                <td>
                  <FontAwesomeIcon icon={faArrowsAlt} />
                </td>
                <td>
                  <FontAwesomeIcon icon={dysfunction.icon} />
                </td>
                <td>{dysfunction.name}</td>
                <th>
                  <a href={`mailto:${dysfunction.email}`}>
                    {dysfunction.emailDelegate}
                  </a>
                </th>
                <td>{dysfunction.lastName}</td>
                <td>
                  {dysfunction.actionCode}
                </td>
                <td>
                  <button
                    type="button"
                    data-toggle="modal"
                    data-target={`#${addDysfunctionModalId}`}
                    onClick={this.openModal(dysfunction)}
                    style={{ background: 'inherit', border: 'none' }}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={this.onDelete(dysfunction.name)}
                  />
                </td>
              </tr>
            ))}
          </Sortable>
        </table>
        <AddDysfunctionModal
          dysfunction={selectedDysfunction}
          edit={edit}
          onSend={(dfs) => this.setState({ dysfunctions: dfs })}
        />
      </>
    );
  }
}

export default ListAdmins;
