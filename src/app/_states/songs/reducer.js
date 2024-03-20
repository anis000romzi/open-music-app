import { ActionType } from './action';

function songsReducer(songs = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_SONGS:
      return action.payload.songs;
    default:
      return songs;
  }
}

export default songsReducer;
