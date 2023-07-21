// lib
import { connect } from 'react-redux';
import Component from 'components/partials/RoomResource';

const mapStateToProps = (state) => ({ memberOf: state.user.memberOf });

export default connect(mapStateToProps)(Component);
