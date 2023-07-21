// lib
import { connect } from 'react-redux';
// src
import Component from 'components/scenes/Manager/Greylists/GreylistForm';

const mapStateToProps = (state) => ({ ...state.user });

export default connect(mapStateToProps)(Component);
