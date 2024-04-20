import { ActionType } from './action';

function playlistDetailReducer(playlistDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_PLAYLIST_DETAIL:
      return action.payload.playlistDetail;
    case ActionType.CLEAR_PLAYLIST_DETAIL:
      return null;
    case ActionType.EDIT_PLAYLIST_DETAIL:
      return {
        ...playlistDetail,
        name: action.payload.name,
      };
    default:
      return playlistDetail;
  }
}

export default playlistDetailReducer;
