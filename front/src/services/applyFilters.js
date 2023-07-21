// lib
import Fuse from 'fuse.js';

function filterRoom(filters, room) {
  // "return false" means that this room will be removed from the list

  // Ignore choosen type is search for a room
  if (!filters.searchText && !room.isFavoriteRoom) {
    if (filters.type.value === 'Salle de visioconférence') {
      if (room.type !== 'Salle de réunion' || !room.videoConference) {
        return false;
      }
    } else if (Array.isArray(filters.type.value)) {
      if (!filters.type.value.includes(room.type)) {
        return false;
      }
    } else if (room.type !== filters.type.value) {
      return false;
    }
  }

  if (!room.videoConference && filters.displayVideoConferenceRooms) {
    return false;
  }

  if (!room.videoRecording && filters.displayVideoAcquisitionRooms) {
    return false;
  }

  if (!room.available && !filters.displayUnavailableRooms) {
    return false;
  }

  if (room.openSpace && !filters.displayOpenSpaces) {
    return false;
  }

  if (!room.allowBookings && (!room.belongsTo || !room.belongsTo.length)) {
    return false;
  }

  if (filters.minCapacity > 5 && room.capacity < filters.minCapacity) {
    return false;
  }

  const { displayCampuses } = filters;
  if (Array.isArray(displayCampuses) && displayCampuses.length > 0) {
    if (!displayCampuses.includes(room.campus)) return false;
  }

  return true;
}

export default (roomList, filters, isFavoriteRoom = false) => {
  const rooms = roomList.filter((r) => {
    const room = { ...r, isFavoriteRoom };
    return filterRoom.bind(null, filters)(room);
  });

  // Order rooms in each category to prevent users to click on those by mistake
  if (!isFavoriteRoom) {
    rooms.sort((roomA, roomB) => roomB.allowBookings - roomA.allowBookings);
  }

  // Search
  if (filters.searchText) {
    const searchOptions = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'type', 'donator', 'building', 'campus', 'wing'],
    };
    return new Fuse(rooms, searchOptions).search(filters.searchText);
  }
  return rooms;
};
