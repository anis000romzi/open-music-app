import { ActionType } from './action';

function albumDetailReducer(albumDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_ALBUM_DETAIL:
      return action.payload.albumDetail;
    case ActionType.CLEAR_ALBUM_DETAIL:
      return null;
    default:
      return albumDetail;
  }
}

export default albumDetailReducer;
