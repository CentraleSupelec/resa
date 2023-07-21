// lib
import { connect } from 'react-redux';
import moment from 'moment';
import { fetchRoomsIfNeeded, forceFetchRooms } from 'actions/rooms/list';
import Component from 'components/scenes/Search/RoomList';

const mapStateToProps = (state) => {
  const searchList = { ...state.search.list };
  const selectedDate = `${moment(state.search.dateTime.selectedDate).format(
    'YYYY-MM-DD',
  )}T`;

  let { selectedStartTime, selectedEndTime } = state.search.dateTime;
  [selectedStartTime, selectedEndTime] = [
    selectedDate + moment(selectedStartTime).format('HH:mm:00.000[Z]'),
    selectedDate + moment(selectedEndTime).format('HH:mm:00.000[Z]'),
  ];

  if (state.bookings.list.favoriteRooms !== null) {
    const favoriteRooms = state.bookings.list.favoriteRooms.map((room) => {
      let available = true;
      if (room.events !== null) {
        room.events.forEach(({ endDate, startDate }) => {
          available = available
            && (selectedStartTime >= endDate || selectedEndTime <= startDate);
        });
      }
      return {
        ...room,
        available,
      };
    });

    searchList.roomGroups = [
      {
        name: 'Mes salles préférées',
        content: favoriteRooms,
        isFavoriteRoomsGroup: true,
      },
      ...searchList.roomGroups,
    ];
  }

  return {
    ...searchList,
    filters: state.search.filters,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchRoomsIfNeeded: () => dispatch(fetchRoomsIfNeeded()),
  forceFetchRooms: () => dispatch(forceFetchRooms()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
