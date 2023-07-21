// lib
import { connect } from 'react-redux';
// src
import Component from 'components/Root';
import { fetchMember } from 'actions/user';

const mapStateToProps = (state) => ({ ...state.user, currentRoomId: state.currentRoom.id });

const mapDispatchToProps = { fetchMember };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
