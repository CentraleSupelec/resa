// lib
import { connect } from 'react-redux';
// src
import Component from 'components/scenes/Manager/Greylists';

const mapStateToProps = (state) => ({ ...state.user });

export default connect(mapStateToProps)(Component);
