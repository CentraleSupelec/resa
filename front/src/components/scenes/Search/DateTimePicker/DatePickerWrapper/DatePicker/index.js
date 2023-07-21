// lib
import React from 'react';
import Dimensions from 'react-dimensions';
import PropTypes from 'prop-types';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import frLocale from 'date-fns/locale/fr';
// src
import theme from './DatePickerTheme';

const locale = {
  blank: 'Sélectionnez une date :',
  headerFormat: 'dddd, D MMM',
  locale: frLocale,
  todayLabel: {
    long: "Aujourd'hui",
    short: 'Auj.',
  },
  weekdays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  weekStartsOn: 1, // Start the week on Monday
};

class DatePicker extends React.PureComponent {
  static propTypes = {
    containerWidth: PropTypes.number,
    handleDateSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    containerWidth: 300,
  };

  render() {
    const today = new Date();
    const { containerWidth, handleDateSelect } = this.props;

    return (
      <InfiniteCalendar
        width={containerWidth}
        height={300}
        selected={false}
        minDate={today}
        locale={locale}
        theme={theme}
        onSelect={handleDateSelect}
      />
    );
  }
}

export default Dimensions()(DatePicker);
