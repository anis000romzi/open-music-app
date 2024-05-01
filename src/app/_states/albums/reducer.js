import { ActionType } from './action';

function albumsReducer(albums = [], action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_ALBUMS:
      return action.payload.albums;
    case ActionType.CLEAR_ALBUMS:
      return [];
    case ActionType.EDIT_ALBUMS:
      return albums.map((album) => {
        if (album.id === action.payload.id) {
          return {
            ...album,
            name: action.payload.name,
            year: action.payload.year,
          };
        }
        return album;
      });
    case ActionType.CHANGE_COVER_ALBUMS:
      return albums.map((album) => {
        if (album.id === action.payload.albumId) {
          return {
            ...album,
            cover: action.payload.file,
          };
        }
        return album;
      });
    default:
      return albums;
  }
}

export default albumsReducer;
