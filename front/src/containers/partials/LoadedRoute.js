// lib
import { connect } from 'react-redux';
// src
import Component from 'components/partials/LoadedRoute';

const mapStateToProps = (state) => ({
  isLogged: state.user.isLogged,
  isLoaded: state.user.isLoaded,
});

export default connect(mapStateToProps)(Component);
