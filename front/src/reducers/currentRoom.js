import { CHOOSE_ROOM } from 'actions/rooms/select/types';

const initialState = {
  id: sessionStorage.getItem('currentRoom.id'),
};

const currentRoom = (state = initialState, action) => {
  switch (action.type) {
    case CHOOSE_ROOM: {
      const { payload: id } = action;
      return {
        ...state, id,
      };
    }
    default:
      return state;
  }
};

export default currentRoom;
