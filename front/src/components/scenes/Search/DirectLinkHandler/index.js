// lib
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router-dom';
import { Collapse } from 'react-collapse';
// src
import ReportDysfunction from './ReportDysfunction';
import DirectLinkActionSelector from './DirectLinkActionSelector';
import DirectLinkStatusBar from './DirectLinkStatusBar';

class DirectLinkHandler extends React.Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    currentRoomId: PropTypes.string.isRequired,
    setRoomId: PropTypes.func.isRequired,
    fetchRoomDetail: PropTypes.func.isRequired,
    initBookingProcess: PropTypes.func.isRequired,
    hideDatePicker: PropTypes.func.isRequired,
    resourceId: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    displayActionSelector: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    errorWhileFetching: PropTypes.bool.isRequired,
    showActionSelector: PropTypes.bool.isRequired,
    room: PropTypes.object.isRequired,
    unsetRoom: PropTypes.func.isRequired,
    chooseRoom: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { fetchRoomDetail } = props;
    this.fetchRoomDetail = fetchRoomDetail.bind(this);
  }

  componentDidMount() {
    const {
      currentRoomId,
      resourceId,
      setRoomId,
      fetchRoomDetail,
      initBookingProcess,
      hideDatePicker,
      unsetRoom,
    } = this.props;
    if (resourceId) {
      setRoomId(resourceId);
      fetchRoomDetail().then(() => {
        if (currentRoomId) {
          unsetRoom();
          initBookingProcess();
        }
      });
      hideDatePicker();
    }
  }

  onClickBookButton = () => {
    const {
      isLogged, resourceId, history, initBookingProcess, chooseRoom,
    } = this.props;
    if (isLogged) {
      initBookingProcess();
    } else {
      chooseRoom(resourceId);
      history.push('/login');
    }
  };

  render() {
    const {
      resourceId,
      displayActionSelector,
      isFetching,
      errorWhileFetching,
      room,
      showActionSelector,
    } = this.props;

    if (resourceId) {
      return (
        <>
          <ReportDysfunction roomId={resourceId} />
          <Collapse isOpened={displayActionSelector}>
            <DirectLinkActionSelector
              isFetching={isFetching}
              errorWhileFetching={errorWhileFetching}
              retryFetch={this.fetchRoomDetail}
              room={room}
              onClickBookButton={this.onClickBookButton}
            />
          </Collapse>
          {!displayActionSelector && (
            <DirectLinkStatusBar
              roomName={room.name}
              showActionSelector={showActionSelector}
            />
          )}
        </>
      );
    }
    return <Redirect to="/recherche/" />;
  }
}

export default withRouter(DirectLinkHandler);
