import { ActionType } from './action';

function popularAlbumsReducer(albums = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_POPULAR_ALBUMS:
      return action.payload.albums;
    default:
      return albums;
  }
}

export default popularAlbumsReducer;
