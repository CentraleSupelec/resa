// lib
import { connect } from 'react-redux';
// src
import Component from 'components/partials/NavBar';

const mapStateToProps = (state) => ({ ...state.user });

export default connect(mapStateToProps)(Component);
