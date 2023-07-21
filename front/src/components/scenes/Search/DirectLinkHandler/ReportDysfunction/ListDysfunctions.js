// lib
import React, { Component } from 'react';
// src
import Dysfunction from './Dysfunction';
import ReportDysfunctionModal, {
  id as reportDysfunctionModalId,
} from './ReportDysfunctionModal';

class ListDysfunctions extends Component {
  state = { chosenDysfunctions: [6] };

  toggleDysfunction = (name) => (event) => {
    if (event) {
      event.preventDefault();
    }
    if (this.state.chosenDysfunctions.includes(name)) {
      this.setState(({ chosenDysfunctions }) => ({
        chosenDysfunctions: chosenDysfunctions.filter(
          (dysfunction) => dysfunction !== name,
        ),
      }));
    } else {
      this.setState(({ chosenDysfunctions }) => ({
        chosenDysfunctions: [...chosenDysfunctions, name],
      }));
    }
  };

  static getDerivedStateFromProps = (props, prevState) => {
    const dysfunctions = props.dysfunctions.map(
      (dysfunction) => dysfunction.name,
    );
    const chosenDysfunctions = prevState.chosenDysfunctions.filter(
      (dysfunction) => dysfunctions.includes(dysfunction),
    );
    return {
      chosenDysfunctions,
    };
  };

  chosenDysfunctions = () => this.props.dysfunctions.filter((dysfunction) => this.state.chosenDysfunctions.includes(dysfunction.name));

  render() {
    return (
      <>
        <div className="row">
          {this.props.dysfunctions.map((dysfunction) => (
            <Dysfunction
              key={dysfunction._id}
              dysfunction={dysfunction}
              active={this.state.chosenDysfunctions.includes(dysfunction.name)}
              onClick={this.toggleDysfunction}
            />
          ))}
        </div>
        <button
          type="button"
          className="btn btn-primary mb-1"
          data-toggle="modal"
          data-target={
            this.state.chosenDysfunctions.length === 0
              ? ''
              : `#${reportDysfunctionModalId}`
          }
        >
          Signaler
        </button>
        <ReportDysfunctionModal
          chosenDysfunctions={this.chosenDysfunctions()}
          roomId={this.props.roomId}
        />
      </>
    );
  }
}

ListDysfunctions.defaultProps = {
  dysfunctions: [],
};

export default ListDysfunctions;
