// lib
import React, { Component } from 'react';
// src
import authenticatedFetch from 'services/authenticatedFetch';
import LoadSpinner from 'components/partials/LoadSpinner';
import RoomRow from './RoomRow';
import DownloadCSV from './DownloadCSV';
import Table from './Table';

class AllRooms extends Component {
  state = { roomList: [], error: null, loading: false };

  componentDidMount() {
    this.setState({ loading: true }, () => {
      authenticatedFetch('search/roomList')
        .then((roomList) => {
          this.setState({ loading: false, roomList, error: null });
          window.roomList = roomList;
        })
        .catch((error) => {
          this.setState({ loading: false, error, roomList: [] });
        });
    });
  }

  render() {
    const { error, loading, roomList } = this.state;
    if (error) {
      console.warn(error);
      return <div>{error.message}</div>;
    }

    if (loading) {
      return (
        <div className="container d-flex h-100 align-items-center justify-content-center">
          <div className="text-center pt-3 pb-3">
            <LoadSpinner />
          </div>
        </div>
      );
    }
    return (
      <>
        <DownloadCSV roomList={roomList} />
        <Table
          component={RoomRow}
          data={roomList}
        />
      </>
    );
  }
}

export default AllRooms;
