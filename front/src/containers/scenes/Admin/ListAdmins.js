// lib
import { connect } from 'react-redux';
// src
import Component from 'components/scenes/Admin/ListAdmins';

const mapStateToProps = (state) => ({ infos: state.user.infos });

export default connect(mapStateToProps)(Component);
