import { ActionType } from './action';

function tracksReducer(tracks = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_TRACKS:
      return action.payload.tracks;
    default:
      return tracks;
  }
}

export default tracksReducer;