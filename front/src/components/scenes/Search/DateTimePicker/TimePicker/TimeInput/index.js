/*
Adapted from NPM module input-moment.
*/
// lib
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import InputSlider from 'react-input-slider';
import moment from 'moment';
// src
import './TimeInput.css';

export default class InputMoment extends Component {
  static propTypes = {
    moment: PropTypes.instanceOf(moment).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  changeHours = (pos) => {
    const { moment: m, onChange } = this.props;
    const intPos = Math.floor(pos.x);
    m.minutes(parseInt((intPos % 4) * 15, 10));
    m.hours(parseInt((intPos - (intPos % 4)) / 4, 10));
    onChange(m);
  };

  render() {
    const { moment: m } = this.props;

    return (
      <div className={`${cx('m-time')} pt-0  mb-5`}>
        <div className="row justify-content-center">
          <div className="showtime">
            <span className="time">{m.format('HH')}</span>
            <span className="separater">h</span>
            <span className="time">{m.format('mm')}</span>
          </div>
        </div>

        <div className="sliders">
          <div className="row mt-5">
            <InputSlider
              className="u-slider-time"
              xmin={28}
              xmax={92}
              x={m.hour() * 4 + m.minutes() / 15}
              onChange={this.changeHours}
            />
          </div>
        </div>
      </div>
    );
  }
}
