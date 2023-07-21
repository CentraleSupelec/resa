// lib
import { connect } from 'react-redux';
// src
import Component from 'components/scenes/Admin';

const mapStateToProps = (state) => ({ isSuperAdmin: state.user.isSuperAdmin });

export default connect(mapStateToProps)(Component);
