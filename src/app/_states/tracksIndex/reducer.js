import { ActionType } from './action';

function tracksIndexReducer(tracksIndex = 0, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_TRACKS_INDEX:
      return action.payload.tracksIndex;
    default:
      return tracksIndex;
  }
}

export default tracksIndexReducer;