import { ActionType } from './action';

function playlistDetailReducer(playlistDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_PLAYLIST_DETAIL:
      return action.payload.playlistDetail;
    case ActionType.CLEAR_PLAYLIST_DETAIL:
      return null;
    default:
      return playlistDetail;
  }
}

export default playlistDetailReducer;
