// lib
import { connect } from 'react-redux';
// src
import Component from 'components/scenes/Manager/Groups';

const mapStateToProps = (state) => ({ infos: state.user.infos });

export default connect(mapStateToProps)(Component);
