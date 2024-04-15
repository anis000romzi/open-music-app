import { ActionType } from './action';

function albumDetailReducer(albumDetail = null, action = {}) {
  switch (action.type) {
    case ActionType.RECEIVE_ALBUM_DETAIL:
      return action.payload.albumDetail;
    case ActionType.CLEAR_ALBUM_DETAIL:
      return null;
    case ActionType.LIKE_ALBUM_DETAIL_SONG:
      return {
        ...albumDetail,
        songs: albumDetail.songs.map((song) => {
          if (song.id === action.payload.songId) {
            return {
              ...song,
              likes: song.likes.concat([action.payload.userId]),
            };
          }
          return song;
        }),
      };
    case ActionType.DELETE_ALBUM_DETAIL_LIKE_SONG:
      return {
        ...albumDetail,
        songs: albumDetail.songs.map((song) => {
          if (song.id === action.payload.songId) {
            return {
              ...song,
              likes: song.likes.filter((id) => id !== action.payload.userId),
            };
          }
          return song;
        }),
      };
    default:
      return albumDetail;
  }
}

export default albumDetailReducer;
